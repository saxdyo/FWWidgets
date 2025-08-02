"""
Concurrency control system inspired by fw2.js OptimizedPromisePool
Provides intelligent concurrency limiting, queue management, and performance monitoring
"""

import asyncio
import time
import threading
from typing import Callable, Any, Optional, List, Dict
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, Future, as_completed
from queue import Queue, PriorityQueue
import logging
from config import NETWORK_CONFIG, LOGGING_CONFIG

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class TaskPriority:
    """Task priority levels"""
    HIGH = 1
    MEDIUM = 2
    LOW = 3


@dataclass
class TaskInfo:
    """Information about a task in the pool"""
    task_id: str
    priority: int
    created_at: float
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    error: Optional[Exception] = None
    
    @property
    def wait_time(self) -> float:
        """Time spent waiting in queue"""
        if self.started_at:
            return self.started_at - self.created_at
        return time.time() - self.created_at
    
    @property
    def execution_time(self) -> float:
        """Time spent executing"""
        if self.started_at and self.completed_at:
            return self.completed_at - self.started_at
        return 0.0


class OptimizedPromisePool:
    """
    Advanced concurrency pool inspired by fw2.js OptimizedPromisePool
    Features:
    - Configurable concurrency limits
    - Priority-based task execution
    - Queue management with overflow protection
    - Performance monitoring and statistics
    - Adaptive concurrency based on performance
    - Graceful degradation under load
    """
    
    def __init__(
        self,
        max_concurrent: int = NETWORK_CONFIG['MAX_CONCURRENT_REQUESTS'],
        max_queue_size: int = 1000,
        enable_adaptive: bool = True
    ):
        self.max_concurrent = max_concurrent
        self.max_queue_size = max_queue_size
        self.enable_adaptive = enable_adaptive
        
        # Thread pool for execution
        self.executor = ThreadPoolExecutor(max_workers=max_concurrent)
        
        # Task tracking
        self.active_tasks: Dict[str, Future] = {}
        self.task_history: List[TaskInfo] = []
        self.task_queue = PriorityQueue(maxsize=max_queue_size)
        
        # Statistics
        self.total_submitted = 0
        self.total_completed = 0
        self.total_failed = 0
        self.total_rejected = 0
        
        # Performance monitoring
        self.avg_execution_time = 0.0
        self.avg_wait_time = 0.0
        self.current_concurrency = 0
        self.peak_concurrency = 0
        
        # Adaptive settings
        self.performance_window = []
        self.window_size = 50
        self.last_adaptation = time.time()
        self.adaptation_interval = 60  # seconds
        
        # Thread safety
        self._lock = threading.Lock()
        
        logger.info(f"Initialized OptimizedPromisePool: max_concurrent={max_concurrent}")
    
    def submit(
        self,
        func: Callable,
        *args,
        priority: int = TaskPriority.MEDIUM,
        task_id: Optional[str] = None,
        **kwargs
    ) -> Future:
        """
        Submit a task to the pool with priority
        Returns Future that can be used to get result
        """
        if task_id is None:
            task_id = f"task_{self.total_submitted}"
        
        with self._lock:
            self.total_submitted += 1
            
            # Check queue capacity
            if self.task_queue.qsize() >= self.max_queue_size:
                self.total_rejected += 1
                raise Exception(f"Task queue full (max: {self.max_queue_size})")
            
            # Create task info
            task_info = TaskInfo(
                task_id=task_id,
                priority=priority,
                created_at=time.time()
            )
            
            # Wrap function with monitoring
            wrapped_func = self._wrap_function(func, task_info, *args, **kwargs)
            
            # Submit to executor
            future = self.executor.submit(wrapped_func)
            self.active_tasks[task_id] = future
            
            # Add to queue for tracking
            self.task_queue.put((priority, time.time(), task_id, task_info))
            
            logger.debug(f"Submitted task {task_id} with priority {priority}")
            return future
    
    def submit_batch(
        self,
        tasks: List[tuple],
        priority: int = TaskPriority.MEDIUM
    ) -> List[Future]:
        """
        Submit multiple tasks as a batch
        tasks: List of (func, args, kwargs) tuples
        """
        futures = []
        for i, task in enumerate(tasks):
            func, args, kwargs = task
            task_id = f"batch_{self.total_submitted}_{i}"
            future = self.submit(func, *args, task_id=task_id, priority=priority, **kwargs)
            futures.append(future)
        
        logger.info(f"Submitted batch of {len(tasks)} tasks")
        return futures
    
    def wait_for_completion(self, timeout: Optional[float] = None) -> bool:
        """Wait for all active tasks to complete"""
        if not self.active_tasks:
            return True
        
        start_time = time.time()
        completed_futures = []
        
        try:
            for future in as_completed(self.active_tasks.values(), timeout=timeout):
                completed_futures.append(future)
                if timeout and (time.time() - start_time) > timeout:
                    break
            
            return len(completed_futures) == len(self.active_tasks)
            
        except Exception as e:
            logger.error(f"Error waiting for completion: {e}")
            return False
    
    def cancel_all(self) -> int:
        """Cancel all pending tasks"""
        cancelled_count = 0
        
        with self._lock:
            for task_id, future in list(self.active_tasks.items()):
                if future.cancel():
                    cancelled_count += 1
                    del self.active_tasks[task_id]
        
        # Clear queue
        while not self.task_queue.empty():
            try:
                self.task_queue.get_nowait()
                cancelled_count += 1
            except:
                break
        
        logger.info(f"Cancelled {cancelled_count} tasks")
        return cancelled_count
    
    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive pool statistics"""
        with self._lock:
            active_count = len(self.active_tasks)
            queue_size = self.task_queue.qsize()
            
            # Calculate success rate
            total_processed = self.total_completed + self.total_failed
            success_rate = (self.total_completed / total_processed) if total_processed > 0 else 0
            
            # Calculate average times from recent history
            recent_tasks = self.task_history[-100:] if self.task_history else []
            avg_exec_time = sum(t.execution_time for t in recent_tasks) / len(recent_tasks) if recent_tasks else 0
            avg_wait_time = sum(t.wait_time for t in recent_tasks) / len(recent_tasks) if recent_tasks else 0
            
            return {
                'total_submitted': self.total_submitted,
                'total_completed': self.total_completed,
                'total_failed': self.total_failed,
                'total_rejected': self.total_rejected,
                'success_rate': success_rate,
                'active_tasks': active_count,
                'queue_size': queue_size,
                'current_concurrency': active_count,
                'max_concurrency': self.max_concurrent,
                'peak_concurrency': self.peak_concurrency,
                'avg_execution_time': avg_exec_time,
                'avg_wait_time': avg_wait_time,
                'queue_utilization': queue_size / self.max_queue_size,
                'pool_utilization': active_count / self.max_concurrent
            }
    
    def _wrap_function(self, func: Callable, task_info: TaskInfo, *args, **kwargs):
        """Wrap function with monitoring and error handling"""
        def wrapper():
            try:
                with self._lock:
                    self.current_concurrency += 1
                    self.peak_concurrency = max(self.peak_concurrency, self.current_concurrency)
                    task_info.started_at = time.time()
                
                # Execute the function
                result = func(*args, **kwargs)
                
                with self._lock:
                    task_info.completed_at = time.time()
                    self.total_completed += 1
                    self._record_performance(task_info)
                    
                logger.debug(f"Task {task_info.task_id} completed successfully")
                return result
                
            except Exception as e:
                with self._lock:
                    task_info.completed_at = time.time()
                    task_info.error = e
                    self.total_failed += 1
                    self._record_performance(task_info)
                
                logger.error(f"Task {task_info.task_id} failed: {e}")
                raise
            
            finally:
                with self._lock:
                    self.current_concurrency -= 1
                    if task_info.task_id in self.active_tasks:
                        del self.active_tasks[task_info.task_id]
                
                # Adaptive concurrency adjustment
                if self.enable_adaptive:
                    self._adapt_concurrency()
        
        return wrapper
    
    def _record_performance(self, task_info: TaskInfo):
        """Record task performance for analytics"""
        self.task_history.append(task_info)
        
        # Keep history manageable
        if len(self.task_history) > 1000:
            self.task_history = self.task_history[-500:]
        
        # Add to performance window for adaptation
        if task_info.execution_time > 0:
            self.performance_window.append({
                'execution_time': task_info.execution_time,
                'wait_time': task_info.wait_time,
                'success': task_info.error is None,
                'timestamp': task_info.completed_at
            })
        
        # Keep window size manageable
        if len(self.performance_window) > self.window_size:
            self.performance_window = self.performance_window[-self.window_size:]
    
    def _adapt_concurrency(self):
        """Adaptively adjust concurrency based on performance"""
        current_time = time.time()
        
        # Only adapt periodically
        if current_time - self.last_adaptation < self.adaptation_interval:
            return
        
        if len(self.performance_window) < 10:  # Need sufficient data
            return
        
        # Calculate recent performance metrics
        recent_performance = [p for p in self.performance_window 
                            if current_time - p['timestamp'] < 300]  # Last 5 minutes
        
        if not recent_performance:
            return
        
        avg_exec_time = sum(p['execution_time'] for p in recent_performance) / len(recent_performance)
        success_rate = sum(1 for p in recent_performance if p['success']) / len(recent_performance)
        avg_wait_time = sum(p['wait_time'] for p in recent_performance) / len(recent_performance)
        
        # Decision logic for adaptation
        old_concurrency = self.max_concurrent
        
        if success_rate > 0.95 and avg_wait_time < 1.0 and avg_exec_time < 5.0:
            # Performance is good, can increase concurrency
            self.max_concurrent = min(self.max_concurrent + 1, 20)
        elif success_rate < 0.8 or avg_exec_time > 10.0:
            # Performance is poor, decrease concurrency
            self.max_concurrent = max(self.max_concurrent - 1, 1)
        
        if self.max_concurrent != old_concurrency:
            logger.info(f"Adapted concurrency: {old_concurrency} -> {self.max_concurrent}")
            # Recreate executor with new size
            self.executor.shutdown(wait=False)
            self.executor = ThreadPoolExecutor(max_workers=self.max_concurrent)
        
        self.last_adaptation = current_time
    
    def shutdown(self, wait: bool = True):
        """Shutdown the pool gracefully"""
        logger.info("Shutting down OptimizedPromisePool")
        self.cancel_all()
        self.executor.shutdown(wait=wait)


class RateLimiter:
    """
    Rate limiter for API requests, inspired by fw2.js rate limiting
    """
    
    def __init__(self, max_requests_per_second: float = 5.0):
        self.max_requests_per_second = max_requests_per_second
        self.min_interval = 1.0 / max_requests_per_second
        self.last_request_time = 0.0
        self._lock = threading.Lock()
    
    def acquire(self):
        """Acquire permission to make a request (blocks if necessary)"""
        with self._lock:
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            
            if time_since_last < self.min_interval:
                sleep_time = self.min_interval - time_since_last
                time.sleep(sleep_time)
                current_time = time.time()
            
            self.last_request_time = current_time
    
    def smart_delay(self, response_time: float = None, error_occurred: bool = False):
        """
        Intelligent delay based on response time and errors
        Inspired by fw2.js smartDelay function
        """
        base_delay = self.min_interval
        
        if error_occurred:
            # Increase delay significantly on errors
            delay = base_delay * 3
        elif response_time and response_time > 5.0:
            # Increase delay for slow responses
            delay = base_delay * 2
        elif response_time and response_time < 1.0:
            # Decrease delay for fast responses
            delay = base_delay * 0.5
        else:
            delay = base_delay
        
        time.sleep(delay)


# Global instances
default_pool = OptimizedPromisePool()
api_rate_limiter = RateLimiter(max_requests_per_second=1.0 / NETWORK_CONFIG['RATE_LIMIT_DELAY'])


def get_pool(pool_type: str = 'default') -> OptimizedPromisePool:
    """Get a pool instance by type"""
    if pool_type == 'default':
        return default_pool
    # Can add more specialized pools here
    return default_pool


def concurrent_map(
    func: Callable,
    items: List[Any],
    max_workers: int = None,
    priority: int = TaskPriority.MEDIUM
) -> List[Any]:
    """
    Map function over items concurrently
    Similar to concurrent.futures.ThreadPoolExecutor.map but with our optimizations
    """
    if max_workers is None:
        max_workers = NETWORK_CONFIG['MAX_CONCURRENT_REQUESTS']
    
    pool = OptimizedPromisePool(max_concurrent=max_workers)
    
    try:
        # Submit all tasks
        futures = []
        for item in items:
            future = pool.submit(func, item, priority=priority)
            futures.append(future)
        
        # Collect results
        results = []
        for future in futures:
            try:
                result = future.result(timeout=NETWORK_CONFIG['TIMEOUT'])
                results.append(result)
            except Exception as e:
                logger.error(f"Task failed in concurrent_map: {e}")
                results.append(None)
        
        return results
    
    finally:
        pool.shutdown(wait=True)
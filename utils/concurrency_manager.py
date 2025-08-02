import asyncio
import threading
import time
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Callable, Any, Optional, Dict
from queue import Queue, Empty
import random

logger = logging.getLogger(__name__)

class OptimizedThreadPool:
    """
    Python equivalent of fw2.js OptimizedPromisePool
    Manages concurrent operations with intelligent throttling
    """
    
    def __init__(self, max_workers: int = 10, timeout: float = 30.0):
        self.max_workers = max_workers
        self.timeout = timeout
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.active_tasks = 0
        self.completed_tasks = 0
        self.failed_tasks = 0
        self.lock = threading.Lock()
        
    def submit_batch(self, tasks: List[tuple], progress_callback: Optional[Callable] = None) -> List[Any]:
        """
        Submit a batch of tasks and return results
        tasks: List of (function, args, kwargs) tuples
        """
        results = []
        futures = []
        
        try:
            # Submit all tasks
            for task_func, args, kwargs in tasks:
                future = self.executor.submit(task_func, *args, **kwargs)
                futures.append(future)
                
            # Collect results as they complete
            for i, future in enumerate(as_completed(futures, timeout=self.timeout)):
                try:
                    result = future.result()
                    results.append(result)
                    
                    with self.lock:
                        self.completed_tasks += 1
                        
                    if progress_callback:
                        progress_callback(i + 1, len(futures), result)
                        
                except Exception as e:
                    logger.error(f"Task failed: {e}")
                    results.append(None)
                    
                    with self.lock:
                        self.failed_tasks += 1
                        
        except Exception as e:
            logger.error(f"Batch execution failed: {e}")
            
        return results
        
    def get_stats(self) -> Dict[str, int]:
        """Get execution statistics"""
        with self.lock:
            return {
                'active_tasks': self.active_tasks,
                'completed_tasks': self.completed_tasks,
                'failed_tasks': self.failed_tasks,
                'max_workers': self.max_workers
            }
            
    def shutdown(self, wait: bool = True):
        """Shutdown the thread pool"""
        self.executor.shutdown(wait=wait)


class RequestRateLimiter:
    """
    Rate limiter for API requests
    Based on fw2.js rate limiting patterns
    """
    
    def __init__(self, requests_per_second: float = 10.0, burst_size: int = 20):
        self.requests_per_second = requests_per_second
        self.burst_size = burst_size
        self.tokens = burst_size
        self.last_update = time.time()
        self.lock = threading.Lock()
        
    def acquire(self, tokens: int = 1) -> bool:
        """Acquire tokens for making requests"""
        with self.lock:
            now = time.time()
            
            # Add tokens based on elapsed time
            elapsed = now - self.last_update
            self.tokens = min(
                self.burst_size,
                self.tokens + elapsed * self.requests_per_second
            )
            self.last_update = now
            
            # Check if we have enough tokens
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            else:
                return False
                
    def wait_for_token(self, tokens: int = 1) -> None:
        """Wait until tokens are available"""
        while not self.acquire(tokens):
            time.sleep(0.1)


class SmartDelay:
    """
    Intelligent delay manager with exponential backoff
    Based on fw2.js smartDelay patterns
    """
    
    def __init__(self, base_delay: float = 1.0, max_delay: float = 60.0, backoff_factor: float = 2.0):
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.backoff_factor = backoff_factor
        self.current_delay = base_delay
        self.failure_count = 0
        
    def on_success(self):
        """Reset delay on successful operation"""
        self.current_delay = self.base_delay
        self.failure_count = 0
        
    def on_failure(self):
        """Increase delay on failure"""
        self.failure_count += 1
        self.current_delay = min(
            self.max_delay,
            self.current_delay * self.backoff_factor
        )
        
    def get_delay(self) -> float:
        """Get current delay with jitter"""
        jitter = random.uniform(0.5, 1.5)
        return self.current_delay * jitter
        
    def wait(self):
        """Wait for the current delay period"""
        delay = self.get_delay()
        logger.debug(f"Waiting {delay:.2f}s (failures: {self.failure_count})")
        time.sleep(delay)


class ConcurrencyManager:
    """
    Main concurrency manager that coordinates all aspects
    Based on fw2.js optimization patterns
    """
    
    def __init__(self, max_workers: int = 10, requests_per_second: float = 10.0):
        self.thread_pool = OptimizedThreadPool(max_workers=max_workers)
        self.rate_limiter = RequestRateLimiter(requests_per_second=requests_per_second)
        self.delay_manager = SmartDelay()
        self.network_conditions = {
            'good': {'workers': max_workers, 'rps': requests_per_second},
            'poor': {'workers': max(1, max_workers // 3), 'rps': requests_per_second / 3},
            'critical': {'workers': 1, 'rps': 1.0}
        }
        self.current_condition = 'good'
        
    def detect_network_condition(self, recent_failures: int, total_requests: int) -> str:
        """Detect network condition based on failure rate"""
        if total_requests == 0:
            return 'good'
            
        failure_rate = recent_failures / total_requests
        
        if failure_rate > 0.5:
            return 'critical'
        elif failure_rate > 0.2:
            return 'poor'
        else:
            return 'good'
            
    def adapt_to_network_condition(self, condition: str):
        """Adapt concurrency settings based on network condition"""
        if condition != self.current_condition:
            logger.info(f"Network condition changed: {self.current_condition} -> {condition}")
            self.current_condition = condition
            
            settings = self.network_conditions[condition]
            
            # Restart thread pool with new settings
            self.thread_pool.shutdown(wait=False)
            self.thread_pool = OptimizedThreadPool(
                max_workers=settings['workers']
            )
            
            # Update rate limiter
            self.rate_limiter.requests_per_second = settings['rps']
            
    def execute_with_retry(self, func: Callable, max_retries: int = 3, *args, **kwargs) -> Any:
        """Execute function with intelligent retry logic"""
        for attempt in range(max_retries + 1):
            try:
                # Wait for rate limit
                self.rate_limiter.wait_for_token()
                
                # Execute function
                result = func(*args, **kwargs)
                
                # Success - reset delay
                self.delay_manager.on_success()
                return result
                
            except Exception as e:
                self.delay_manager.on_failure()
                
                if attempt < max_retries:
                    logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying...")
                    self.delay_manager.wait()
                else:
                    logger.error(f"All {max_retries + 1} attempts failed: {e}")
                    raise
                    
    def batch_execute_with_adaptive_concurrency(
        self, 
        tasks: List[tuple], 
        progress_callback: Optional[Callable] = None
    ) -> List[Any]:
        """Execute batch with adaptive concurrency based on network conditions"""
        total_tasks = len(tasks)
        completed = 0
        failed = 0
        results = []
        
        # Process tasks in smaller batches to allow adaptation
        batch_size = min(20, total_tasks)
        
        for i in range(0, total_tasks, batch_size):
            batch = tasks[i:i + batch_size]
            
            # Detect and adapt to network condition
            failure_rate = failed / max(1, completed + failed)
            condition = self.detect_network_condition(failed, completed + failed)
            self.adapt_to_network_condition(condition)
            
            # Execute batch
            batch_results = self.thread_pool.submit_batch(batch, progress_callback)
            results.extend(batch_results)
            
            # Update counters
            batch_completed = sum(1 for r in batch_results if r is not None)
            batch_failed = len(batch_results) - batch_completed
            
            completed += batch_completed
            failed += batch_failed
            
            logger.info(f"Batch {i//batch_size + 1}: {batch_completed}/{len(batch)} successful")
            
        return results
        
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get comprehensive performance statistics"""
        return {
            'thread_pool': self.thread_pool.get_stats(),
            'rate_limiter': {
                'requests_per_second': self.rate_limiter.requests_per_second,
                'current_tokens': self.rate_limiter.tokens,
                'burst_size': self.rate_limiter.burst_size
            },
            'delay_manager': {
                'current_delay': self.delay_manager.current_delay,
                'failure_count': self.delay_manager.failure_count,
                'base_delay': self.delay_manager.base_delay
            },
            'network_condition': self.current_condition
        }
        
    def shutdown(self):
        """Shutdown the concurrency manager"""
        self.thread_pool.shutdown(wait=True)


# Global concurrency manager instance
concurrency_manager = ConcurrencyManager(max_workers=8, requests_per_second=5.0)
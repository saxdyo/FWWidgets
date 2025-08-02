"""
Concurrency management system for controlling parallel requests and operations.
Inspired by the OptimizedPromisePool from fw2.js.
"""

import asyncio
import time
import threading
from typing import Any, Callable, List, Optional, Dict, Union
from dataclasses import dataclass, field
from enum import Enum
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import random


class TaskPriority(Enum):
    """Task priority levels"""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class TaskResult:
    """Result of a task execution"""
    task_id: str
    success: bool
    result: Any = None
    error: Optional[Exception] = None
    duration: float = 0.0
    retries: int = 0
    priority: TaskPriority = TaskPriority.NORMAL


@dataclass
class TaskMetrics:
    """Task execution metrics"""
    total_tasks: int = 0
    completed_tasks: int = 0
    failed_tasks: int = 0
    active_tasks: int = 0
    queued_tasks: int = 0
    average_duration: float = 0.0
    success_rate: float = 0.0
    total_duration: float = 0.0
    
    def update(self, result: TaskResult):
        """Update metrics with a task result"""
        self.completed_tasks += 1
        if result.success:
            self.total_duration += result.duration
            self.average_duration = self.total_duration / max(1, self.completed_tasks - self.failed_tasks)
        else:
            self.failed_tasks += 1
        
        self.success_rate = (self.completed_tasks - self.failed_tasks) / max(1, self.completed_tasks)


class ConcurrencyManager:
    """
    Advanced concurrency manager for controlling parallel operations.
    Similar to OptimizedPromisePool in fw2.js but adapted for Python.
    """
    
    def __init__(self, 
                 max_concurrent: int = 10,
                 max_retries: int = 3,
                 timeout: float = 30.0,
                 backoff_factor: float = 1.5):
        """
        Initialize the concurrency manager.
        
        Args:
            max_concurrent: Maximum number of concurrent tasks
            max_retries: Maximum number of retries for failed tasks
            timeout: Task timeout in seconds
            backoff_factor: Exponential backoff factor for retries
        """
        self.max_concurrent = max_concurrent
        self.max_retries = max_retries
        self.timeout = timeout
        self.backoff_factor = backoff_factor
        
        self._executor = ThreadPoolExecutor(max_workers=max_concurrent)
        self._semaphore = threading.Semaphore(max_concurrent)
        self._metrics = TaskMetrics()
        self._lock = threading.RLock()
        self._active_tasks: Dict[str, threading.Thread] = {}
        
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def execute_tasks(self, 
                     tasks: List[Callable],
                     task_args: Optional[List[tuple]] = None,
                     task_kwargs: Optional[List[dict]] = None,
                     priorities: Optional[List[TaskPriority]] = None,
                     task_ids: Optional[List[str]] = None) -> List[TaskResult]:
        """
        Execute multiple tasks concurrently.
        
        Args:
            tasks: List of callable functions to execute
            task_args: List of argument tuples for each task
            task_kwargs: List of keyword argument dicts for each task
            priorities: List of priorities for each task
            task_ids: List of custom task IDs
            
        Returns:
            List of TaskResult objects
        """
        if not tasks:
            return []
        
        # Prepare task parameters
        num_tasks = len(tasks)
        task_args = task_args or [() for _ in range(num_tasks)]
        task_kwargs = task_kwargs or [{} for _ in range(num_tasks)]
        priorities = priorities or [TaskPriority.NORMAL for _ in range(num_tasks)]
        task_ids = task_ids or [f"task_{i}_{time.time()}" for i in range(num_tasks)]
        
        # Sort tasks by priority (higher priority first)
        task_data = list(zip(tasks, task_args, task_kwargs, priorities, task_ids))
        task_data.sort(key=lambda x: x[3].value, reverse=True)
        
        # Update metrics
        with self._lock:
            self._metrics.total_tasks += num_tasks
            self._metrics.queued_tasks += num_tasks
        
        # Execute tasks
        results = []
        futures = {}
        
        for task, args, kwargs, priority, task_id in task_data:
            future = self._executor.submit(
                self._execute_single_task, 
                task, args, kwargs, priority, task_id
            )
            futures[future] = task_id
        
        # Collect results
        for future in as_completed(futures):
            task_id = futures[future]
            try:
                result = future.result(timeout=self.timeout)
                results.append(result)
                
                with self._lock:
                    self._metrics.update(result)
                    self._metrics.queued_tasks -= 1
                    
            except Exception as e:
                error_result = TaskResult(
                    task_id=task_id,
                    success=False,
                    error=e,
                    priority=TaskPriority.NORMAL
                )
                results.append(error_result)
                
                with self._lock:
                    self._metrics.update(error_result)
                    self._metrics.queued_tasks -= 1
        
        return results
    
    def _execute_single_task(self, 
                           task: Callable, 
                           args: tuple, 
                           kwargs: dict, 
                           priority: TaskPriority, 
                           task_id: str) -> TaskResult:
        """Execute a single task with retry logic and error handling."""
        start_time = time.time()
        retries = 0
        last_error = None
        
        with self._lock:
            self._metrics.active_tasks += 1
            self._active_tasks[task_id] = threading.current_thread()
        
        try:
            while retries <= self.max_retries:
                try:
                    # Add jitter to prevent thundering herd
                    if retries > 0:
                        delay = (self.backoff_factor ** retries) + random.uniform(0, 1)
                        time.sleep(delay)
                    
                    # Execute the task
                    result = task(*args, **kwargs)
                    
                    duration = time.time() - start_time
                    return TaskResult(
                        task_id=task_id,
                        success=True,
                        result=result,
                        duration=duration,
                        retries=retries,
                        priority=priority
                    )
                    
                except Exception as e:
                    last_error = e
                    retries += 1
                    
                    self.logger.warning(
                        f"Task {task_id} failed (attempt {retries}/{self.max_retries + 1}): {e}"
                    )
                    
                    if retries > self.max_retries:
                        break
            
            # All retries exhausted
            duration = time.time() - start_time
            return TaskResult(
                task_id=task_id,
                success=False,
                error=last_error,
                duration=duration,
                retries=retries,
                priority=priority
            )
            
        finally:
            with self._lock:
                self._metrics.active_tasks -= 1
                if task_id in self._active_tasks:
                    del self._active_tasks[task_id]
    
    def execute_single(self, 
                      task: Callable, 
                      *args, 
                      priority: TaskPriority = TaskPriority.NORMAL,
                      task_id: Optional[str] = None,
                      **kwargs) -> TaskResult:
        """Execute a single task."""
        if task_id is None:
            task_id = f"single_task_{time.time()}"
        
        return self.execute_tasks(
            tasks=[task],
            task_args=[args],
            task_kwargs=[kwargs],
            priorities=[priority],
            task_ids=[task_id]
        )[0]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics."""
        with self._lock:
            return {
                'total_tasks': self._metrics.total_tasks,
                'completed_tasks': self._metrics.completed_tasks,
                'failed_tasks': self._metrics.failed_tasks,
                'active_tasks': self._metrics.active_tasks,
                'queued_tasks': self._metrics.queued_tasks,
                'success_rate': self._metrics.success_rate,
                'average_duration': self._metrics.average_duration,
                'max_concurrent': self.max_concurrent,
                'active_task_ids': list(self._active_tasks.keys())
            }
    
    def cancel_all_tasks(self) -> int:
        """Cancel all active tasks."""
        cancelled_count = 0
        with self._lock:
            for task_id, thread in self._active_tasks.items():
                try:
                    # Note: Python threads cannot be forcibly killed
                    # This is more of a graceful shutdown signal
                    self.logger.info(f"Requesting cancellation of task {task_id}")
                    cancelled_count += 1
                except Exception as e:
                    self.logger.error(f"Error cancelling task {task_id}: {e}")
        
        return cancelled_count
    
    def shutdown(self, wait: bool = True, timeout: float = 30.0):
        """Shutdown the concurrency manager."""
        self.logger.info("Shutting down concurrency manager...")
        
        if wait:
            self._executor.shutdown(wait=True, timeout=timeout)
        else:
            self._executor.shutdown(wait=False)
        
        self.logger.info("Concurrency manager shutdown complete")


class NetworkConcurrencyManager(ConcurrencyManager):
    """
    Specialized concurrency manager for network requests with rate limiting.
    Similar to the network optimization features in fw2.js.
    """
    
    def __init__(self, 
                 max_concurrent: int = 5,  # Lower default for network requests
                 max_retries: int = 3,
                 timeout: float = 30.0,
                 rate_limit: float = 0.1,  # Minimum delay between requests
                 backoff_factor: float = 2.0):
        """
        Initialize the network concurrency manager.
        
        Args:
            max_concurrent: Maximum concurrent network requests
            max_retries: Maximum retries for failed requests
            timeout: Request timeout in seconds
            rate_limit: Minimum delay between requests in seconds
            backoff_factor: Exponential backoff factor
        """
        super().__init__(max_concurrent, max_retries, timeout, backoff_factor)
        self.rate_limit = rate_limit
        self._last_request_time = 0.0
        self._request_lock = threading.Lock()
    
    def _execute_single_task(self, task, args, kwargs, priority, task_id):
        """Execute a single network task with rate limiting."""
        # Apply rate limiting
        with self._request_lock:
            current_time = time.time()
            time_since_last = current_time - self._last_request_time
            
            if time_since_last < self.rate_limit:
                sleep_time = self.rate_limit - time_since_last
                time.sleep(sleep_time)
            
            self._last_request_time = time.time()
        
        # Execute the parent method
        return super()._execute_single_task(task, args, kwargs, priority, task_id)


class BatchProcessor:
    """
    Batch processor for handling large sets of operations efficiently.
    Similar to batch processing concepts in fw2.js.
    """
    
    def __init__(self, 
                 concurrency_manager: ConcurrencyManager,
                 batch_size: int = 50,
                 delay_between_batches: float = 1.0):
        """
        Initialize the batch processor.
        
        Args:
            concurrency_manager: Concurrency manager to use
            batch_size: Number of tasks per batch
            delay_between_batches: Delay between batch executions
        """
        self.concurrency_manager = concurrency_manager
        self.batch_size = batch_size
        self.delay_between_batches = delay_between_batches
        
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def process_batches(self, 
                       tasks: List[Callable],
                       task_args: Optional[List[tuple]] = None,
                       task_kwargs: Optional[List[dict]] = None,
                       progress_callback: Optional[Callable[[int, int], None]] = None) -> List[TaskResult]:
        """
        Process tasks in batches.
        
        Args:
            tasks: List of tasks to execute
            task_args: Arguments for each task
            task_kwargs: Keyword arguments for each task
            progress_callback: Optional callback for progress updates (current, total)
            
        Returns:
            List of all task results
        """
        if not tasks:
            return []
        
        all_results = []
        total_tasks = len(tasks)
        
        # Prepare task parameters
        task_args = task_args or [() for _ in range(total_tasks)]
        task_kwargs = task_kwargs or [{} for _ in range(total_tasks)]
        
        # Process in batches
        for i in range(0, total_tasks, self.batch_size):
            batch_end = min(i + self.batch_size, total_tasks)
            
            batch_tasks = tasks[i:batch_end]
            batch_args = task_args[i:batch_end]
            batch_kwargs = task_kwargs[i:batch_end]
            
            self.logger.info(f"Processing batch {i//self.batch_size + 1}, tasks {i+1}-{batch_end} of {total_tasks}")
            
            # Execute batch
            batch_results = self.concurrency_manager.execute_tasks(
                tasks=batch_tasks,
                task_args=batch_args,
                task_kwargs=batch_kwargs
            )
            
            all_results.extend(batch_results)
            
            # Progress callback
            if progress_callback:
                progress_callback(batch_end, total_tasks)
            
            # Delay between batches (except for the last batch)
            if batch_end < total_tasks:
                time.sleep(self.delay_between_batches)
        
        return all_results


# Global instances
default_concurrency_manager = ConcurrencyManager()
network_concurrency_manager = NetworkConcurrencyManager()
default_batch_processor = BatchProcessor(default_concurrency_manager)
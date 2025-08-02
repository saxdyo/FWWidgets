import time
import threading
from collections import OrderedDict
from typing import Any, Optional, Dict, Tuple
import json
import logging
import os

logger = logging.getLogger(__name__)

class OptimizedLRUCache:
    """
    Advanced LRU Cache with TTL support and statistics tracking
    Based on optimization patterns from fw2.js
    """
    
    def __init__(self, max_size: int = 1000, default_ttl: int = 3600):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self.cache: OrderedDict = OrderedDict()
        self.lock = threading.RLock()
        
        # Statistics tracking
        self.stats = {
            'hits': 0,
            'misses': 0,
            'evictions': 0,
            'expired': 0,
            'total_requests': 0
        }
        
    def _is_expired(self, entry: Dict[str, Any]) -> bool:
        """Check if cache entry has expired"""
        return time.time() > entry['expires_at']
        
    def _cleanup_expired(self):
        """Remove all expired entries"""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.cache.items()
            if current_time > entry['expires_at']
        ]
        
        for key in expired_keys:
            del self.cache[key]
            self.stats['expired'] += 1
            
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache with LRU and TTL support"""
        with self.lock:
            self.stats['total_requests'] += 1
            
            if key not in self.cache:
                self.stats['misses'] += 1
                return None
                
            entry = self.cache[key]
            
            # Check if expired
            if self._is_expired(entry):
                del self.cache[key]
                self.stats['expired'] += 1
                self.stats['misses'] += 1
                return None
                
            # Move to end (most recently used)
            self.cache.move_to_end(key)
            self.stats['hits'] += 1
            
            return entry['data']
            
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with optional TTL"""
        with self.lock:
            if ttl is None:
                ttl = self.default_ttl
                
            # Remove expired entries periodically
            if len(self.cache) % 100 == 0:
                self._cleanup_expired()
                
            # Evict oldest if at capacity
            while len(self.cache) >= self.max_size:
                oldest_key = next(iter(self.cache))
                del self.cache[oldest_key]
                self.stats['evictions'] += 1
                
            entry = {
                'data': value,
                'created_at': time.time(),
                'expires_at': time.time() + ttl,
                'access_count': 0
            }
            
            self.cache[key] = entry
            
    def delete(self, key: str) -> bool:
        """Delete specific key from cache"""
        with self.lock:
            if key in self.cache:
                del self.cache[key]
                return True
            return False
            
    def clear(self) -> None:
        """Clear all cache entries"""
        with self.lock:
            self.cache.clear()
            
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self.lock:
            total_requests = self.stats['total_requests']
            hit_rate = (self.stats['hits'] / total_requests * 100) if total_requests > 0 else 0
            
            return {
                **self.stats,
                'hit_rate': round(hit_rate, 2),
                'cache_size': len(self.cache),
                'max_size': self.max_size
            }
            
    def is_fresh(self, key: str, max_age: int = 1800) -> bool:
        """Check if cached data is fresh (within max_age seconds)"""
        with self.lock:
            if key not in self.cache:
                return False
                
            entry = self.cache[key]
            age = time.time() - entry['created_at']
            return age < max_age and not self._is_expired(entry)


class CacheManager:
    """
    Global cache manager with multiple cache instances
    Based on fw2.js optimization patterns
    """
    
    def __init__(self):
        # Different cache instances for different data types
        self.caches = {
            'trending': OptimizedLRUCache(max_size=500, default_ttl=3600),    # 1 hour
            'genres': OptimizedLRUCache(max_size=100, default_ttl=86400),     # 24 hours
            'images': OptimizedLRUCache(max_size=2000, default_ttl=7200),     # 2 hours
            'movies': OptimizedLRUCache(max_size=1000, default_ttl=3600),     # 1 hour
            'metadata': OptimizedLRUCache(max_size=200, default_ttl=86400),   # 24 hours
        }
        
    def get(self, cache_type: str, key: str) -> Optional[Any]:
        """Get value from specific cache type"""
        if cache_type in self.caches:
            return self.caches[cache_type].get(key)
        return None
        
    def set(self, cache_type: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in specific cache type"""
        if cache_type in self.caches:
            self.caches[cache_type].set(key, value, ttl)
            
    def is_fresh(self, cache_type: str, key: str, max_age: int = 1800) -> bool:
        """Check if data is fresh in specific cache"""
        if cache_type in self.caches:
            return self.caches[cache_type].is_fresh(key, max_age)
        return False
        
    def clear_cache(self, cache_type: Optional[str] = None) -> None:
        """Clear specific cache or all caches"""
        if cache_type and cache_type in self.caches:
            self.caches[cache_type].clear()
        else:
            for cache in self.caches.values():
                cache.clear()
                
    def get_all_stats(self) -> Dict[str, Any]:
        """Get statistics for all caches"""
        return {
            cache_type: cache.get_stats()
            for cache_type, cache in self.caches.items()
        }
        
    def check_data_health(self) -> Dict[str, Any]:
        """
        Check overall cache health and data freshness
        Based on fw2.js data health check patterns
        """
        health_report = {
            'status': 'healthy',
            'issues': [],
            'recommendations': [],
            'cache_stats': self.get_all_stats()
        }
        
        for cache_type, cache in self.caches.items():
            stats = cache.get_stats()
            
            # Check hit rate
            if stats['hit_rate'] < 30:
                health_report['issues'].append(f"Low hit rate for {cache_type}: {stats['hit_rate']}%")
                health_report['recommendations'].append(f"Consider increasing TTL for {cache_type}")
                
            # Check cache utilization
            utilization = (stats['cache_size'] / stats['max_size']) * 100
            if utilization > 90:
                health_report['issues'].append(f"High cache utilization for {cache_type}: {utilization:.1f}%")
                health_report['recommendations'].append(f"Consider increasing max_size for {cache_type}")
                
        if health_report['issues']:
            health_report['status'] = 'warning' if len(health_report['issues']) < 3 else 'critical'
            
        return health_report


# Global cache manager instance
cache_manager = CacheManager()

def get_cache_key(prefix: str, **kwargs) -> str:
    """Generate cache key from parameters"""
    params = '_'.join(f"{k}={v}" for k, v in sorted(kwargs.items()) if v is not None)
    return f"{prefix}_{params}" if params else prefix

def cache_response(cache_type: str, key_prefix: str, ttl: Optional[int] = None):
    """Decorator for caching function responses"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = get_cache_key(key_prefix, **kwargs)
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_type, cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit for {cache_key}")
                return cached_result
                
            # Execute function and cache result
            result = func(*args, **kwargs)
            if result is not None:
                cache_manager.set(cache_type, cache_key, result, ttl)
                logger.debug(f"Cached result for {cache_key}")
                
            return result
        return wrapper
    return decorator
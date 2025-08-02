"""
Advanced caching system inspired by fw2.js OptimizedLRUCache
Provides LRU cache with TTL support, statistics, and automatic cleanup
"""

import time
import threading
from typing import Any, Optional, Dict, Tuple
from collections import OrderedDict
from dataclasses import dataclass, field
from config import CACHE_CONFIG, LOGGING_CONFIG
import logging

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class CacheEntry:
    """Cache entry with value, timestamp, and access tracking"""
    value: Any
    timestamp: float
    access_count: int = 0
    last_accessed: float = field(default_factory=time.time)
    
    def is_expired(self, ttl_seconds: int) -> bool:
        """Check if entry has expired"""
        return time.time() - self.timestamp > ttl_seconds
    
    def touch(self):
        """Update access tracking"""
        self.access_count += 1
        self.last_accessed = time.time()


@dataclass
class CacheStats:
    """Cache statistics tracking"""
    hits: int = 0
    misses: int = 0
    evictions: int = 0
    expired_removals: int = 0
    total_requests: int = 0
    
    @property
    def hit_rate(self) -> float:
        """Calculate cache hit rate"""
        if self.total_requests == 0:
            return 0.0
        return self.hits / self.total_requests
    
    @property
    def miss_rate(self) -> float:
        """Calculate cache miss rate"""
        return 1.0 - self.hit_rate


class OptimizedLRUCache:
    """
    Advanced LRU cache with TTL support, inspired by fw2.js OptimizedLRUCache
    Features:
    - TTL (Time To Live) support
    - LRU eviction policy
    - Thread-safe operations
    - Cache statistics
    - Automatic cleanup
    - Performance monitoring
    """
    
    def __init__(
        self, 
        max_size: int = CACHE_CONFIG['MAX_SIZE'], 
        default_ttl: int = CACHE_CONFIG['TTL_SECONDS']
    ):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self._lock = threading.RLock()
        self._stats = CacheStats()
        self._last_cleanup = time.time()
        
        logger.info(f"Initialized OptimizedLRUCache: max_size={max_size}, default_ttl={default_ttl}s")
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get value from cache with LRU update"""
        with self._lock:
            self._stats.total_requests += 1
            
            if key not in self._cache:
                self._stats.misses += 1
                logger.debug(f"Cache miss for key: {key}")
                return default
            
            entry = self._cache[key]
            
            # Check if expired
            if entry.is_expired(self.default_ttl):
                self._remove_entry(key)
                self._stats.misses += 1
                self._stats.expired_removals += 1
                logger.debug(f"Cache expired for key: {key}")
                return default
            
            # Move to end (most recently used)
            self._cache.move_to_end(key)
            entry.touch()
            self._stats.hits += 1
            
            logger.debug(f"Cache hit for key: {key}")
            return entry.value
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with optional custom TTL"""
        with self._lock:
            current_time = time.time()
            
            # Create new entry
            entry = CacheEntry(
                value=value,
                timestamp=current_time
            )
            
            # If key already exists, update it
            if key in self._cache:
                self._cache[key] = entry
                self._cache.move_to_end(key)
                logger.debug(f"Updated cache entry for key: {key}")
            else:
                # Add new entry
                self._cache[key] = entry
                logger.debug(f"Added new cache entry for key: {key}")
                
                # Check if we need to evict
                if len(self._cache) > self.max_size:
                    self._evict_lru()
            
            # Periodic cleanup
            if current_time - self._last_cleanup > CACHE_CONFIG['CLEANUP_INTERVAL']:
                self._cleanup_expired()
    
    def delete(self, key: str) -> bool:
        """Delete entry from cache"""
        with self._lock:
            if key in self._cache:
                self._remove_entry(key)
                logger.debug(f"Deleted cache entry for key: {key}")
                return True
            return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            cleared_count = len(self._cache)
            self._cache.clear()
            logger.info(f"Cleared cache: {cleared_count} entries removed")
    
    def has(self, key: str) -> bool:
        """Check if key exists and is not expired"""
        with self._lock:
            if key not in self._cache:
                return False
            
            entry = self._cache[key]
            if entry.is_expired(self.default_ttl):
                self._remove_entry(key)
                self._stats.expired_removals += 1
                return False
            
            return True
    
    def keys(self) -> list:
        """Get all valid (non-expired) keys"""
        with self._lock:
            valid_keys = []
            current_time = time.time()
            
            for key, entry in list(self._cache.items()):
                if entry.is_expired(self.default_ttl):
                    self._remove_entry(key)
                    self._stats.expired_removals += 1
                else:
                    valid_keys.append(key)
            
            return valid_keys
    
    def size(self) -> int:
        """Get current cache size"""
        with self._lock:
            return len(self._cache)
    
    def stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self._lock:
            return {
                'hits': self._stats.hits,
                'misses': self._stats.misses,
                'hit_rate': self._stats.hit_rate,
                'miss_rate': self._stats.miss_rate,
                'evictions': self._stats.evictions,
                'expired_removals': self._stats.expired_removals,
                'total_requests': self._stats.total_requests,
                'current_size': len(self._cache),
                'max_size': self.max_size,
                'utilization': len(self._cache) / self.max_size if self.max_size > 0 else 0
            }
    
    def _evict_lru(self) -> None:
        """Evict least recently used entry"""
        if self._cache:
            lru_key, _ = self._cache.popitem(last=False)
            self._stats.evictions += 1
            logger.debug(f"Evicted LRU entry: {lru_key}")
    
    def _remove_entry(self, key: str) -> None:
        """Remove entry from cache"""
        if key in self._cache:
            del self._cache[key]
    
    def _cleanup_expired(self) -> None:
        """Clean up expired entries"""
        current_time = time.time()
        expired_keys = []
        
        for key, entry in self._cache.items():
            if entry.is_expired(self.default_ttl):
                expired_keys.append(key)
        
        for key in expired_keys:
            self._remove_entry(key)
            self._stats.expired_removals += 1
        
        self._last_cleanup = current_time
        
        if expired_keys:
            logger.debug(f"Cleaned up {len(expired_keys)} expired entries")


class SpecializedCaches:
    """
    Specialized cache instances for different data types,
    inspired by fw2.js global cache instances
    """
    
    def __init__(self):
        # Trending content cache (shorter TTL)
        self.trending = OptimizedLRUCache(
            max_size=200,
            default_ttl=CACHE_CONFIG['TRENDING_CACHE_TTL']
        )
        
        # Genres cache (longer TTL, rarely changes)
        self.genres = OptimizedLRUCache(
            max_size=50,
            default_ttl=CACHE_CONFIG['GENRES_CACHE_TTL']
        )
        
        # Images cache (medium TTL)
        self.images = OptimizedLRUCache(
            max_size=500,
            default_ttl=CACHE_CONFIG['IMAGES_CACHE_TTL']
        )
        
        # General API responses cache
        self.api_responses = OptimizedLRUCache(
            max_size=300,
            default_ttl=CACHE_CONFIG['TTL_SECONDS']
        )
        
        logger.info("Initialized specialized cache instances")
    
    def get_cache_by_type(self, cache_type: str) -> OptimizedLRUCache:
        """Get cache instance by type"""
        caches = {
            'trending': self.trending,
            'genres': self.genres,
            'images': self.images,
            'api': self.api_responses
        }
        return caches.get(cache_type, self.api_responses)
    
    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all cache instances"""
        return {
            'trending': self.trending.stats(),
            'genres': self.genres.stats(),
            'images': self.images.stats(),
            'api_responses': self.api_responses.stats()
        }
    
    def clear_all(self) -> None:
        """Clear all cache instances"""
        self.trending.clear()
        self.genres.clear()
        self.images.clear()
        self.api_responses.clear()
        logger.info("Cleared all specialized caches")


# Global cache instances
global_caches = SpecializedCaches()


def get_cache(cache_type: str = 'api') -> OptimizedLRUCache:
    """Get a cache instance by type"""
    return global_caches.get_cache_by_type(cache_type)


def cache_key_builder(*args, **kwargs) -> str:
    """Build cache key from arguments"""
    key_parts = []
    
    # Add positional arguments
    for arg in args:
        if arg is not None:
            key_parts.append(str(arg))
    
    # Add keyword arguments (sorted for consistency)
    for k, v in sorted(kwargs.items()):
        if v is not None:
            key_parts.append(f"{k}:{v}")
    
    return "|".join(key_parts)


def cached(cache_type: str = 'api', ttl: Optional[int] = None):
    """
    Decorator for caching function results
    Usage: @cached('trending', ttl=3600)
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            cache = get_cache(cache_type)
            cache_key = f"{func.__name__}:{cache_key_builder(*args, **kwargs)}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        return wrapper
    return decorator
"""
Advanced caching system with LRU cache, TTL support, and statistics tracking.
Inspired by the OptimizedLRUCache from fw2.js.
"""

import time
import threading
from collections import OrderedDict
from typing import Any, Optional, Dict, Tuple
from dataclasses import dataclass
import json


@dataclass
class CacheStats:
    """Cache statistics tracking"""
    hits: int = 0
    misses: int = 0
    expired: int = 0
    evicted: int = 0
    
    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.0
    
    def to_dict(self) -> Dict:
        return {
            'hits': self.hits,
            'misses': self.misses,
            'expired': self.expired,
            'evicted': self.evicted,
            'hit_rate': self.hit_rate,
            'total_requests': self.hits + self.misses
        }


@dataclass
class CacheEntry:
    """Cache entry with TTL support"""
    value: Any
    timestamp: float
    ttl: float
    access_count: int = 0
    last_access: float = None
    
    def __post_init__(self):
        if self.last_access is None:
            self.last_access = self.timestamp
    
    @property
    def is_expired(self) -> bool:
        """Check if the cache entry has expired"""
        return (time.time() - self.timestamp) > self.ttl
    
    @property
    def age(self) -> float:
        """Get the age of the cache entry in seconds"""
        return time.time() - self.timestamp
    
    def touch(self):
        """Update access information"""
        self.access_count += 1
        self.last_access = time.time()


class OptimizedLRUCache:
    """
    Advanced LRU cache with TTL support, statistics tracking, and thread safety.
    Similar to the OptimizedLRUCache in fw2.js but adapted for Python.
    """
    
    def __init__(self, max_size: int = 1000, default_ttl: float = 3600):
        """
        Initialize the cache.
        
        Args:
            max_size: Maximum number of entries to store
            default_ttl: Default time-to-live in seconds
        """
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self._stats = CacheStats()
        self._lock = threading.RLock()
        
    def get(self, key: str) -> Optional[Any]:
        """
        Get a value from the cache.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value if found and not expired, None otherwise
        """
        with self._lock:
            if key not in self._cache:
                self._stats.misses += 1
                return None
            
            entry = self._cache[key]
            
            # Check if expired
            if entry.is_expired:
                self._stats.expired += 1
                self._stats.misses += 1
                del self._cache[key]
                return None
            
            # Move to end (most recently used)
            self._cache.move_to_end(key)
            entry.touch()
            self._stats.hits += 1
            
            return entry.value
    
    def set(self, key: str, value: Any, ttl: Optional[float] = None) -> None:
        """
        Set a value in the cache.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time-to-live in seconds (uses default if None)
        """
        if ttl is None:
            ttl = self.default_ttl
            
        with self._lock:
            # Remove existing entry if it exists
            if key in self._cache:
                del self._cache[key]
            
            # Create new entry
            entry = CacheEntry(
                value=value,
                timestamp=time.time(),
                ttl=ttl
            )
            
            self._cache[key] = entry
            
            # Evict oldest entries if necessary
            while len(self._cache) > self.max_size:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
                self._stats.evicted += 1
    
    def delete(self, key: str) -> bool:
        """
        Delete a key from the cache.
        
        Args:
            key: Cache key to delete
            
        Returns:
            True if key was found and deleted, False otherwise
        """
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False
    
    def clear(self) -> None:
        """Clear all entries from the cache."""
        with self._lock:
            self._cache.clear()
            self._stats = CacheStats()
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired entries from the cache.
        
        Returns:
            Number of expired entries removed
        """
        with self._lock:
            expired_keys = []
            for key, entry in self._cache.items():
                if entry.is_expired:
                    expired_keys.append(key)
            
            for key in expired_keys:
                del self._cache[key]
                self._stats.expired += 1
            
            return len(expired_keys)
    
    def get_stats(self) -> Dict:
        """Get cache statistics."""
        with self._lock:
            stats = self._stats.to_dict()
            stats.update({
                'current_size': len(self._cache),
                'max_size': self.max_size,
                'fill_ratio': len(self._cache) / self.max_size
            })
            return stats
    
    def get_info(self) -> Dict:
        """Get detailed cache information."""
        with self._lock:
            entries_info = []
            for key, entry in self._cache.items():
                entries_info.append({
                    'key': key,
                    'age': entry.age,
                    'ttl': entry.ttl,
                    'access_count': entry.access_count,
                    'is_expired': entry.is_expired,
                    'size_estimate': len(str(entry.value))
                })
            
            return {
                'stats': self.get_stats(),
                'entries': entries_info
            }
    
    def has_fresh_data(self, key: str, max_age: float = None) -> bool:
        """
        Check if cache has fresh data for a key.
        
        Args:
            key: Cache key
            max_age: Maximum acceptable age in seconds
            
        Returns:
            True if fresh data exists, False otherwise
        """
        with self._lock:
            if key not in self._cache:
                return False
            
            entry = self._cache[key]
            if entry.is_expired:
                return False
            
            if max_age is not None and entry.age > max_age:
                return False
            
            return True
    
    def get_with_metadata(self, key: str) -> Optional[Tuple[Any, Dict]]:
        """
        Get value with metadata.
        
        Args:
            key: Cache key
            
        Returns:
            Tuple of (value, metadata) if found, None otherwise
        """
        with self._lock:
            if key not in self._cache:
                return None
            
            entry = self._cache[key]
            if entry.is_expired:
                return None
            
            metadata = {
                'age': entry.age,
                'ttl': entry.ttl,
                'access_count': entry.access_count,
                'last_access': entry.last_access
            }
            
            return entry.value, metadata


class GlobalCacheManager:
    """
    Global cache manager for different data types.
    Similar to the global cache instances in fw2.js.
    """
    
    def __init__(self):
        self.caches = {
            'trending': OptimizedLRUCache(max_size=100, default_ttl=1800),  # 30 min
            'movies': OptimizedLRUCache(max_size=500, default_ttl=3600),    # 1 hour
            'tv_shows': OptimizedLRUCache(max_size=500, default_ttl=3600),  # 1 hour
            'images': OptimizedLRUCache(max_size=1000, default_ttl=7200),   # 2 hours
            'genres': OptimizedLRUCache(max_size=50, default_ttl=86400),    # 24 hours
            'details': OptimizedLRUCache(max_size=200, default_ttl=1800),   # 30 min
            'search': OptimizedLRUCache(max_size=100, default_ttl=900),     # 15 min
        }
    
    def get_cache(self, cache_type: str) -> OptimizedLRUCache:
        """Get a specific cache by type."""
        return self.caches.get(cache_type, self.caches['movies'])
    
    def cleanup_all_expired(self) -> Dict[str, int]:
        """Cleanup expired entries from all caches."""
        cleanup_stats = {}
        for cache_type, cache in self.caches.items():
            cleanup_stats[cache_type] = cache.cleanup_expired()
        return cleanup_stats
    
    def get_all_stats(self) -> Dict[str, Dict]:
        """Get statistics for all caches."""
        all_stats = {}
        for cache_type, cache in self.caches.items():
            all_stats[cache_type] = cache.get_stats()
        return all_stats
    
    def clear_all(self) -> None:
        """Clear all caches."""
        for cache in self.caches.values():
            cache.clear()


# Global cache manager instance
cache_manager = GlobalCacheManager()
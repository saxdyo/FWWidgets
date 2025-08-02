"""
Enhanced TMDB API client with optimization features.
Integrates advanced caching, concurrency control, network resilience, and content filtering.
"""

import requests
import time
import json
from typing import List, Dict, Optional, Any
from config import (
    TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL,
    REQUEST_TIMEOUT, REQUEST_DELAY
)

# Import optimization modules
try:
    from advanced_cache import cache_manager
    from enhanced_network import global_session, global_image_optimizer, CDNRegion
    from concurrency_manager import network_concurrency_manager, TaskPriority
    from content_filter import default_content_filter, chinese_optimizer
    OPTIMIZATIONS_AVAILABLE = True
except ImportError as e:
    print(f"Optimization modules not available: {e}")
    OPTIMIZATIONS_AVAILABLE = False


class TMDBClient:
    """Enhanced TMDB API client with advanced optimization features"""
    
    def __init__(self, enable_optimizations: bool = True):
        """
        Initialize enhanced TMDB client
        
        Args:
            enable_optimizations: Whether to enable optimization features
        """
        if not TMDB_API_KEY:
            raise ValueError("TMDB_API_KEY is required. Please set it in .env file")
        
        self.api_key = TMDB_API_KEY
        self.base_url = TMDB_BASE_URL
        self.image_base_url = TMDB_IMAGE_BASE_URL
        self.enable_optimizations = enable_optimizations and OPTIMIZATIONS_AVAILABLE
        
        # Use enhanced session if optimizations enabled
        if self.enable_optimizations:
            self.session = global_session
            self.cache = cache_manager
            self.concurrency_manager = network_concurrency_manager
            self.content_filter = default_content_filter
            self.chinese_optimizer = chinese_optimizer
            self.image_optimizer = global_image_optimizer
            print("✓ TMDB client initialized with optimizations enabled")
        else:
            self.session = requests.Session()
            self.session.headers.update({
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            })
            self.cache = None
            print("TMDB client initialized with basic functionality")
    
    def _get_cache_key(self, endpoint: str, params: Dict = None) -> str:
        """Generate cache key for request."""
        param_str = ""
        if params:
            # Sort params for consistent cache keys
            sorted_params = sorted(params.items())
            param_str = "&".join([f"{k}={v}" for k, v in sorted_params])
        return f"tmdb:{endpoint}:{param_str}"
    
    def _make_request(self, endpoint: str, params: Dict = None, cache_type: str = 'movies') -> Dict:
        """
        Enhanced API request with caching and optimization
        
        Args:
            endpoint: API endpoint
            params: Request parameters
            cache_type: Type of cache to use
            
        Returns:
            API response data
        """
        # Check cache first if optimizations enabled
        if self.enable_optimizations and self.cache:
            cache_key = self._get_cache_key(endpoint, params)
            cached_data = self.cache.get_cache(cache_type).get(cache_key)
            if cached_data:
                return cached_data
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            if self.enable_optimizations:
                # Use enhanced session
                response = self.session.get(url, params=params)
                data = response.json()
            else:
                # Use basic session
                response = self.session.get(
                    url, 
                    params=params,
                    timeout=REQUEST_TIMEOUT
                )
                response.raise_for_status()
                time.sleep(REQUEST_DELAY)  # Basic rate limiting
                data = response.json()
            
            # Cache the response if optimizations enabled
            if self.enable_optimizations and self.cache and data:
                cache_key = self._get_cache_key(endpoint, params)
                # Different TTL for different cache types
                ttl_map = {
                    'trending': 1800,  # 30 minutes
                    'movies': 3600,    # 1 hour
                    'tv_shows': 3600,  # 1 hour
                    'genres': 86400,   # 24 hours
                    'search': 900      # 15 minutes
                }
                ttl = ttl_map.get(cache_type, 3600)
                self.cache.get_cache(cache_type).set(cache_key, data, ttl)
            
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"API请求失败: {e}")
            return {}
    
    def get_popular_movies(self, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """获取热门电影列表 (Enhanced with filtering)"""
        params = {'page': page}
        data = self._make_request('movie/popular', params, 'movies')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_top_rated_movies(self, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """获取高分电影列表 (Enhanced with filtering)"""
        params = {'page': page}
        data = self._make_request('movie/top_rated', params, 'movies')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_now_playing_movies(self, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """获取正在上映的电影列表 (Enhanced with filtering)"""
        params = {'page': page}
        data = self._make_request('movie/now_playing', params, 'movies')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_upcoming_movies(self, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """获取即将上映的电影列表 (Enhanced with filtering)"""
        params = {'page': page}
        data = self._make_request('movie/upcoming', params, 'movies')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_trending_movies(self, time_window: str = 'day', apply_filters: bool = True) -> List[Dict]:
        """获取热门趋势电影 (Enhanced with filtering)"""
        data = self._make_request(f'trending/movie/{time_window}', cache_type='trending')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_trending_tv(self, time_window: str = 'day', apply_filters: bool = True) -> List[Dict]:
        """获取热门趋势电视剧 (Enhanced with filtering)"""
        data = self._make_request(f'trending/tv/{time_window}', cache_type='trending')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_movie_details(self, movie_id: int) -> Dict:
        """获取电影详情"""
        data = self._make_request(f'movie/{movie_id}', cache_type='details')
        
        # Enhance with Chinese metadata if optimizations enabled
        if self.enable_optimizations:
            data = self.chinese_optimizer.enhance_chinese_metadata(data)
        
        return data
    
    def get_tv_details(self, tv_id: int) -> Dict:
        """获取电视剧详情"""
        data = self._make_request(f'tv/{tv_id}', cache_type='details')
        
        # Enhance with Chinese metadata if optimizations enabled
        if self.enable_optimizations:
            data = self.chinese_optimizer.enhance_chinese_metadata(data)
        
        return data
    
    def get_movie_images(self, movie_id: int) -> Dict:
        """获取电影图片"""
        return self._make_request(f'movie/{movie_id}/images', cache_type='images')
    
    def get_tv_images(self, tv_id: int) -> Dict:
        """获取电视剧图片"""
        return self._make_request(f'tv/{tv_id}/images', cache_type='images')
    
    def search_movies(self, query: str, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """搜索电影 (Enhanced with filtering)"""
        params = {'query': query, 'page': page}
        data = self._make_request('search/movie', params, 'search')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def search_tv(self, query: str, page: int = 1, apply_filters: bool = True) -> List[Dict]:
        """搜索电视剧 (Enhanced with filtering)"""
        params = {'query': query, 'page': page}
        data = self._make_request('search/tv', params, 'search')
        results = data.get('results', [])
        
        # Apply content filtering if optimizations enabled
        if self.enable_optimizations and apply_filters:
            results = self.content_filter.filter_items(results)
            results = self.chinese_optimizer.prioritize_chinese_content(results)
        
        return results
    
    def get_full_image_url(self, file_path: str, size: str = 'original') -> str:
        """获取完整的图片URL (Enhanced with CDN optimization)"""
        if not file_path:
            return ""
        
        # Use optimized image URL if optimizations enabled
        if self.enable_optimizations:
            # Determine image type from path
            if 'poster' in file_path or file_path.startswith('/'):
                image_type = 'poster' if 'poster' in file_path else 'backdrop'
                return self.image_optimizer.get_optimized_image_url(
                    file_path, image_type, size, CDNRegion.GLOBAL
                ) or f"{self.image_base_url}{size}{file_path}"
        
        # Fallback to basic URL
        return f"{self.image_base_url}{size}{file_path}"
    
    def get_movies_with_backdrops(self, limit: int = 50, apply_filters: bool = True) -> List[Dict]:
        """获取有背景图的电影列表 (Enhanced method)"""
        all_movies = []
        page = 1
        
        # Collect movies from multiple sources
        sources = [
            ('popular', self.get_popular_movies),
            ('top_rated', self.get_top_rated_movies),
            ('trending', lambda p=page: self.get_trending_movies('day'))
        ]
        
        # Use concurrent processing if optimizations enabled
        if self.enable_optimizations:
            # Create tasks for parallel execution
            tasks = []
            for source_name, source_func in sources:
                tasks.append(lambda p=page: source_func(p, apply_filters))
            
            # Execute tasks concurrently
            results = self.concurrency_manager.execute_tasks(
                tasks=tasks,
                priorities=[TaskPriority.HIGH] * len(tasks)
            )
            
            # Collect successful results
            for result in results:
                if result.success and result.result:
                    all_movies.extend(result.result)
        else:
            # Sequential processing for basic mode
            for source_name, source_func in sources:
                movies = source_func(page, apply_filters)
                all_movies.extend(movies)
        
        # Filter movies with backdrop images
        movies_with_backdrops = [
            movie for movie in all_movies 
            if movie.get('backdrop_path') and movie.get('vote_average', 0) > 0
        ]
        
        # Remove duplicates based on ID
        seen_ids = set()
        unique_movies = []
        for movie in movies_with_backdrops:
            if movie.get('id') not in seen_ids:
                seen_ids.add(movie.get('id'))
                unique_movies.append(movie)
        
        # Sort by popularity and limit results
        unique_movies.sort(key=lambda x: x.get('popularity', 0), reverse=True)
        
        return unique_movies[:limit]
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """获取缓存统计信息 (Only available with optimizations)"""
        if self.enable_optimizations and self.cache:
            return self.cache.get_all_stats()
        return {"message": "Cache statistics not available without optimizations"}
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """获取性能指标 (Only available with optimizations)"""
        if self.enable_optimizations:
            return {
                "cache_stats": self.get_cache_stats(),
                "concurrency_metrics": self.concurrency_manager.get_metrics(),
                "cdn_performance": self.session.cdn_manager.performance_stats
            }
        return {"message": "Performance metrics not available without optimizations"}
    
    def clear_cache(self, cache_type: str = None) -> bool:
        """清除缓存 (Only available with optimizations)"""
        if self.enable_optimizations and self.cache:
            if cache_type:
                self.cache.get_cache(cache_type).clear()
            else:
                self.cache.clear_all()
            return True
        return False
"""
TMDB API客户端
Enhanced with optimization features from fw2.js patterns
"""

import requests
import time
import logging
from typing import Dict, List, Optional, Any
from config import TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, NETWORK_CONFIG
from optimized_cache import cached, get_cache
from network_resilience import smart_request, api_rate_limiter
from content_filter import filter_content
from concurrency_control import get_pool, TaskPriority, concurrent_map

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class TMDBClient:
    """
    TMDB API客户端
    Enhanced with advanced optimization features:
    - Intelligent caching with TTL
    - Network resilience and retry logic
    - Content filtering
    - Concurrency control
    - Rate limiting
    - Performance monitoring
    """
    
    def __init__(self):
        if not TMDB_API_KEY:
            raise ValueError("TMDB_API_KEY environment variable is required")
        
        self.api_key = TMDB_API_KEY
        self.base_url = TMDB_BASE_URL
        self.image_base_url = TMDB_IMAGE_BASE_URL
        
        # Performance tracking
        self.request_stats = {
            'total_requests': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'failed_requests': 0,
            'average_response_time': 0.0
        }
        
        logger.info("TMDB Client initialized with advanced optimizations")
    
    def _make_request(self, endpoint: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Make an optimized API request with caching, rate limiting, and retry logic
        """
        if params is None:
            params = {}
        
        # Add API key to params
        params['api_key'] = self.api_key
        
        # Apply rate limiting
        api_rate_limiter.acquire()
        
        # Construct URL
        url = f"{self.base_url}{endpoint}"
        
        start_time = time.time()
        try:
            # Make request with smart retry and failover
            response = smart_request('GET', url, params=params)
            response_time = time.time() - start_time
            
            # Update stats
            self.request_stats['total_requests'] += 1
            self._update_response_time(response_time)
            
            # Smart delay based on response time
            api_rate_limiter.smart_delay(response_time, error_occurred=False)
            
            return response.json()
            
        except Exception as e:
            response_time = time.time() - start_time
            self.request_stats['failed_requests'] += 1
            
            # Apply penalty delay for errors
            api_rate_limiter.smart_delay(response_time, error_occurred=True)
            
            logger.error(f"API request failed: {e}")
            raise
    
    def _update_response_time(self, response_time: float):
        """Update average response time statistics"""
        total_requests = self.request_stats['total_requests']
        current_avg = self.request_stats['average_response_time']
        
        # Calculate running average
        if total_requests == 1:
            self.request_stats['average_response_time'] = response_time
        else:
            self.request_stats['average_response_time'] = (
                (current_avg * (total_requests - 1) + response_time) / total_requests
            )
    
    @cached('trending', ttl=3600)  # Cache trending data for 1 hour
    def get_trending(self, time_window: str = 'day', page: int = 1) -> List[Dict[str, Any]]:
        """
        获取热门内容 (电影和电视剧)
        Enhanced with intelligent caching and content filtering
        """
        try:
            endpoint = f"/trending/all/{time_window}"
            params = {'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Retrieved {len(filtered_results)} filtered trending items")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to get trending content: {e}")
            return []
    
    @cached('api', ttl=1800)  # Cache for 30 minutes
    def get_popular_movies(self, page: int = 1) -> List[Dict[str, Any]]:
        """
        获取热门电影
        Enhanced with caching and filtering
        """
        try:
            endpoint = "/movie/popular"
            params = {'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Add media_type for consistency
            for item in results:
                item['media_type'] = 'movie'
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Retrieved {len(filtered_results)} filtered popular movies")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to get popular movies: {e}")
            return []
    
    @cached('api', ttl=1800)
    def get_top_rated_movies(self, page: int = 1) -> List[Dict[str, Any]]:
        """
        获取高评分电影
        Enhanced with caching and filtering
        """
        try:
            endpoint = "/movie/top_rated"
            params = {'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Add media_type for consistency
            for item in results:
                item['media_type'] = 'movie'
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Retrieved {len(filtered_results)} filtered top-rated movies")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to get top-rated movies: {e}")
            return []
    
    @cached('api', ttl=1800)
    def get_now_playing_movies(self, page: int = 1) -> List[Dict[str, Any]]:
        """
        获取正在上映的电影
        Enhanced with caching and filtering
        """
        try:
            endpoint = "/movie/now_playing"
            params = {'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Add media_type for consistency
            for item in results:
                item['media_type'] = 'movie'
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Retrieved {len(filtered_results)} filtered now-playing movies")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to get now-playing movies: {e}")
            return []
    
    @cached('api', ttl=1800)
    def get_upcoming_movies(self, page: int = 1) -> List[Dict[str, Any]]:
        """
        获取即将上映的电影
        Enhanced with caching and filtering
        """
        try:
            endpoint = "/movie/upcoming"
            params = {'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Add media_type for consistency
            for item in results:
                item['media_type'] = 'movie'
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Retrieved {len(filtered_results)} filtered upcoming movies")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to get upcoming movies: {e}")
            return []
    
    @cached('api', ttl=3600)  # Cache movie details for 1 hour
    def get_movie_details(self, movie_id: int) -> Optional[Dict[str, Any]]:
        """
        获取电影详细信息
        Enhanced with caching
        """
        try:
            endpoint = f"/movie/{movie_id}"
            params = {'append_to_response': 'images,videos,credits'}
            
            data = self._make_request(endpoint, params)
            data['media_type'] = 'movie'  # Add for consistency
            
            logger.debug(f"Retrieved movie details for ID: {movie_id}")
            return data
            
        except Exception as e:
            logger.error(f"Failed to get movie details for ID {movie_id}: {e}")
            return None
    
    @cached('images', ttl=7200)  # Cache image data for 2 hours
    def get_movie_images(self, movie_id: int) -> Dict[str, List[Dict[str, Any]]]:
        """
        获取电影图片
        Enhanced with specialized image caching
        """
        try:
            endpoint = f"/movie/{movie_id}/images"
            
            data = self._make_request(endpoint)
            
            logger.debug(f"Retrieved images for movie ID: {movie_id}")
            return data
            
        except Exception as e:
            logger.error(f"Failed to get movie images for ID {movie_id}: {e}")
            return {'backdrops': [], 'posters': []}
    
    @cached('api', ttl=1800)
    def search_movies(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        """
        搜索电影
        Enhanced with caching and filtering
        """
        try:
            endpoint = "/search/movie"
            params = {'query': query, 'page': page}
            
            data = self._make_request(endpoint, params)
            results = data.get('results', [])
            
            # Add media_type for consistency
            for item in results:
                item['media_type'] = 'movie'
            
            # Apply content filtering
            filtered_results = filter_content(results)
            
            logger.info(f"Search '{query}' returned {len(filtered_results)} filtered results")
            return filtered_results
            
        except Exception as e:
            logger.error(f"Failed to search movies for query '{query}': {e}")
            return []
    
    def get_movies_with_backdrops(self, category: str = 'popular', limit: int = 50) -> List[Dict[str, Any]]:
        """
        获取有背景图的电影列表 (并发优化版本)
        Enhanced with concurrency control and smart filtering
        """
        try:
            # Get movies based on category
            if category == 'trending':
                movies = self.get_trending()
            elif category == 'top_rated':
                movies = self.get_top_rated_movies()
            elif category == 'now_playing':
                movies = self.get_now_playing_movies()
            else:
                movies = self.get_popular_movies()
            
            # Filter movies that have backdrop images
            movies_with_backdrops = [
                movie for movie in movies[:limit*2]  # Get extra to account for filtering
                if movie.get('backdrop_path')
            ]
            
            # Use concurrent processing for getting detailed movie info
            def get_movie_with_details(movie):
                movie_details = self.get_movie_details(movie['id'])
                if movie_details:
                    # Merge basic info with details
                    movie_details.update({
                        'backdrop_path': movie.get('backdrop_path'),
                        'poster_path': movie.get('poster_path'),
                        'popularity': movie.get('popularity', 0),
                        'vote_average': movie.get('vote_average', 0),
                        'vote_count': movie.get('vote_count', 0)
                    })
                return movie_details
            
            # Process movies concurrently
            detailed_movies = concurrent_map(
                get_movie_with_details,
                movies_with_backdrops[:limit],
                max_workers=NETWORK_CONFIG['MAX_CONCURRENT_REQUESTS'],
                priority=TaskPriority.HIGH
            )
            
            # Filter out None results
            valid_movies = [movie for movie in detailed_movies if movie is not None]
            
            logger.info(f"Retrieved {len(valid_movies)} movies with backdrops from '{category}' category")
            return valid_movies
            
        except Exception as e:
            logger.error(f"Failed to get movies with backdrops: {e}")
            return []
    
    def get_full_image_url(self, image_path: str, size: str = 'original') -> str:
        """
        生成完整的图片URL
        Enhanced with intelligent CDN selection
        """
        if not image_path:
            return ""
        
        # Use network resilience module for optimal CDN selection
        from network_resilience import get_optimized_image_url
        return get_optimized_image_url(image_path, size)
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get client performance statistics
        """
        cache_stats = {}
        try:
            from optimized_cache import global_caches
            cache_stats = global_caches.get_all_stats()
        except Exception:
            pass
        
        return {
            'request_stats': self.request_stats,
            'cache_stats': cache_stats
        }
    
    def health_check(self) -> Dict[str, Any]:
        """
        Perform health check on TMDB API
        """
        try:
            start_time = time.time()
            
            # Simple API call to check connectivity
            endpoint = "/configuration"
            self._make_request(endpoint)
            
            response_time = time.time() - start_time
            
            return {
                'status': 'healthy',
                'response_time': response_time,
                'timestamp': time.time()
            }
            
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': time.time()
            }
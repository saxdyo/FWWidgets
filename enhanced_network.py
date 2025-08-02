"""
Enhanced network module with CDN optimization, retry logic, and smart request handling.
Inspired by the network optimization features from fw2.js.
"""

import requests
import time
import random
from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass
from enum import Enum
import logging
import json
from urllib.parse import urljoin, urlparse
import threading
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class CDNRegion(Enum):
    """CDN regions for optimized image delivery"""
    GLOBAL = "global"
    CHINA = "china"
    ASIA = "asia"
    EUROPE = "europe"
    AMERICAS = "americas"


@dataclass
class CDNEndpoint:
    """CDN endpoint configuration"""
    name: str
    base_url: str
    region: CDNRegion
    priority: int = 1
    max_retries: int = 3
    timeout: float = 10.0
    supports_webp: bool = True
    supports_compression: bool = True


@dataclass
class NetworkConfig:
    """Network configuration settings"""
    timeout: float = 30.0
    max_retries: int = 3
    backoff_factor: float = 2.0
    rate_limit: float = 0.1
    user_agents: List[str] = None
    preferred_region: CDNRegion = CDNRegion.GLOBAL
    enable_compression: bool = True
    verify_ssl: bool = True
    
    def __post_init__(self):
        if self.user_agents is None:
            self.user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            ]


class CDNManager:
    """
    CDN management for optimized content delivery.
    Similar to CDN selection features in fw2.js.
    """
    
    def __init__(self):
        self.endpoints = {
            # TMDB CDN endpoints
            'tmdb_images': CDNEndpoint(
                name='TMDB Images',
                base_url='https://image.tmdb.org/t/p/',
                region=CDNRegion.GLOBAL,
                priority=1
            ),
            
            # Alternative CDN endpoints (hypothetical examples)
            'tmdb_images_asia': CDNEndpoint(
                name='TMDB Images Asia',
                base_url='https://asia-image.tmdb.org/t/p/',
                region=CDNRegion.ASIA,
                priority=2
            ),
            
            'tmdb_images_china': CDNEndpoint(
                name='TMDB Images China',
                base_url='https://cn-image.tmdb.org/t/p/',
                region=CDNRegion.CHINA,
                priority=1,
                timeout=15.0  # Longer timeout for China
            ),
            
            # GitHub Raw CDN (for fallback data)
            'github_raw': CDNEndpoint(
                name='GitHub Raw',
                base_url='https://raw.githubusercontent.com/',
                region=CDNRegion.GLOBAL,
                priority=3
            ),
            
            # CDN alternatives for China optimization
            'jsdelivr_china': CDNEndpoint(
                name='jsDelivr China',
                base_url='https://cdn.jsdelivr.net/gh/',
                region=CDNRegion.CHINA,
                priority=2
            )
        }
        
        self.performance_stats = {}
        self._lock = threading.Lock()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def get_best_endpoint(self, 
                         service_type: str, 
                         region: CDNRegion = CDNRegion.GLOBAL) -> Optional[CDNEndpoint]:
        """
        Get the best CDN endpoint for a service type and region.
        
        Args:
            service_type: Type of service (e.g., 'tmdb_images')
            region: Preferred region
            
        Returns:
            Best available CDN endpoint
        """
        # Filter endpoints by service type and region
        candidates = []
        for name, endpoint in self.endpoints.items():
            if service_type in name and (endpoint.region == region or endpoint.region == CDNRegion.GLOBAL):
                candidates.append(endpoint)
        
        if not candidates:
            # Fallback to any endpoint matching service type
            candidates = [endpoint for name, endpoint in self.endpoints.items() if service_type in name]
        
        if not candidates:
            return None
        
        # Sort by priority and performance
        candidates.sort(key=lambda x: (x.priority, self._get_endpoint_performance(x.name)))
        return candidates[0]
    
    def _get_endpoint_performance(self, endpoint_name: str) -> float:
        """Get performance score for an endpoint (lower is better)."""
        with self._lock:
            stats = self.performance_stats.get(endpoint_name, {'avg_response_time': 5.0, 'error_rate': 0.1})
            # Combine response time and error rate for scoring
            return stats['avg_response_time'] * (1 + stats['error_rate'])
    
    def update_performance_stats(self, endpoint_name: str, response_time: float, success: bool):
        """Update performance statistics for an endpoint."""
        with self._lock:
            if endpoint_name not in self.performance_stats:
                self.performance_stats[endpoint_name] = {
                    'avg_response_time': response_time,
                    'error_rate': 0.0 if success else 1.0,
                    'total_requests': 1,
                    'failed_requests': 0 if success else 1
                }
            else:
                stats = self.performance_stats[endpoint_name]
                stats['total_requests'] += 1
                if not success:
                    stats['failed_requests'] += 1
                
                # Update moving average
                alpha = 0.1  # Smoothing factor
                stats['avg_response_time'] = (1 - alpha) * stats['avg_response_time'] + alpha * response_time
                stats['error_rate'] = stats['failed_requests'] / stats['total_requests']


class EnhancedRequestSession:
    """
    Enhanced requests session with retry logic, rate limiting, and smart headers.
    Similar to the optimized request handling in fw2.js.
    """
    
    def __init__(self, config: NetworkConfig = None):
        """Initialize the enhanced session."""
        self.config = config or NetworkConfig()
        self.session = requests.Session()
        self.cdn_manager = CDNManager()
        self._setup_session()
        self._last_request_time = 0.0
        self._request_count = 0
        self._lock = threading.Lock()
        
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def _setup_session(self):
        """Setup the requests session with retry strategy."""
        retry_strategy = Retry(
            total=self.config.max_retries,
            backoff_factor=self.config.backoff_factor,
            status_forcelist=[408, 429, 500, 502, 503, 504],
            method_whitelist=["HEAD", "GET", "OPTIONS"]
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
    
    def _get_smart_headers(self) -> Dict[str, str]:
        """Get smart headers with rotating user agents."""
        headers = {
            'Accept': 'application/json, image/*, */*',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'Cache-Control': 'no-cache',
            'DNT': '1',
        }
        
        if self.config.enable_compression:
            headers['Accept-Encoding'] = 'gzip, deflate, br'
        
        # Rotate user agent
        if self.config.user_agents:
            headers['User-Agent'] = random.choice(self.config.user_agents)
        
        return headers
    
    def _apply_rate_limit(self):
        """Apply rate limiting between requests."""
        with self._lock:
            current_time = time.time()
            time_since_last = current_time - self._last_request_time
            
            if time_since_last < self.config.rate_limit:
                sleep_time = self.config.rate_limit - time_since_last
                time.sleep(sleep_time)
            
            self._last_request_time = time.time()
            self._request_count += 1
    
    def get(self, 
            url: str, 
            params: Optional[Dict] = None,
            headers: Optional[Dict] = None,
            timeout: Optional[float] = None,
            **kwargs) -> requests.Response:
        """
        Enhanced GET request with optimization features.
        
        Args:
            url: Request URL
            params: Query parameters
            headers: Request headers
            timeout: Request timeout
            **kwargs: Additional arguments
            
        Returns:
            Response object
        """
        self._apply_rate_limit()
        
        # Merge headers
        request_headers = self._get_smart_headers()
        if headers:
            request_headers.update(headers)
        
        # Use configured timeout if not specified
        if timeout is None:
            timeout = self.config.timeout
        
        start_time = time.time()
        try:
            response = self.session.get(
                url,
                params=params,
                headers=request_headers,
                timeout=timeout,
                verify=self.config.verify_ssl,
                **kwargs
            )
            
            response_time = time.time() - start_time
            
            # Update CDN performance stats if applicable
            parsed_url = urlparse(url)
            endpoint_name = f"{parsed_url.netloc.replace('.', '_')}"
            self.cdn_manager.update_performance_stats(endpoint_name, response_time, response.ok)
            
            response.raise_for_status()
            return response
            
        except Exception as e:
            response_time = time.time() - start_time
            
            # Update CDN performance stats for failed request
            parsed_url = urlparse(url)
            endpoint_name = f"{parsed_url.netloc.replace('.', '_')}"
            self.cdn_manager.update_performance_stats(endpoint_name, response_time, False)
            
            self.logger.warning(f"Request failed for {url}: {e}")
            raise
    
    def get_json(self, url: str, **kwargs) -> Dict[str, Any]:
        """Get JSON response with error handling."""
        response = self.get(url, **kwargs)
        try:
            return response.json()
        except json.JSONDecodeError as e:
            self.logger.error(f"Failed to decode JSON from {url}: {e}")
            raise
    
    def download_file(self, 
                     url: str, 
                     file_path: str,
                     chunk_size: int = 8192,
                     progress_callback: Optional[Callable[[int, int], None]] = None) -> bool:
        """
        Download a file with progress tracking.
        
        Args:
            url: File URL
            file_path: Local file path
            chunk_size: Download chunk size
            progress_callback: Progress callback function (downloaded, total)
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = self.get(url, stream=True)
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        
                        if progress_callback and total_size > 0:
                            progress_callback(downloaded, total_size)
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to download {url}: {e}")
            return False


class ImageURLOptimizer:
    """
    Image URL optimizer for different sizes and formats.
    Similar to the image optimization features in fw2.js.
    """
    
    def __init__(self, cdn_manager: CDNManager):
        self.cdn_manager = cdn_manager
        
        # TMDB image sizes
        self.tmdb_sizes = {
            'poster': ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
            'backdrop': ['w300', 'w780', 'w1280', 'original'],
            'logo': ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
            'profile': ['w45', 'w185', 'h632', 'original']
        }
        
        self.default_sizes = {
            'poster': 'w500',
            'backdrop': 'w1280',
            'logo': 'w300',
            'profile': 'w185'
        }
    
    def get_optimized_image_url(self, 
                              image_path: str,
                              image_type: str = 'poster',
                              size: Optional[str] = None,
                              region: CDNRegion = CDNRegion.GLOBAL,
                              fallback_cdn: bool = True) -> Optional[str]:
        """
        Get optimized image URL with CDN selection.
        
        Args:
            image_path: TMDB image path (e.g., '/abc123.jpg')
            image_type: Type of image ('poster', 'backdrop', 'logo', 'profile')
            size: Image size (e.g., 'w500', 'original')
            region: Preferred CDN region
            fallback_cdn: Whether to try alternative CDNs
            
        Returns:
            Optimized image URL or None if unavailable
        """
        if not image_path:
            return None
        
        # Remove leading slash if present
        if image_path.startswith('/'):
            image_path = image_path[1:]
        
        # Get appropriate size
        if size is None:
            size = self.default_sizes.get(image_type, 'w500')
        
        # Validate size for image type
        valid_sizes = self.tmdb_sizes.get(image_type, self.tmdb_sizes['poster'])
        if size not in valid_sizes:
            size = self.default_sizes.get(image_type, 'w500')
        
        # Get best CDN endpoint
        endpoint = self.cdn_manager.get_best_endpoint('tmdb_images', region)
        if not endpoint:
            return None
        
        # Construct URL
        url = f"{endpoint.base_url}{size}/{image_path}"
        
        return url
    
    def get_multiple_sizes(self, 
                          image_path: str,
                          image_type: str = 'poster',
                          sizes: Optional[List[str]] = None,
                          region: CDNRegion = CDNRegion.GLOBAL) -> Dict[str, str]:
        """
        Get multiple image URLs for different sizes.
        
        Args:
            image_path: TMDB image path
            image_type: Type of image
            sizes: List of sizes to generate
            region: Preferred CDN region
            
        Returns:
            Dictionary mapping size to URL
        """
        if sizes is None:
            sizes = self.tmdb_sizes.get(image_type, self.tmdb_sizes['poster'])
        
        urls = {}
        for size in sizes:
            url = self.get_optimized_image_url(image_path, image_type, size, region)
            if url:
                urls[size] = url
        
        return urls
    
    def get_responsive_srcset(self, 
                            image_path: str,
                            image_type: str = 'poster',
                            region: CDNRegion = CDNRegion.GLOBAL) -> str:
        """
        Generate responsive srcset for HTML img tags.
        
        Args:
            image_path: TMDB image path
            image_type: Type of image
            region: Preferred CDN region
            
        Returns:
            Srcset string for responsive images
        """
        size_to_width = {
            'w92': '92w',
            'w154': '154w',
            'w185': '185w',
            'w342': '342w',
            'w500': '500w',
            'w780': '780w',
            'w300': '300w',
            'w1280': '1280w'
        }
        
        urls = self.get_multiple_sizes(image_path, image_type, region=region)
        srcset_items = []
        
        for size, url in urls.items():
            if size in size_to_width:
                srcset_items.append(f"{url} {size_to_width[size]}")
        
        return ', '.join(srcset_items)


class SmartRateLimiter:
    """
    Smart rate limiter with adaptive delays.
    Similar to the rate limiting features in fw2.js.
    """
    
    def __init__(self, 
                 base_delay: float = 0.1,
                 max_delay: float = 5.0,
                 burst_limit: int = 10):
        """
        Initialize the rate limiter.
        
        Args:
            base_delay: Base delay between requests
            max_delay: Maximum delay
            burst_limit: Number of requests allowed in burst
        """
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.burst_limit = burst_limit
        
        self._request_times = []
        self._consecutive_errors = 0
        self._lock = threading.Lock()
    
    def wait_if_needed(self, is_error: bool = False):
        """Wait if rate limiting is needed."""
        with self._lock:
            current_time = time.time()
            
            # Update error count
            if is_error:
                self._consecutive_errors += 1
            else:
                self._consecutive_errors = 0
            
            # Clean old request times (keep only last burst_limit)
            self._request_times = [t for t in self._request_times if current_time - t < 60]
            
            # Check if we need to wait
            if len(self._request_times) >= self.burst_limit:
                # Calculate adaptive delay based on errors
                error_multiplier = min(2 ** self._consecutive_errors, 8)
                delay = min(self.base_delay * error_multiplier, self.max_delay)
                
                # Add jitter
                delay += random.uniform(0, delay * 0.1)
                
                time.sleep(delay)
            
            # Record this request
            self._request_times.append(current_time)


# Global instances
global_session = EnhancedRequestSession()
global_cdn_manager = CDNManager()
global_image_optimizer = ImageURLOptimizer(global_cdn_manager)
global_rate_limiter = SmartRateLimiter()
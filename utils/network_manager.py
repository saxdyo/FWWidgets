import requests
import time
import random
import logging
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urljoin, urlparse
import hashlib
from .concurrency_manager import concurrency_manager
from .cache_manager import cache_manager

logger = logging.getLogger(__name__)

class CDNManager:
    """
    CDN fallback and selection manager
    Based on fw2.js CDN optimization patterns
    """
    
    def __init__(self):
        # TMDB CDN endpoints (from fw2.js patterns)
        self.tmdb_cdns = [
            'https://image.tmdb.org/t/p/',
            'https://www.themoviedb.org/t/p/',
            'https://images.tmdb.org/t/p/',
        ]
        
        # Alternative CDNs for different regions
        self.regional_cdns = {
            'global': self.tmdb_cdns,
            'china': [
                'https://image.tmdb.org/t/p/',
                'https://cdn.jsdelivr.net/gh/tmdb/',  # JSDelivr fallback
                'https://www.themoviedb.org/t/p/',
            ],
            'asia': [
                'https://image.tmdb.org/t/p/',
                'https://www.themoviedb.org/t/p/',
                'https://images.tmdb.org/t/p/',
            ]
        }
        
        # CDN health tracking
        self.cdn_health = {}
        self.preferred_region = 'global'
        
    def get_available_cdns(self, region: str = None) -> List[str]:
        """Get available CDNs for a region"""
        region = region or self.preferred_region
        return self.regional_cdns.get(region, self.tmdb_cdns)
        
    def update_cdn_health(self, cdn_url: str, success: bool, response_time: float):
        """Update CDN health metrics"""
        if cdn_url not in self.cdn_health:
            self.cdn_health[cdn_url] = {
                'success_count': 0,
                'failure_count': 0,
                'avg_response_time': 0,
                'last_success': 0,
                'health_score': 100
            }
            
        health = self.cdn_health[cdn_url]
        
        if success:
            health['success_count'] += 1
            health['last_success'] = time.time()
            # Update average response time (exponential moving average)
            if health['avg_response_time'] == 0:
                health['avg_response_time'] = response_time
            else:
                health['avg_response_time'] = (health['avg_response_time'] * 0.8) + (response_time * 0.2)
        else:
            health['failure_count'] += 1
            
        # Calculate health score (0-100)
        total_requests = health['success_count'] + health['failure_count']
        success_rate = health['success_count'] / total_requests if total_requests > 0 else 0
        
        # Factor in response time (faster = better score)
        time_factor = max(0, 100 - health['avg_response_time'] * 10)
        health['health_score'] = (success_rate * 70) + (time_factor * 0.3)
        
    def get_best_cdn(self, region: str = None) -> str:
        """Get the best performing CDN for a region"""
        available_cdns = self.get_available_cdns(region)
        
        if not self.cdn_health:
            return available_cdns[0]
            
        # Sort CDNs by health score
        healthy_cdns = [
            (cdn, self.cdn_health.get(cdn, {}).get('health_score', 100))
            for cdn in available_cdns
            if self.cdn_health.get(cdn, {}).get('health_score', 100) > 20
        ]
        
        if healthy_cdns:
            healthy_cdns.sort(key=lambda x: x[1], reverse=True)
            return healthy_cdns[0][0]
        else:
            # Fallback to first available CDN
            return available_cdns[0]


class SmartRequestManager:
    """
    Intelligent request manager with fallback mechanisms
    Based on fw2.js network optimization patterns
    """
    
    def __init__(self):
        self.cdn_manager = CDNManager()
        self.session = requests.Session()
        
        # Rotating User-Agent headers (from fw2.js)
        self.user_agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        ]
        
        # Request headers optimization
        self.base_headers = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Referer': 'https://www.themoviedb.org/',
        }
        
    def get_optimized_headers(self) -> Dict[str, str]:
        """Get optimized headers with rotation"""
        headers = self.base_headers.copy()
        headers['User-Agent'] = random.choice(self.user_agents)
        return headers
        
    def make_request_with_fallback(
        self, 
        url: str, 
        method: str = 'GET',
        max_retries: int = 3,
        timeout: int = 30,
        **kwargs
    ) -> Optional[requests.Response]:
        """
        Make request with intelligent fallback and retry logic
        """
        start_time = time.time()
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                # Get optimized headers
                headers = kwargs.get('headers', {})
                headers.update(self.get_optimized_headers())
                kwargs['headers'] = headers
                
                # Make request
                response = self.session.request(
                    method=method,
                    url=url,
                    timeout=timeout,
                    **kwargs
                )
                
                # Update CDN health on success
                response_time = time.time() - start_time
                parsed_url = urlparse(url)
                cdn_base = f"{parsed_url.scheme}://{parsed_url.netloc}"
                self.cdn_manager.update_cdn_health(cdn_base, True, response_time)
                
                response.raise_for_status()
                return response
                
            except Exception as e:
                last_exception = e
                
                # Update CDN health on failure
                parsed_url = urlparse(url)
                cdn_base = f"{parsed_url.scheme}://{parsed_url.netloc}"
                self.cdn_manager.update_cdn_health(cdn_base, False, 0)
                
                if attempt < max_retries - 1:
                    # Exponential backoff with jitter
                    delay = (2 ** attempt) + random.uniform(0, 1)
                    logger.warning(f"Request failed (attempt {attempt + 1}): {e}. Retrying in {delay:.2f}s")
                    time.sleep(delay)
                else:
                    logger.error(f"All {max_retries} attempts failed for {url}: {e}")
                    
        return None


class OptimizedImageManager:
    """
    Optimized image URL generation and management
    Based on fw2.js image optimization patterns
    """
    
    def __init__(self):
        self.request_manager = SmartRequestManager()
        
        # Image size configurations
        self.size_configs = {
            'thumbnail': 'w154',
            'small': 'w342',
            'medium': 'w500',
            'large': 'w780',
            'xlarge': 'w1280',
            'original': 'original'
        }
        
        # Network-based size selection
        self.network_sizes = {
            'good': 'large',
            'poor': 'medium', 
            'critical': 'small'
        }
        
    def get_optimized_image_url(
        self, 
        image_path: str, 
        size: str = 'medium',
        network_condition: str = 'good',
        region: str = None
    ) -> str:
        """
        Generate optimized image URL with CDN selection
        """
        if not image_path:
            return ""
            
        # Adjust size based on network condition
        if network_condition in self.network_sizes:
            size = self.network_sizes[network_condition]
            
        # Get size parameter
        size_param = self.size_configs.get(size, 'w500')
        
        # Get best CDN
        cdn_base = self.request_manager.cdn_manager.get_best_cdn(region)
        
        # Clean image path
        if image_path.startswith('/'):
            image_path = image_path[1:]
            
        # Construct URL
        return f"{cdn_base}{size_param}/{image_path}"
        
    def get_multiple_sizes(self, image_path: str, region: str = None) -> Dict[str, str]:
        """Generate URLs for multiple image sizes"""
        if not image_path:
            return {}
            
        return {
            size: self.get_optimized_image_url(image_path, size, region=region)
            for size in self.size_configs.keys()
        }
        
    def preload_image(self, url: str) -> bool:
        """Preload image and cache response"""
        try:
            response = self.request_manager.make_request_with_fallback(
                url, 
                method='HEAD',  # Just check if image exists
                timeout=10
            )
            return response is not None and response.status_code == 200
        except Exception as e:
            logger.debug(f"Preload failed for {url}: {e}")
            return False


class NetworkManager:
    """
    Main network manager coordinating all network operations
    Based on fw2.js comprehensive network optimization
    """
    
    def __init__(self):
        self.request_manager = SmartRequestManager()
        self.image_manager = OptimizedImageManager()
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'cache_hits': 0,
            'fallback_used': 0
        }
        
    def make_api_request(
        self, 
        url: str, 
        cache_key: str = None,
        cache_ttl: int = 3600,
        **kwargs
    ) -> Optional[Dict[str, Any]]:
        """
        Make API request with caching and fallback
        """
        self.stats['total_requests'] += 1
        
        # Try cache first
        if cache_key:
            cached_data = cache_manager.get('movies', cache_key)
            if cached_data:
                self.stats['cache_hits'] += 1
                logger.debug(f"Cache hit for {cache_key}")
                return cached_data
                
        # Make request with fallback
        response = concurrency_manager.execute_with_retry(
            self.request_manager.make_request_with_fallback,
            3,  # max_retries
            url,
            **kwargs
        )
        
        if response and response.status_code == 200:
            try:
                data = response.json()
                
                # Cache successful response
                if cache_key:
                    cache_manager.set('movies', cache_key, data, cache_ttl)
                    
                self.stats['successful_requests'] += 1
                return data
                
            except Exception as e:
                logger.error(f"Failed to parse JSON response: {e}")
                
        self.stats['failed_requests'] += 1
        return None
        
    def download_image_with_fallback(
        self, 
        image_path: str, 
        local_path: str,
        size: str = 'medium',
        max_retries: int = 3
    ) -> bool:
        """
        Download image with CDN fallback and optimization
        """
        if not image_path:
            return False
            
        # Get network condition for size optimization
        perf_stats = concurrency_manager.get_performance_stats()
        network_condition = perf_stats.get('network_condition', 'good')
        
        # Generate optimized URL
        image_url = self.image_manager.get_optimized_image_url(
            image_path, 
            size=size,
            network_condition=network_condition
        )
        
        # Try different CDNs if needed
        available_cdns = self.request_manager.cdn_manager.get_available_cdns()
        
        for cdn in available_cdns:
            try:
                # Replace CDN in URL
                if image_url.startswith('https://image.tmdb.org'):
                    cdn_url = image_url.replace('https://image.tmdb.org', cdn.rstrip('/'))
                else:
                    cdn_url = image_url
                    
                # Make request
                response = self.request_manager.make_request_with_fallback(
                    cdn_url,
                    timeout=30
                )
                
                if response and response.status_code == 200:
                    # Save image
                    with open(local_path, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            f.write(chunk)
                            
                    logger.info(f"Downloaded image: {local_path}")
                    return True
                    
            except Exception as e:
                logger.warning(f"Failed to download from {cdn}: {e}")
                continue
                
        logger.error(f"Failed to download image after trying all CDNs: {image_path}")
        return False
        
    def get_network_stats(self) -> Dict[str, Any]:
        """Get comprehensive network statistics"""
        return {
            'requests': self.stats,
            'concurrency': concurrency_manager.get_performance_stats(),
            'cache': cache_manager.get_all_stats(),
            'cdn_health': self.request_manager.cdn_manager.cdn_health
        }
        
    def auto_recover_network(self) -> Dict[str, Any]:
        """
        Auto-recovery mechanism for network issues
        Based on fw2.js auto-recovery patterns
        """
        recovery_report = {
            'actions_taken': [],
            'issues_found': [],
            'status': 'healthy'
        }
        
        # Check failure rate
        total_requests = self.stats['total_requests']
        if total_requests > 0:
            failure_rate = self.stats['failed_requests'] / total_requests
            
            if failure_rate > 0.3:
                recovery_report['issues_found'].append(f"High failure rate: {failure_rate:.1%}")
                
                # Clear unhealthy CDNs
                unhealthy_cdns = [
                    cdn for cdn, health in self.request_manager.cdn_manager.cdn_health.items()
                    if health.get('health_score', 100) < 50
                ]
                
                if unhealthy_cdns:
                    for cdn in unhealthy_cdns:
                        del self.request_manager.cdn_manager.cdn_health[cdn]
                    recovery_report['actions_taken'].append(f"Cleared {len(unhealthy_cdns)} unhealthy CDNs")
                    
                # Reset network condition to good
                concurrency_manager.current_condition = 'good'
                recovery_report['actions_taken'].append("Reset network condition to 'good'")
                
                recovery_report['status'] = 'recovered'
                
        return recovery_report


# Global network manager instance  
network_manager = NetworkManager()
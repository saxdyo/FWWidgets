"""
Network resilience system inspired by fw2.js
Provides intelligent CDN selection, retry logic, request optimization, and health monitoring
"""

import time
import random
import requests
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from urllib.parse import urljoin, urlparse
import logging
from config import NETWORK_CONFIG, CDN_CONFIG, LOGGING_CONFIG
from optimized_cache import get_cache, cached
from concurrent.futures import ThreadPoolExecutor, as_completed

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class SourceHealth:
    """Health information for a CDN source"""
    url: str
    response_time: float = 0.0
    success_rate: float = 1.0
    last_check: float = field(default_factory=time.time)
    consecutive_failures: int = 0
    total_requests: int = 0
    total_failures: int = 0
    is_available: bool = True
    
    def update_success(self, response_time: float):
        """Update stats for successful request"""
        self.response_time = (self.response_time + response_time) / 2 if self.response_time > 0 else response_time
        self.total_requests += 1
        self.consecutive_failures = 0
        self.success_rate = (self.total_requests - self.total_failures) / self.total_requests
        self.last_check = time.time()
        self.is_available = True
    
    def update_failure(self):
        """Update stats for failed request"""
        self.total_requests += 1
        self.total_failures += 1
        self.consecutive_failures += 1
        self.success_rate = (self.total_requests - self.total_failures) / self.total_requests
        self.last_check = time.time()
        
        # Mark as unavailable after too many consecutive failures
        if self.consecutive_failures >= 3:
            self.is_available = False
    
    @property
    def health_score(self) -> float:
        """Calculate overall health score (0-1)"""
        if not self.is_available:
            return 0.0
        
        # Combine success rate and response time (lower is better for response time)
        time_score = max(0, 1 - (self.response_time / 10.0))  # 10s = 0 score
        return (self.success_rate * 0.7) + (time_score * 0.3)


class IntelligentCDNSelector:
    """
    Intelligent CDN source selection inspired by fw2.js dynamic CDN selection
    Features:
    - Health monitoring of multiple sources
    - Automatic failover
    - Performance-based source ranking
    - Geographic optimization
    - Smart source recovery
    """
    
    def __init__(self):
        self.sources: Dict[str, SourceHealth] = {}
        self.primary_sources = CDN_CONFIG['PRIMARY_SOURCES']
        self.fallback_sources = CDN_CONFIG['FALLBACK_SOURCES']
        self.china_sources = CDN_CONFIG['CHINA_OPTIMIZED_SOURCES']
        
        # Initialize source health tracking
        all_sources = self.primary_sources + self.fallback_sources + self.china_sources
        for source in all_sources:
            self.sources[source] = SourceHealth(url=source)
        
        self.last_health_check = 0
        self.user_agents = NETWORK_CONFIG['USER_AGENTS']
        
        logger.info(f"Initialized CDN selector with {len(all_sources)} sources")
    
    def get_best_source(self, prefer_china: bool = False) -> str:
        """Get the best available source based on health metrics"""
        self._periodic_health_check()
        
        # Choose source pool based on preference
        if prefer_china and self.china_sources:
            source_pool = self.china_sources + self.primary_sources
        else:
            source_pool = self.primary_sources + self.fallback_sources
        
        # Filter available sources and sort by health score
        available_sources = [
            (source, self.sources[source]) for source in source_pool
            if source in self.sources and self.sources[source].is_available
        ]
        
        if not available_sources:
            # Emergency fallback - try any source
            logger.warning("No healthy sources available, using emergency fallback")
            return self.primary_sources[0] if self.primary_sources else "https://image.tmdb.org/t/p/"
        
        # Sort by health score (highest first)
        available_sources.sort(key=lambda x: x[1].health_score, reverse=True)
        
        best_source = available_sources[0][0]
        logger.debug(f"Selected CDN source: {best_source} (score: {available_sources[0][1].health_score:.2f})")
        
        return best_source
    
    def report_success(self, source: str, response_time: float):
        """Report successful request to update source health"""
        if source in self.sources:
            self.sources[source].update_success(response_time)
    
    def report_failure(self, source: str):
        """Report failed request to update source health"""
        if source in self.sources:
            self.sources[source].update_failure()
            logger.warning(f"CDN source failure reported: {source}")
    
    def _periodic_health_check(self):
        """Perform periodic health checks on all sources"""
        current_time = time.time()
        if current_time - self.last_health_check < CDN_CONFIG['SOURCE_HEALTH_CHECK_INTERVAL']:
            return
        
        logger.info("Performing CDN health check...")
        
        def check_source(source: str) -> Tuple[str, bool, float]:
            """Check if a source is responsive"""
            try:
                # Simple HEAD request to check availability
                test_url = urljoin(source, "w185/test.jpg")  # Doesn't need to exist
                start_time = time.time()
                
                response = requests.head(
                    test_url,
                    timeout=5,
                    headers={'User-Agent': random.choice(self.user_agents)}
                )
                
                response_time = time.time() - start_time
                # Consider 404 as success (source is responsive)
                is_success = response.status_code in [200, 404, 403]
                
                return source, is_success, response_time
                
            except Exception as e:
                logger.debug(f"Health check failed for {source}: {e}")
                return source, False, 10.0
        
        # Check all sources concurrently
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(check_source, source) for source in self.sources.keys()]
            
            for future in as_completed(futures):
                source, is_success, response_time = future.result()
                
                if is_success:
                    self.sources[source].update_success(response_time)
                else:
                    self.sources[source].update_failure()
        
        self.last_health_check = current_time
        
        # Log health summary
        healthy_count = sum(1 for s in self.sources.values() if s.is_available)
        logger.info(f"Health check complete: {healthy_count}/{len(self.sources)} sources healthy")
    
    def get_health_report(self) -> Dict[str, Any]:
        """Get comprehensive health report for all sources"""
        return {
            source: {
                'response_time': health.response_time,
                'success_rate': health.success_rate,
                'health_score': health.health_score,
                'is_available': health.is_available,
                'consecutive_failures': health.consecutive_failures,
                'total_requests': health.total_requests
            }
            for source, health in self.sources.items()
        }


class RetryableRequest:
    """
    Advanced retry logic inspired by fw2.js retry mechanisms
    Features:
    - Exponential backoff
    - Jittered delays
    - Source failover
    - Smart error handling
    """
    
    def __init__(self, cdn_selector: IntelligentCDNSelector):
        self.cdn_selector = cdn_selector
        self.session = requests.Session()
        
        # Setup session with optimized settings
        adapter = requests.adapters.HTTPAdapter(
            pool_connections=20,
            pool_maxsize=100,
            max_retries=0  # We handle retries ourselves
        )
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)
    
    def request(
        self,
        method: str,
        url: str,
        max_retries: int = NETWORK_CONFIG['MAX_RETRIES'],
        prefer_china: bool = False,
        **kwargs
    ) -> requests.Response:
        """
        Make a request with intelligent retry and failover
        """
        last_exception = None
        attempted_sources = set()
        
        for attempt in range(max_retries + 1):
            try:
                # Get best available source
                base_source = self.cdn_selector.get_best_source(prefer_china=prefer_china)
                
                # If we've already tried this source, try to get an alternative
                if base_source in attempted_sources and attempt > 0:
                    # Try to get a different source by temporarily marking current as unavailable
                    original_availability = self.cdn_selector.sources[base_source].is_available
                    self.cdn_selector.sources[base_source].is_available = False
                    base_source = self.cdn_selector.get_best_source(prefer_china=prefer_china)
                    self.cdn_selector.sources[base_source].is_available = original_availability
                
                attempted_sources.add(base_source)
                
                # Construct full URL
                if url.startswith('http'):
                    full_url = url
                else:
                    full_url = urljoin(base_source, url.lstrip('/'))
                
                # Prepare request with optimizations
                request_kwargs = {
                    'timeout': NETWORK_CONFIG['TIMEOUT'],
                    'headers': {
                        'User-Agent': random.choice(self.cdn_selector.user_agents),
                        **kwargs.get('headers', {})
                    },
                    **{k: v for k, v in kwargs.items() if k != 'headers'}
                }
                
                # Make the request
                start_time = time.time()
                response = self.session.request(method, full_url, **request_kwargs)
                response_time = time.time() - start_time
                
                # Check if response is successful
                response.raise_for_status()
                
                # Report success to CDN selector
                self.cdn_selector.report_success(base_source, response_time)
                
                logger.debug(f"Request successful: {method} {full_url} ({response_time:.2f}s)")
                return response
                
            except Exception as e:
                last_exception = e
                
                # Report failure to CDN selector
                if 'base_source' in locals():
                    self.cdn_selector.report_failure(base_source)
                
                logger.warning(f"Request attempt {attempt + 1} failed: {e}")
                
                # Don't retry on certain errors
                if isinstance(e, requests.exceptions.HTTPError):
                    if e.response.status_code in [400, 401, 403, 404]:
                        break
                
                # Calculate delay for next attempt
                if attempt < max_retries:
                    delay = self._calculate_retry_delay(attempt)
                    logger.debug(f"Retrying in {delay:.2f} seconds...")
                    time.sleep(delay)
        
        # All retries exhausted
        logger.error(f"Request failed after {max_retries + 1} attempts: {last_exception}")
        raise last_exception
    
    def _calculate_retry_delay(self, attempt: int) -> float:
        """Calculate retry delay with exponential backoff and jitter"""
        if not NETWORK_CONFIG['EXPONENTIAL_BACKOFF']:
            return NETWORK_CONFIG['RETRY_DELAY']
        
        # Exponential backoff: base_delay * (2 ^ attempt)
        base_delay = NETWORK_CONFIG['RETRY_DELAY']
        exponential_delay = base_delay * (2 ** attempt)
        
        # Add jitter to prevent thundering herd
        jitter = random.uniform(0.1, 0.3) * exponential_delay
        
        return min(exponential_delay + jitter, 30)  # Cap at 30 seconds


class OptimizedImageManager:
    """
    Optimized image URL generation and management inspired by fw2.js OptimizedImageManager
    """
    
    def __init__(self):
        self.cdn_selector = IntelligentCDNSelector()
        self.requester = RetryableRequest(self.cdn_selector)
    
    @cached('images', ttl=7200)
    def get_optimized_image_url(
        self,
        image_path: str,
        size: str = 'medium',
        prefer_china: bool = False
    ) -> str:
        """
        Generate optimized image URL with best available CDN
        """
        if not image_path:
            return ""
        
        # Get size configuration
        from config import IMAGE_CONFIG
        size_code = IMAGE_CONFIG['SIZES'].get(size, 'w500')
        
        # Get best CDN source
        base_source = self.cdn_selector.get_best_source(prefer_china=prefer_china)
        
        # Construct URL
        if image_path.startswith('/'):
            image_path = image_path[1:]
        
        full_url = urljoin(base_source, f"{size_code}/{image_path}")
        
        logger.debug(f"Generated optimized image URL: {full_url}")
        return full_url
    
    def download_image(
        self,
        image_path: str,
        size: str = 'medium',
        prefer_china: bool = False
    ) -> Optional[bytes]:
        """
        Download image with retry and failover
        """
        try:
            url = self.get_optimized_image_url(image_path, size, prefer_china)
            if not url:
                return None
            
            response = self.requester.request('GET', url)
            return response.content
            
        except Exception as e:
            logger.error(f"Failed to download image {image_path}: {e}")
            return None
    
    def preload_images(self, image_paths: List[str], size: str = 'medium') -> Dict[str, bool]:
        """
        Preload multiple images concurrently
        Returns dict of image_path -> success_status
        """
        results = {}
        
        def download_single(path: str) -> Tuple[str, bool]:
            try:
                content = self.download_image(path, size)
                return path, content is not None
            except:
                return path, False
        
        with ThreadPoolExecutor(max_workers=NETWORK_CONFIG['MAX_CONCURRENT_REQUESTS']) as executor:
            futures = [executor.submit(download_single, path) for path in image_paths]
            
            for future in as_completed(futures):
                path, success = future.result()
                results[path] = success
        
        success_count = sum(results.values())
        logger.info(f"Preloaded {success_count}/{len(image_paths)} images")
        
        return results


# Global instances
global_cdn_selector = IntelligentCDNSelector()
global_requester = RetryableRequest(global_cdn_selector)
global_image_manager = OptimizedImageManager()


def smart_request(method: str, url: str, **kwargs) -> requests.Response:
    """
    Make a smart request with all optimizations enabled
    """
    return global_requester.request(method, url, **kwargs)


def get_optimized_image_url(image_path: str, size: str = 'medium') -> str:
    """
    Get optimized image URL using global image manager
    """
    return global_image_manager.get_optimized_image_url(image_path, size)


def download_image_optimized(image_path: str, size: str = 'medium') -> Optional[bytes]:
    """
    Download image using global optimized image manager
    """
    return global_image_manager.download_image(image_path, size)


def get_network_health_report() -> Dict[str, Any]:
    """
    Get comprehensive network health report
    """
    return {
        'cdn_health': global_cdn_selector.get_health_report(),
        'request_stats': {
            # Can add more stats here
        }
    }
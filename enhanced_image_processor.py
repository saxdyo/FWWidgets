"""
Enhanced image processing with intelligent sizing, compression, and preloading.
Inspired by the image optimization features from fw2.js.
"""

import os
import time
import threading
from typing import Dict, List, Optional, Tuple, Any, Callable
from dataclasses import dataclass
from enum import Enum
import logging
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import hashlib

try:
    from PIL import Image, ImageFilter, ImageEnhance, ImageOps
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

from enhanced_network import global_session, ImageURLOptimizer, CDNRegion


class ImageFormat(Enum):
    """Supported image formats"""
    JPEG = "JPEG"
    PNG = "PNG"
    WEBP = "WEBP"
    AVIF = "AVIF"


class CompressionLevel(Enum):
    """Image compression levels"""
    LOW = 1      # High quality, large file
    MEDIUM = 2   # Balanced quality/size
    HIGH = 3     # Lower quality, small file
    ULTRA = 4    # Minimum quality, tiny file


@dataclass
class ImageOptimizationConfig:
    """Configuration for image optimization"""
    target_format: ImageFormat = ImageFormat.JPEG
    compression_level: CompressionLevel = CompressionLevel.MEDIUM
    max_width: Optional[int] = None
    max_height: Optional[int] = None
    enable_webp_fallback: bool = True
    enable_progressive: bool = True
    enable_optimization: bool = True
    quality_map: Dict[CompressionLevel, int] = None
    
    def __post_init__(self):
        if self.quality_map is None:
            self.quality_map = {
                CompressionLevel.LOW: 95,
                CompressionLevel.MEDIUM: 85,
                CompressionLevel.HIGH: 75,
                CompressionLevel.ULTRA: 60
            }


@dataclass
class ImageProcessingResult:
    """Result of image processing operation"""
    success: bool
    original_size: Optional[Tuple[int, int]] = None
    processed_size: Optional[Tuple[int, int]] = None
    original_file_size: Optional[int] = None
    processed_file_size: Optional[int] = None
    compression_ratio: Optional[float] = None
    processing_time: Optional[float] = None
    error: Optional[str] = None
    output_path: Optional[str] = None


class IntelligentImageProcessor:
    """
    Intelligent image processor with adaptive optimization.
    Similar to the image optimization features in fw2.js.
    """
    
    def __init__(self, cache_dir: str = "image_cache"):
        """
        Initialize the image processor.
        
        Args:
            cache_dir: Directory for caching processed images
        """
        self.cache_dir = cache_dir
        self.image_optimizer = ImageURLOptimizer(None)
        self.session = global_session
        self.cache_index = {}  # URL -> local path mapping
        self.processing_stats = {
            'total_processed': 0,
            'cache_hits': 0,
            'bytes_saved': 0,
            'processing_time': 0.0
        }
        self._lock = threading.Lock()
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Create cache directory
        os.makedirs(cache_dir, exist_ok=True)
        
        if not PIL_AVAILABLE:
            self.logger.warning("PIL not available. Image processing will be limited.")
    
    def _get_cache_key(self, url: str, config: ImageOptimizationConfig) -> str:
        """Generate cache key for processed image."""
        # Create a hash of URL and config
        config_str = f"{config.target_format.value}_{config.compression_level.value}_{config.max_width}_{config.max_height}"
        cache_string = f"{url}_{config_str}"
        return hashlib.md5(cache_string.encode()).hexdigest()
    
    def _get_cache_path(self, cache_key: str, format: ImageFormat) -> str:
        """Get full cache file path."""
        extension = format.value.lower()
        if extension == "jpeg":
            extension = "jpg"
        return os.path.join(self.cache_dir, f"{cache_key}.{extension}")
    
    def _detect_optimal_format(self, image: Image.Image, config: ImageOptimizationConfig) -> ImageFormat:
        """Detect optimal format for image based on content."""
        if not PIL_AVAILABLE:
            return config.target_format
        
        # Analyze image characteristics
        has_transparency = image.mode in ('RGBA', 'LA') or 'transparency' in image.info
        
        # If image has transparency, prefer PNG or WEBP
        if has_transparency:
            if config.enable_webp_fallback:
                return ImageFormat.WEBP
            return ImageFormat.PNG
        
        # For photos, prefer JPEG or WEBP
        if config.enable_webp_fallback:
            return ImageFormat.WEBP
        
        return ImageFormat.JPEG
    
    def _calculate_optimal_dimensions(self, 
                                    original_size: Tuple[int, int],
                                    config: ImageOptimizationConfig) -> Tuple[int, int]:
        """Calculate optimal dimensions for resizing."""
        width, height = original_size
        
        # No resizing needed if no constraints
        if not config.max_width and not config.max_height:
            return width, height
        
        # Calculate scaling factor
        scale_x = 1.0
        scale_y = 1.0
        
        if config.max_width and width > config.max_width:
            scale_x = config.max_width / width
        
        if config.max_height and height > config.max_height:
            scale_y = config.max_height / height
        
        # Use the smaller scale to maintain aspect ratio
        scale = min(scale_x, scale_y)
        
        if scale < 1.0:
            new_width = int(width * scale)
            new_height = int(height * scale)
            return new_width, new_height
        
        return width, height
    
    def _apply_smart_compression(self, 
                               image: Image.Image,
                               config: ImageOptimizationConfig) -> Image.Image:
        """Apply smart compression based on image content."""
        if not PIL_AVAILABLE:
            return image
        
        # Apply sharpening for high compression levels
        if config.compression_level in [CompressionLevel.HIGH, CompressionLevel.ULTRA]:
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(1.1)  # Slight sharpening
        
        # Apply noise reduction for very high compression
        if config.compression_level == CompressionLevel.ULTRA:
            # Apply slight blur to reduce noise
            image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        return image
    
    def _optimize_image(self, 
                       image: Image.Image,
                       config: ImageOptimizationConfig,
                       output_path: str) -> ImageProcessingResult:
        """Optimize a PIL Image according to configuration."""
        if not PIL_AVAILABLE:
            return ImageProcessingResult(
                success=False,
                error="PIL not available for image processing"
            )
        
        start_time = time.time()
        original_size = image.size
        
        try:
            # Calculate optimal dimensions
            new_size = self._calculate_optimal_dimensions(original_size, config)
            
            # Resize if needed
            if new_size != original_size:
                # Use high-quality resampling
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Apply smart compression
            image = self._apply_smart_compression(image, config)
            
            # Detect optimal format
            optimal_format = self._detect_optimal_format(image, config)
            
            # Convert color mode if necessary
            if optimal_format == ImageFormat.JPEG and image.mode in ('RGBA', 'LA'):
                # Convert to RGB for JPEG
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            
            # Save with optimization
            save_kwargs = {
                'optimize': config.enable_optimization,
                'quality': config.quality_map[config.compression_level]
            }
            
            if optimal_format == ImageFormat.JPEG:
                save_kwargs['progressive'] = config.enable_progressive
                save_kwargs['format'] = 'JPEG'
            elif optimal_format == ImageFormat.PNG:
                save_kwargs['format'] = 'PNG'
            elif optimal_format == ImageFormat.WEBP:
                save_kwargs['format'] = 'WEBP'
                save_kwargs['lossless'] = config.compression_level == CompressionLevel.LOW
            
            # Get original file size (approximate)
            original_buffer = BytesIO()
            temp_image = image.copy()
            temp_image.save(original_buffer, format='PNG')
            original_file_size = original_buffer.tell()
            
            # Save optimized image
            image.save(output_path, **save_kwargs)
            
            # Get processed file size
            processed_file_size = os.path.getsize(output_path)
            
            # Calculate compression ratio
            compression_ratio = processed_file_size / original_file_size if original_file_size > 0 else 1.0
            
            processing_time = time.time() - start_time
            
            return ImageProcessingResult(
                success=True,
                original_size=original_size,
                processed_size=new_size,
                original_file_size=original_file_size,
                processed_file_size=processed_file_size,
                compression_ratio=compression_ratio,
                processing_time=processing_time,
                output_path=output_path
            )
            
        except Exception as e:
            self.logger.error(f"Error optimizing image: {e}")
            return ImageProcessingResult(
                success=False,
                error=str(e),
                processing_time=time.time() - start_time
            )
    
    def process_image_url(self, 
                         url: str,
                         config: ImageOptimizationConfig = None,
                         force_reprocess: bool = False) -> ImageProcessingResult:
        """
        Process an image from URL with optimization.
        
        Args:
            url: Image URL
            config: Optimization configuration
            force_reprocess: Force reprocessing even if cached
            
        Returns:
            ImageProcessingResult with processing details
        """
        if config is None:
            config = ImageOptimizationConfig()
        
        # Check cache first
        cache_key = self._get_cache_key(url, config)
        cache_path = self._get_cache_path(cache_key, config.target_format)
        
        with self._lock:
            if not force_reprocess and os.path.exists(cache_path):
                self.processing_stats['cache_hits'] += 1
                return ImageProcessingResult(
                    success=True,
                    output_path=cache_path,
                    processing_time=0.0
                )
        
        if not PIL_AVAILABLE:
            return ImageProcessingResult(
                success=False,
                error="PIL not available for image processing"
            )
        
        try:
            # Download image
            response = self.session.get(url)
            image_data = BytesIO(response.content)
            image = Image.open(image_data)
            
            # Process image
            result = self._optimize_image(image, config, cache_path)
            
            # Update stats
            with self._lock:
                self.processing_stats['total_processed'] += 1
                if result.processing_time:
                    self.processing_stats['processing_time'] += result.processing_time
                if result.original_file_size and result.processed_file_size:
                    bytes_saved = result.original_file_size - result.processed_file_size
                    self.processing_stats['bytes_saved'] += max(0, bytes_saved)
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error processing image from {url}: {e}")
            return ImageProcessingResult(
                success=False,
                error=str(e)
            )
    
    def process_multiple_images(self, 
                               urls: List[str],
                               config: ImageOptimizationConfig = None,
                               max_workers: int = 4,
                               progress_callback: Optional[Callable[[int, int], None]] = None) -> List[ImageProcessingResult]:
        """
        Process multiple images concurrently.
        
        Args:
            urls: List of image URLs
            config: Optimization configuration
            max_workers: Maximum concurrent workers
            progress_callback: Progress callback function
            
        Returns:
            List of ImageProcessingResult objects
        """
        if config is None:
            config = ImageOptimizationConfig()
        
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_url = {
                executor.submit(self.process_image_url, url, config): url 
                for url in urls
            }
            
            # Collect results
            completed = 0
            for future in future_to_url:
                try:
                    result = future.result()
                    results.append(result)
                    completed += 1
                    
                    if progress_callback:
                        progress_callback(completed, len(urls))
                        
                except Exception as e:
                    self.logger.error(f"Error processing image: {e}")
                    results.append(ImageProcessingResult(
                        success=False,
                        error=str(e)
                    ))
                    completed += 1
                    
                    if progress_callback:
                        progress_callback(completed, len(urls))
        
        return results
    
    def preload_images(self, 
                      urls: List[str],
                      config: ImageOptimizationConfig = None,
                      priority_urls: Optional[List[str]] = None) -> Dict[str, str]:
        """
        Preload and cache images for faster access.
        
        Args:
            urls: List of image URLs to preload
            config: Optimization configuration
            priority_urls: URLs to process with higher priority
            
        Returns:
            Dictionary mapping URLs to local cache paths
        """
        if config is None:
            config = ImageOptimizationConfig()
        
        # Separate priority and normal URLs
        priority_urls = priority_urls or []
        normal_urls = [url for url in urls if url not in priority_urls]
        
        # Process priority URLs first
        url_to_path = {}
        
        if priority_urls:
            self.logger.info(f"Preloading {len(priority_urls)} priority images...")
            priority_results = self.process_multiple_images(priority_urls, config)
            
            for url, result in zip(priority_urls, priority_results):
                if result.success and result.output_path:
                    url_to_path[url] = result.output_path
        
        # Process normal URLs
        if normal_urls:
            self.logger.info(f"Preloading {len(normal_urls)} normal images...")
            normal_results = self.process_multiple_images(normal_urls, config)
            
            for url, result in zip(normal_urls, normal_results):
                if result.success and result.output_path:
                    url_to_path[url] = result.output_path
        
        return url_to_path
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get image processing statistics."""
        with self._lock:
            stats = self.processing_stats.copy()
            
            # Calculate additional metrics
            if stats['total_processed'] > 0:
                stats['cache_hit_rate'] = stats['cache_hits'] / (stats['cache_hits'] + stats['total_processed'])
                stats['avg_processing_time'] = stats['processing_time'] / stats['total_processed']
            else:
                stats['cache_hit_rate'] = 0.0
                stats['avg_processing_time'] = 0.0
            
            # Add cache info
            stats['cache_size_mb'] = self._get_cache_size_mb()
            stats['cached_files'] = len([f for f in os.listdir(self.cache_dir) if os.path.isfile(os.path.join(self.cache_dir, f))])
            
            return stats
    
    def _get_cache_size_mb(self) -> float:
        """Get cache directory size in MB."""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(self.cache_dir):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                if os.path.isfile(filepath):
                    total_size += os.path.getsize(filepath)
        return total_size / (1024 * 1024)  # Convert to MB
    
    def cleanup_cache(self, max_age_days: int = 30, max_size_mb: int = 1000) -> Dict[str, int]:
        """
        Clean up old cache files.
        
        Args:
            max_age_days: Maximum age of files to keep
            max_size_mb: Maximum cache size in MB
            
        Returns:
            Dictionary with cleanup statistics
        """
        import time
        
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        
        files_removed = 0
        bytes_freed = 0
        
        # Get all cache files with their info
        cache_files = []
        for filename in os.listdir(self.cache_dir):
            filepath = os.path.join(self.cache_dir, filename)
            if os.path.isfile(filepath):
                stat = os.stat(filepath)
                cache_files.append({
                    'path': filepath,
                    'size': stat.st_size,
                    'age': current_time - stat.st_mtime
                })
        
        # Remove old files
        for file_info in cache_files:
            if file_info['age'] > max_age_seconds:
                try:
                    os.remove(file_info['path'])
                    files_removed += 1
                    bytes_freed += file_info['size']
                except OSError as e:
                    self.logger.warning(f"Could not remove {file_info['path']}: {e}")
        
        # Check if we need to remove more files due to size limit
        remaining_files = [f for f in cache_files if f['path'] not in []]
        current_size_mb = sum(f['size'] for f in remaining_files) / (1024 * 1024)
        
        if current_size_mb > max_size_mb:
            # Sort by age (oldest first) and remove until under limit
            remaining_files.sort(key=lambda x: x['age'], reverse=True)
            
            for file_info in remaining_files:
                if current_size_mb <= max_size_mb:
                    break
                
                try:
                    os.remove(file_info['path'])
                    files_removed += 1
                    bytes_freed += file_info['size']
                    current_size_mb -= file_info['size'] / (1024 * 1024)
                except OSError as e:
                    self.logger.warning(f"Could not remove {file_info['path']}: {e}")
        
        return {
            'files_removed': files_removed,
            'bytes_freed': bytes_freed,
            'current_cache_size_mb': self._get_cache_size_mb()
        }


# Predefined optimization configurations
OPTIMIZATION_CONFIGS = {
    'web_thumbnail': ImageOptimizationConfig(
        target_format=ImageFormat.WEBP,
        compression_level=CompressionLevel.MEDIUM,
        max_width=300,
        max_height=300,
        enable_webp_fallback=True
    ),
    
    'mobile_optimized': ImageOptimizationConfig(
        target_format=ImageFormat.JPEG,
        compression_level=CompressionLevel.HIGH,
        max_width=800,
        max_height=600,
        enable_progressive=True
    ),
    
    'high_quality': ImageOptimizationConfig(
        target_format=ImageFormat.JPEG,
        compression_level=CompressionLevel.LOW,
        max_width=1920,
        max_height=1080,
        enable_progressive=True
    ),
    
    'ultra_compressed': ImageOptimizationConfig(
        target_format=ImageFormat.WEBP,
        compression_level=CompressionLevel.ULTRA,
        max_width=640,
        max_height=480,
        enable_webp_fallback=True
    )
}


# Global instance
global_image_processor = IntelligentImageProcessor()
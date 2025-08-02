"""
Enhanced image optimization system inspired by fw2.js image processing
Provides dynamic sizing, compression, overlay generation, and advanced image handling
"""

import os
import io
import time
import hashlib
from typing import Optional, Tuple, Dict, Any, Union
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from dataclasses import dataclass
import logging
from config import IMAGE_CONFIG, CONTENT_FILTER, LOGGING_CONFIG
from network_resilience import download_image_optimized, get_optimized_image_url
import time

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class ImageProcessingOptions:
    """Options for image processing"""
    quality: str = 'medium'  # high, medium, low
    enable_compression: bool = True
    enable_progressive: bool = True
    max_file_size_mb: float = 10.0
    target_width: Optional[int] = None
    target_height: Optional[int] = None
    maintain_aspect_ratio: bool = True
    enable_optimization: bool = True


@dataclass
class OverlayOptions:
    """Options for title overlay generation"""
    title: str = ""
    subtitle: str = ""
    rating: float = 0.0
    year: str = ""
    position: str = "bottom_left"  # bottom_left, bottom_center, center
    font_size: int = 24
    font_color: Tuple[int, int, int] = (255, 255, 255)
    shadow_color: Tuple[int, int, int] = (0, 0, 0)
    shadow_offset: Tuple[int, int] = (2, 2)
    background_opacity: float = 0.7
    enable_gradient: bool = True


class EnhancedImageOptimizer:
    """
    Enhanced image processing system inspired by fw2.js image optimization
    Features:
    - Dynamic image sizing based on content and network conditions
    - Advanced compression with quality optimization
    - Title overlay generation on backdrops
    - Progressive JPEG support
    - Image deduplication
    - Performance monitoring
    """
    
    def __init__(self):
        self.image_cache = {}
        self.processing_stats = {
            'total_processed': 0,
            'total_compressed': 0,
            'total_overlays_generated': 0,
            'average_compression_ratio': 0.0,
            'average_processing_time': 0.0
        }
        
        # Try to load fonts for overlay generation
        self.fonts = self._load_fonts()
        
        logger.info("Initialized EnhancedImageOptimizer")
    
    def _load_fonts(self) -> Dict[str, Optional[ImageFont.FreeTypeFont]]:
        """Load available fonts for text overlay"""
        fonts = {
            'default': None,
            'bold': None,
            'light': None
        }
        
        # Common font locations
        font_paths = [
            # Linux
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
            # Windows
            'C:/Windows/Fonts/arial.ttf',
            'C:/Windows/Fonts/calibri.ttf',
            # macOS
            '/System/Library/Fonts/Helvetica.ttc',
            '/Library/Fonts/Arial.ttf'
        ]
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    fonts['default'] = ImageFont.truetype(font_path, IMAGE_CONFIG['OVERLAY_SETTINGS']['font_size'])
                    fonts['bold'] = ImageFont.truetype(font_path, IMAGE_CONFIG['OVERLAY_SETTINGS']['font_size'] + 4)
                    fonts['light'] = ImageFont.truetype(font_path, IMAGE_CONFIG['OVERLAY_SETTINGS']['font_size'] - 4)
                    logger.info(f"Loaded fonts from: {font_path}")
                    break
                except Exception as e:
                    logger.debug(f"Failed to load font {font_path}: {e}")
        
        if fonts['default'] is None:
            logger.warning("No system fonts found, using default PIL font")
        
        return fonts
    
    def optimize_image(
        self,
        image_data: bytes,
        options: ImageProcessingOptions = None
    ) -> Tuple[bytes, Dict[str, Any]]:
        """
        Optimize image with compression, resizing, and quality enhancement
        """
        if options is None:
            options = ImageProcessingOptions()
        
        start_time = time.time()
        original_size = len(image_data)
        
        try:
            # Load image
            image = Image.open(io.BytesIO(image_data))
            original_format = image.format
            original_dimensions = image.size
            
            # Convert to RGB if necessary
            if image.mode in ('RGBA', 'LA', 'P'):
                # Create white background for transparency
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            elif image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if needed
            if options.target_width or options.target_height:
                image = self._resize_image(image, options)
            
            # Enhance image quality
            if options.enable_optimization:
                image = self._enhance_image(image)
            
            # Compress and save
            optimized_data = self._compress_image(image, options)
            
            processing_time = time.time() - start_time
            compression_ratio = len(optimized_data) / original_size
            
            # Update stats
            self.processing_stats['total_processed'] += 1
            self.processing_stats['total_compressed'] += 1
            self.processing_stats['average_compression_ratio'] = (
                (self.processing_stats['average_compression_ratio'] * (self.processing_stats['total_compressed'] - 1) + compression_ratio) /
                self.processing_stats['total_compressed']
            )
            self.processing_stats['average_processing_time'] = (
                (self.processing_stats['average_processing_time'] * (self.processing_stats['total_processed'] - 1) + processing_time) /
                self.processing_stats['total_processed']
            )
            
            metadata = {
                'original_size': original_size,
                'optimized_size': len(optimized_data),
                'compression_ratio': compression_ratio,
                'processing_time': processing_time,
                'original_dimensions': original_dimensions,
                'final_dimensions': image.size,
                'original_format': original_format,
                'quality': options.quality
            }
            
            logger.debug(f"Image optimized: {original_size} -> {len(optimized_data)} bytes "
                        f"({compression_ratio:.2f} ratio, {processing_time:.2f}s)")
            
            return optimized_data, metadata
            
        except Exception as e:
            logger.error(f"Image optimization failed: {e}")
            return image_data, {'error': str(e)}
    
    def create_title_backdrop(
        self,
        backdrop_path: str,
        overlay_options: OverlayOptions,
        processing_options: ImageProcessingOptions = None
    ) -> Optional[bytes]:
        """
        Create backdrop image with title overlay inspired by fw2.js createTitlePosterWithOverlay
        """
        try:
            # Download backdrop image
            backdrop_data = download_image_optimized(backdrop_path, size='large')
            if not backdrop_data:
                logger.error(f"Failed to download backdrop: {backdrop_path}")
                return None
            
            # Load and process backdrop
            image = Image.open(io.BytesIO(backdrop_data))
            
            # Ensure minimum width for good quality overlay
            min_width = 1280
            if image.width < min_width:
                logger.warning(f"Backdrop too small ({image.width}px), using poster instead")
                return None
            
            # Convert to RGB
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Add overlay
            image_with_overlay = self._add_text_overlay(image, overlay_options)
            
            # Optimize the final image
            if processing_options is None:
                processing_options = ImageProcessingOptions(quality='high')
            
            optimized_data, _ = self.optimize_image(
                self._image_to_bytes(image_with_overlay),
                processing_options
            )
            
            self.processing_stats['total_overlays_generated'] += 1
            
            logger.info(f"Created title backdrop for: {overlay_options.title}")
            return optimized_data
            
        except Exception as e:
            logger.error(f"Failed to create title backdrop: {e}")
            return None
    
    def _resize_image(self, image: Image.Image, options: ImageProcessingOptions) -> Image.Image:
        """Resize image with smart aspect ratio handling"""
        original_width, original_height = image.size
        
        if options.target_width and options.target_height:
            if options.maintain_aspect_ratio:
                # Calculate scaling to fit within bounds
                width_ratio = options.target_width / original_width
                height_ratio = options.target_height / original_height
                scale_ratio = min(width_ratio, height_ratio)
                
                new_width = int(original_width * scale_ratio)
                new_height = int(original_height * scale_ratio)
            else:
                new_width = options.target_width
                new_height = options.target_height
        elif options.target_width:
            scale_ratio = options.target_width / original_width
            new_width = options.target_width
            new_height = int(original_height * scale_ratio)
        elif options.target_height:
            scale_ratio = options.target_height / original_height
            new_width = int(original_width * scale_ratio)
            new_height = options.target_height
        else:
            return image
        
        # Use high-quality resampling
        return image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    def _enhance_image(self, image: Image.Image) -> Image.Image:
        """Enhance image quality with filters and adjustments"""
        try:
            # Subtle sharpening
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(1.1)
            
            # Slight contrast enhancement
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.05)
            
            # Color saturation boost
            enhancer = ImageEnhance.Color(image)
            image = enhancer.enhance(1.1)
            
            return image
            
        except Exception as e:
            logger.debug(f"Image enhancement failed: {e}")
            return image
    
    def _compress_image(self, image: Image.Image, options: ImageProcessingOptions) -> bytes:
        """Compress image with optimal quality settings"""
        output = io.BytesIO()
        
        # Get quality settings
        quality_settings = IMAGE_CONFIG['QUALITY_SETTINGS'][options.quality]
        
        save_kwargs = {
            'format': 'JPEG',
            'quality': quality_settings['quality'],
            'optimize': quality_settings['optimize']
        }
        
        # Enable progressive JPEG if configured
        if options.enable_progressive and IMAGE_CONFIG['PROGRESSIVE_JPEG']:
            save_kwargs['progressive'] = True
        
        # Save with compression
        image.save(output, **save_kwargs)
        compressed_data = output.getvalue()
        
        # Check file size constraint
        max_size_bytes = options.max_file_size_mb * 1024 * 1024
        if len(compressed_data) > max_size_bytes:
            # Reduce quality iteratively
            for reduced_quality in range(quality_settings['quality'] - 10, 30, -10):
                output = io.BytesIO()
                save_kwargs['quality'] = reduced_quality
                image.save(output, **save_kwargs)
                compressed_data = output.getvalue()
                
                if len(compressed_data) <= max_size_bytes:
                    logger.debug(f"Reduced quality to {reduced_quality} to meet size constraint")
                    break
        
        return compressed_data
    
    def _add_text_overlay(self, image: Image.Image, options: OverlayOptions) -> Image.Image:
        """Add text overlay to image"""
        if not options.title:
            return image
        
        # Create a copy to work with
        overlay_image = image.copy()
        draw = ImageDraw.Draw(overlay_image)
        
        # Calculate text dimensions and position
        font = self.fonts['bold'] or ImageFont.load_default()
        
        # Prepare text elements
        texts = []
        if options.title:
            texts.append((options.title, font, options.font_color))
        
        if options.subtitle:
            subtitle_font = self.fonts['light'] or font
            texts.append((options.subtitle, subtitle_font, options.font_color))
        
        if options.rating > 0:
            rating_text = f"★ {options.rating:.1f}"
            rating_font = self.fonts['default'] or font
            texts.append((rating_text, rating_font, (255, 215, 0)))  # Gold color
        
        if options.year:
            year_font = self.fonts['light'] or font
            texts.append((f"({options.year})", year_font, options.font_color))
        
        # Calculate total text block dimensions
        total_height = 0
        max_width = 0
        
        for text, text_font, _ in texts:
            bbox = draw.textbbox((0, 0), text, font=text_font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            max_width = max(max_width, text_width)
            total_height += text_height + 5  # 5px spacing
        
        # Determine position
        margin = 30
        if options.position == "bottom_left":
            x = margin
            y = image.height - total_height - margin
        elif options.position == "bottom_center":
            x = (image.width - max_width) // 2
            y = image.height - total_height - margin
        else:  # center
            x = (image.width - max_width) // 2
            y = (image.height - total_height) // 2
        
        # Add gradient background if enabled
        if options.enable_gradient:
            self._add_gradient_background(
                overlay_image, 
                x - 20, y - 10, 
                max_width + 40, total_height + 20,
                options.background_opacity
            )
        
        # Draw text with shadows
        current_y = y
        for text, text_font, color in texts:
            # Draw shadow
            shadow_x = x + options.shadow_offset[0]
            shadow_y = current_y + options.shadow_offset[1]
            draw.text((shadow_x, shadow_y), text, font=text_font, fill=options.shadow_color)
            
            # Draw main text
            draw.text((x, current_y), text, font=text_font, fill=color)
            
            # Move to next line
            bbox = draw.textbbox((0, 0), text, font=text_font)
            current_y += (bbox[3] - bbox[1]) + 5
        
        return overlay_image
    
    def _add_gradient_background(
        self, 
        image: Image.Image, 
        x: int, y: int, 
        width: int, height: int, 
        opacity: float
    ):
        """Add gradient background behind text"""
        # Create gradient overlay
        gradient = Image.new('RGBA', (width, height))
        gradient_draw = ImageDraw.Draw(gradient)
        
        # Create vertical gradient from transparent to semi-transparent black
        for i in range(height):
            alpha = int(255 * opacity * (i / height))
            gradient_draw.line(
                [(0, i), (width, i)], 
                fill=(0, 0, 0, alpha)
            )
        
        # Paste gradient onto image
        image.paste(gradient, (x, y), gradient)
    
    def _image_to_bytes(self, image: Image.Image, format: str = 'JPEG') -> bytes:
        """Convert PIL Image to bytes"""
        output = io.BytesIO()
        if format == 'JPEG' and image.mode != 'RGB':
            image = image.convert('RGB')
        image.save(output, format=format)
        return output.getvalue()
    
    def generate_image_hash(self, image_data: bytes) -> str:
        """Generate hash for image deduplication"""
        return hashlib.md5(image_data).hexdigest()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get processing statistics"""
        return self.processing_stats.copy()


# Global instance
global_image_optimizer = EnhancedImageOptimizer()


def optimize_image(image_data: bytes, options: ImageProcessingOptions = None) -> Tuple[bytes, Dict[str, Any]]:
    """Optimize image using global optimizer"""
    return global_image_optimizer.optimize_image(image_data, options)


def create_title_backdrop(
    backdrop_path: str,
    title: str,
    subtitle: str = "",
    rating: float = 0.0,
    year: str = ""
) -> Optional[bytes]:
    """Create title backdrop using global optimizer"""
    overlay_options = OverlayOptions(
        title=title,
        subtitle=subtitle,
        rating=rating,
        year=year
    )
    return global_image_optimizer.create_title_backdrop(backdrop_path, overlay_options)


def get_image_processing_stats() -> Dict[str, Any]:
    """Get image processing statistics"""
    return global_image_optimizer.get_stats()
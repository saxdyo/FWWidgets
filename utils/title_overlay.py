from PIL import Image, ImageDraw, ImageFont
import requests
import io
import logging
from typing import Dict, Any, Optional, Tuple
import os
from urllib.parse import quote
import base64

logger = logging.getLogger(__name__)

class TitleOverlayGenerator:
    """
    Generate backdrop images with title overlays
    Based on fw2.js createTitlePosterWithOverlay patterns
    """
    
    def __init__(self):
        self.default_font_size = 48
        self.subtitle_font_size = 32
        self.rating_font_size = 24
        
        # Try to load fonts
        self.title_font = self._load_font(self.default_font_size)
        self.subtitle_font = self._load_font(self.subtitle_font_size)
        self.rating_font = self._load_font(self.rating_font_size)
        
        # Overlay configurations
        self.overlay_configs = {
            'default': {
                'position': 'bottom-left',
                'background_opacity': 0.7,
                'text_color': (255, 255, 255),
                'background_color': (0, 0, 0),
                'margin': 40,
                'line_spacing': 8
            },
            'center': {
                'position': 'center',
                'background_opacity': 0.8,
                'text_color': (255, 255, 255),
                'background_color': (0, 0, 0),
                'margin': 60,
                'line_spacing': 12
            },
            'minimal': {
                'position': 'bottom-left',
                'background_opacity': 0.5,
                'text_color': (255, 255, 255),
                'background_color': (0, 0, 0),
                'margin': 20,
                'line_spacing': 4
            }
        }
        
    def _load_font(self, size: int) -> ImageFont.FreeTypeFont:
        """Load font with fallback"""
        font_paths = [
            '/System/Library/Fonts/PingFang.ttc',  # macOS
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',  # Linux
            'C:\\Windows\\Fonts\\msyh.ttc',  # Windows
            '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'  # Linux fallback
        ]
        
        for font_path in font_paths:
            try:
                if os.path.exists(font_path):
                    return ImageFont.truetype(font_path, size)
            except Exception:
                continue
                
        # Fallback to default font
        try:
            return ImageFont.load_default()
        except:
            return None
            
    def create_title_overlay(
        self,
        backdrop_url: str,
        title: str,
        subtitle: str = "",
        rating: float = 0.0,
        year: str = "",
        genres: str = "",
        overlay_style: str = "default"
    ) -> Optional[Image.Image]:
        """
        Create backdrop image with title overlay
        """
        try:
            # Download backdrop image
            backdrop_image = self._download_image(backdrop_url)
            if not backdrop_image:
                return None
                
            # Get overlay configuration
            config = self.overlay_configs.get(overlay_style, self.overlay_configs['default'])
            
            # Create overlay
            overlay_image = self._create_overlay(
                backdrop_image,
                title,
                subtitle,
                rating,
                year,
                genres,
                config
            )
            
            return overlay_image
            
        except Exception as e:
            logger.error(f"Failed to create title overlay: {e}")
            return None
            
    def _download_image(self, image_url: str) -> Optional[Image.Image]:
        """Download image from URL"""
        try:
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            image = Image.open(io.BytesIO(response.content))
            return image.convert('RGB')  # Ensure RGB mode
            
        except Exception as e:
            logger.error(f"Failed to download image from {image_url}: {e}")
            return None
            
    def _create_overlay(
        self,
        backdrop: Image.Image,
        title: str,
        subtitle: str,
        rating: float,
        year: str,
        genres: str,
        config: Dict[str, Any]
    ) -> Image.Image:
        """Create the actual overlay on the backdrop"""
        # Create a copy of the backdrop
        result = backdrop.copy()
        draw = ImageDraw.Draw(result)
        
        # Prepare text lines
        text_lines = self._prepare_text_lines(title, subtitle, rating, year, genres)
        
        # Calculate text dimensions
        line_heights = []
        line_widths = []
        
        for i, (text, font) in enumerate(text_lines):
            if font and text:
                bbox = draw.textbbox((0, 0), text, font=font)
                width = bbox[2] - bbox[0]
                height = bbox[3] - bbox[1]
                line_widths.append(width)
                line_heights.append(height)
            else:
                line_widths.append(0)
                line_heights.append(0)
                
        # Calculate total text area
        max_width = max(line_widths) if line_widths else 0
        total_height = sum(line_heights) + (len(text_lines) - 1) * config['line_spacing']
        
        # Calculate position
        position = self._calculate_position(
            result.size,
            (max_width, total_height),
            config['position'],
            config['margin']
        )
        
        # Draw background
        self._draw_background(draw, position, max_width, total_height, config)
        
        # Draw text
        self._draw_text_lines(draw, text_lines, position, config, line_heights)
        
        return result
        
    def _prepare_text_lines(
        self,
        title: str,
        subtitle: str,
        rating: float,
        year: str,
        genres: str
    ) -> list:
        """Prepare text lines with their corresponding fonts"""
        lines = []
        
        # Main title
        if title:
            lines.append((title, self.title_font))
            
        # Subtitle
        if subtitle:
            lines.append((subtitle, self.subtitle_font))
            
        # Rating and year line
        rating_year_parts = []
        if rating > 0:
            rating_year_parts.append(f"★ {rating:.1f}")
        if year:
            rating_year_parts.append(year)
            
        if rating_year_parts:
            rating_year_text = " • ".join(rating_year_parts)
            lines.append((rating_year_text, self.rating_font))
            
        # Genres
        if genres:
            lines.append((genres, self.rating_font))
            
        return lines
        
    def _calculate_position(
        self,
        image_size: Tuple[int, int],
        text_size: Tuple[int, int],
        position_type: str,
        margin: int
    ) -> Tuple[int, int]:
        """Calculate text position based on configuration"""
        img_width, img_height = image_size
        text_width, text_height = text_size
        
        if position_type == 'bottom-left':
            x = margin
            y = img_height - text_height - margin
        elif position_type == 'bottom-right':
            x = img_width - text_width - margin
            y = img_height - text_height - margin
        elif position_type == 'top-left':
            x = margin
            y = margin
        elif position_type == 'top-right':
            x = img_width - text_width - margin
            y = margin
        elif position_type == 'center':
            x = (img_width - text_width) // 2
            y = (img_height - text_height) // 2
        else:  # default to bottom-left
            x = margin
            y = img_height - text_height - margin
            
        return (max(0, x), max(0, y))
        
    def _draw_background(
        self,
        draw: ImageDraw.Draw,
        position: Tuple[int, int],
        width: int,
        height: int,
        config: Dict[str, Any]
    ):
        """Draw semi-transparent background for text"""
        x, y = position
        margin = config['margin'] // 2
        
        # Expand background slightly beyond text
        bg_x1 = x - margin
        bg_y1 = y - margin
        bg_x2 = x + width + margin
        bg_y2 = y + height + margin
        
        # Create background color with opacity
        bg_color = config['background_color']
        opacity = int(255 * config['background_opacity'])
        
        # Create a semi-transparent overlay
        overlay = Image.new('RGBA', (bg_x2 - bg_x1, bg_y2 - bg_y1), (*bg_color, opacity))
        
        # This is a simplified approach - for full alpha compositing,
        # we'd need to work with RGBA images throughout
        draw.rectangle([bg_x1, bg_y1, bg_x2, bg_y2], fill=bg_color)
        
    def _draw_text_lines(
        self,
        draw: ImageDraw.Draw,
        text_lines: list,
        position: Tuple[int, int],
        config: Dict[str, Any],
        line_heights: list
    ):
        """Draw text lines with proper spacing"""
        x, y = position
        current_y = y
        text_color = config['text_color']
        
        for i, (text, font) in enumerate(text_lines):
            if text and font:
                draw.text((x, current_y), text, font=font, fill=text_color)
                
            if i < len(line_heights):
                current_y += line_heights[i] + config['line_spacing']
                
    def generate_overlay_url(
        self,
        backdrop_path: str,
        title: str,
        subtitle: str = "",
        rating: float = 0.0,
        year: str = "",
        genres: str = "",
        style: str = "default"
    ) -> str:
        """
        Generate a URL that would create an overlay image
        This mimics fw2.js URL-based overlay generation
        """
        # In a real implementation, this would point to a service that generates overlays
        # For now, we'll create a data URL structure that could be used later
        
        params = {
            'backdrop': backdrop_path,
            'title': title,
            'subtitle': subtitle,
            'rating': rating,
            'year': year,
            'genres': genres,
            'style': style
        }
        
        # Filter out empty parameters
        filtered_params = {k: v for k, v in params.items() if v}
        
        # Create a URL-safe parameter string
        param_string = "&".join([f"{k}={quote(str(v))}" for k, v in filtered_params.items()])
        
        # This would be the endpoint for overlay generation
        base_url = "https://overlay-service.example.com/generate"
        return f"{base_url}?{param_string}"
        
    def save_overlay_image(self, image: Image.Image, output_path: str) -> bool:
        """Save overlay image to file"""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save with high quality
            image.save(output_path, 'JPEG', quality=95, optimize=True)
            logger.info(f"Saved overlay image: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save overlay image: {e}")
            return False


class OverlayManager:
    """
    Manage overlay generation and caching
    Based on fw2.js overlay management patterns
    """
    
    def __init__(self, cache_dir: str = "overlays"):
        self.cache_dir = cache_dir
        self.generator = TitleOverlayGenerator()
        
        # Create cache directory
        os.makedirs(cache_dir, exist_ok=True)
        
    def get_overlay_image_path(
        self,
        movie_data: Dict[str, Any],
        style: str = "default",
        size: str = "w1280"
    ) -> Optional[str]:
        """
        Get or create overlay image for movie data
        """
        # Generate cache filename
        movie_id = movie_data.get('id', 'unknown')
        cache_filename = f"{movie_id}_{style}_{size}.jpg"
        cache_path = os.path.join(self.cache_dir, cache_filename)
        
        # Return existing file if it exists
        if os.path.exists(cache_path):
            return cache_path
            
        # Generate new overlay
        return self._create_overlay_for_movie(movie_data, cache_path, style, size)
        
    def _create_overlay_for_movie(
        self,
        movie_data: Dict[str, Any],
        output_path: str,
        style: str,
        size: str
    ) -> Optional[str]:
        """Create overlay image for movie data"""
        try:
            # Extract movie information
            title = movie_data.get('display_title') or movie_data.get('title') or movie_data.get('name', '')
            overview = movie_data.get('display_overview') or movie_data.get('overview', '')
            rating = movie_data.get('vote_average', 0.0)
            
            # Get year from release date
            year = ""
            release_date = movie_data.get('release_date') or movie_data.get('first_air_date')
            if release_date:
                try:
                    year = release_date.split('-')[0]
                except:
                    pass
                    
            # Get backdrop URL
            backdrop_path = movie_data.get('backdrop_path')
            if not backdrop_path:
                return None
                
            # Construct full backdrop URL
            backdrop_url = f"https://image.tmdb.org/t/p/{size}{backdrop_path}"
            
            # Generate overlay
            overlay_image = self.generator.create_title_overlay(
                backdrop_url=backdrop_url,
                title=title,
                subtitle=overview[:100] + "..." if len(overview) > 100 else overview,
                rating=rating,
                year=year,
                genres="",  # Could add genre processing here
                overlay_style=style
            )
            
            if overlay_image:
                if self.generator.save_overlay_image(overlay_image, output_path):
                    return output_path
                    
        except Exception as e:
            logger.error(f"Failed to create overlay for movie {movie_data.get('id')}: {e}")
            
        return None
        
    def batch_generate_overlays(
        self,
        movies_data: list,
        style: str = "default",
        max_workers: int = 4
    ) -> Dict[str, str]:
        """
        Generate overlays for multiple movies in parallel
        """
        from concurrent.futures import ThreadPoolExecutor, as_completed
        
        results = {}
        
        def generate_single_overlay(movie_data):
            movie_id = movie_data.get('id', 'unknown')
            overlay_path = self.get_overlay_image_path(movie_data, style)
            return movie_id, overlay_path
            
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_movie = {
                executor.submit(generate_single_overlay, movie): movie
                for movie in movies_data
            }
            
            # Collect results
            for future in as_completed(future_to_movie):
                try:
                    movie_id, overlay_path = future.result()
                    if overlay_path:
                        results[str(movie_id)] = overlay_path
                except Exception as e:
                    movie = future_to_movie[future]
                    logger.error(f"Failed to generate overlay for movie {movie.get('id')}: {e}")
                    
        return results
        
    def cleanup_old_overlays(self, max_age_days: int = 30):
        """Clean up old overlay files"""
        import time
        
        current_time = time.time()
        max_age_seconds = max_age_days * 24 * 60 * 60
        
        removed_count = 0
        
        try:
            for filename in os.listdir(self.cache_dir):
                file_path = os.path.join(self.cache_dir, filename)
                
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getmtime(file_path)
                    
                    if file_age > max_age_seconds:
                        os.remove(file_path)
                        removed_count += 1
                        
            logger.info(f"Cleaned up {removed_count} old overlay files")
            
        except Exception as e:
            logger.error(f"Failed to cleanup overlay files: {e}")


# Global overlay manager instance
overlay_manager = OverlayManager()
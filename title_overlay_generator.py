"""
Title overlay generator for creating backdrop images with overlaid text.
Inspired by the title overlay features from fw2.js.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import requests
from io import BytesIO
import os
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum
import logging
import math


class OverlayPosition(Enum):
    """Overlay text positions"""
    TOP_LEFT = "top_left"
    TOP_RIGHT = "top_right"
    TOP_CENTER = "top_center"
    BOTTOM_LEFT = "bottom_left"
    BOTTOM_RIGHT = "bottom_right"
    BOTTOM_CENTER = "bottom_center"
    CENTER = "center"


class TextStyle(Enum):
    """Text styling options"""
    NORMAL = "normal"
    BOLD = "bold"
    ITALIC = "italic"
    OUTLINE = "outline"
    SHADOW = "shadow"
    GLOW = "glow"


@dataclass
class OverlayConfig:
    """Configuration for overlay generation"""
    position: OverlayPosition = OverlayPosition.BOTTOM_LEFT
    font_size: int = 48
    font_color: Tuple[int, int, int, int] = (255, 255, 255, 255)  # RGBA
    background_color: Optional[Tuple[int, int, int, int]] = (0, 0, 0, 128)  # Semi-transparent black
    text_style: TextStyle = TextStyle.NORMAL
    padding: int = 20
    max_width: Optional[int] = None
    line_height: float = 1.2
    shadow_offset: Tuple[int, int] = (2, 2)
    shadow_color: Tuple[int, int, int, int] = (0, 0, 0, 180)
    outline_width: int = 2
    outline_color: Tuple[int, int, int, int] = (0, 0, 0, 255)


@dataclass
class OverlayText:
    """Text content for overlay"""
    title: str
    subtitle: Optional[str] = None
    rating: Optional[float] = None
    year: Optional[int] = None
    genre: Optional[str] = None
    duration: Optional[str] = None
    extra_info: Optional[str] = None


class TitleOverlayGenerator:
    """
    Generate backdrop images with title overlays.
    Similar to the title overlay features in fw2.js.
    """
    
    def __init__(self, font_paths: Optional[Dict[str, str]] = None):
        """
        Initialize the overlay generator.
        
        Args:
            font_paths: Dictionary mapping font names to file paths
        """
        self.font_paths = font_paths or self._get_default_fonts()
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def _get_default_fonts(self) -> Dict[str, str]:
        """Get default system fonts."""
        default_fonts = {
            'regular': None,
            'bold': None,
            'italic': None
        }
        
        # Try to find system fonts
        possible_paths = [
            '/System/Library/Fonts/',  # macOS
            '/usr/share/fonts/',       # Linux
            'C:/Windows/Fonts/',       # Windows
        ]
        
        font_names = {
            'regular': ['Arial.ttf', 'DejaVuSans.ttf', 'Helvetica.ttf'],
            'bold': ['Arial Bold.ttf', 'DejaVuSans-Bold.ttf', 'Helvetica-Bold.ttf'],
            'italic': ['Arial Italic.ttf', 'DejaVuSans-Oblique.ttf', 'Helvetica-Oblique.ttf']
        }
        
        for font_type, names in font_names.items():
            for path in possible_paths:
                for name in names:
                    font_path = os.path.join(path, name)
                    if os.path.exists(font_path):
                        default_fonts[font_type] = font_path
                        break
                if default_fonts[font_type]:
                    break
        
        return default_fonts
    
    def _load_font(self, size: int, style: TextStyle = TextStyle.NORMAL) -> ImageFont.ImageFont:
        """Load font with specified size and style."""
        font_map = {
            TextStyle.NORMAL: 'regular',
            TextStyle.BOLD: 'bold',
            TextStyle.ITALIC: 'italic',
            TextStyle.OUTLINE: 'bold',
            TextStyle.SHADOW: 'regular',
            TextStyle.GLOW: 'bold'
        }
        
        font_key = font_map.get(style, 'regular')
        font_path = self.font_paths.get(font_key)
        
        try:
            if font_path and os.path.exists(font_path):
                return ImageFont.truetype(font_path, size)
            else:
                return ImageFont.load_default()
        except Exception as e:
            self.logger.warning(f"Failed to load font {font_path}: {e}")
            return ImageFont.load_default()
    
    def _download_image(self, url: str) -> Optional[Image.Image]:
        """Download image from URL."""
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return Image.open(BytesIO(response.content))
        except Exception as e:
            self.logger.error(f"Failed to download image from {url}: {e}")
            return None
    
    def _format_overlay_text(self, text: OverlayText) -> List[str]:
        """Format overlay text into multiple lines."""
        lines = []
        
        # Main title
        if text.title:
            lines.append(text.title)
        
        # Subtitle or additional info line
        subtitle_parts = []
        if text.year:
            subtitle_parts.append(str(text.year))
        if text.rating:
            subtitle_parts.append(f"★ {text.rating:.1f}")
        if text.genre:
            subtitle_parts.append(text.genre)
        if text.duration:
            subtitle_parts.append(text.duration)
        
        if subtitle_parts:
            lines.append(" • ".join(subtitle_parts))
        
        # Custom subtitle
        if text.subtitle:
            lines.append(text.subtitle)
        
        # Extra info
        if text.extra_info:
            lines.append(text.extra_info)
        
        return lines
    
    def _calculate_text_size(self, text: str, font: ImageFont.ImageFont) -> Tuple[int, int]:
        """Calculate text size."""
        # Create a temporary image to measure text
        temp_img = Image.new('RGBA', (1, 1))
        temp_draw = ImageDraw.Draw(temp_img)
        bbox = temp_draw.textbbox((0, 0), text, font=font)
        return bbox[2] - bbox[0], bbox[3] - bbox[1]
    
    def _wrap_text(self, text: str, font: ImageFont.ImageFont, max_width: int) -> List[str]:
        """Wrap text to fit within max width."""
        if not max_width:
            return [text]
        
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            text_width, _ = self._calculate_text_size(test_line, font)
            
            if text_width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    # Single word too long, add anyway
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines
    
    def _calculate_overlay_position(self, 
                                  image_size: Tuple[int, int],
                                  text_size: Tuple[int, int],
                                  position: OverlayPosition,
                                  padding: int) -> Tuple[int, int]:
        """Calculate overlay position."""
        img_width, img_height = image_size
        text_width, text_height = text_size
        
        position_map = {
            OverlayPosition.TOP_LEFT: (padding, padding),
            OverlayPosition.TOP_RIGHT: (img_width - text_width - padding, padding),
            OverlayPosition.TOP_CENTER: ((img_width - text_width) // 2, padding),
            OverlayPosition.BOTTOM_LEFT: (padding, img_height - text_height - padding),
            OverlayPosition.BOTTOM_RIGHT: (img_width - text_width - padding, img_height - text_height - padding),
            OverlayPosition.BOTTOM_CENTER: ((img_width - text_width) // 2, img_height - text_height - padding),
            OverlayPosition.CENTER: ((img_width - text_width) // 2, (img_height - text_height) // 2)
        }
        
        return position_map.get(position, (padding, img_height - text_height - padding))
    
    def _draw_text_with_style(self, 
                            draw: ImageDraw.Draw,
                            position: Tuple[int, int],
                            text: str,
                            font: ImageFont.ImageFont,
                            config: OverlayConfig):
        """Draw text with specified style effects."""
        x, y = position
        
        if config.text_style == TextStyle.SHADOW:
            # Draw shadow
            shadow_x = x + config.shadow_offset[0]
            shadow_y = y + config.shadow_offset[1]
            draw.text((shadow_x, shadow_y), text, font=font, fill=config.shadow_color)
            # Draw main text
            draw.text((x, y), text, font=font, fill=config.font_color)
            
        elif config.text_style == TextStyle.OUTLINE:
            # Draw outline by drawing text multiple times with slight offsets
            for dx in range(-config.outline_width, config.outline_width + 1):
                for dy in range(-config.outline_width, config.outline_width + 1):
                    if dx != 0 or dy != 0:
                        draw.text((x + dx, y + dy), text, font=font, fill=config.outline_color)
            # Draw main text
            draw.text((x, y), text, font=font, fill=config.font_color)
            
        elif config.text_style == TextStyle.GLOW:
            # Create glow effect with multiple layers
            glow_color = (*config.font_color[:3], config.font_color[3] // 4)
            for radius in range(1, 6):
                for angle in range(0, 360, 45):
                    glow_x = x + int(radius * math.cos(math.radians(angle)))
                    glow_y = y + int(radius * math.sin(math.radians(angle)))
                    draw.text((glow_x, glow_y), text, font=font, fill=glow_color)
            # Draw main text
            draw.text((x, y), text, font=font, fill=config.font_color)
            
        else:
            # Normal text
            draw.text((x, y), text, font=font, fill=config.font_color)
    
    def _add_background_overlay(self, 
                              image: Image.Image,
                              text_bbox: Tuple[int, int, int, int],
                              config: OverlayConfig) -> Image.Image:
        """Add background overlay behind text."""
        if not config.background_color:
            return image
        
        # Create overlay with background
        overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        # Expand bbox with padding
        x1, y1, x2, y2 = text_bbox
        x1 -= config.padding // 2
        y1 -= config.padding // 2
        x2 += config.padding // 2
        y2 += config.padding // 2
        
        # Draw background rectangle
        overlay_draw.rectangle([x1, y1, x2, y2], fill=config.background_color)
        
        # Composite overlay onto image
        return Image.alpha_composite(image.convert('RGBA'), overlay)
    
    def generate_overlay(self, 
                        backdrop_url: str,
                        text: OverlayText,
                        config: OverlayConfig = None,
                        output_path: Optional[str] = None) -> Optional[Image.Image]:
        """
        Generate backdrop image with title overlay.
        
        Args:
            backdrop_url: URL of the backdrop image
            text: Text content for overlay
            config: Overlay configuration
            output_path: Optional output file path
            
        Returns:
            PIL Image with overlay or None if failed
        """
        if config is None:
            config = OverlayConfig()
        
        # Download backdrop image
        backdrop = self._download_image(backdrop_url)
        if not backdrop:
            return None
        
        # Convert to RGBA for overlay support
        if backdrop.mode != 'RGBA':
            backdrop = backdrop.convert('RGBA')
        
        # Format text lines
        text_lines = self._format_overlay_text(text)
        if not text_lines:
            return backdrop
        
        # Load fonts
        title_font = self._load_font(config.font_size, config.text_style)
        subtitle_font = self._load_font(int(config.font_size * 0.7), TextStyle.NORMAL)
        
        # Calculate text layout
        all_lines = []
        max_width = config.max_width or backdrop.width - (config.padding * 2)
        
        # Process title (first line)
        if text_lines:
            title_lines = self._wrap_text(text_lines[0], title_font, max_width)
            for line in title_lines:
                all_lines.append((line, title_font, True))  # (text, font, is_title)
        
        # Process other lines
        for line in text_lines[1:]:
            wrapped_lines = self._wrap_text(line, subtitle_font, max_width)
            for wrapped_line in wrapped_lines:
                all_lines.append((wrapped_line, subtitle_font, False))
        
        # Calculate total text area
        total_height = 0
        max_line_width = 0
        
        for line_text, font, is_title in all_lines:
            line_width, line_height = self._calculate_text_size(line_text, font)
            max_line_width = max(max_line_width, line_width)
            total_height += int(line_height * config.line_height)
        
        # Calculate overlay position
        text_area_size = (max_line_width, total_height)
        overlay_x, overlay_y = self._calculate_overlay_position(
            backdrop.size, text_area_size, config.position, config.padding
        )
        
        # Add background overlay if specified
        text_bbox = (
            overlay_x, overlay_y,
            overlay_x + max_line_width, overlay_y + total_height
        )
        
        if config.background_color:
            backdrop = self._add_background_overlay(backdrop, text_bbox, config)
        
        # Draw text
        draw = ImageDraw.Draw(backdrop)
        current_y = overlay_y
        
        for line_text, font, is_title in all_lines:
            line_width, line_height = self._calculate_text_size(line_text, font)
            
            # Center align text within the text area
            line_x = overlay_x + (max_line_width - line_width) // 2
            
            # Use different color for subtitles
            if is_title:
                line_config = config
            else:
                subtitle_config = OverlayConfig(
                    font_color=(*config.font_color[:3], int(config.font_color[3] * 0.8)),
                    text_style=TextStyle.NORMAL,
                    shadow_offset=config.shadow_offset,
                    shadow_color=config.shadow_color,
                    outline_width=config.outline_width,
                    outline_color=config.outline_color
                )
                line_config = subtitle_config
            
            self._draw_text_with_style(draw, (line_x, current_y), line_text, font, line_config)
            current_y += int(line_height * config.line_height)
        
        # Save if output path specified
        if output_path:
            try:
                backdrop.save(output_path, format='PNG', optimize=True)
                self.logger.info(f"Saved overlay image to {output_path}")
            except Exception as e:
                self.logger.error(f"Failed to save image to {output_path}: {e}")
        
        return backdrop
    
    def generate_multiple_overlays(self, 
                                  items: List[Dict[str, Any]],
                                  output_dir: str,
                                  config: OverlayConfig = None) -> List[str]:
        """
        Generate overlay images for multiple items.
        
        Args:
            items: List of TMDB items
            output_dir: Output directory
            config: Overlay configuration
            
        Returns:
            List of generated file paths
        """
        if config is None:
            config = OverlayConfig()
        
        os.makedirs(output_dir, exist_ok=True)
        generated_files = []
        
        for item in items:
            # Extract backdrop URL
            backdrop_path = item.get('backdrop_path')
            if not backdrop_path:
                continue
            
            backdrop_url = f"https://image.tmdb.org/t/p/w1280{backdrop_path}"
            
            # Create overlay text
            title = item.get('title', item.get('name', 'Unknown'))
            year = None
            if item.get('release_date'):
                year = int(item['release_date'][:4])
            elif item.get('first_air_date'):
                year = int(item['first_air_date'][:4])
            
            rating = item.get('vote_average')
            
            # Get genre names (simplified)
            genre_ids = item.get('genre_ids', [])
            genre_map = {
                28: "Action", 35: "Comedy", 18: "Drama", 16: "Animation",
                80: "Crime", 99: "Documentary", 27: "Horror", 10749: "Romance",
                878: "Sci-Fi", 53: "Thriller"
            }
            genre = genre_map.get(genre_ids[0] if genre_ids else None)
            
            overlay_text = OverlayText(
                title=title,
                year=year,
                rating=rating,
                genre=genre
            )
            
            # Generate filename
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            filename = f"{safe_title}_{item.get('id', 'unknown')}_overlay.png"
            output_path = os.path.join(output_dir, filename)
            
            # Generate overlay
            result = self.generate_overlay(backdrop_url, overlay_text, config, output_path)
            if result:
                generated_files.append(output_path)
                self.logger.info(f"Generated overlay for {title}")
            else:
                self.logger.warning(f"Failed to generate overlay for {title}")
        
        return generated_files


# Predefined overlay configurations
OVERLAY_CONFIGS = {
    'default': OverlayConfig(),
    
    'minimal': OverlayConfig(
        position=OverlayPosition.BOTTOM_LEFT,
        font_size=40,
        background_color=None,
        text_style=TextStyle.OUTLINE,
        padding=30
    ),
    
    'cinematic': OverlayConfig(
        position=OverlayPosition.BOTTOM_CENTER,
        font_size=56,
        font_color=(255, 255, 255, 255),
        background_color=(0, 0, 0, 160),
        text_style=TextStyle.SHADOW,
        padding=40,
        line_height=1.3
    ),
    
    'bold': OverlayConfig(
        position=OverlayPosition.BOTTOM_LEFT,
        font_size=52,
        font_color=(255, 255, 255, 255),
        text_style=TextStyle.GLOW,
        padding=35,
        background_color=(0, 0, 0, 120)
    ),
    
    'elegant': OverlayConfig(
        position=OverlayPosition.BOTTOM_RIGHT,
        font_size=44,
        font_color=(240, 240, 240, 255),
        background_color=(20, 20, 20, 180),
        text_style=TextStyle.NORMAL,
        padding=25,
        line_height=1.4
    )
}


# Global instance
title_overlay_generator = TitleOverlayGenerator()
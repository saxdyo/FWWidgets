import os
import requests
import hashlib
from pathlib import Path
from typing import List, Dict, Optional
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from tqdm import tqdm
import json
from config import IMAGES_DIR, REQUEST_TIMEOUT, IMAGES_BASE_DIR, WIDGET_DATA_FORMAT
import time
import logging


class ImageDownloader:
    """图片下载器"""
    
    def __init__(self, output_dir: str = IMAGES_DIR):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # 创建子目录
        self.backdrops_dir = self.output_dir / 'backdrops'
        self.posters_dir = self.output_dir / 'posters'
        self.thumbs_dir = self.output_dir / 'thumbnails'
        
        for dir_path in [self.backdrops_dir, self.posters_dir, self.thumbs_dir]:
            dir_path.mkdir(exist_ok=True)
        
        # 标题海报相关目录
        self.title_posters_dir = Path(IMAGES_BASE_DIR) / "title_posters"
        self.title_posters_dir.mkdir(exist_ok=True)
        
        # 字体缓存
        self._font_cache = {}
    
    def _get_file_hash(self, url: str) -> str:
        """根据URL生成文件哈希"""
        return hashlib.md5(url.encode()).hexdigest()
    
    def _sanitize_filename(self, filename: str) -> str:
        """清理文件名，移除非法字符"""
        invalid_chars = '<>:"/\\|?*'
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        return filename[:100]  # 限制文件名长度
    
    def _download_image(self, url: str, file_path: Path) -> bool:
        """下载单个图片"""
        try:
            response = requests.get(url, timeout=REQUEST_TIMEOUT, stream=True)
            response.raise_for_status()
            
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"下载失败 {url}: {e}")
            return False
        except Exception as e:
            print(f"保存失败 {file_path}: {e}")
            return False
    
    def _create_thumbnail(self, image_path: Path, thumb_path: Path, size: tuple = (300, 169)) -> bool:
        """创建缩略图"""
        try:
            with Image.open(image_path) as img:
                # 保持宽高比的缩略图
                img.thumbnail(size, Image.Resampling.LANCZOS)
                
                # 创建新图片并粘贴缩略图
                thumb = Image.new('RGB', size, (0, 0, 0))
                x = (size[0] - img.width) // 2
                y = (size[1] - img.height) // 2
                thumb.paste(img, (x, y))
                
                thumb.save(thumb_path, 'JPEG', quality=85)
            
            return True
            
        except Exception as e:
            print(f"创建缩略图失败 {image_path}: {e}")
            return False
    
    def _get_font(self, size=48):
        """获取字体，支持中文"""
        if size in self._font_cache:
            return self._font_cache[size]
            
        # 尝试不同的字体路径
        font_paths = [
            "/System/Library/Fonts/PingFang.ttc",  # macOS
            "/System/Library/Fonts/Arial.ttf",      # macOS
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",  # Linux
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",  # Linux
            "C:/Windows/Fonts/simhei.ttf",          # Windows 中文
            "C:/Windows/Fonts/arial.ttf",           # Windows
        ]
        
        font = None
        for font_path in font_paths:
            try:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, size)
                    break
            except Exception:
                continue
                
        if font is None:
            try:
                font = ImageFont.load_default()
            except Exception:
                font = None
                
        self._font_cache[size] = font
        return font
    
    def create_title_poster(self, movie_data, backdrop_path=None):
        """创建有片名的背景图"""
        try:
            if not WIDGET_DATA_FORMAT.get("include_title_posters", False):
                return None
                
            config = WIDGET_DATA_FORMAT["title_poster_config"]
            
            # 获取背景图
            if backdrop_path and os.path.exists(backdrop_path):
                backdrop_img = Image.open(backdrop_path)
            else:
                logging.warning(f"背景图不存在: {backdrop_path}")
                return None
                
            # 检查图片尺寸
            if backdrop_img.width < config.get("min_backdrop_width", 1280):
                logging.warning(f"背景图宽度不足: {backdrop_img.width}")
                return None
                
            # 转换为RGB模式
            if backdrop_img.mode != 'RGB':
                backdrop_img = backdrop_img.convert('RGB')
                
            # 创建绘图对象
            draw = ImageDraw.Draw(backdrop_img)
            
            # 准备文本信息
            title = movie_data.get("title") or movie_data.get("name", "")
            rating = movie_data.get("vote_average", 0)
            year = ""
            if movie_data.get("release_date"):
                year = movie_data["release_date"][:4]
            elif movie_data.get("first_air_date"):
                year = movie_data["first_air_date"][:4]
                
            # 构建显示文本
            display_texts = []
            
            # 主标题
            if title:
                display_texts.append({
                    "text": title,
                    "font_size": config.get("font_size", 48),
                    "is_main": True
                })
            
            # 评分和年份
            subtitle_parts = []
            if config.get("include_rating", True) and rating > 0:
                subtitle_parts.append(f"⭐ {rating:.1f}")
            if config.get("include_year", True) and year:
                subtitle_parts.append(year)
                
            if subtitle_parts:
                display_texts.append({
                    "text": " · ".join(subtitle_parts),
                    "font_size": int(config.get("font_size", 48) * 0.6),
                    "is_main": False
                })
            
            # 添加半透明遮罩（可选）
            if config.get("overlay_opacity", 0) > 0:
                overlay = Image.new('RGBA', backdrop_img.size, (0, 0, 0, 0))
                overlay_draw = ImageDraw.Draw(overlay)
                
                # 根据位置决定遮罩区域
                position = config.get("title_position", "bottom_left")
                opacity = int(255 * config.get("overlay_opacity", 0.7))
                
                if position in ["bottom_left", "bottom_center"]:
                    # 底部渐变遮罩
                    gradient_height = backdrop_img.height // 3
                    for y in range(gradient_height):
                        alpha = int(opacity * (gradient_height - y) / gradient_height)
                        overlay_draw.rectangle(
                            [(0, backdrop_img.height - gradient_height + y), 
                             (backdrop_img.width, backdrop_img.height - gradient_height + y + 1)],
                            fill=(0, 0, 0, alpha)
                        )
                        
                backdrop_img = Image.alpha_composite(backdrop_img.convert('RGBA'), overlay).convert('RGB')
                draw = ImageDraw.Draw(backdrop_img)
            
            # 绘制文本
            self._draw_texts(draw, display_texts, backdrop_img.size, config)
            
            # 生成保存路径
            movie_id = movie_data.get("id", "unknown")
            filename = f"title_poster_{movie_id}.jpg"
            save_path = self.title_posters_dir / filename
            
            # 保存图片
            backdrop_img.save(save_path, "JPEG", quality=85, optimize=True)
            
            logging.info(f"标题海报已生成: {save_path}")
            return str(save_path)
            
        except Exception as e:
            logging.error(f"生成标题海报失败: {e}")
            return None
    
    def _draw_texts(self, draw, display_texts, image_size, config):
        """绘制文本到图片上"""
        width, height = image_size
        position = config.get("title_position", "bottom_left")
        font_color = config.get("font_color", "white")
        shadow_color = config.get("shadow_color", "black")
        shadow_offset = config.get("shadow_offset", (2, 2))
        
        # 计算总文本高度
        total_height = 0
        text_info = []
        
        for text_data in display_texts:
            font = self._get_font(text_data["font_size"])
            if font:
                bbox = draw.textbbox((0, 0), text_data["text"], font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            else:
                text_width = len(text_data["text"]) * text_data["font_size"] * 0.6
                text_height = text_data["font_size"]
            
            text_info.append({
                "text": text_data["text"],
                "font": font,
                "width": text_width,
                "height": text_height,
                "is_main": text_data.get("is_main", False)
            })
            total_height += text_height
        
        # 计算起始位置
        margin = 40
        line_spacing = 10
        
        if position == "bottom_left":
            start_x = margin
            start_y = height - total_height - (len(text_info) - 1) * line_spacing - margin
        elif position == "bottom_center":
            start_x = width // 2
            start_y = height - total_height - (len(text_info) - 1) * line_spacing - margin
        else:  # center
            start_x = width // 2
            start_y = (height - total_height - (len(text_info) - 1) * line_spacing) // 2
        
        # 绘制每行文本
        current_y = start_y
        for info in text_info:
            text = info["text"]
            font = info["font"]
            
            # 计算X位置
            if position == "bottom_center" or position == "center":
                text_x = start_x - info["width"] // 2
            else:
                text_x = start_x
            
            # 绘制阴影
            if shadow_offset != (0, 0):
                shadow_x = text_x + shadow_offset[0]
                shadow_y = current_y + shadow_offset[1]
                draw.text((shadow_x, shadow_y), text, font=font, fill=shadow_color)
            
            # 绘制主文本
            draw.text((text_x, current_y), text, font=font, fill=font_color)
            
            current_y += info["height"] + line_spacing
    
    def download_movie_backdrop(self, movie: Dict) -> Optional[Dict]:
        """下载电影背景图"""
        if not movie.get('backdrop_url'):
            return None
        
        # 生成文件名
        movie_title = self._sanitize_filename(movie['title'])
        file_hash = self._get_file_hash(movie['backdrop_url'])
        
        backdrop_filename = f"{movie['id']}_{movie_title}_{file_hash}.jpg"
        backdrop_path = self.backdrops_dir / backdrop_filename
        
        # 如果文件已存在，跳过下载
        if backdrop_path.exists():
            return {
                'movie_id': movie['id'],
                'title': movie['title'],
                'backdrop_path': str(backdrop_path.relative_to(self.output_dir)),
                'backdrop_url': movie['backdrop_url'],
                'status': 'existed'
            }
        
        # 下载背景图
        if self._download_image(movie['backdrop_url'], backdrop_path):
            # 创建缩略图
            thumb_filename = f"thumb_{backdrop_filename}"
            thumb_path = self.thumbs_dir / thumb_filename
            self._create_thumbnail(backdrop_path, thumb_path)
            
            return {
                'movie_id': movie['id'],
                'title': movie['title'],
                'backdrop_path': str(backdrop_path.relative_to(self.output_dir)),
                'thumbnail_path': str(thumb_path.relative_to(self.output_dir)) if thumb_path.exists() else None,
                'backdrop_url': movie['backdrop_url'],
                'file_size': backdrop_path.stat().st_size,
                'status': 'downloaded'
            }
        
        return None
    
    def download_movie_poster(self, movie: Dict) -> Optional[Dict]:
        """下载电影海报"""
        if not movie.get('poster_url'):
            return None
        
        # 生成文件名
        movie_title = self._sanitize_filename(movie['title'])
        file_hash = self._get_file_hash(movie['poster_url'])
        
        poster_filename = f"{movie['id']}_{movie_title}_{file_hash}.jpg"
        poster_path = self.posters_dir / poster_filename
        
        # 如果文件已存在，跳过下载
        if poster_path.exists():
            return {
                'movie_id': movie['id'],
                'title': movie['title'],
                'poster_path': str(poster_path.relative_to(self.output_dir)),
                'poster_url': movie['poster_url'],
                'status': 'existed'
            }
        
        # 下载海报
        if self._download_image(movie['poster_url'], poster_path):
            return {
                'movie_id': movie['id'],
                'title': movie['title'],
                'poster_path': str(poster_path.relative_to(self.output_dir)),
                'poster_url': movie['poster_url'],
                'file_size': poster_path.stat().st_size,
                'status': 'downloaded'
            }
        
        return None
    
    def download_movie_images(self, movies: List[Dict], download_backdrops: bool = True, 
                            download_posters: bool = False) -> List[Dict]:
        """批量下载电影图片"""
        results = []
        
        print(f"开始下载 {len(movies)} 部电影的图片...")
        
        for movie in tqdm(movies, desc="下载进度"):
            movie_result = {
                'movie_id': movie['id'],
                'title': movie['title'],
                'backdrop': None,
                'poster': None
            }
            
            # 下载背景图
            if download_backdrops and movie.get('backdrop_url'):
                backdrop_result = self.download_movie_backdrop(movie)
                if backdrop_result:
                    movie_result['backdrop'] = backdrop_result
            
            # 下载海报
            if download_posters and movie.get('poster_url'):
                poster_result = self.download_movie_poster(movie)
                if poster_result:
                    movie_result['poster'] = poster_result
            
            results.append(movie_result)
        
        return results
    
    def get_download_stats(self, results: List[Dict]) -> Dict:
        """获取下载统计信息"""
        stats = {
            'total_movies': len(results),
            'backdrops_downloaded': 0,
            'backdrops_existed': 0,
            'posters_downloaded': 0,
            'posters_existed': 0,
            'total_size': 0
        }
        
        for result in results:
            if result.get('backdrop'):
                if result['backdrop']['status'] == 'downloaded':
                    stats['backdrops_downloaded'] += 1
                    stats['total_size'] += result['backdrop'].get('file_size', 0)
                elif result['backdrop']['status'] == 'existed':
                    stats['backdrops_existed'] += 1
            
            if result.get('poster'):
                if result['poster']['status'] == 'downloaded':
                    stats['posters_downloaded'] += 1
                    stats['total_size'] += result['poster'].get('file_size', 0)
                elif result['poster']['status'] == 'existed':
                    stats['posters_existed'] += 1
        
        return stats
    
    def cleanup_old_images(self, keep_days: int = 30):
        """清理旧图片文件"""
        import time
        current_time = time.time()
        cutoff_time = current_time - (keep_days * 24 * 60 * 60)
        
        removed_count = 0
        for dir_path in [self.backdrops_dir, self.posters_dir, self.thumbs_dir]:
            for file_path in dir_path.iterdir():
                if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
                    try:
                        file_path.unlink()
                        removed_count += 1
                    except Exception as e:
                        print(f"删除文件失败 {file_path}: {e}")
        
        print(f"清理了 {removed_count} 个旧文件")
        return removed_count
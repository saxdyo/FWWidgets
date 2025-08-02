import os
import requests
import hashlib
from pathlib import Path
from typing import List, Dict, Optional
from PIL import Image
from tqdm import tqdm
import json
from config import IMAGES_DIR, REQUEST_TIMEOUT


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
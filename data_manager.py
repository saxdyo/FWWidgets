import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
from config import DATA_DIR


class DataManager:
    """数据管理器，负责保存和管理电影数据"""
    
    def __init__(self, data_dir: str = DATA_DIR):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        # 数据文件路径
        self.movies_file = self.data_dir / 'movies.json'
        self.download_log_file = self.data_dir / 'download_log.json'
        self.metadata_file = self.data_dir / 'metadata.json'
    
    def save_movies_data(self, movies: List[Dict], category: str = 'popular') -> bool:
        """保存电影数据"""
        try:
            # 读取现有数据
            existing_data = self.load_movies_data()
            
            # 更新数据
            if category not in existing_data:
                existing_data[category] = []
            
            # 根据ID去重，保留最新数据
            existing_ids = {movie['id'] for movie in existing_data[category]}
            new_movies = [movie for movie in movies if movie['id'] not in existing_ids]
            existing_data[category].extend(new_movies)
            
            # 按流行度排序
            existing_data[category].sort(key=lambda x: x.get('popularity', 0), reverse=True)
            
            # 添加更新时间戳
            existing_data['last_updated'] = datetime.now().isoformat()
            existing_data['categories'] = list(existing_data.keys() - {'last_updated', 'total_movies'})
            existing_data['total_movies'] = sum(
                len(movies) for key, movies in existing_data.items() 
                if key not in ['last_updated', 'categories', 'total_movies']
            )
            
            # 保存数据
            with open(self.movies_file, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            print(f"保存了 {len(new_movies)} 部新电影到 {category} 分类")
            return True
            
        except Exception as e:
            print(f"保存电影数据失败: {e}")
            return False
    
    def load_movies_data(self) -> Dict:
        """加载电影数据"""
        try:
            if self.movies_file.exists():
                with open(self.movies_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"加载电影数据失败: {e}")
            return {}
    
    def save_download_log(self, download_results: List[Dict], stats: Dict) -> bool:
        """保存下载日志"""
        try:
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'stats': stats,
                'results': download_results
            }
            
            # 读取现有日志
            logs = self.load_download_logs()
            logs.append(log_entry)
            
            # 只保留最近30天的日志
            cutoff_date = datetime.now() - timedelta(days=30)
            logs = [
                log for log in logs 
                if datetime.fromisoformat(log['timestamp']) > cutoff_date
            ]
            
            # 保存日志
            with open(self.download_log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)
            
            return True
            
        except Exception as e:
            print(f"保存下载日志失败: {e}")
            return False
    
    def load_download_logs(self) -> List[Dict]:
        """加载下载日志"""
        try:
            if self.download_log_file.exists():
                with open(self.download_log_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return []
        except Exception as e:
            print(f"加载下载日志失败: {e}")
            return []
    
    def save_metadata(self, metadata: Dict) -> bool:
        """保存元数据"""
        try:
            metadata['last_updated'] = datetime.now().isoformat()
            
            with open(self.metadata_file, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, ensure_ascii=False, indent=2)
            
            return True
            
        except Exception as e:
            print(f"保存元数据失败: {e}")
            return False
    
    def load_metadata(self) -> Dict:
        """加载元数据"""
        try:
            if self.metadata_file.exists():
                with open(self.metadata_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"加载元数据失败: {e}")
            return {}
    
    def get_movies_by_category(self, category: str) -> List[Dict]:
        """按分类获取电影"""
        data = self.load_movies_data()
        return data.get(category, [])
    
    def get_all_movies(self) -> List[Dict]:
        """获取所有电影"""
        data = self.load_movies_data()
        all_movies = []
        
        for key, value in data.items():
            if key not in ['last_updated', 'categories', 'total_movies'] and isinstance(value, list):
                all_movies.extend(value)
        
        # 去重（基于ID）
        unique_movies = {}
        for movie in all_movies:
            unique_movies[movie['id']] = movie
        
        return list(unique_movies.values())
    
    def search_movies(self, query: str) -> List[Dict]:
        """搜索电影"""
        all_movies = self.get_all_movies()
        query_lower = query.lower()
        
        results = []
        for movie in all_movies:
            title_match = query_lower in movie.get('title', '').lower()
            original_title_match = query_lower in movie.get('original_title', '').lower()
            overview_match = query_lower in movie.get('overview', '').lower()
            
            if title_match or original_title_match or overview_match:
                results.append(movie)
        
        return results
    
    def get_statistics(self) -> Dict:
        """获取数据统计信息"""
        data = self.load_movies_data()
        logs = self.load_download_logs()
        
        stats = {
            'total_movies': data.get('total_movies', 0),
            'categories': data.get('categories', []),
            'last_updated': data.get('last_updated', ''),
            'download_logs_count': len(logs),
            'latest_download': logs[-1]['timestamp'] if logs else None
        }
        
        # 按分类统计
        category_stats = {}
        for category in stats['categories']:
            movies = data.get(category, [])
            category_stats[category] = {
                'count': len(movies),
                'avg_rating': sum(movie.get('vote_average', 0) for movie in movies) / len(movies) if movies else 0,
                'latest_release': max(movie.get('release_date', '') for movie in movies) if movies else ''
            }
        
        stats['category_stats'] = category_stats
        
        return stats
    
    def export_data(self, output_file: str, format: str = 'json') -> bool:
        """导出数据"""
        try:
            data = {
                'movies': self.load_movies_data(),
                'logs': self.load_download_logs(),
                'metadata': self.load_metadata(),
                'exported_at': datetime.now().isoformat()
            }
            
            output_path = Path(output_file)
            
            if format.lower() == 'json':
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
            else:
                raise ValueError(f"不支持的格式: {format}")
            
            print(f"数据已导出到: {output_path}")
            return True
            
        except Exception as e:
            print(f"导出数据失败: {e}")
            return False
    
    def cleanup_old_data(self, keep_days: int = 90) -> int:
        """清理旧数据"""
        try:
            cutoff_date = datetime.now() - timedelta(days=keep_days)
            
            # 清理旧日志
            logs = self.load_download_logs()
            old_logs_count = len(logs)
            
            logs = [
                log for log in logs 
                if datetime.fromisoformat(log['timestamp']) > cutoff_date
            ]
            
            new_logs_count = len(logs)
            removed_logs = old_logs_count - new_logs_count
            
            # 保存清理后的日志
            with open(self.download_log_file, 'w', encoding='utf-8') as f:
                json.dump(logs, f, ensure_ascii=False, indent=2)
            
            print(f"清理了 {removed_logs} 条旧日志")
            return removed_logs
            
        except Exception as e:
            print(f"清理旧数据失败: {e}")
            return 0
    
    def create_index(self) -> bool:
        """创建数据索引"""
        try:
            all_movies = self.get_all_movies()
            
            # 创建各种索引
            indexes = {
                'by_id': {movie['id']: movie for movie in all_movies},
                'by_title': {},
                'by_year': {},
                'by_genre': {},
                'by_rating': {}
            }
            
            # 标题索引
            for movie in all_movies:
                title = movie.get('title', '').lower()
                if title:
                    if title not in indexes['by_title']:
                        indexes['by_title'][title] = []
                    indexes['by_title'][title].append(movie['id'])
            
            # 年份索引
            for movie in all_movies:
                year = movie.get('release_date', '')[:4] if movie.get('release_date') else 'unknown'
                if year not in indexes['by_year']:
                    indexes['by_year'][year] = []
                indexes['by_year'][year].append(movie['id'])
            
            # 评分索引
            for movie in all_movies:
                rating = int(movie.get('vote_average', 0))
                if rating not in indexes['by_rating']:
                    indexes['by_rating'][rating] = []
                indexes['by_rating'][rating].append(movie['id'])
            
            # 保存索引
            index_file = self.data_dir / 'indexes.json'
            with open(index_file, 'w', encoding='utf-8') as f:
                json.dump(indexes, f, ensure_ascii=False, indent=2)
            
            print(f"创建了包含 {len(all_movies)} 部电影的索引")
            return True
            
        except Exception as e:
            print(f"创建索引失败: {e}")
            return False
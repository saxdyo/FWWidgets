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
    
    def export_widget_data(self, movies_data: List[Dict]) -> bool:
        """导出JavaScript小组件兼容的数据格式"""
        try:
            from config import WIDGET_DATA_FORMAT, WIDGET_ITEM_MAPPING
            
            # 按类型分组数据
            trending_data = []
            popular_data = []
            top_rated_data = []
            
            for movie in movies_data:
                widget_item = self._convert_to_widget_format(movie)
                
                # 根据来源分类
                source = movie.get('source', 'trending')
                if 'popular' in source.lower():
                    popular_data.append(widget_item)
                elif 'top' in source.lower() or 'rated' in source.lower():
                    top_rated_data.append(widget_item)
                else:
                    trending_data.append(widget_item)
            
            # 限制每个分类的数量
            max_items = WIDGET_DATA_FORMAT.get("max_items_per_category", 20)
            trending_data = trending_data[:max_items]
            popular_data = popular_data[:max_items]
            top_rated_data = top_rated_data[:max_items]
            
            # 生成小组件数据结构
            widget_export = {
                "lastUpdated": datetime.now().isoformat(),
                "version": "2.0.0",
                "dataSource": "TMDB",
                "totalItems": len(trending_data),
                "categories": {
                    "trending": {
                        "title": "今日热门",
                        "count": len(trending_data),
                        "items": trending_data
                    }
                },
                "metadata": {
                    "generatedBy": "TMDB Movie Background Crawler",
                    "apiVersion": "3",
                    "includeTitlePosters": WIDGET_DATA_FORMAT.get("include_title_posters", False),
                    "formats": ["JSON"]
                }
            }
            
            # 如果有足够的数据，添加其他分类
            if popular_data:
                widget_export["categories"]["popular"] = {
                    "title": "热门电影",
                    "count": len(popular_data),
                    "items": popular_data
                }
            
            if top_rated_data:
                widget_export["categories"]["top_rated"] = {
                    "title": "高分内容",
                    "count": len(top_rated_data),
                    "items": top_rated_data
                }
            
            # 导出主要的trending数据（兼容现有小组件）
            trending_filename = WIDGET_DATA_FORMAT.get("trending_filename", "TMDB_Trending.json")
            trending_file_path = self.data_dir / trending_filename
            
            with open(trending_file_path, 'w', encoding='utf-8') as f:
                json.dump(widget_export, f, ensure_ascii=False, indent=2)
            
            # 导出其他分类数据（可选）
            if popular_data:
                popular_filename = WIDGET_DATA_FORMAT.get("popular_filename", "TMDB_Popular.json")
                popular_file_path = self.data_dir / popular_filename
                
                popular_export = {
                    **widget_export,
                    "totalItems": len(popular_data),
                    "categories": {
                        "popular": widget_export["categories"]["popular"]
                    }
                }
                
                with open(popular_file_path, 'w', encoding='utf-8') as f:
                    json.dump(popular_export, f, ensure_ascii=False, indent=2)
            
            if top_rated_data:
                top_rated_filename = WIDGET_DATA_FORMAT.get("top_rated_filename", "TMDB_TopRated.json")
                top_rated_file_path = self.data_dir / top_rated_filename
                
                top_rated_export = {
                    **widget_export,
                    "totalItems": len(top_rated_data),
                    "categories": {
                        "top_rated": widget_export["categories"]["top_rated"]
                    }
                }
                
                with open(top_rated_file_path, 'w', encoding='utf-8') as f:
                    json.dump(top_rated_export, f, ensure_ascii=False, indent=2)
            
            print(f"✅ 小组件数据已导出:")
            print(f"   - {trending_file_path} ({len(trending_data)} 项)")
            if popular_data:
                print(f"   - {popular_file_path} ({len(popular_data)} 项)")
            if top_rated_data:
                print(f"   - {top_rated_file_path} ({len(top_rated_data)} 项)")
            
            return True
            
        except Exception as e:
            print(f"❌ 导出小组件数据失败: {e}")
            return False
    
    def _convert_to_widget_format(self, movie: Dict) -> Dict:
        """将电影数据转换为小组件兼容格式"""
        from config import WIDGET_ITEM_MAPPING
        
        # 基本字段映射
        widget_item = {
            "id": str(movie.get("id", "")),
            "type": "tmdb",
            "title": movie.get("title") or movie.get("name", "未知标题"),
            "genreTitle": self._format_genres(movie.get("genres", [])),
            "rating": round(movie.get("vote_average", 0), 1),
            "description": movie.get("overview", "")[:200] + ("..." if len(movie.get("overview", "")) > 200 else ""),
            "releaseDate": movie.get("release_date") or movie.get("first_air_date", ""),
            "posterPath": movie.get("poster_url", ""),
            "coverUrl": movie.get("poster_url", ""),
            "backdropPath": movie.get("backdrop_url", ""),
            "mediaType": movie.get("media_type", "movie"),
            "popularity": round(movie.get("popularity", 0), 1),
            "voteCount": movie.get("vote_count", 0)
        }
        
        # 添加标题海报路径（如果存在）
        if movie.get("title_poster_path"):
            widget_item["titlePosterPath"] = movie["title_poster_path"]
        
        # 添加可选字段
        widget_item.update({
            "link": None,
            "duration": 0,
            "durationText": "",
            "episode": 0,
            "childItems": []
        })
        
        return widget_item
    
    def _format_genres(self, genres: List) -> str:
        """格式化类型信息"""
        if not genres:
            return ""
        
        # 如果genres是字符串列表
        if isinstance(genres, list) and genres:
            if isinstance(genres[0], str):
                return "•".join(genres[:2])
            # 如果是字典列表（TMDB格式）
            elif isinstance(genres[0], dict):
                genre_names = [g.get("name", "") for g in genres[:2] if g.get("name")]
                return "•".join(genre_names)
        
        return ""
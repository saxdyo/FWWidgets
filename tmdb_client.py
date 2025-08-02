import requests
import time
import json
from typing import List, Dict, Optional
from config import (
    TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL,
    REQUEST_TIMEOUT, REQUEST_DELAY
)


class TMDBClient:
    """TMDB API客户端"""
    
    def __init__(self):
        if not TMDB_API_KEY:
            raise ValueError("TMDB_API_KEY is required. Please set it in .env file")
        
        self.api_key = TMDB_API_KEY
        self.base_url = TMDB_BASE_URL
        self.image_base_url = TMDB_IMAGE_BASE_URL
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        })
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """发送API请求"""
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = self.session.get(
                url, 
                params=params,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            # 避免API限制
            time.sleep(REQUEST_DELAY)
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"API请求失败: {e}")
            return {}
    
    def get_popular_movies(self, page: int = 1) -> List[Dict]:
        """获取热门电影列表"""
        params = {'page': page}
        data = self._make_request('movie/popular', params)
        return data.get('results', [])
    
    def get_top_rated_movies(self, page: int = 1) -> List[Dict]:
        """获取评分最高的电影"""
        params = {'page': page}
        data = self._make_request('movie/top_rated', params)
        return data.get('results', [])
    
    def get_now_playing_movies(self, page: int = 1) -> List[Dict]:
        """获取正在上映的电影"""
        params = {'page': page}
        data = self._make_request('movie/now_playing', params)
        return data.get('results', [])
    
    def get_upcoming_movies(self, page: int = 1) -> List[Dict]:
        """获取即将上映的电影"""
        params = {'page': page}
        data = self._make_request('movie/upcoming', params)
        return data.get('results', [])
    
    def get_movie_details(self, movie_id: int) -> Dict:
        """获取电影详细信息"""
        return self._make_request(f'movie/{movie_id}')
    
    def get_movie_images(self, movie_id: int) -> Dict:
        """获取电影图片"""
        return self._make_request(f'movie/{movie_id}/images')
    
    def search_movies(self, query: str, page: int = 1) -> List[Dict]:
        """搜索电影"""
        params = {
            'query': query,
            'page': page,
            'include_adult': False
        }
        data = self._make_request('search/movie', params)
        return data.get('results', [])
    
    def get_backdrop_url(self, backdrop_path: str) -> str:
        """获取背景图完整URL"""
        if not backdrop_path:
            return ""
        return f"{self.image_base_url}{backdrop_path}"
    
    def get_poster_url(self, poster_path: str) -> str:
        """获取海报完整URL"""
        if not poster_path:
            return ""
        return f"{self.image_base_url}{poster_path}"
    
    def get_movies_with_backdrops(self, category: str = 'popular', pages: int = 5) -> List[Dict]:
        """获取带背景图的电影列表"""
        movies_with_backdrops = []
        
        # 选择获取方法
        get_method = {
            'popular': self.get_popular_movies,
            'top_rated': self.get_top_rated_movies,
            'now_playing': self.get_now_playing_movies,
            'upcoming': self.get_upcoming_movies
        }.get(category, self.get_popular_movies)
        
        for page in range(1, pages + 1):
            movies = get_method(page)
            
            for movie in movies:
                if movie.get('backdrop_path'):
                    movie_data = {
                        'id': movie['id'],
                        'title': movie['title'],
                        'original_title': movie.get('original_title', ''),
                        'overview': movie.get('overview', ''),
                        'release_date': movie.get('release_date', ''),
                        'vote_average': movie.get('vote_average', 0),
                        'vote_count': movie.get('vote_count', 0),
                        'popularity': movie.get('popularity', 0),
                        'backdrop_path': movie['backdrop_path'],
                        'backdrop_url': self.get_backdrop_url(movie['backdrop_path']),
                        'poster_path': movie.get('poster_path', ''),
                        'poster_url': self.get_poster_url(movie.get('poster_path', '')) if movie.get('poster_path') else '',
                        'genre_ids': movie.get('genre_ids', []),
                        'adult': movie.get('adult', False),
                        'original_language': movie.get('original_language', ''),
                        'category': category
                    }
                    movies_with_backdrops.append(movie_data)
        
        return movies_with_backdrops
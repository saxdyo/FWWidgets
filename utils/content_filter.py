import re
import logging
from typing import List, Dict, Any, Optional, Set
from datetime import datetime

logger = logging.getLogger(__name__)

class ContentFilter:
    """
    Content filtering system based on fw2.js optimization patterns
    Filters out unwanted content and prioritizes regional content
    """
    
    def __init__(self):
        # Content filtering rules (from fw2.js)
        self.unwanted_genres = {
            10764,  # Reality TV
            10767,  # Talk Show  
            10766,  # Soap Opera
            10763,  # News
        }
        
        # Unwanted keywords in titles/descriptions
        self.unwanted_keywords = {
            'variety', '综艺', '真人秀', 'reality show', 'talk show',
            '脱口秀', '访谈', '新闻', 'news', '直播', 'live',
            '短剧', 'short drama', '微剧', '网剧', 'web drama',
            '广告', 'advertisement', 'commercial', '宣传片',
            'making of', '花絮', 'behind the scenes', '幕后',
            '预告', 'trailer', 'teaser', '片花', 'preview'
        }
        
        # Adult content indicators
        self.adult_indicators = {
            'adult', '成人', '18+', 'xxx', 'porn', '色情',
            'erotic', '情色', 'nsfw', '限制级', 'restricted'
        }
        
        # Low quality indicators
        self.low_quality_indicators = {
            '网络电影', 'web movie', '微电影', 'micro film',
            '网络剧', 'web series', '自制剧', 'original series'
        }
        
        # Chinese content prioritization
        self.chinese_countries = {'CN', 'HK', 'TW', 'SG'}
        self.chinese_languages = {'zh', 'zh-CN', 'zh-TW', 'zh-HK', 'cmn', 'yue'}
        
    def is_unwanted_genre(self, genre_ids: List[int]) -> bool:
        """Check if content has unwanted genres"""
        if not genre_ids:
            return False
        return bool(set(genre_ids) & self.unwanted_genres)
        
    def contains_unwanted_keywords(self, text: str) -> bool:
        """Check if text contains unwanted keywords"""
        if not text:
            return False
            
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.unwanted_keywords)
        
    def is_adult_content(self, title: str, overview: str = "", certification: str = "") -> bool:
        """Check if content is adult/restricted"""
        combined_text = f"{title} {overview} {certification}".lower()
        return any(indicator in combined_text for indicator in self.adult_indicators)
        
    def is_low_quality(self, title: str, overview: str = "", vote_count: int = 0) -> bool:
        """Check if content appears to be low quality"""
        # Very low vote count
        if vote_count < 10:
            return True
            
        # Low quality keywords
        combined_text = f"{title} {overview}".lower()
        if any(indicator in combined_text for indicator in self.low_quality_indicators):
            return True
            
        return False
        
    def is_chinese_content(self, item: Dict[str, Any]) -> bool:
        """Check if content is Chinese/Chinese-language"""
        # Check origin country
        origin_countries = item.get('origin_country', [])
        if any(country in self.chinese_countries for country in origin_countries):
            return True
            
        # Check original language
        original_language = item.get('original_language', '')
        if original_language in self.chinese_languages:
            return True
            
        # Check production countries
        production_countries = item.get('production_countries', [])
        for country in production_countries:
            if country.get('iso_3166_1') in self.chinese_countries:
                return True
                
        return False
        
    def get_chinese_title(self, item: Dict[str, Any]) -> str:
        """
        Get Chinese title with priority order
        Based on fw2.js title prioritization
        """
        # Priority order for title fields
        title_fields = [
            'title',  # Movie title
            'name',   # TV show name
            'original_title',  # Original movie title
            'original_name'    # Original TV name
        ]
        
        for field in title_fields:
            title = item.get(field, '')
            if title and self._contains_chinese(title):
                return title
                
        # Fallback to any available title
        for field in title_fields:
            title = item.get(field, '')
            if title:
                return title
                
        return "未知标题"
        
    def get_chinese_description(self, item: Dict[str, Any]) -> str:
        """Get Chinese description if available"""
        overview = item.get('overview', '')
        
        # Check if overview contains Chinese characters
        if self._contains_chinese(overview):
            return overview
            
        # Fallback to original overview
        return overview or ""
        
    def _contains_chinese(self, text: str) -> bool:
        """Check if text contains Chinese characters"""
        if not text:
            return False
        return bool(re.search(r'[\u4e00-\u9fff]', text))
        
    def filter_content(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Filter content list and return clean, prioritized results
        """
        filtered_items = []
        
        for item in items:
            # Skip unwanted content
            if self._should_filter_out(item):
                continue
                
            # Enhance item with Chinese content
            enhanced_item = self._enhance_item(item)
            filtered_items.append(enhanced_item)
            
        # Sort with Chinese content priority
        return self._sort_with_priority(filtered_items)
        
    def _should_filter_out(self, item: Dict[str, Any]) -> bool:
        """Determine if item should be filtered out"""
        title = item.get('title') or item.get('name', '')
        overview = item.get('overview', '')
        genre_ids = item.get('genre_ids', [])
        vote_count = item.get('vote_count', 0)
        
        # Filter by genre
        if self.is_unwanted_genre(genre_ids):
            logger.debug(f"Filtered out by genre: {title}")
            return True
            
        # Filter by keywords
        if self.contains_unwanted_keywords(title) or self.contains_unwanted_keywords(overview):
            logger.debug(f"Filtered out by keywords: {title}")
            return True
            
        # Filter adult content
        if self.is_adult_content(title, overview):
            logger.debug(f"Filtered out adult content: {title}")
            return True
            
        # Filter low quality content
        if self.is_low_quality(title, overview, vote_count):
            logger.debug(f"Filtered out low quality: {title}")
            return True
            
        return False
        
    def _enhance_item(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance item with Chinese content preferences"""
        enhanced = item.copy()
        
        # Add Chinese-prioritized title
        enhanced['display_title'] = self.get_chinese_title(item)
        enhanced['display_overview'] = self.get_chinese_description(item)
        
        # Add Chinese content flag
        enhanced['is_chinese_content'] = self.is_chinese_content(item)
        
        # Add content quality score
        enhanced['quality_score'] = self._calculate_quality_score(item)
        
        return enhanced
        
    def _calculate_quality_score(self, item: Dict[str, Any]) -> float:
        """Calculate content quality score for ranking"""
        score = 0.0
        
        # Base score from TMDB ratings
        vote_average = item.get('vote_average', 0)
        vote_count = item.get('vote_count', 0)
        popularity = item.get('popularity', 0)
        
        # Weighted scoring
        score += vote_average * 10  # 0-100 points from rating
        score += min(vote_count / 100, 20)  # Up to 20 points from vote count
        score += min(popularity / 100, 10)  # Up to 10 points from popularity
        
        # Bonus for Chinese content
        if self.is_chinese_content(item):
            score += 15
            
        # Bonus for recent content
        release_date = item.get('release_date') or item.get('first_air_date')
        if release_date:
            try:
                release_year = datetime.strptime(release_date, '%Y-%m-%d').year
                current_year = datetime.now().year
                years_ago = current_year - release_year
                
                if years_ago <= 3:  # Recent content bonus
                    score += max(0, 10 - years_ago * 2)
            except:
                pass
                
        return round(score, 2)
        
    def _sort_with_priority(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Sort items with Chinese content and quality priority"""
        def sort_key(item):
            is_chinese = item.get('is_chinese_content', False)
            quality_score = item.get('quality_score', 0)
            
            # Chinese content gets priority boost
            priority_score = quality_score + (30 if is_chinese else 0)
            
            return -priority_score  # Negative for descending order
            
        return sorted(items, key=sort_key)


class GenreManager:
    """
    Manage genre information and translations
    Based on fw2.js genre handling patterns
    """
    
    def __init__(self):
        # TMDB genre mappings with Chinese translations
        self.movie_genres = {
            28: {"en": "Action", "zh": "动作"},
            12: {"en": "Adventure", "zh": "冒险"},
            16: {"en": "Animation", "zh": "动画"},
            35: {"en": "Comedy", "zh": "喜剧"},
            80: {"en": "Crime", "zh": "犯罪"},
            99: {"en": "Documentary", "zh": "纪录片"},
            18: {"en": "Drama", "zh": "剧情"},
            10751: {"en": "Family", "zh": "家庭"},
            14: {"en": "Fantasy", "zh": "奇幻"},
            36: {"en": "History", "zh": "历史"},
            27: {"en": "Horror", "zh": "恐怖"},
            10402: {"en": "Music", "zh": "音乐"},
            9648: {"en": "Mystery", "zh": "悬疑"},
            10749: {"en": "Romance", "zh": "爱情"},
            878: {"en": "Science Fiction", "zh": "科幻"},
            10770: {"en": "TV Movie", "zh": "电视电影"},
            53: {"en": "Thriller", "zh": "惊悚"},
            10752: {"en": "War", "zh": "战争"},
            37: {"en": "Western", "zh": "西部"}
        }
        
        self.tv_genres = {
            10759: {"en": "Action & Adventure", "zh": "动作冒险"},
            16: {"en": "Animation", "zh": "动画"},
            35: {"en": "Comedy", "zh": "喜剧"},
            80: {"en": "Crime", "zh": "犯罪"},
            99: {"en": "Documentary", "zh": "纪录片"},
            18: {"en": "Drama", "zh": "剧情"},
            10751: {"en": "Family", "zh": "家庭"},
            10762: {"en": "Kids", "zh": "儿童"},
            9648: {"en": "Mystery", "zh": "悬疑"},
            10763: {"en": "News", "zh": "新闻"},
            10764: {"en": "Reality", "zh": "真人秀"},
            10765: {"en": "Sci-Fi & Fantasy", "zh": "科幻奇幻"},
            10766: {"en": "Soap", "zh": "肥皂剧"},
            10767: {"en": "Talk", "zh": "脱口秀"},
            10768: {"en": "War & Politics", "zh": "战争政治"},
            37: {"en": "Western", "zh": "西部"}
        }
        
    def get_genre_names(self, genre_ids: List[int], media_type: str = "movie", language: str = "zh") -> List[str]:
        """Get genre names for given IDs"""
        genres_map = self.movie_genres if media_type == "movie" else self.tv_genres
        
        genre_names = []
        for genre_id in genre_ids:
            if genre_id in genres_map:
                genre_info = genres_map[genre_id]
                name = genre_info.get(language, genre_info.get("en", ""))
                if name:
                    genre_names.append(name)
                    
        return genre_names
        
    def format_genre_string(self, genre_ids: List[int], media_type: str = "movie", max_genres: int = 3) -> str:
        """Format genre string for display"""
        genre_names = self.get_genre_names(genre_ids, media_type, "zh")
        
        if not genre_names:
            return ""
            
        # Limit number of genres and join with separator
        limited_genres = genre_names[:max_genres]
        return " • ".join(limited_genres)


# Global instances
content_filter = ContentFilter()
genre_manager = GenreManager()
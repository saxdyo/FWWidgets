"""
Content filtering system inspired by fw2.js content filtering
Provides intelligent filtering of unwanted content types, quality control, and smart recommendations
"""

import re
from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass
import logging
from config import CONTENT_FILTER, I18N_CONFIG, LOGGING_CONFIG

# Setup logging
logging.basicConfig(
    level=getattr(logging, LOGGING_CONFIG['LEVEL']),
    format=LOGGING_CONFIG['FORMAT']
)
logger = logging.getLogger(__name__)


@dataclass
class ContentItem:
    """Represents a content item for filtering"""
    id: int
    title: str
    original_title: str = ""
    overview: str = ""
    genre_ids: List[int] = None
    media_type: str = "movie"  # movie, tv
    vote_average: float = 0.0
    vote_count: int = 0
    popularity: float = 0.0
    release_date: str = ""
    first_air_date: str = ""
    origin_country: List[str] = None
    original_language: str = ""
    runtime: int = 0  # minutes
    episode_run_time: List[int] = None
    adult: bool = False
    
    def __post_init__(self):
        if self.genre_ids is None:
            self.genre_ids = []
        if self.origin_country is None:
            self.origin_country = []
        if self.episode_run_time is None:
            self.episode_run_time = []


class ContentFilter:
    """
    Advanced content filtering inspired by fw2.js filtering logic
    Features:
    - Genre-based filtering
    - Keyword-based exclusion
    - Quality thresholds
    - Content type classification
    - Language and region preferences
    - Duration-based filtering
    - Adult content filtering
    """
    
    def __init__(self):
        # Genre ID mappings from TMDB
        self.genre_mappings = {
            # Movie genres
            'movie': {
                28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
                18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
                9648: "悬疑", 10749: "爱情", 878: "科幻", 10770: "电视电影", 53: "惊悚",
                10752: "战争", 37: "西部"
            },
            # TV genres
            'tv': {
                10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
                18: "剧情", 10751: "家庭", 10762: "儿童", 9648: "悬疑", 10763: "新闻",
                10764: "真人秀", 10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀",
                10768: "战争政治", 37: "西部"
            }
        }
        
        # Exclude genre IDs that represent unwanted content
        self.excluded_genre_ids = {
            10764,  # Reality show
            10767,  # Talk show
            10766,  # Soap opera
            10763,  # News
        }
        
        # Compile keyword patterns for efficient matching
        self.excluded_patterns = [
            re.compile(pattern, re.IGNORECASE) 
            for pattern in CONTENT_FILTER['EXCLUDE_KEYWORDS']
        ]
        
        self.filter_stats = {
            'total_processed': 0,
            'filtered_out': 0,
            'filter_reasons': {},
            'top_filtered_genres': {},
            'quality_filtered': 0,
            'adult_filtered': 0,
            'duration_filtered': 0,
            'keyword_filtered': 0
        }
        
        logger.info("Initialized ContentFilter")
    
    def filter_content_list(self, content_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Filter a list of content items based on all filtering criteria
        """
        if not content_items:
            return []
        
        filtered_items = []
        
        for item_data in content_items:
            self.filter_stats['total_processed'] += 1
            
            # Convert to ContentItem for easier handling
            content_item = self._dict_to_content_item(item_data)
            
            # Apply all filters
            if self._should_include_content(content_item):
                # Apply content enhancements
                enhanced_item = self._enhance_content_item(item_data, content_item)
                filtered_items.append(enhanced_item)
            else:
                self.filter_stats['filtered_out'] += 1
        
        logger.info(f"Filtered content: {len(filtered_items)}/{len(content_items)} items passed filters")
        return filtered_items
    
    def _should_include_content(self, content: ContentItem) -> bool:
        """
        Determine if content should be included based on all filter criteria
        """
        # Adult content filter
        if content.adult and not CONTENT_FILTER['ADULT_CONTENT']:
            self._record_filter_reason('adult_content')
            self.filter_stats['adult_filtered'] += 1
            return False
        
        # Quality filters
        if not self._passes_quality_filter(content):
            self.filter_stats['quality_filtered'] += 1
            return False
        
        # Genre filters
        if not self._passes_genre_filter(content):
            return False
        
        # Keyword filters
        if not self._passes_keyword_filter(content):
            self.filter_stats['keyword_filtered'] += 1
            return False
        
        # Duration filters
        if not self._passes_duration_filter(content):
            self.filter_stats['duration_filtered'] += 1
            return False
        
        return True
    
    def _passes_quality_filter(self, content: ContentItem) -> bool:
        """Check if content meets quality thresholds"""
        # Minimum vote count
        if content.vote_count < CONTENT_FILTER['MIN_VOTE_COUNT']:
            self._record_filter_reason('low_vote_count')
            return False
        
        # Minimum rating
        if content.vote_average < CONTENT_FILTER['MIN_RATING']:
            self._record_filter_reason('low_rating')
            return False
        
        return True
    
    def _passes_genre_filter(self, content: ContentItem) -> bool:
        """Check if content genres are acceptable"""
        if not content.genre_ids:
            return True
        
        # Check for excluded genre IDs
        excluded_genres = set(content.genre_ids) & self.excluded_genre_ids
        if excluded_genres:
            for genre_id in excluded_genres:
                genre_name = self.genre_mappings.get(content.media_type, {}).get(genre_id, str(genre_id))
                self._record_filter_reason(f'excluded_genre_{genre_name}')
                self._record_genre_filter(genre_name)
            return False
        
        return True
    
    def _passes_keyword_filter(self, content: ContentItem) -> bool:
        """Check if content contains excluded keywords"""
        # Check title and overview for excluded keywords
        text_to_check = f"{content.title} {content.original_title} {content.overview}".lower()
        
        for pattern in self.excluded_patterns:
            if pattern.search(text_to_check):
                self._record_filter_reason(f'keyword_{pattern.pattern}')
                return False
        
        return True
    
    def _passes_duration_filter(self, content: ContentItem) -> bool:
        """Check if content meets duration requirements"""
        if not CONTENT_FILTER['EXCLUDE_SHORT_DURATION']:
            return True
        
        min_duration = CONTENT_FILTER['MIN_DURATION_MINUTES']
        
        if content.media_type == 'movie':
            if content.runtime > 0 and content.runtime < min_duration:
                self._record_filter_reason('short_duration_movie')
                return False
        elif content.media_type == 'tv':
            # For TV shows, check average episode runtime
            if content.episode_run_time:
                avg_runtime = sum(content.episode_run_time) / len(content.episode_run_time)
                if avg_runtime < min_duration:
                    self._record_filter_reason('short_duration_tv')
                    return False
        
        return True
    
    def _enhance_content_item(self, original_item: Dict[str, Any], content: ContentItem) -> Dict[str, Any]:
        """
        Enhance content item with additional metadata and optimizations
        """
        enhanced_item = original_item.copy()
        
        # Add genre names
        genre_names = []
        for genre_id in content.genre_ids:
            genre_name = self.genre_mappings.get(content.media_type, {}).get(genre_id)
            if genre_name:
                genre_names.append(genre_name)
        
        enhanced_item['genre_names'] = genre_names
        enhanced_item['genre_title'] = '•'.join(genre_names[:2]) if genre_names else ""
        
        # Prioritize Chinese titles if available
        enhanced_item['display_title'] = self._get_preferred_title(content)
        enhanced_item['display_overview'] = self._get_preferred_overview(content)
        
        # Add quality score
        enhanced_item['quality_score'] = self._calculate_quality_score(content)
        
        # Add content classification
        enhanced_item['content_classification'] = self._classify_content(content)
        
        # Add recommendation score
        enhanced_item['recommendation_score'] = self._calculate_recommendation_score(content)
        
        return enhanced_item
    
    def _get_preferred_title(self, content: ContentItem) -> str:
        """Get preferred title based on language priority"""
        # For Chinese content or if Chinese title is preferred
        if ('CN' in content.origin_country or 
            content.original_language in ['zh', 'zh-CN', 'zh-TW']):
            return content.original_title or content.title
        
        # Otherwise use localized title
        return content.title or content.original_title
    
    def _get_preferred_overview(self, content: ContentItem) -> str:
        """Get preferred overview/description"""
        # For now, just return the overview as-is
        # In a full implementation, this could prioritize different language versions
        return content.overview
    
    def _calculate_quality_score(self, content: ContentItem) -> float:
        """Calculate a quality score for content ranking"""
        score = 0.0
        
        # Rating component (0-10 scale -> 0-40 points)
        score += content.vote_average * 4
        
        # Vote count component (logarithmic scale, max 20 points)
        if content.vote_count > 0:
            import math
            score += min(20, math.log10(content.vote_count) * 5)
        
        # Popularity component (max 20 points)
        score += min(20, content.popularity / 100 * 20)
        
        # Recency bonus (max 20 points)
        release_year = self._extract_year(content.release_date or content.first_air_date)
        if release_year:
            from datetime import datetime
            current_year = datetime.now().year
            years_old = current_year - release_year
            recency_score = max(0, 20 - years_old)
            score += recency_score
        
        return min(100, score)  # Cap at 100
    
    def _classify_content(self, content: ContentItem) -> str:
        """Classify content into categories"""
        if content.media_type == 'movie':
            # Classify by runtime
            if content.runtime > 150:
                return 'epic_movie'
            elif content.runtime < 90:
                return 'short_movie'
            else:
                return 'feature_movie'
        else:  # TV
            # Classify by genre and origin
            if 16 in content.genre_ids:  # Animation
                if 'JP' in content.origin_country:
                    return 'anime'
                elif 'CN' in content.origin_country:
                    return 'chinese_animation'
                else:
                    return 'western_animation'
            elif 80 in content.genre_ids:  # Crime
                return 'crime_series'
            elif 18 in content.genre_ids:  # Drama
                return 'drama_series'
            else:
                return 'tv_series'
    
    def _calculate_recommendation_score(self, content: ContentItem) -> float:
        """Calculate recommendation score for personalization"""
        # Base score from quality
        score = self._calculate_quality_score(content)
        
        # Bonus for high-quality animation
        if 16 in content.genre_ids and content.vote_average > 8.0:
            score += 10
        
        # Bonus for recent high-rated content
        release_year = self._extract_year(content.release_date or content.first_air_date)
        if release_year:
            from datetime import datetime
            current_year = datetime.now().year
            if current_year - release_year <= 2 and content.vote_average > 7.5:
                score += 15
        
        return min(100, score)
    
    def _extract_year(self, date_string: str) -> Optional[int]:
        """Extract year from date string"""
        if not date_string:
            return None
        try:
            return int(date_string.split('-')[0])
        except (ValueError, IndexError):
            return None
    
    def _dict_to_content_item(self, item_data: Dict[str, Any]) -> ContentItem:
        """Convert dictionary to ContentItem"""
        return ContentItem(
            id=item_data.get('id', 0),
            title=item_data.get('title', item_data.get('name', '')),
            original_title=item_data.get('original_title', item_data.get('original_name', '')),
            overview=item_data.get('overview', ''),
            genre_ids=item_data.get('genre_ids', []),
            media_type=item_data.get('media_type', 'movie'),
            vote_average=item_data.get('vote_average', 0.0),
            vote_count=item_data.get('vote_count', 0),
            popularity=item_data.get('popularity', 0.0),
            release_date=item_data.get('release_date', ''),
            first_air_date=item_data.get('first_air_date', ''),
            origin_country=item_data.get('origin_country', []),
            original_language=item_data.get('original_language', ''),
            runtime=item_data.get('runtime', 0),
            episode_run_time=item_data.get('episode_run_time', []),
            adult=item_data.get('adult', False)
        )
    
    def _record_filter_reason(self, reason: str):
        """Record why content was filtered out"""
        if reason not in self.filter_stats['filter_reasons']:
            self.filter_stats['filter_reasons'][reason] = 0
        self.filter_stats['filter_reasons'][reason] += 1
    
    def _record_genre_filter(self, genre_name: str):
        """Record which genres are being filtered most"""
        if genre_name not in self.filter_stats['top_filtered_genres']:
            self.filter_stats['top_filtered_genres'][genre_name] = 0
        self.filter_stats['top_filtered_genres'][genre_name] += 1
    
    def is_fresh_content(self, content: ContentItem, max_age_days: int = 30) -> bool:
        """
        Check if content is fresh/recent based on age
        Inspired by fw2.js data freshness logic
        """
        if not content.release_date and not content.first_air_date:
            return False
        
        release_date = content.release_date or content.first_air_date
        try:
            from datetime import datetime, timedelta
            release_datetime = datetime.strptime(release_date, '%Y-%m-%d')
            age = datetime.now() - release_datetime
            return age.days <= max_age_days
        except ValueError:
            return False
    
    def get_trending_content(self, content_list: List[Dict[str, Any]], limit: int = 20) -> List[Dict[str, Any]]:
        """
        Get trending content based on popularity and recency
        """
        # Filter content first
        filtered_content = self.filter_content_list(content_list)
        
        # Sort by recommendation score (which includes recency and popularity)
        trending_content = sorted(
            filtered_content,
            key=lambda x: x.get('recommendation_score', 0),
            reverse=True
        )
        
        return trending_content[:limit]
    
    def get_filter_stats(self) -> Dict[str, Any]:
        """Get filtering statistics"""
        stats = self.filter_stats.copy()
        
        # Calculate filter rate
        if stats['total_processed'] > 0:
            stats['filter_rate'] = stats['filtered_out'] / stats['total_processed']
        else:
            stats['filter_rate'] = 0.0
        
        return stats
    
    def reset_stats(self):
        """Reset filtering statistics"""
        self.filter_stats = {
            'total_processed': 0,
            'filtered_out': 0,
            'filter_reasons': {},
            'top_filtered_genres': {},
            'quality_filtered': 0,
            'adult_filtered': 0,
            'duration_filtered': 0,
            'keyword_filtered': 0
        }


# Global instance
global_content_filter = ContentFilter()


def filter_content(content_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Filter content using global filter instance"""
    return global_content_filter.filter_content_list(content_items)


def get_trending_content(content_items: List[Dict[str, Any]], limit: int = 20) -> List[Dict[str, Any]]:
    """Get trending content using global filter"""
    return global_content_filter.get_trending_content(content_items, limit)


def get_content_filter_stats() -> Dict[str, Any]:
    """Get content filtering statistics"""
    return global_content_filter.get_filter_stats()
"""
Content filtering system for excluding unwanted content types.
Inspired by the content filtering features from fw2.js.
"""

import re
from typing import Dict, List, Set, Optional, Any
from dataclasses import dataclass
from enum import Enum
import logging


class ContentType(Enum):
    """Content types for filtering"""
    MOVIE = "movie"
    TV_SERIES = "tv"
    ANIME = "anime"
    DOCUMENTARY = "documentary"
    VARIETY_SHOW = "variety"
    TALK_SHOW = "talk"
    NEWS = "news"
    REALITY_TV = "reality"
    SHORT_DRAMA = "short_drama"
    ADULT = "adult"
    UNKNOWN = "unknown"


@dataclass
class FilterRule:
    """Content filtering rule"""
    name: str
    content_types: Set[ContentType]
    keywords: Set[str]
    genre_ids: Set[int]
    min_rating: float = 0.0
    max_rating: float = 10.0
    min_vote_count: int = 0
    exclude: bool = True  # True to exclude, False to include only
    priority: int = 1  # Higher priority rules are applied first


class ContentFilter:
    """
    Advanced content filtering system.
    Similar to the content filtering features in fw2.js.
    """
    
    def __init__(self):
        self.rules: List[FilterRule] = []
        self.logger = logging.getLogger(self.__class__.__name__)
        self._setup_default_rules()
    
    def _setup_default_rules(self):
        """Setup default filtering rules."""
        
        # Rule 1: Exclude variety shows and talk shows
        variety_keywords = {
            '综艺', '脱口秀', '真人秀', '选秀', '访谈', '晚会', '颁奖', '演唱会',
            'variety', 'talk show', 'reality', 'competition', 'award', 'concert',
            'live', 'special', '特别节目', '直播', '现场', '演出'
        }
        
        self.add_rule(FilterRule(
            name="exclude_variety_shows",
            content_types={ContentType.VARIETY_SHOW, ContentType.TALK_SHOW, ContentType.REALITY_TV},
            keywords=variety_keywords,
            genre_ids={10764, 10767},  # TMDB: Reality, Talk Show
            exclude=True,
            priority=10
        ))
        
        # Rule 2: Exclude news and documentary (optional)
        news_keywords = {
            '新闻', '报道', '纪录片', '记录片', 'news', 'documentary', 'report',
            '时事', '访问', '专访', '采访'
        }
        
        self.add_rule(FilterRule(
            name="exclude_news_docs",
            content_types={ContentType.NEWS, ContentType.DOCUMENTARY},
            keywords=news_keywords,
            genre_ids={99},  # TMDB: Documentary
            exclude=True,
            priority=8
        ))
        
        # Rule 3: Exclude short dramas (less than 30 minutes, few episodes)
        short_drama_keywords = {
            '微剧', '短剧', '网剧', '迷你剧', 'web series', 'mini series',
            '小品', '短片', 'short film', 'webisode'
        }
        
        self.add_rule(FilterRule(
            name="exclude_short_dramas",
            content_types={ContentType.SHORT_DRAMA},
            keywords=short_drama_keywords,
            genre_ids=set(),
            exclude=True,
            priority=7
        ))
        
        # Rule 4: Exclude adult content
        adult_keywords = {
            '成人', '色情', '限制级', '18+', 'adult', 'erotic', 'porn',
            'xxx', 'mature', 'explicit', '情色', '写真'
        }
        
        self.add_rule(FilterRule(
            name="exclude_adult_content",
            content_types={ContentType.ADULT},
            keywords=adult_keywords,
            genre_ids=set(),
            exclude=True,
            priority=15
        ))
        
        # Rule 5: Minimum quality filter
        self.add_rule(FilterRule(
            name="minimum_quality",
            content_types=set(),
            keywords=set(),
            genre_ids=set(),
            min_rating=4.0,
            min_vote_count=10,
            exclude=True,
            priority=5
        ))
    
    def add_rule(self, rule: FilterRule):
        """Add a filtering rule."""
        self.rules.append(rule)
        # Sort rules by priority (higher first)
        self.rules.sort(key=lambda r: r.priority, reverse=True)
    
    def remove_rule(self, rule_name: str) -> bool:
        """Remove a filtering rule by name."""
        for i, rule in enumerate(self.rules):
            if rule.name == rule_name:
                del self.rules[i]
                return True
        return False
    
    def _detect_content_type(self, item: Dict[str, Any]) -> ContentType:
        """Detect content type from TMDB item."""
        media_type = item.get('media_type', item.get('type', 'unknown'))
        title = item.get('title', item.get('name', '')).lower()
        overview = item.get('overview', '').lower()
        genre_ids = item.get('genre_ids', [])
        
        # Check for explicit content type markers
        if media_type == 'movie':
            # Check for documentary
            if 99 in genre_ids or any(word in title + overview for word in ['documentary', '纪录片', '记录片']):
                return ContentType.DOCUMENTARY
            return ContentType.MOVIE
        
        elif media_type == 'tv':
            # Check for anime
            if (16 in genre_ids and  # Animation genre
                any(country in item.get('origin_country', []) for country in ['JP', 'CN', 'KR'])):
                return ContentType.ANIME
            
            # Check for variety shows
            if (10764 in genre_ids or 10767 in genre_ids or  # Reality, Talk Show
                any(word in title + overview for word in ['综艺', '脱口秀', '真人秀', 'variety', 'talk show', 'reality'])):
                return ContentType.VARIETY_SHOW
            
            # Check for news
            if (10763 in genre_ids or  # News
                any(word in title + overview for word in ['新闻', '报道', 'news', 'report'])):
                return ContentType.NEWS
            
            # Check for short drama (based on episode count and runtime)
            episode_count = item.get('number_of_episodes', 0)
            runtime = item.get('episode_run_time', [0])
            avg_runtime = sum(runtime) / len(runtime) if runtime else 0
            
            if episode_count > 0 and episode_count <= 12 and avg_runtime < 30:
                return ContentType.SHORT_DRAMA
            
            return ContentType.TV_SERIES
        
        return ContentType.UNKNOWN
    
    def _matches_keywords(self, item: Dict[str, Any], keywords: Set[str]) -> bool:
        """Check if item matches any of the keywords."""
        if not keywords:
            return False
        
        searchable_text = ' '.join([
            item.get('title', ''),
            item.get('name', ''),
            item.get('overview', ''),
            item.get('tagline', '')
        ]).lower()
        
        return any(keyword.lower() in searchable_text for keyword in keywords)
    
    def _matches_genres(self, item: Dict[str, Any], genre_ids: Set[int]) -> bool:
        """Check if item matches any of the genre IDs."""
        if not genre_ids:
            return False
        
        item_genres = set(item.get('genre_ids', []))
        return bool(item_genres.intersection(genre_ids))
    
    def _matches_rating(self, item: Dict[str, Any], min_rating: float, max_rating: float) -> bool:
        """Check if item's rating is within the specified range."""
        rating = item.get('vote_average', 0.0)
        return min_rating <= rating <= max_rating
    
    def _matches_vote_count(self, item: Dict[str, Any], min_vote_count: int) -> bool:
        """Check if item has minimum vote count."""
        vote_count = item.get('vote_count', 0)
        return vote_count >= min_vote_count
    
    def should_exclude(self, item: Dict[str, Any]) -> bool:
        """
        Determine if an item should be excluded based on filtering rules.
        
        Args:
            item: TMDB item dictionary
            
        Returns:
            True if item should be excluded, False otherwise
        """
        content_type = self._detect_content_type(item)
        
        for rule in self.rules:
            # Check content type match
            type_match = not rule.content_types or content_type in rule.content_types
            
            # Check keyword match
            keyword_match = self._matches_keywords(item, rule.keywords)
            
            # Check genre match
            genre_match = self._matches_genres(item, rule.genre_ids)
            
            # Check rating range
            rating_match = not self._matches_rating(item, rule.min_rating, rule.max_rating)
            
            # Check vote count
            vote_count_match = not self._matches_vote_count(item, rule.min_vote_count)
            
            # Determine if rule matches
            rule_matches = type_match or keyword_match or genre_match or rating_match or vote_count_match
            
            if rule_matches and rule.exclude:
                self.logger.debug(f"Excluding item '{item.get('title', item.get('name', 'Unknown'))}' due to rule '{rule.name}'")
                return True
            elif rule_matches and not rule.exclude:
                # Include-only rule matched, don't exclude
                return False
        
        # No exclusion rules matched
        return False
    
    def filter_items(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Filter a list of items, removing those that should be excluded.
        
        Args:
            items: List of TMDB items
            
        Returns:
            Filtered list of items
        """
        filtered_items = []
        excluded_count = 0
        
        for item in items:
            if not self.should_exclude(item):
                filtered_items.append(item)
            else:
                excluded_count += 1
        
        self.logger.info(f"Filtered {len(items)} items: {len(filtered_items)} kept, {excluded_count} excluded")
        return filtered_items
    
    def get_filter_stats(self, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Get detailed filtering statistics for a list of items.
        
        Args:
            items: List of TMDB items
            
        Returns:
            Dictionary with filtering statistics
        """
        stats = {
            'total_items': len(items),
            'excluded_items': 0,
            'kept_items': 0,
            'exclusion_reasons': {},
            'content_type_distribution': {}
        }
        
        for item in items:
            content_type = self._detect_content_type(item)
            
            # Update content type distribution
            if content_type.value not in stats['content_type_distribution']:
                stats['content_type_distribution'][content_type.value] = 0
            stats['content_type_distribution'][content_type.value] += 1
            
            # Check exclusion
            excluded = False
            for rule in self.rules:
                type_match = not rule.content_types or content_type in rule.content_types
                keyword_match = self._matches_keywords(item, rule.keywords)
                genre_match = self._matches_genres(item, rule.genre_ids)
                rating_match = not self._matches_rating(item, rule.min_rating, rule.max_rating)
                vote_count_match = not self._matches_vote_count(item, rule.min_vote_count)
                
                rule_matches = type_match or keyword_match or genre_match or rating_match or vote_count_match
                
                if rule_matches and rule.exclude:
                    if rule.name not in stats['exclusion_reasons']:
                        stats['exclusion_reasons'][rule.name] = 0
                    stats['exclusion_reasons'][rule.name] += 1
                    excluded = True
                    break
            
            if excluded:
                stats['excluded_items'] += 1
            else:
                stats['kept_items'] += 1
        
        return stats


class ChineseContentOptimizer:
    """
    Optimizer for Chinese content preferences.
    Similar to the Chinese optimization features in fw2.js.
    """
    
    def __init__(self):
        self.chinese_regions = {'CN', 'HK', 'TW', 'SG'}
        self.preferred_languages = ['zh-CN', 'zh-HK', 'zh-TW', 'zh']
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def prioritize_chinese_content(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Prioritize Chinese content in the results.
        
        Args:
            items: List of TMDB items
            
        Returns:
            Reordered list with Chinese content prioritized
        """
        chinese_items = []
        other_items = []
        
        for item in items:
            if self._is_chinese_content(item):
                chinese_items.append(item)
            else:
                other_items.append(item)
        
        # Sort Chinese content by popularity within group
        chinese_items.sort(key=lambda x: x.get('popularity', 0), reverse=True)
        other_items.sort(key=lambda x: x.get('popularity', 0), reverse=True)
        
        return chinese_items + other_items
    
    def _is_chinese_content(self, item: Dict[str, Any]) -> bool:
        """Check if content is Chinese."""
        # Check origin country
        origin_countries = item.get('origin_country', [])
        if any(country in self.chinese_regions for country in origin_countries):
            return True
        
        # Check original language
        original_language = item.get('original_language', '')
        if original_language in self.preferred_languages:
            return True
        
        # Check production countries
        production_countries = item.get('production_countries', [])
        for country in production_countries:
            if country.get('iso_3166_1') in self.chinese_regions:
                return True
        
        return False
    
    def enhance_chinese_metadata(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """
        Enhance metadata for Chinese content with localized information.
        
        Args:
            item: TMDB item dictionary
            
        Returns:
            Enhanced item with Chinese metadata
        """
        enhanced_item = item.copy()
        
        # Prioritize Chinese title if available
        if 'translations' in item:
            translations = item['translations'].get('translations', [])
            for translation in translations:
                if translation.get('iso_639_1') in ['zh', 'cn']:
                    chinese_data = translation.get('data', {})
                    if chinese_data.get('title'):
                        enhanced_item['chinese_title'] = chinese_data['title']
                    if chinese_data.get('overview'):
                        enhanced_item['chinese_overview'] = chinese_data['overview']
                    break
        
        # Add Chinese region flag
        enhanced_item['is_chinese_content'] = self._is_chinese_content(item)
        
        return enhanced_item


# Global instances
default_content_filter = ContentFilter()
chinese_optimizer = ChineseContentOptimizer()
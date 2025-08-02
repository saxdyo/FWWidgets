import os
from dotenv import load_dotenv

load_dotenv()

# TMDB API配置
TMDB_API_KEY = os.getenv('TMDB_API_KEY')
TMDB_BASE_URL = 'https://api.themoviedb.org/3'
TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

# 图片配置
IMAGES_DIR = 'movie_backgrounds'
DATA_DIR = 'data'
LOGS_DIR = 'logs'
MAX_IMAGES_PER_BATCH = 50

# Git配置
GIT_COMMIT_MESSAGE_TEMPLATE = "Update movie backgrounds - {date}"
GIT_BRANCH = 'main'

# 更新频率配置
UPDATE_SCHEDULE = {
    'hour': 6,
    'minute': 0
}

# === 高级优化配置 (基于fw2.js优化) ===

# 缓存配置
CACHE_CONFIG = {
    'TTL_SECONDS': 1800,  # 30分钟TTL
    'MAX_SIZE': 1000,     # LRU缓存最大条目数
    'CLEANUP_INTERVAL': 300,  # 5分钟清理间隔
    'TRENDING_CACHE_TTL': 3600,  # 热门内容缓存1小时
    'GENRES_CACHE_TTL': 86400,   # 类型数据缓存24小时
    'IMAGES_CACHE_TTL': 7200     # 图片缓存2小时
}

# 网络配置
NETWORK_CONFIG = {
    'TIMEOUT': 30,
    'MAX_RETRIES': 3,
    'RETRY_DELAY': 1,
    'EXPONENTIAL_BACKOFF': True,
    'MAX_CONCURRENT_REQUESTS': 5,
    'RATE_LIMIT_DELAY': 0.2,  # 200ms between requests
    'USER_AGENTS': [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    ]
}

# CDN配置 (多源优化)
CDN_CONFIG = {
    'PRIMARY_SOURCES': [
        'https://image.tmdb.org/t/p/',
        'https://www.themoviedb.org/t/p/'
    ],
    'FALLBACK_SOURCES': [
        'https://themoviedb.org/t/p/',
        'https://api.themoviedb.org/t/p/'
    ],
    'CHINA_OPTIMIZED_SOURCES': [
        # 可以添加中国优化的CDN源
    ],
    'SOURCE_HEALTH_CHECK_INTERVAL': 3600  # 1小时检查一次源健康状态
}

# 图片优化配置
IMAGE_CONFIG = {
    'SIZES': {
        'thumbnail': 'w185',
        'small': 'w342',
        'medium': 'w500',
        'large': 'w780',
        'original': 'original'
    },
    'QUALITY_SETTINGS': {
        'high': {'quality': 95, 'optimize': True},
        'medium': {'quality': 85, 'optimize': True},
        'low': {'quality': 70, 'optimize': True}
    },
    'COMPRESSION_ENABLED': True,
    'PROGRESSIVE_JPEG': True,
    'MAX_FILE_SIZE_MB': 10,
    'THUMBNAIL_SIZE': (300, 450),
    'OVERLAY_SETTINGS': {
        'font_size': 24,
        'font_color': (255, 255, 255),
        'shadow_color': (0, 0, 0),
        'background_opacity': 0.7
    }
}

# 内容过滤配置
CONTENT_FILTER = {
    'EXCLUDE_GENRES': [
        'talk_show',      # 脱口秀
        'reality_show',   # 真人秀
        'variety_show'    # 综艺节目
    ],
    'EXCLUDE_KEYWORDS': [
        '短剧', '小品', '相声', '脱口秀',
        'variety', 'talk show', 'reality'
    ],
    'MIN_VOTE_COUNT': 50,
    'MIN_RATING': 0.0,
    'ADULT_CONTENT': False,
    'EXCLUDE_SHORT_DURATION': True,  # 排除时长过短内容
    'MIN_DURATION_MINUTES': 20
}

# 数据健康检查配置
DATA_HEALTH_CONFIG = {
    'CHECK_INTERVAL_HOURS': 24,
    'MIN_SUCCESSFUL_DOWNLOADS': 10,
    'MAX_ERROR_RATE': 0.2,  # 20%错误率阈值
    'AUTO_RECOVERY_ENABLED': True,
    'BACKUP_RETENTION_DAYS': 7,
    'INTEGRITY_CHECK_ENABLED': True
}

# 日志配置
LOGGING_CONFIG = {
    'LEVEL': 'INFO',
    'FORMAT': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'MAX_FILE_SIZE_MB': 10,
    'BACKUP_COUNT': 5,
    'PERFORMANCE_TIMING': True,
    'REQUEST_LOGGING': True
}

# 国际化配置
I18N_CONFIG = {
    'DEFAULT_LANGUAGE': 'zh-CN',
    'FALLBACK_LANGUAGE': 'en-US',
    'TITLE_PRIORITY': ['zh-CN', 'zh', 'en'],
    'DESCRIPTION_PRIORITY': ['zh-CN', 'zh', 'en']
}

# 性能监控配置
PERFORMANCE_CONFIG = {
    'ENABLE_METRICS': True,
    'TRACK_DOWNLOAD_SPEED': True,
    'TRACK_API_RESPONSE_TIME': True,
    'TRACK_CACHE_HIT_RATE': True,
    'METRICS_RETENTION_DAYS': 30
}

# 请求配置 (保持向后兼容)
REQUEST_TIMEOUT = NETWORK_CONFIG['TIMEOUT']
REQUEST_DELAY = NETWORK_CONFIG['RATE_LIMIT_DELAY']

# JavaScript小组件数据格式配置
WIDGET_DATA_FORMAT = {
    "trending_filename": "TMDB_Trending.json",
    "popular_filename": "TMDB_Popular.json",
    "top_rated_filename": "TMDB_Top_Rated.json",
    "export_format": "json",
    "include_metadata": True,
    "include_images": True
}

# JavaScript小组件兼容的数据字段映射
WIDGET_ITEM_MAPPING = {
    "id": "id",
    "type": "tmdb",
    "title": "title",  # 电影用title，电视剧用name
    "genreTitle": "genre_names",
    "rating": "vote_average",
    "description": "overview",
    "releaseDate": "release_date",  # 电影用release_date，电视剧用first_air_date
    "posterPath": "poster_url",
    "coverUrl": "poster_url",
    "backdropPath": "backdrop_url",
    "titlePosterPath": "title_poster_url",  # 新增：有片名的背景图
    "mediaType": "media_type",
    "popularity": "popularity",
    "voteCount": "vote_count"
}
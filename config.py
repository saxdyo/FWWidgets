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
MAX_IMAGES_PER_BATCH = 50

# Git配置
GIT_COMMIT_MESSAGE_TEMPLATE = "Update movie backgrounds - {date}"
GIT_BRANCH = 'main'

# 更新频率配置
UPDATE_SCHEDULE = {
    'hour': 6,
    'minute': 0
}

# 请求配置
REQUEST_TIMEOUT = 30
REQUEST_DELAY = 1  # 秒，避免API限制

# JavaScript小组件数据格式配置
WIDGET_DATA_FORMAT = {
    "trending_filename": "TMDB_Trending.json",
    "popular_filename": "TMDB_Popular.json",
    "top_rated_filename": "TMDB_TopRated.json",
    "max_items_per_category": 20,
    "include_title_posters": True,  # 是否生成有片名的背景图
    "title_poster_config": {
        "enable_overlay": True,
        "font_size": 48,
        "font_color": "white",
        "shadow_color": "black",
        "shadow_offset": (2, 2),
        "title_position": "bottom_left",  # bottom_left, bottom_center, center
        "include_rating": True,
        "include_year": True,
        "overlay_opacity": 0.7,
        "min_backdrop_width": 1280
    }
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
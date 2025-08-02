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
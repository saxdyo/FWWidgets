import os
import json
import requests
from datetime import datetime, timezone, timedelta
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
SAVE_PATH = os.path.join(os.getcwd(), "data", "TMDB_Trending_with_logos.json")

class LogoBackdropCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def get_platform_logos(self):
        """获取平台logo的静态映射"""
        return {
            "netflix": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                "backdrop": "https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be6b-4c47-b8c8-0f9c4a2c0c0a/4c1c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c/Netflix_Logo_RGB.png"
            },
            "disney": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
                "backdrop": "https://www.disney.com/static/app/images/disney-plus-logo.png"
            },
            "hbo": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
                "backdrop": "https://www.hbo.com/static/app/images/hbo-logo.png"
            },
            "amazon": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/2/27/Amazon_Prime_Video_logo.svg",
                "backdrop": "https://www.amazon.com/static/app/images/prime-video-logo.png"
            },
            "hulu": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
                "backdrop": "https://www.hulu.com/static/app/images/hulu-logo.png"
            },
            "apple": {
                "logo": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Apple_TV_Plus_logo.svg",
                "backdrop": "https://www.apple.com/static/app/images/apple-tv-plus-logo.png"
            }
        }
    
    def detect_platform_from_title(self, title, overview=""):
        """从标题和简介中检测平台"""
        title_lower = title.lower()
        overview_lower = overview.lower()
        
        platform_keywords = {
            "netflix": ["netflix", "netflix original", "netflix series"],
            "disney": ["disney", "disney+", "disney plus", "marvel", "star wars"],
            "hbo": ["hbo", "hbo max", "warner bros"],
            "amazon": ["amazon", "prime video", "amazon original"],
            "hulu": ["hulu", "hulu original"],
            "apple": ["apple tv", "apple tv+", "apple original"]
        }
        
        for platform, keywords in platform_keywords.items():
            for keyword in keywords:
                if keyword in title_lower or keyword in overview_lower:
                    return platform
        
        return None

def fetch_tmdb_data(time_window="day", media_type="all"):
    if not TMDB_API_KEY:
        return {"results": []}

    endpoint = f"/trending/all/{time_window}" if media_type == "all" else f"/trending/{media_type}/{time_window}"
    url = f"{BASE_URL}{endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}

    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

def fetch_popular_movies():  
    if not TMDB_API_KEY:
        return {"results": []}
    
    endpoint = "/movie/popular"
    url = f"{BASE_URL}{endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "zh-CN",
        "region": "CN",
        "page": 1
    }
    
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()
    data["results"] = data["results"][:15]
    return data

def get_media_details(media_type, media_id):
    if not TMDB_API_KEY:
        return {"genres": []}
    
    detail_endpoint = f"/{media_type}/{media_id}"
    url = f"{BASE_URL}{detail_endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}
    
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    return response.json()

def get_media_images(media_type, media_id):
    images_endpoint = f"/{media_type}/{media_id}/images"
    url = f"{BASE_URL}{images_endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "include_image_language": "zh,en,null"
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_image_url(path, size="original"):
    return f"https://image.tmdb.org/t/p/{size}{path}"

def get_best_title_backdrop(image_data):
    backdrops = image_data.get("backdrops", [])
    
    def get_priority_score(backdrop):
        lang = backdrop.get("iso_639_1")
        if lang == "zh":
            lang_score = 0
        elif lang == "en":
            lang_score = 1
        elif lang is None:
            lang_score = 2
        else:
            lang_score = 3
        
        vote_avg = -backdrop.get("vote_average", 0)
        width = backdrop.get("width", 0)
        height = backdrop.get("height", 0)
        resolution = -(width * height)
        
        return (lang_score, vote_avg, resolution)
    
    if not backdrops:
        return ""
    
    sorted_backdrops = sorted(backdrops, key=get_priority_score)
    best_backdrop = sorted_backdrops[0]
    return get_image_url(best_backdrop["file_path"])

def process_tmdb_data_with_logos(data, time_window, media_type, logo_crawler):
    results = []
    platform_logos = logo_crawler.get_platform_logos()
    
    for item in data.get("results", []):
        title = item.get("title") or item.get("name")
        item_type = media_type if media_type != "all" else item.get("media_type")
        
        if item_type == "tv":
            release_date = item.get("first_air_date")
        else:
            release_date = item.get("release_date")
        
        overview = item.get("overview")
        rating = round(item.get("vote_average"), 1)
        media_id = item.get("id")

        poster_url = get_image_url(item.get("poster_path"))

        detail_data = get_media_details(item_type, media_id)
        genres = detail_data.get("genres", [])
        genre_title = "•".join([g["name"] for g in genres[:3]])

        image_data = get_media_images(item_type, media_id)
        title_backdrop_url = get_best_title_backdrop(image_data)

        if item_type == "person":
            continue
            
        if (rating == 0 and 
            not release_date and 
            not overview and 
            "None" in poster_url):
            continue

        # 检测平台并添加logo信息
        detected_platform = logo_crawler.detect_platform_from_title(title, overview)
        platform_logo_url = ""
        platform_backdrop_url = ""
        
        if detected_platform and detected_platform in platform_logos:
            platform_logo_url = platform_logos[detected_platform]["logo"]
            platform_backdrop_url = platform_logos[detected_platform]["backdrop"]

        results.append({
            "id": media_id,
            "title": title,
            "type": item_type,
            "genreTitle": genre_title,
            "rating": rating,
            "release_date": release_date,
            "overview": overview,
            "poster_url": poster_url,
            "title_backdrop": title_backdrop_url,
            "platform": detected_platform,
            "platform_logo": platform_logo_url,
            "platform_backdrop": platform_backdrop_url
        })
    
    return results

def save_to_json(data, filepath):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def print_trending_results(results, section_title):
    print("")
    print(f"================= {section_title}  =================")
    
    for i, item in enumerate(results, 1):
        title = item.get("title")
        item_type = item.get("type")
        rating = item.get("rating")
        genre_title = item.get("genreTitle")
        platform = item.get("platform", "未知")
        
        print(f"{i:2d}. {title} ({item_type}) 评分: {rating} | {genre_title} | 平台: {platform}")

def main():
    print("=== 开始执行TMDB数据获取（含Logo） ===")
    
    logo_crawler = LogoBackdropCrawler()
    
    if not TMDB_API_KEY:
        beijing_timezone = timezone(timedelta(hours=8))
        beijing_now = datetime.now(beijing_timezone)
        last_updated = beijing_now.strftime("%Y-%m-%d %H:%M:%S")
        
        print(f"✅ 热门数据获取时间: {last_updated}")
        
        data_to_save = {
            "last_updated": last_updated,
            "today_global": [],
            "week_global_all": [],
            "popular_movies": []
        }
        save_to_json(data_to_save, SAVE_PATH)
        print("")
        print("================= 执行完成 =================")
        print("get_tmdb_data_with_logos.py 运行完成")
        return

    today_global = fetch_tmdb_data(time_window="day", media_type="all")
    today_processed = process_tmdb_data_with_logos(today_global, "day", "all", logo_crawler)

    week_global_all = fetch_tmdb_data(time_window="week", media_type="all")
    week_processed = process_tmdb_data_with_logos(week_global_all, "week", "all", logo_crawler)

    popular_movies = fetch_popular_movies()
    popular_processed = process_tmdb_data_with_logos(popular_movies, "popular", "movie", logo_crawler)

    beijing_timezone = timezone(timedelta(hours=8))
    beijing_now = datetime.now(beijing_timezone)
    last_updated = beijing_now.strftime("%Y-%m-%d %H:%M:%S")

    print(f"✅ 热门数据获取时间: {last_updated}")

    print_trending_results(today_processed, "今日热门")
    print_trending_results(week_processed, "本周热门")
    
    if popular_processed:
        print_trending_results(popular_processed, "热门电影")

    data_to_save = {
        "last_updated": last_updated,
        "today_global": today_processed,
        "week_global_all": week_processed,
        "popular_movies": popular_processed
    }

    save_to_json(data_to_save, SAVE_PATH)
    
    print("")
    print("================= 执行完成 =================")

if __name__ == "__main__":
    main()
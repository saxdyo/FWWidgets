import os
import json
import requests
from datetime import datetime, timezone, timedelta
import pytz
from bs4 import BeautifulSoup
import time
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 配置
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
SAVE_PATH = os.path.join(os.getcwd(), "data", "TMDB_Trending.json")

# 使用pytz处理时区
BEIJING_TZ = pytz.timezone('Asia/Shanghai')

def safe_request(url, params=None, timeout=10, max_retries=3):
    """带重试机制的安全请求函数"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.warning(f"请求失败 (尝试 {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # 指数退避
            else:
                logger.error(f"所有重试失败: {url}")
                raise

def fetch_tmdb_data(time_window="day", media_type="all"):
    """获取TMDB热门数据"""
    if not TMDB_API_KEY:
        logger.warning("TMDB_API_KEY未设置")
        return {"results": []}

    endpoint = f"/trending/all/{time_window}" if media_type == "all" else f"/trending/{media_type}/{time_window}"
    url = f"{BASE_URL}{endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}

    return safe_request(url, params)

def fetch_popular_movies():  
    """获取热门电影"""
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
    
    data = safe_request(url, params)
    data["results"] = data["results"][:15]  # 限制返回15个
    return data

def fetch_top_rated_content(media_type="movie"):
    """获取高分内容"""
    if not TMDB_API_KEY:
        return {"results": []}
    
    endpoint = f"/{media_type}/top_rated"
    url = f"{BASE_URL}{endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "language": "zh-CN",
        "page": 1
    }
    
    data = safe_request(url, params)
    data["results"] = data["results"][:10]  # 限制返回10个
    return data

def get_media_details(media_type, media_id):
    """获取媒体详细信息"""
    if not TMDB_API_KEY:
        return {"genres": []}
    
    detail_endpoint = f"/{media_type}/{media_id}"
    url = f"{BASE_URL}{detail_endpoint}"
    params = {"api_key": TMDB_API_KEY, "language": "zh-CN"}
    
    return safe_request(url, params)

def get_media_images(media_type, media_id):
    """获取媒体图片信息"""
    images_endpoint = f"/{media_type}/{media_id}/images"
    url = f"{BASE_URL}{images_endpoint}"
    params = {
        "api_key": TMDB_API_KEY,
        "include_image_language": "zh,en,null"
    }
    return safe_request(url, params)

def get_image_url(path, size="original"):
    """构建图片URL"""
    if not path:
        return None
    return f"https://image.tmdb.org/t/p/{size}{path}"

def get_best_title_backdrop(image_data):
    """智能选择最佳背景图"""
    backdrops = image_data.get("backdrops", [])
    
    if not backdrops:
        return None
    
    def get_priority_score(backdrop):
        # 语言优先级：中文 > 英文 > 无语言 > 其他
        lang = backdrop.get("iso_639_1")
        if lang == "zh":
            lang_score = 0
        elif lang == "en":
            lang_score = 1
        elif lang is None:
            lang_score = 2
        else:
            lang_score = 3
        
        # 评分（取负值用于升序排列）
        vote_avg = -backdrop.get("vote_average", 0)
        
        # 分辨率（取负值用于升序排列）
        width = backdrop.get("width", 0)
        height = backdrop.get("height", 0)
        resolution = -(width * height)
        
        return (lang_score, vote_avg, resolution)
    
    sorted_backdrops = sorted(backdrops, key=get_priority_score)
    best_backdrop = sorted_backdrops[0]
    return get_image_url(best_backdrop["file_path"])

def generate_title_backdrop_url(item, item_type, backdrop_path):
    """生成带标题的背景图URL，使用可用的OG图片服务"""
    if not backdrop_path:
        return None
        
    title = item.get("title") or item.get("name", "")
    release_date = item.get("release_date") or item.get("first_air_date", "")
    rating = item.get("vote_average", 0)
    
    # 提取年份
    year = ""
    if release_date:
        try:
            year = release_date.split("-")[0]
        except:
            year = ""
    
    # 如果缺少必要信息，返回原始背景图
    if not title or not year:
        return get_image_url(backdrop_path, "w1280")
    
    # 构建标题背景图URL，使用可用的OG服务
    try:
        from urllib.parse import quote
        
        # 构建副标题
        subtitle = f"{year} • ⭐ {rating:.1f} • {item_type}"
        
        # 暂时不生成带标题背景图，避免404错误
        # 直接返回原始背景图
        logger.info(f"🔄 跳过标题背景图生成，使用原始背景图: {title}")
        return get_image_url(backdrop_path, "w1280")
        
    except Exception as e:
        logger.error(f"生成标题背景图失败: {e}")
        # 如果生成失败，返回原始背景图
        return get_image_url(backdrop_path, "w1280")

def enhance_with_external_data(item, item_type):
    """使用BeautifulSoup增强数据（可选功能）"""
    # 这是一个扩展功能示例，可以爬取额外信息
    # 当前返回原数据，未来可以添加更多数据源
    return item

def process_tmdb_data(data, time_window, media_type, section_name=""):
    """处理TMDB数据"""
    results = []
    logger.info(f"开始处理{section_name}数据，原始数据量: {len(data.get('results', []))}")
    
    for item in data.get("results", []):
        try:
            title = item.get("title") or item.get("name")
            item_type = media_type if media_type != "all" else item.get("media_type")
            
            # 跳过人物类型
            if item_type == "person":
                continue
            
            # 获取发布日期
            if item_type == "tv":
                release_date = item.get("first_air_date")
            else:
                release_date = item.get("release_date")
            
            overview = item.get("overview", "")
            rating = round(item.get("vote_average", 0), 1)
            media_id = item.get("id")
            popularity = item.get("popularity", 0)
            vote_count = item.get("vote_count", 0)

            # 获取海报URL
            poster_url = get_image_url(item.get("poster_path"))

            # 获取详细信息和类型
            try:
                detail_data = get_media_details(item_type, media_id)
                genres = detail_data.get("genres", [])
                genre_title = "•".join([g["name"] for g in genres[:3]])
            except Exception as e:
                logger.warning(f"获取详细信息失败 {title}: {e}")
                genre_title = ""

            # 生成带标题的背景图
            try:
                # 优先使用我们的标题背景图生成服务
                if item.get("backdrop_path"):
                    title_backdrop_url = generate_title_backdrop_url(item, item_type, item.get("backdrop_path"))
                else:
                    # 如果没有backdrop_path，尝试获取图片数据
                    image_data = get_media_images(item_type, media_id)
                    best_backdrop = get_best_title_backdrop(image_data)
                    if best_backdrop:
                        # 从最佳背景图提取路径并生成标题背景图
                        backdrop_path = best_backdrop.replace("https://image.tmdb.org/t/p/original", "")
                        title_backdrop_url = generate_title_backdrop_url(item, item_type, backdrop_path)
                    else:
                        title_backdrop_url = None
                    
            except Exception as e:
                logger.warning(f"生成标题背景图失败 {title}: {e}")
                # 回退到原始背景图
                title_backdrop_url = get_image_url(item.get("backdrop_path")) if item.get("backdrop_path") else None

            # 数据质量检查
            if (rating == 0 and 
                not release_date and 
                not overview and 
                not poster_url):
                logger.debug(f"跳过低质量数据: {title}")
                continue

            # 增强数据（可选）
            enhanced_item = enhance_with_external_data(item, item_type)

            result_item = {
                "id": media_id,
                "title": title,
                "type": item_type,
                "genreTitle": genre_title,
                "rating": rating,
                "release_date": release_date,
                "overview": overview,
                "poster_url": poster_url,
                "title_backdrop": title_backdrop_url,
                "popularity": popularity,
                "vote_count": vote_count
            }
            
            results.append(result_item)
            
        except Exception as e:
            logger.error(f"处理项目失败 {item.get('title', 'Unknown')}: {e}")
            continue
    
    logger.info(f"{section_name}数据处理完成，有效数据量: {len(results)}")
    return results

def save_to_json(data, filepath):
    """保存数据到JSON文件"""
    try:
        # 确保目录存在
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"数据已保存到: {filepath}")
    except Exception as e:
        logger.error(f"保存文件失败: {e}")
        raise

def print_trending_results(results, section_title):
    """打印结果摘要"""
    print(f"\n================= {section_title} =================")
    
    for i, item in enumerate(results[:10], 1):  # 只显示前10个
        title = item.get("title", "未知标题")
        item_type = item.get("type", "unknown")
        rating = item.get("rating", 0)
        genre_title = item.get("genreTitle", "")
        
        print(f"{i:2d}. {title} ({item_type}) 评分: {rating} | {genre_title}")
    
    if len(results) > 10:
        print(f"    ... 还有 {len(results) - 10} 个项目")

def get_beijing_time():
    """获取北京时间"""
    return datetime.now(BEIJING_TZ).strftime("%Y-%m-%d %H:%M:%S")

def main():
    """主函数"""
    logger.info("=== 开始执行TMDB数据获取 ===")
    
    if not TMDB_API_KEY:
        logger.warning("TMDB_API_KEY未设置，生成空数据文件")
        
        data_to_save = {
            "last_updated": get_beijing_time(),
            "today_global": [],
            "week_global_all": [],
            "popular_movies": [],
            "top_rated_movies": [],
            "status": "no_api_key"
        }
        save_to_json(data_to_save, SAVE_PATH)
        print("================= 执行完成 =================")
        return

    try:
        # 获取各类数据
        logger.info("开始获取今日热门数据...")
        today_global = fetch_tmdb_data(time_window="day", media_type="all")
        today_processed = process_tmdb_data(today_global, "day", "all", "今日热门")

        logger.info("开始获取本周热门数据...")
        week_global_all = fetch_tmdb_data(time_window="week", media_type="all")
        week_processed = process_tmdb_data(week_global_all, "week", "all", "本周热门")

        logger.info("开始获取热门电影数据...")
        popular_movies = fetch_popular_movies()
        popular_processed = process_tmdb_data(popular_movies, "popular", "movie", "热门电影")

        logger.info("开始获取高分电影数据...")
        top_rated_movies = fetch_top_rated_content("movie")
        top_rated_processed = process_tmdb_data(top_rated_movies, "top_rated", "movie", "高分电影")

        # 获取更新时间
        last_updated = get_beijing_time()
        logger.info(f"数据获取完成，更新时间: {last_updated}")

        # 打印结果摘要
        print_trending_results(today_processed, "今日热门")
        print_trending_results(week_processed, "本周热门")
        print_trending_results(popular_processed, "热门电影")
        print_trending_results(top_rated_processed, "高分电影")

        # 构建最终数据
        data_to_save = {
            "last_updated": last_updated,
            "today_global": today_processed,
            "week_global_all": week_processed,
            "popular_movies": popular_processed,
            "top_rated_movies": top_rated_processed,
            "status": "success",
            "total_items": len(today_processed) + len(week_processed) + len(popular_processed) + len(top_rated_processed)
        }

        # 保存数据
        save_to_json(data_to_save, SAVE_PATH)
        
        logger.info("================= 执行完成 =================")
        print(f"\n✅ 成功获取并保存了 {data_to_save['total_items']} 个项目的数据")

    except Exception as e:
        logger.error(f"执行过程中发生错误: {e}")
        
        # 即使出错也保存一个基本文件
        error_data = {
            "last_updated": get_beijing_time(),
            "today_global": [],
            "week_global_all": [],
            "popular_movies": [],
            "top_rated_movies": [],
            "status": "error",
            "error_message": str(e)
        }
        save_to_json(error_data, SAVE_PATH)
        raise

if __name__ == "__main__":
    main()
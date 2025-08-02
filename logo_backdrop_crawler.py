import os
import json
import requests
import time
from datetime import datetime, timezone, timedelta
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re

class LogoBackdropCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.base_path = os.path.join(os.getcwd(), "data")
        self.logo_data_path = os.path.join(self.base_path, "logo_backdrops.json")
        
    def get_logo_sources(self):
        """获取logo背景图的来源网站"""
        return {
            "netflix": {
                "url": "https://www.netflix.com/",
                "logo_pattern": r"netflix.*logo",
                "backdrop_pattern": r"hero.*image|banner.*image"
            },
            "disney": {
                "url": "https://www.disney.com/",
                "logo_pattern": r"disney.*logo",
                "backdrop_pattern": r"hero.*image|banner.*image"
            },
            "hbo": {
                "url": "https://www.hbo.com/",
                "logo_pattern": r"hbo.*logo",
                "backdrop_pattern": r"hero.*image|banner.*image"
            },
            "amazon": {
                "url": "https://www.amazon.com/",
                "logo_pattern": r"amazon.*logo",
                "backdrop_pattern": r"hero.*image|banner.*image"
            },
            "hulu": {
                "url": "https://www.hulu.com/",
                "logo_pattern": r"hulu.*logo",
                "backdrop_pattern": r"hero.*image|banner.*image"
            }
        }
    
    def crawl_website_logos(self, website_name, website_config):
        """爬取特定网站的logo和背景图"""
        try:
            print(f"正在爬取 {website_name} 的logo和背景图...")
            
            response = self.session.get(website_config["url"], timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 查找logo图片
            logos = []
            logo_pattern = re.compile(website_config["logo_pattern"], re.IGNORECASE)
            
            # 查找所有图片标签
            for img in soup.find_all('img'):
                src = img.get('src', '')
                alt = img.get('alt', '')
                title = img.get('title', '')
                
                # 检查是否是logo
                if (logo_pattern.search(src) or 
                    logo_pattern.search(alt) or 
                    logo_pattern.search(title)):
                    
                    logo_url = urljoin(website_config["url"], src)
                    logos.append({
                        "url": logo_url,
                        "alt": alt,
                        "title": title,
                        "width": img.get('width'),
                        "height": img.get('height')
                    })
            
            # 查找背景图
            backdrops = []
            backdrop_pattern = re.compile(website_config["backdrop_pattern"], re.IGNORECASE)
            
            # 查找CSS背景图
            for style in soup.find_all('style'):
                if style.string:
                    # 查找background-image属性
                    bg_matches = re.findall(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style.string)
                    for bg_url in bg_matches:
                        if backdrop_pattern.search(bg_url):
                            backdrop_url = urljoin(website_config["url"], bg_url)
                            backdrops.append({
                                "url": backdrop_url,
                                "type": "css_background",
                                "source": "style_tag"
                            })
            
            # 查找内联样式中的背景图
            for element in soup.find_all(attrs={'style': True}):
                style = element.get('style', '')
                bg_matches = re.findall(r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)', style)
                for bg_url in bg_matches:
                    if backdrop_pattern.search(bg_url):
                        backdrop_url = urljoin(website_config["url"], bg_url)
                        backdrops.append({
                            "url": backdrop_url,
                            "type": "inline_background",
                            "source": "inline_style"
                        })
            
            return {
                "website": website_name,
                "url": website_config["url"],
                "logos": logos,
                "backdrops": backdrops,
                "crawled_at": datetime.now(timezone(timedelta(hours=8))).isoformat()
            }
            
        except Exception as e:
            print(f"爬取 {website_name} 时出错: {str(e)}")
            return {
                "website": website_name,
                "url": website_config["url"],
                "logos": [],
                "backdrops": [],
                "error": str(e),
                "crawled_at": datetime.now(timezone(timedelta(hours=8))).isoformat()
            }
    
    def crawl_all_logos(self):
        """爬取所有网站的logo和背景图"""
        print("=== 开始爬取logo背景图 ===")
        
        sources = self.get_logo_sources()
        all_results = []
        
        for website_name, website_config in sources.items():
            result = self.crawl_website_logos(website_name, website_config)
            all_results.append(result)
            
            # 添加延迟避免被封
            time.sleep(2)
        
        # 保存结果
        self.save_logo_data(all_results)
        
        # 打印结果
        self.print_results(all_results)
        
        return all_results
    
    def save_logo_data(self, data):
        """保存logo数据到JSON文件"""
        os.makedirs(self.base_path, exist_ok=True)
        
        save_data = {
            "last_updated": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S"),
            "total_websites": len(data),
            "websites": data
        }
        
        with open(self.logo_data_path, "w", encoding="utf-8") as f:
            json.dump(save_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Logo数据已保存到: {self.logo_data_path}")
    
    def print_results(self, results):
        """打印爬取结果"""
        print("\n=== 爬取结果汇总 ===")
        
        for result in results:
            website = result["website"]
            logos_count = len(result["logos"])
            backdrops_count = len(result["backdrops"])
            
            print(f"\n📺 {website.upper()}")
            print(f"   Logo数量: {logos_count}")
            print(f"   背景图数量: {backdrops_count}")
            
            if "error" in result:
                print(f"   ❌ 错误: {result['error']}")
            else:
                print(f"   ✅ 爬取成功")
                
                if logos_count > 0:
                    print(f"   🖼️  Logo示例:")
                    for i, logo in enumerate(result["logos"][:3]):
                        print(f"      {i+1}. {logo['url']}")
                
                if backdrops_count > 0:
                    print(f"   🎨  背景图示例:")
                    for i, backdrop in enumerate(result["backdrops"][:3]):
                        print(f"      {i+1}. {backdrop['url']}")
    
    def load_existing_data(self):
        """加载现有的logo数据"""
        if os.path.exists(self.logo_data_path):
            with open(self.logo_data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return None
    
    def merge_with_tmdb_data(self, tmdb_data_path):
        """将logo数据与TMDB数据合并"""
        if not os.path.exists(tmdb_data_path):
            print(f"❌ TMDB数据文件不存在: {tmdb_data_path}")
            return
        
        # 加载TMDB数据
        with open(tmdb_data_path, "r", encoding="utf-8") as f:
            tmdb_data = json.load(f)
        
        # 加载logo数据
        logo_data = self.load_existing_data()
        if not logo_data:
            print("❌ Logo数据不存在，请先运行爬虫")
            return
        
        # 创建logo映射
        logo_mapping = {}
        for website_data in logo_data.get("websites", []):
            website_name = website_data["website"]
            if website_data.get("logos"):
                logo_mapping[website_name] = website_data["logos"][0]["url"]
            if website_data.get("backdrops"):
                logo_mapping[f"{website_name}_backdrop"] = website_data["backdrops"][0]["url"]
        
        # 为TMDB数据添加logo信息
        for section in ["today_global", "week_global_all", "popular_movies"]:
            if section in tmdb_data:
                for item in tmdb_data[section]:
                    # 根据标题或类型匹配logo
                    title = item.get("title", "").lower()
                    media_type = item.get("type", "")
                    
                    # 简单的logo匹配逻辑
                    if "netflix" in title or media_type == "netflix":
                        item["platform_logo"] = logo_mapping.get("netflix", "")
                        item["platform_backdrop"] = logo_mapping.get("netflix_backdrop", "")
                    elif "disney" in title or media_type == "disney":
                        item["platform_logo"] = logo_mapping.get("disney", "")
                        item["platform_backdrop"] = logo_mapping.get("disney_backdrop", "")
                    elif "hbo" in title or media_type == "hbo":
                        item["platform_logo"] = logo_mapping.get("hbo", "")
                        item["platform_backdrop"] = logo_mapping.get("hbo_backdrop", "")
                    elif "amazon" in title or media_type == "amazon":
                        item["platform_logo"] = logo_mapping.get("amazon", "")
                        item["platform_backdrop"] = logo_mapping.get("amazon_backdrop", "")
                    elif "hulu" in title or media_type == "hulu":
                        item["platform_logo"] = logo_mapping.get("hulu", "")
                        item["platform_backdrop"] = logo_mapping.get("hulu_backdrop", "")
        
        # 保存合并后的数据
        merged_path = os.path.join(self.base_path, "TMDB_Trending_with_logos.json")
        with open(merged_path, "w", encoding="utf-8") as f:
            json.dump(tmdb_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 合并数据已保存到: {merged_path}")

def main():
    crawler = LogoBackdropCrawler()
    
    # 爬取logo和背景图
    results = crawler.crawl_all_logos()
    
    # 合并TMDB数据（如果存在）
    tmdb_data_path = os.path.join(crawler.base_path, "TMDB_Trending.json")
    if os.path.exists(tmdb_data_path):
        print("\n=== 合并TMDB数据 ===")
        crawler.merge_with_tmdb_data(tmdb_data_path)
    
    print("\n=== 爬取完成 ===")

if __name__ == "__main__":
    main()
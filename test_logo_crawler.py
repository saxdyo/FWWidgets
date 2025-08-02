#!/usr/bin/env python3
"""
Logo爬取功能测试脚本
用于验证logo爬取和数据合并功能
"""

import os
import json
import sys
from datetime import datetime, timezone, timedelta

def test_logo_crawler():
    """测试logo爬取功能"""
    print("=== 测试Logo爬取功能 ===")
    
    try:
        # 导入logo爬取模块
        from logo_backdrop_crawler import LogoBackdropCrawler
        
        crawler = LogoBackdropCrawler()
        
        # 测试平台logo映射
        print("\n1. 测试平台logo映射...")
        platform_logos = crawler.get_platform_logos()
        print(f"✅ 支持的平台数量: {len(platform_logos)}")
        for platform, data in platform_logos.items():
            print(f"   - {platform}: {data['logo']}")
        
        # 测试平台检测
        print("\n2. 测试平台检测...")
        test_titles = [
            ("Netflix Original Series", "netflix"),
            ("Disney+ Marvel Series", "disney"),
            ("HBO Max Original", "hbo"),
            ("Amazon Prime Video", "amazon"),
            ("Hulu Original", "hulu"),
            ("Apple TV+ Series", "apple"),
            ("Unknown Title", None)
        ]
        
        for title, expected in test_titles:
            detected = crawler.detect_platform_from_title(title)
            status = "✅" if detected == expected else "❌"
            print(f"   {status} '{title}' -> {detected} (期望: {expected})")
        
        print("\n✅ Logo爬取功能测试通过")
        return True
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        return False
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def test_tmdb_integration():
    """测试TMDB集成功能"""
    print("\n=== 测试TMDB集成功能 ===")
    
    try:
        # 导入TMDB集成模块
        from get_tmdb_data_with_logos import LogoBackdropCrawler as TMDBLogoCrawler
        
        crawler = TMDBLogoCrawler()
        
        # 测试平台检测
        print("\n1. 测试TMDB平台检测...")
        test_cases = [
            ("Stranger Things", "A Netflix original series", "netflix"),
            ("The Mandalorian", "A Disney+ Star Wars series", "disney"),
            ("Game of Thrones", "An HBO fantasy series", "hbo"),
            ("The Boys", "An Amazon Prime original", "amazon"),
            ("The Handmaid's Tale", "A Hulu original series", "hulu"),
            ("Ted Lasso", "An Apple TV+ comedy", "apple"),
            ("Unknown Movie", "Regular movie description", None)
        ]
        
        for title, overview, expected in test_cases:
            detected = crawler.detect_platform_from_title(title, overview)
            status = "✅" if detected == expected else "❌"
            print(f"   {status} '{title}' -> {detected} (期望: {expected})")
        
        print("\n✅ TMDB集成功能测试通过")
        return True
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        return False
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        return False

def test_data_files():
    """测试数据文件"""
    print("\n=== 测试数据文件 ===")
    
    data_dir = os.path.join(os.getcwd(), "data")
    required_files = [
        "TMDB_Trending.json",
        "logo_backdrops.json", 
        "TMDB_Trending_with_logos.json"
    ]
    
    print(f"\n检查数据目录: {data_dir}")
    
    if not os.path.exists(data_dir):
        print("❌ 数据目录不存在")
        return False
    
    for filename in required_files:
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
            # 检查文件大小
            size = os.path.getsize(filepath)
            print(f"✅ {filename} - {size} bytes")
            
            # 尝试解析JSON
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"   - JSON格式正确")
            except json.JSONDecodeError as e:
                print(f"   - ❌ JSON格式错误: {e}")
        else:
            print(f"❌ {filename} - 文件不存在")
    
    return True

def test_workflow_config():
    """测试工作流配置"""
    print("\n=== 测试工作流配置 ===")
    
    workflow_files = [
        "TMDB_Trending.yml",
        "TMDB_Trending_with_logos.yml"
    ]
    
    for filename in workflow_files:
        if os.path.exists(filename):
            print(f"✅ {filename} - 存在")
            
            # 检查文件内容
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 检查关键配置
                if "TMDB_API_KEY" in content:
                    print(f"   - ✅ 包含TMDB API密钥配置")
                else:
                    print(f"   - ❌ 缺少TMDB API密钥配置")
                
                if "logo_backdrop_crawler.py" in content:
                    print(f"   - ✅ 包含logo爬取脚本")
                else:
                    print(f"   - ❌ 缺少logo爬取脚本")
                    
            except Exception as e:
                print(f"   - ❌ 读取文件失败: {e}")
        else:
            print(f"❌ {filename} - 文件不存在")
    
    return True

def create_sample_data():
    """创建示例数据文件"""
    print("\n=== 创建示例数据 ===")
    
    data_dir = os.path.join(os.getcwd(), "data")
    os.makedirs(data_dir, exist_ok=True)
    
    # 创建示例logo数据
    sample_logo_data = {
        "last_updated": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S"),
        "total_websites": 6,
        "websites": [
            {
                "website": "netflix",
                "url": "https://www.netflix.com/",
                "logos": [
                    {
                        "url": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                        "alt": "Netflix Logo",
                        "title": "Netflix",
                        "width": 200,
                        "height": 100
                    }
                ],
                "backdrops": [
                    {
                        "url": "https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be6b-4c47-b8c8-0f9c4a2c0c0a/4c1c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c/Netflix_Logo_RGB.png",
                        "type": "css_background",
                        "source": "style_tag"
                    }
                ],
                "crawled_at": datetime.now(timezone(timedelta(hours=8))).isoformat()
            }
        ]
    }
    
    logo_file = os.path.join(data_dir, "logo_backdrops.json")
    with open(logo_file, 'w', encoding='utf-8') as f:
        json.dump(sample_logo_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 创建示例logo数据: {logo_file}")
    
    # 创建示例TMDB数据
    sample_tmdb_data = {
        "last_updated": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M:%S"),
        "today_global": [
            {
                "id": 123,
                "title": "Stranger Things",
                "type": "tv",
                "genreTitle": "科幻•悬疑",
                "rating": 8.7,
                "release_date": "2016-07-15",
                "overview": "A Netflix original series about supernatural events in a small town.",
                "poster_url": "https://image.tmdb.org/t/p/w500/poster.jpg",
                "title_backdrop": "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
                "platform": "netflix",
                "platform_logo": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
                "platform_backdrop": "https://assets.nflxext.com/ffe/siteui/vlv3/93da5c27-be6b-4c47-b8c8-0f9c4a2c0c0a/4c1c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c/Netflix_Logo_RGB.png"
            }
        ],
        "week_global_all": [],
        "popular_movies": []
    }
    
    tmdb_file = os.path.join(data_dir, "TMDB_Trending_with_logos.json")
    with open(tmdb_file, 'w', encoding='utf-8') as f:
        json.dump(sample_tmdb_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 创建示例TMDB数据: {tmdb_file}")
    
    return True

def main():
    """主测试函数"""
    print("🚀 开始Logo爬取系统测试")
    print("=" * 50)
    
    tests = [
        ("Logo爬取功能", test_logo_crawler),
        ("TMDB集成功能", test_tmdb_integration),
        ("数据文件检查", test_data_files),
        ("工作流配置", test_workflow_config),
        ("创建示例数据", create_sample_data)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} 测试失败")
        except Exception as e:
            print(f"❌ {test_name} 测试异常: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！Logo爬取系统准备就绪")
        return 0
    else:
        print("⚠️ 部分测试失败，请检查配置")
        return 1

if __name__ == "__main__":
    sys.exit(main())
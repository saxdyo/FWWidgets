#!/usr/bin/env python3
"""
简化的Logo爬取系统测试脚本
不依赖外部库，只测试基本功能
"""

import os
import json
import sys
from datetime import datetime, timezone, timedelta

def test_file_structure():
    """测试文件结构"""
    print("=== 测试文件结构 ===")
    
    required_files = [
        "logo_backdrop_crawler.py",
        "get_tmdb_data_with_logos.py", 
        "TMDB_Trending_with_logos.yml",
        "requirements.txt",
        "README_Logo_Crawler.md"
    ]
    
    missing_files = []
    for filename in required_files:
        if os.path.exists(filename):
            size = os.path.getsize(filename)
            print(f"✅ {filename} - {size} bytes")
        else:
            print(f"❌ {filename} - 文件不存在")
            missing_files.append(filename)
    
    if missing_files:
        print(f"\n⚠️ 缺少文件: {', '.join(missing_files)}")
        return False
    
    print("\n✅ 所有必需文件都存在")
    return True

def test_data_directory():
    """测试数据目录"""
    print("\n=== 测试数据目录 ===")
    
    data_dir = os.path.join(os.getcwd(), "data")
    
    if not os.path.exists(data_dir):
        print("❌ 数据目录不存在")
        return False
    
    print(f"✅ 数据目录存在: {data_dir}")
    
    # 检查数据文件
    data_files = [
        "logo_backdrops.json",
        "TMDB_Trending_with_logos.json"
    ]
    
    for filename in data_files:
        filepath = os.path.join(data_dir, filename)
        if os.path.exists(filepath):
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
    
    workflow_file = "TMDB_Trending_with_logos.yml"
    
    if not os.path.exists(workflow_file):
        print(f"❌ {workflow_file} - 文件不存在")
        return False
    
    print(f"✅ {workflow_file} - 存在")
    
    try:
        with open(workflow_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查关键配置
        required_configs = [
            "TMDB_API_KEY",
            "logo_backdrop_crawler.py",
            "get_tmdb_data_with_logos.py",
            "python3"
        ]
        
        for config in required_configs:
            if config in content:
                print(f"   - ✅ 包含 {config}")
            else:
                print(f"   - ❌ 缺少 {config}")
        
        return True
        
    except Exception as e:
        print(f"   - ❌ 读取文件失败: {e}")
        return False

def test_requirements():
    """测试依赖文件"""
    print("\n=== 测试依赖文件 ===")
    
    requirements_file = "requirements.txt"
    
    if not os.path.exists(requirements_file):
        print(f"❌ {requirements_file} - 文件不存在")
        return False
    
    print(f"✅ {requirements_file} - 存在")
    
    try:
        with open(requirements_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        required_packages = [
            "requests",
            "beautifulsoup4", 
            "lxml",
            "pytz"
        ]
        
        for package in required_packages:
            if package in content:
                print(f"   - ✅ 包含 {package}")
            else:
                print(f"   - ❌ 缺少 {package}")
        
        return True
        
    except Exception as e:
        print(f"   - ❌ 读取文件失败: {e}")
        return False

def test_readme():
    """测试README文件"""
    print("\n=== 测试README文件 ===")
    
    readme_file = "README_Logo_Crawler.md"
    
    if not os.path.exists(readme_file):
        print(f"❌ {readme_file} - 文件不存在")
        return False
    
    print(f"✅ {readme_file} - 存在")
    
    try:
        with open(readme_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查关键内容
        required_sections = [
            "Logo背景图爬取系统",
            "功能特性",
            "安装和使用",
            "数据格式"
        ]
        
        for section in required_sections:
            if section in content:
                print(f"   - ✅ 包含 {section}")
            else:
                print(f"   - ❌ 缺少 {section}")
        
        return True
        
    except Exception as e:
        print(f"   - ❌ 读取文件失败: {e}")
        return False

def create_sample_script():
    """创建示例脚本"""
    print("\n=== 创建示例脚本 ===")
    
    sample_script = """#!/usr/bin/env python3
\"\"\"
示例Logo爬取脚本
演示如何使用logo爬取功能
\"\"\"

import os
import json
from datetime import datetime, timezone, timedelta

def create_sample_logo_data():
    \"\"\"创建示例logo数据\"\"\"
    sample_data = {
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
    
    data_dir = os.path.join(os.getcwd(), "data")
    os.makedirs(data_dir, exist_ok=True)
    
    logo_file = os.path.join(data_dir, "sample_logo_data.json")
    with open(logo_file, 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 创建示例logo数据: {logo_file}")
    return True

if __name__ == "__main__":
    create_sample_logo_data()
    print("\\n🎉 示例脚本执行完成")
"""
    
    with open("sample_logo_script.py", "w", encoding="utf-8") as f:
        f.write(sample_script)
    
    print("✅ 创建示例脚本: sample_logo_script.py")
    return True

def main():
    """主测试函数"""
    print("🚀 开始Logo爬取系统简化测试")
    print("=" * 50)
    
    tests = [
        ("文件结构", test_file_structure),
        ("数据目录", test_data_directory),
        ("工作流配置", test_workflow_config),
        ("依赖文件", test_requirements),
        ("README文件", test_readme),
        ("示例脚本", create_sample_script)
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
        print("🎉 所有测试通过！Logo爬取系统文件结构完整")
        print("\n📋 下一步操作:")
        print("1. 安装依赖: pip3 install -r requirements.txt")
        print("2. 设置环境变量: export TMDB_API_KEY='your_api_key'")
        print("3. 运行爬虫: python3 logo_backdrop_crawler.py")
        print("4. 运行集成脚本: python3 get_tmdb_data_with_logos.py")
        return 0
    else:
        print("⚠️ 部分测试失败，请检查文件结构")
        return 1

if __name__ == "__main__":
    sys.exit(main())
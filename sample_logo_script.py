#!/usr/bin/env python3
"""
示例Logo爬取脚本
演示如何使用logo爬取功能
"""

import os
import json
from datetime import datetime, timezone, timedelta

def create_sample_logo_data():
    """创建示例logo数据"""
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
    print("\n🎉 示例脚本执行完成")

#!/usr/bin/env python3
import json
import urllib.parse

def convert_title_backdrop(old_url, title, rating, year, media_type):
    """将旧的 image-overlay.vercel.app URL 转换为 placehold.co URL"""
    try:
        # 构建标题文本
        title_text = f"{title} ({year})"
        subtitle_text = f"⭐ {rating} • {media_type}"
        combined_text = f"{title_text} - {subtitle_text}"
        
        # URL编码
        encoded_text = urllib.parse.quote(combined_text)
        
        # 生成新的 placehold.co URL
        new_url = f"https://placehold.co/1200x630/1a1a2e/ffffff.jpeg?text={encoded_text}"
        return new_url
    except Exception as e:
        print(f"转换失败: {e}")
        return old_url

def main():
    # 读取现有数据包
    with open('data/TMDB_Trending.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    # 遍历数据并更新 title_backdrop
    for key, item in data.items():
        if isinstance(item, dict) and 'title_backdrop' in item:
            old_url = item['title_backdrop']
            
            # 检查是否是旧的 image-overlay.vercel.app 链接
            if 'image-overlay.vercel.app' in old_url:
                title = item.get('title', '')
                rating = item.get('rating', 0)
                release_date = item.get('release_date', '')
                year = release_date.split('-')[0] if release_date else ''
                media_type = item.get('type', 'movie')
                
                # 转换为新的链接
                new_url = convert_title_backdrop(old_url, title, rating, year, media_type)
                item['title_backdrop'] = new_url
                updated_count += 1
                
                print(f"✅ 更新: {title} -> {new_url[:80]}...")
    
    # 保存更新后的数据
    with open('data/TMDB_Trending.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n🎉 更新完成！共更新了 {updated_count} 个项目的 title_backdrop")

if __name__ == "__main__":
    main()
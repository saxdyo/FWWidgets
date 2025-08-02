# TMDB背景图数据包

## 📋 数据概览

- **生成时间**: 2025-08-02T12:58:53.235Z
- **总计项目**: 191 项
- **包含背景图**: 191 项
- **平均评分**: 7.2

## 📁 数据文件

- `tmdb-backdrops-full.json` - 完整数据包（包含所有信息）
- `tmdb-backdrops-simple.json` - 简化版本（仅关键信息）
- `tmdb-backdrops-metadata.json` - 元数据信息
- `tmdb-backdrops-movies.json` - 热门电影数据
- `tmdb-backdrops-tv.json` - 热门电视剧数据
- `tmdb-backdrops-trending.json` - 今日热门数据
- `tmdb-backdrops-top-rated.json` - 高分内容数据

## 🏷️ 数据结构

每个媒体项目包含以下字段：

```json
{
  "id": 123456,
  "title": "电影标题",
  "mediaType": "movie|tv",
  "backdropUrls": {
    "w300": "https://image.tmdb.org/t/p/w300/backdrop.jpg",
    "w780": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
    "w1280": "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
    "original": "https://image.tmdb.org/t/p/original/backdrop.jpg"
  },
  "rating": 8.5,
  "releaseYear": 2024
}
```

## 🔄 自动更新

此数据包通过GitHub Actions每24小时自动更新一次。

---
*数据来源：[TMDB (The Movie Database)](https://www.themoviedb.org/)*

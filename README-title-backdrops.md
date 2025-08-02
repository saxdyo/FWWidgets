# TMDB带标题背景图数据包

## 📋 功能概述

自动生成和更新TMDB带标题背景图数据包，每6小时更新一次，包含热门电影和电视剧前20部。

## 🚀 更新策略

### 📦 数据包更新
- **更新频率**: 每6小时自动更新
- **数据内容**: 热门电影前20部 + 热门电视剧前20部
- **文件位置**: `data/tmdb-title-backdrops.json`
- **更新方式**: GitHub Actions自动执行

### ⚡ 实时生成
- **触发条件**: 数据包不可用或过期时
- **备用方案**: 提供本地备用数据
- **错误处理**: 完整的错误捕获和日志记录

## 📊 数据格式

```json
{
  "last_updated": "2025-08-02 17:50:27",
  "update_interval": "6小时",
  "total_items": 40,
  "movies_count": 20,
  "tv_shows_count": 20,
  "today_global": [
    {
      "id": 552524,
      "title": "星际宝贝史迪奇",
      "type": "movie",
      "genreTitle": "电影•家庭•科幻•喜剧",
      "rating": 7.2,
      "release_date": "2025-05-17",
      "overview": "讲述孤独的夏威夷小女孩莉萝...",
      "poster_url": "https://image.tmdb.org/t/p/original/dpEWJUvwpYAX1YFvoyzOfsikIGq.jpg",
      "title_backdrop": "https://image-overlay.vercel.app/api/backdrop?bg=...&title=星际宝贝史迪奇&year=2025&rating=7.2&type=movie"
    }
  ]
}
```

## 🔧 使用方法

### 1. 手动更新数据包
```bash
node generate-title-backdrop.js
```

### 2. 在脚本中调用
```javascript
// 调用带标题背景图数据
const results = await loadTmdbTitleBackdropData({
  data_source: "today_global",
  media_type: "all",
  min_rating: "7.0",
  sort_by: "rating_desc",
  page: 1
});
```

### 3. 模块配置
- **模块名称**: `TMDB带标题背景图`
- **函数名称**: `loadTmdbTitleBackdropData`
- **缓存时间**: 1800秒（30分钟）

## 📁 文件结构

```
├── generate-title-backdrop.js          # 数据包生成脚本
├── update-title-backdrops-cron.js     # 定时任务脚本
├── .github/workflows/
│   └── update-title-backdrops.yml     # GitHub Actions工作流
├── data/
│   └── tmdb-title-backdrops.json      # 数据包文件
└── logs/
    └── title-backdrops-update.log     # 更新日志
```

## ⏰ 更新计划

### GitHub Actions定时任务
- **频率**: 每6小时执行一次
- **时间**: UTC 0:00, 6:00, 12:00, 18:00
- **触发**: 自动定时 + 手动触发

### 更新检查逻辑
1. 检查数据包文件是否存在
2. 检查文件修改时间是否超过6小时
3. 如需更新，调用TMDB API获取最新数据
4. 生成带标题背景图URL
5. 保存到数据包文件
6. 记录更新日志

## 🎯 优势特点

### ✅ 数据包优势
- **⚡ 速度快**: 直接读取本地文件，响应时间 < 100ms
- **🛡️ 稳定性高**: 不依赖外部API，网络问题不影响
- **💰 成本低**: 减少API调用次数，节省费用
- **📱 离线可用**: 数据包可以离线使用
- **🔄 一致性好**: 所有用户看到相同的数据

### ✅ 实时生成优势
- **🆕 数据最新**: 每次调用都是最新数据
- **📈 数据量大**: 可以获取更多内容
- **🎛️ 灵活筛选**: 支持更多筛选条件
- **🔄 动态更新**: 数据实时更新

## 🔍 监控和日志

### 日志文件
- **位置**: `logs/title-backdrops-update.log`
- **内容**: 更新时间、数据统计、错误信息
- **格式**: `[时间戳] 消息内容`

### 监控指标
- 更新频率: 每6小时
- 数据量: 40个项目（20部电影 + 20部电视剧）
- 文件大小: 约500KB
- 响应时间: < 100ms

## 🛠️ 配置说明

### 环境变量
```bash
TMDB_API_KEY=your_tmdb_api_key_here
```

### 配置参数
```javascript
const CONFIG = {
  MAX_MOVIES: 20,        // 热门电影前20部
  MAX_TV_SHOWS: 20,      // 热门电视剧前20部
  UPDATE_INTERVAL: 6 * 60 * 60 * 1000, // 6小时更新间隔
  RATE_LIMIT_DELAY: 250, // API请求延迟
  LANGUAGE: 'zh-CN'      // 中文内容
};
```

## 📈 性能优化

1. **智能缓存**: 检查数据包更新时间，避免重复生成
2. **API限制**: 合理控制API调用频率
3. **错误处理**: 完善的备用方案和错误恢复
4. **日志记录**: 详细的更新日志便于监控
5. **数据压缩**: JSON文件优化，减少文件大小

## 🎉 总结

这个方案结合了**数据包**的**速度和稳定性**，以及**实时生成**的**灵活性**，为用户提供了最佳的体验！

- 📦 **主要使用数据包**: 每天4次自动更新，确保数据新鲜
- 🔄 **实时生作为备用**: 当数据包不可用时启用
- 📊 **智能切换机制**: 自动选择最佳数据源
- 🛡️ **完善错误处理**: 多重备用方案确保可用性
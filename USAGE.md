# 📖 TMDB背景图数据包使用指南

## 🎯 概述

这个解决方案提供了一个完整的TMDB背景图爬取和数据包生成系统，包含以下核心功能：

1. **自动爬取**: 从TMDB API获取热门影视内容的背景图
2. **数据包生成**: 生成结构化的JSON数据包
3. **定期更新**: 通过GitHub Actions自动更新数据
4. **小组件集成**: 在fw2.js中直接使用数据包

## 🚀 快速启动

### 步骤1: 设置API密钥

1. 注册TMDB账号并获取API密钥
2. 创建`.env`文件：
```bash
TMDB_API_KEY=your_actual_api_key_here
MAX_MOVIES=100
MAX_TV_SHOWS=50
```

### 步骤2: 首次运行

```bash
# 安装依赖
npm install

# 运行爬取脚本
npm run scrape
```

### 步骤3: 验证数据

```bash
# 检查生成的数据文件
ls -la data/

# 查看数据统计
cat data/tmdb-backdrops-metadata.json
```

## 📁 数据包详解

### 生成的文件

| 文件名 | 用途 | 大小估计 |
|--------|------|----------|
| `tmdb-backdrops-full.json` | 完整数据包，包含所有信息 | ~500KB |
| `tmdb-backdrops-simple.json` | 简化版本，仅关键字段 | ~200KB |
| `tmdb-backdrops-movies.json` | 仅电影数据 | ~300KB |
| `tmdb-backdrops-tv.json` | 仅电视剧数据 | ~150KB |
| `tmdb-backdrops-trending.json` | 今日热门内容 | ~50KB |
| `tmdb-backdrops-top-rated.json` | 高分内容 | ~100KB |
| `tmdb-backdrops-metadata.json` | 元数据和统计信息 | ~5KB |

### 数据结构说明

#### 完整数据项
```json
{
  "id": 872585,
  "title": "阿凡达：水之道",
  "originalTitle": "Avatar: The Way of Water",
  "overview": "描述文本...",
  "mediaType": "movie",
  "releaseDate": "2022-12-14",
  "releaseYear": 2022,
  "rating": 7.6,
  "voteCount": 8234,
  "popularity": 2841.677,
  "adult": false,
  "genreIds": [878, 12, 28],
  "originalLanguage": "en",
  "backdropPath": "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
  "posterPath": "/94xxm5701CzOdJdUEdIuwqZaowx.jpg",
  "backdropUrls": {
    "w300": "https://image.tmdb.org/t/p/w300/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "w780": "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "w1280": "https://image.tmdb.org/t/p/w1280/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "original": "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
  },
  "posterUrls": {
    "w154": "https://image.tmdb.org/t/p/w154/94xxm5701CzOdJdUEdIuwqZaowx.jpg",
    "w342": "https://image.tmdb.org/t/p/w342/94xxm5701CzOdJdUEdIuwqZaowx.jpg",
    "w500": "https://image.tmdb.org/t/p/w500/94xxm5701CzOdJdUEdIuwqZaowx.jpg",
    "w780": "https://image.tmdb.org/t/p/w780/94xxm5701CzOdJdUEdIuwqZaowx.jpg",
    "original": "https://image.tmdb.org/t/p/original/94xxm5701CzOdJdUEdIuwqZaowx.jpg"
  },
  "hasBackdrop": true,
  "hasPoster": true,
  "updatedAt": "2024-01-01T08:00:00.000Z"
}
```

#### 简化数据项
```json
{
  "id": 872585,
  "title": "阿凡达：水之道",
  "mediaType": "movie",
  "backdropUrls": {
    "w300": "https://image.tmdb.org/t/p/w300/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "w780": "https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "w1280": "https://image.tmdb.org/t/p/w1280/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    "original": "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg"
  },
  "rating": 7.6,
  "releaseYear": 2022
}
```

## 🤖 自动化设置

### GitHub Actions配置

1. **添加Secrets**: 在GitHub仓库设置中添加`TMDB_API_KEY`
2. **启用Actions**: 确保Actions在仓库中已启用
3. **检查权限**: 确保Actions有写入权限

### 自动化时间表

- **定时执行**: 每天UTC 0:00 (北京时间8:00)
- **手动触发**: 在Actions页面可以手动运行
- **条件更新**: 只有当数据超过24小时或有实际变更时才提交

### 监控自动化

查看Actions运行状态：
1. 进入GitHub仓库的Actions页面
2. 查看"Update TMDB Backdrop Data"工作流
3. 检查运行日志和生成的报告

## 🎨 在fw2.js中使用

### 模块配置

新的"TMDB背景图数据包"模块已添加到fw2.js中，提供以下配置选项：

```javascript
{
  data_source: "combined",    // 数据源: combined/movies/tv/trending/top_rated
  media_type: "all",         // 媒体类型: all/movie/tv
  min_rating: "0",           // 最低评分: 0/6.0/7.0/8.0/9.0
  sort_by: "rating_desc",    // 排序: rating_desc/popularity_desc/release_date
  backdrop_size: "w1280",    // 图片尺寸: w300/w780/w1280/original
  page: 1                    // 页码
}
```

### 数据加载流程

1. **优先本地**: 首先尝试加载本地数据包
2. **API回退**: 如果本地数据不可用，回退到API请求
3. **缓存机制**: 结果会被缓存30分钟
4. **错误处理**: 提供友好的错误信息和后备数据

## 🔧 自定义配置

### 修改爬取参数

在`tmdb-scraper.js`中调整以下配置：

```javascript
const CONFIG = {
  MAX_MOVIES: 100,           // 最大电影数量
  MAX_TV_SHOWS: 50,          // 最大电视剧数量
  RATE_LIMIT_DELAY: 250,     // API请求间隔(毫秒)
  LANGUAGE: 'zh-CN'          // 语言设置
};
```

### 自定义数据源

可以在脚本中添加新的数据获取函数：

```javascript
// 获取特定类型的内容
async function getSpecificContent() {
  const data = await makeRequest('/discover/movie', {
    with_genres: '28,12',     // 动作+冒险
    vote_average_gte: 7.0,    // 7分以上
    primary_release_year: 2024 // 2024年
  });
  return data ? data.results : [];
}
```

## 📊 数据质量控制

### 筛选标准

- **背景图要求**: 必须有backdrop_path
- **评分要求**: 可配置最低评分阈值
- **去重机制**: 基于媒体类型和ID去重
- **排序优化**: 综合考虑评分和热度

### 质量指标

元数据文件包含以下质量指标：
- 总项目数量
- 有背景图的项目比例
- 平均评分
- 各类型内容分布

## 🐛 故障排除

### 常见问题

#### 1. API请求失败
```bash
# 检查API密钥是否正确
echo $TMDB_API_KEY

# 测试API连接
curl "https://api.themoviedb.org/3/movie/popular?api_key=$TMDB_API_KEY"
```

#### 2. 数据包为空
- 检查网络连接
- 验证API配额是否用完
- 查看控制台错误信息

#### 3. GitHub Actions失败
- 检查Secrets配置
- 查看Actions日志
- 验证权限设置

### 调试模式

启用详细日志：
```bash
# 设置调试环境变量
DEBUG=1 node tmdb-scraper.js
```

## 📈 性能优化

### 缓存策略

- **本地缓存**: 30分钟内存缓存
- **文件缓存**: 本地JSON文件
- **智能更新**: 只有数据变更时才重新生成

### API使用优化

- **请求限制**: 250ms间隔避免限制
- **批量处理**: 并行获取多个数据源
- **错误重试**: 自动重试失败的请求

## 🔒 安全考虑

### API密钥安全

- 使用环境变量存储
- 不要提交到Git仓库
- 定期轮换API密钥

### 数据隐私

- 只获取公开的影视信息
- 不存储用户个人数据
- 遵循TMDB使用条款

---

💡 **提示**: 如果遇到问题，请查看项目的Issues页面或创建新的Issue。
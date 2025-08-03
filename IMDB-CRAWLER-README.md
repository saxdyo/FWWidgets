# IMDb数据爬取器

这是一个用于获取和更新IMDb影视数据的爬取器，支持电影、剧集和动画数据。

## 功能特性

### 🎬 支持的数据类型
- **电影 (Movies)**: 热门电影、最新上映、评分排行等
- **剧集 (TV Shows)**: 热门剧集、最新剧集、评分排行等  
- **动画 (Anime)**: 热门动画、最新动画、评分排行等

### 🌍 支持的地区
- 全部地区 (all)
- 中国大陆 (country:cn)
- 美国 (country:us)
- 英国 (country:gb)
- 日本 (country:jp)
- 韩国 (country:kr)
- 欧美 (region:us-eu)
- 香港 (country:hk)
- 台湾 (country:tw)

### 📊 支持的排序方式
- **热度排序**: hs (热门度)
- **评分排序**: r (评分)
- **上映时间**: rd (发布日期)
- **年份排序**: y (年份)
- **标题排序**: t (标题)
- **时长排序**: d (时长)

## 安装和配置

### 1. 环境要求
- Node.js 14+
- TMDB API Key

### 2. 获取TMDB API Key
1. 访问 [TMDB官网](https://www.themoviedb.org/)
2. 注册账号并登录
3. 进入 Settings > API
4. 申请API Key

### 3. 配置API Key
```bash
# 方法1: 环境变量
export TMDB_API_KEY="your_api_key_here"

# 方法2: 直接修改脚本
# 编辑 imdb-crawler.js 中的 CONFIG.TMDB_API_KEY
```

## 使用方法

### 基本命令
```bash
# 完整爬取所有数据
node imdb-crawler.js crawl

# 更新现有数据
node imdb-crawler.js update

# 测试模式
node imdb-crawler.js test

# 查看帮助
node imdb-crawler.js
```

### 高级用法

#### 1. 自定义配置
编辑 `imdb-crawler.js` 中的 `CONFIG` 对象：

```javascript
const CONFIG = {
  // 请求间隔(毫秒)
  REQUEST_DELAY: 1000,
  
  // 最大重试次数
  MAX_RETRIES: 3,
  
  // 每页数据量
  ITEMS_PER_PAGE: 20,
  
  // 最大页数
  MAX_PAGES: 50,
  
  // 数据存储路径
  DATA_DIR: './imdb-data'
};
```

#### 2. 自定义数据范围
```javascript
// 只爬取特定地区
REGIONS: ['country:cn', 'country:us'],

// 只爬取特定媒体类型
MEDIA_TYPES: ['movie', 'tv'],

// 只爬取特定排序方式
SORT_TYPES: ['hs', 'r']
```

## 数据格式

### 输出数据结构
```json
{
  "id": 574475,
  "p": "/nMUAHKfJg1eqKC4t8LCP8GFKG5I.jpg",
  "b": "/uIpJPDNFoeX0TVml9smPrs9KUVx.jpg",
  "t": "死神来了6：血脉诅咒",
  "r": 7.201,
  "y": 2025,
  "rd": "2025-05-14",
  "hs": 15.452,
  "d": 1205.511,
  "mt": "movie",
  "o": "电影简介..."
}
```

### 字段说明
- `id`: TMDB ID
- `p`: 海报路径
- `b`: 背景图路径
- `t`: 标题
- `r`: 评分
- `y`: 年份
- `rd`: 发布日期
- `hs`: 热度值
- `d`: 时长(分钟)
- `mt`: 媒体类型 (movie/tv/anime)
- `o`: 简介

## 数据存储结构

```
imdb-data/
├── movies/
│   ├── all/
│   │   ├── by_hs/
│   │   │   └── page_1.json
│   │   ├── by_r/
│   │   │   └── page_1.json
│   │   └── ...
│   ├── country_cn/
│   └── ...
├── tv/
│   └── ...
└── anime/
    └── ...
```

## 与fw2.js集成

### 1. 数据源配置
在 `fw2.js` 中，IMDB模块使用以下数据源：

```javascript
// 电影数据
const movieUrl = `https://raw.githubusercontent.com/opix-maker/Forward/main/imdb-data-platform/dist/movies/${region}/by_${sortKey}/page_${page}.json`;

// 动画数据
const animeUrl = `https://raw.githubusercontent.com/opix-maker/Forward/main/imdb-data-platform/dist/anime/${region}/by_${sortKey}/page_${page}.json`;
```

### 2. 模块配置
```javascript
{
  title: "IMDb 影视榜单",
  description: "IMDb热门影视内容",
  functionName: "loadImdbMovieListModule",
  params: [
    {
      name: "media_type",
      title: "媒体类型",
      enumOptions: [
        { title: "全部", value: "all" },
        { title: "电影", value: "movie" },
        { title: "剧集", value: "tv" },
        { title: "动画", value: "anime" }
      ]
    }
  ]
}
```

## 注意事项

### 1. API限制
- TMDB API有请求频率限制
- 建议设置适当的 `REQUEST_DELAY`
- 避免短时间内大量请求

### 2. 数据更新
- 建议定期运行更新命令
- 可以设置定时任务自动更新
- 注意备份重要数据

### 3. 错误处理
- 脚本包含重试机制
- 网络错误会自动跳过
- 检查日志了解详细错误信息

## 故障排除

### 常见问题

#### 1. API Key错误
```
❌ 获取热门电影失败: 401 Unauthorized
```
**解决方案**: 检查API Key是否正确配置

#### 2. 网络超时
```
❌ 请求失败: timeout
```
**解决方案**: 增加 `REQUEST_DELAY` 或检查网络连接

#### 3. 数据为空
```
⚠️ 第1页无数据，停止爬取
```
**解决方案**: 检查API响应或调整请求参数

## 贡献

欢迎提交Issue和Pull Request来改进这个爬取器！

## 许可证

MIT License
# 🗂️ TMDB数据获取方案大全（除预处理数据外）

## 🌟 方案概览

| 方案 | 实时性 | 数据量 | 成本 | 复杂度 | 推荐度 |
|------|--------|--------|------|--------|--------|
| 1. 直接调用TMDB API | 实时 | 完整 | 免费 | ⭐ | ⭐⭐⭐⭐⭐ |
| 2. 缓存代理服务 | 准实时 | 完整 | 免费 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 3. 第三方聚合API | 实时 | 丰富 | 付费 | ⭐ | ⭐⭐⭐⭐ |
| 4. 爬虫 + 定时更新 | 批量 | 可控 | 免费 | ⭐⭐⭐ | ⭐⭐⭐ |
| 5. GraphQL包装器 | 实时 | 精准 | 免费 | ⭐⭐ | ⭐⭐⭐⭐ |
| 6. RSS/Feed聚合 | 定时 | 有限 | 免费 | ⭐ | ⭐⭐ |
| 7. 本地数据库 | 实时 | 完整 | 服务器 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🎯 方案1: 直接调用TMDB API (最推荐)

### 优势
- ✅ 数据最新、最准确
- ✅ 完全免费（每天4万次请求）
- ✅ 官方支持，稳定可靠
- ✅ 丰富的端点和参数

### 实现示例

```javascript
// 直接TMDB API调用
class TMDBDirectAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.themoviedb.org/3';
  }
  
  async getTrending(timeWindow = 'day', mediaType = 'all', page = 1) {
    const url = `${this.baseURL}/trending/${mediaType}/${timeWindow}`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'zh-CN',
      page: page.toString()
    });
    
    const response = await fetch(`${url}?${params}`);
    return await response.json();
  }
  
  async getPopular(mediaType = 'movie', page = 1) {
    const url = `${this.baseURL}/${mediaType}/popular`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'zh-CN',
      page: page.toString()
    });
    
    const response = await fetch(`${url}?${params}`);
    return await response.json();
  }
  
  async getTopRated(mediaType = 'movie', page = 1) {
    const url = `${this.baseURL}/${mediaType}/top_rated`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'zh-CN',
      page: page.toString()
    });
    
    const response = await fetch(`${url}?${params}`);
    return await response.json();
  }
  
  async searchMulti(query, page = 1) {
    const url = `${this.baseURL}/search/multi`;
    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'zh-CN',
      query: query,
      page: page.toString()
    });
    
    const response = await fetch(`${url}?${params}`);
    return await response.json();
  }
}

// 使用示例
const tmdb = new TMDBDirectAPI('your-api-key');
const trendingMovies = await tmdb.getTrending('day', 'movie');
```

---

## 🚀 方案2: 缓存代理服务 (强烈推荐)

### 概念
在您的服务和TMDB之间添加一个缓存层，提高性能并减少API调用。

### Cloudflare Workers实现

```javascript
// Cloudflare Workers缓存代理
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 解析请求参数
    const mediaType = url.searchParams.get('media_type') || 'all';
    const timeWindow = url.searchParams.get('time_window') || 'day';
    const page = url.searchParams.get('page') || '1';
    
    // 构建缓存键
    const cacheKey = `tmdb-${path}-${mediaType}-${timeWindow}-${page}`;
    
    // 尝试从缓存获取
    const cache = caches.default;
    let response = await cache.match(cacheKey);
    
    if (!response) {
      // 缓存未命中，调用TMDB API
      const tmdbUrl = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}`;
      const params = new URLSearchParams({
        api_key: env.TMDB_API_KEY,
        language: 'zh-CN',
        page: page
      });
      
      const tmdbResponse = await fetch(`${tmdbUrl}?${params}`);
      const data = await tmdbResponse.json();
      
      // 添加自定义处理（如背景图URL等）
      const processedData = this.processData(data);
      
      response = new Response(JSON.stringify(processedData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // 1小时缓存
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      // 存入缓存
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    
    return response;
  },
  
  processData(data) {
    // 添加自定义字段，如生成背景图URL
    if (data.results) {
      data.results = data.results.map(item => ({
        ...item,
        custom_backdrop: this.generateBackdropUrl(item),
        enhanced_rating: this.formatRating(item.vote_average),
        media_type_text: item.media_type === 'movie' ? '电影' : '剧集'
      }));
    }
    return data;
  },
  
  generateBackdropUrl(item) {
    if (item.backdrop_path) {
      const baseUrl = 'https://your-backdrop-service.vercel.app/api/backdrop';
      const params = new URLSearchParams({
        bg: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
        title: item.title || item.name,
        year: new Date(item.release_date || item.first_air_date).getFullYear(),
        rating: item.vote_average.toFixed(1),
        type: item.media_type
      });
      return `${baseUrl}?${params}`;
    }
    return null;
  },
  
  formatRating(rating) {
    return rating ? `⭐${rating.toFixed(1)}分` : '';
  }
};
```

---

## 🌐 方案3: 第三方聚合API

### RapidAPI上的TMDB替代品

```javascript
// 使用IMDB API (RapidAPI)
class IMDBRapidAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://imdb8.p.rapidapi.com';
  }
  
  async getPopularMovies() {
    const response = await fetch(`${this.baseURL}/title/get-popular-movies-by-genre`, {
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
      }
    });
    return await response.json();
  }
}

// 使用OMDb API
class OMDbAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'http://www.omdbapi.com/';
  }
  
  async search(title, type = '', year = '') {
    const params = new URLSearchParams({
      apikey: this.apiKey,
      s: title,
      type: type,
      y: year
    });
    
    const response = await fetch(`${this.baseURL}?${params}`);
    return await response.json();
  }
}
```

---

## 🕷️ 方案4: 爬虫 + 定时更新

### 使用Puppeteer爬取

```javascript
// 爬虫示例 (仅供学习，请遵守网站ToS)
const puppeteer = require('puppeteer');

class TMDBScraper {
  async scrapeTrending() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.themoviedb.org/movie');
    
    const movies = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.card'));
      return items.map(item => ({
        title: item.querySelector('h2')?.textContent?.trim(),
        rating: item.querySelector('.vote_average')?.textContent?.trim(),
        image: item.querySelector('img')?.src,
        link: item.querySelector('a')?.href
      }));
    });
    
    await browser.close();
    return movies;
  }
}

// 定时更新脚本
const cron = require('node-cron');

// 每小时更新一次
cron.schedule('0 * * * *', async () => {
  const scraper = new TMDBScraper();
  const data = await scraper.scrapeTrending();
  
  // 保存到文件或数据库
  await fs.writeFile('trending-data.json', JSON.stringify(data, null, 2));
  console.log('数据已更新');
});
```

---

## 📊 方案5: GraphQL包装器

### 使用Apollo Server包装TMDB API

```javascript
// GraphQL Schema
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    overview: String
    releaseDate: String
    voteAverage: Float
    posterPath: String
    backdropPath: String
    customBackdrop: String
  }
  
  type Query {
    trendingMovies(timeWindow: String): [Movie]
    popularMovies(page: Int): [Movie]
    searchMovies(query: String!): [Movie]
  }
`;

const resolvers = {
  Query: {
    trendingMovies: async (_, { timeWindow = 'day' }) => {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${API_KEY}`);
      const data = await response.json();
      
      return data.results.map(movie => ({
        ...movie,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        customBackdrop: generateCustomBackdrop(movie)
      }));
    },
    
    popularMovies: async (_, { page = 1 }) => {
      // 类似实现
    },
    
    searchMovies: async (_, { query }) => {
      // 搜索实现
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
```

---

## 📡 方案6: RSS/Feed聚合

### 聚合多个电影资讯源

```javascript
// RSS聚合器
const Parser = require('rss-parser');

class MovieFeedAggregator {
  constructor() {
    this.parser = new Parser();
    this.feeds = [
      'https://www.imdb.com/rss/news/',
      'https://variety.com/feed/',
      'https://www.hollywoodreporter.com/feed/'
    ];
  }
  
  async aggregateFeeds() {
    const allItems = [];
    
    for (const feedUrl of this.feeds) {
      try {
        const feed = await this.parser.parseURL(feedUrl);
        allItems.push(...feed.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.contentSnippet,
          source: new URL(feedUrl).hostname
        })));
      } catch (error) {
        console.error(`Failed to parse ${feedUrl}:`, error);
      }
    }
    
    // 按时间排序
    return allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }
}
```

---

## 🗄️ 方案7: 本地数据库方案

### 使用SQLite存储TMDB数据

```javascript
// 数据库同步器
const sqlite3 = require('sqlite3').verbose();

class TMDBDatabase {
  constructor(dbPath = 'tmdb.db') {
    this.db = new sqlite3.Database(dbPath);
    this.initDatabase();
  }
  
  initDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        overview TEXT,
        release_date TEXT,
        vote_average REAL,
        poster_path TEXT,
        backdrop_path TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  async syncFromTMDB() {
    // 获取热门电影
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    
    for (const movie of data.results) {
      await this.upsertMovie(movie);
    }
  }
  
  upsertMovie(movie) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO movies 
        (id, title, overview, release_date, vote_average, poster_path, backdrop_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        movie.id,
        movie.title,
        movie.overview,
        movie.release_date,
        movie.vote_average,
        movie.poster_path,
        movie.backdrop_path
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  getMovies(limit = 20) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM movies ORDER BY vote_average DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

// 使用定时任务同步
const cron = require('node-cron');
const db = new TMDBDatabase();

// 每6小时同步一次
cron.schedule('0 */6 * * *', async () => {
  await db.syncFromTMDB();
  console.log('数据库已同步');
});
```

---

## 🎯 推荐选择策略

### 🏆 最佳组合方案

1. **立即可用**: 方案1 (直接TMDB API)
2. **性能优化**: 方案2 (缓存代理)
3. **长期稳定**: 方案7 (本地数据库)

### 🚀 快速实施步骤

1. **第一步**: 直接使用TMDB API，确保功能正常
2. **第二步**: 添加缓存层提高性能
3. **第三步**: 根据需求选择长期方案

### 📊 根据场景选择

- **个人项目**: 方案1 (直接API)
- **中小型应用**: 方案2 (缓存代理)
- **企业级应用**: 方案7 (本地数据库)
- **实验性项目**: 方案5 (GraphQL)
- **新闻聚合**: 方案6 (RSS Feed)

## 🔧 立即可用的fw2.js修改

您可以简单地修改fw2.js中的预处理数据加载，改为直接调用TMDB API：

```javascript
// 替换预处理数据加载为直接API调用
async function loadTmdbTrendingFromAPI(params = {}) {
  const { content_type = "today", media_type = "all", page = 1 } = params;
  
  let endpoint;
  switch (content_type) {
    case "today":
      endpoint = `/trending/${media_type}/day`;
      break;
    case "week":
      endpoint = `/trending/${media_type}/week`;
      break;
    case "popular":
      endpoint = media_type === "tv" ? "/tv/popular" : "/movie/popular";
      break;
    default:
      endpoint = "/trending/all/day";
  }
  
  const response = await Widget.http.get(`https://api.themoviedb.org/3${endpoint}?api_key=${CONFIG.API_KEY}&language=zh-CN&page=${page}`);
  
  // 转换为WidgetItem格式
  return response.data.results.map(item => ({
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || item.name,
    description: item.overview,
    releaseDate: item.release_date || item.first_air_date,
    // ... 其他字段
  }));
}
```

这样您就完全不依赖预处理数据了！🎉
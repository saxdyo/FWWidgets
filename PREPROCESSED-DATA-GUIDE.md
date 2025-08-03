# 预处理数据源创建指南

## 🎯 概述

本指南将帮助您创建自己的预处理数据源，类似于 `quantumultxx/ForwardWidgets` 的 `TMDB_Trending.json` 数据。

## 📁 文件结构

```
/workspace/
├── create-preprocessed-data.js    # 数据生成脚本
├── deploy-preprocessed-data.sh    # 部署脚本
├── data/                         # 数据目录
│   └── TMDB_Trending.json       # 生成的预处理数据
└── PREPROCESSED-DATA-GUIDE.md   # 本指南
```

## 🚀 快速开始

### 1. 生成预处理数据

```bash
# 生成示例数据
npm run generate:preprocessed
```

### 2. 部署到GitHub

```bash
# 部署数据到GitHub
npm run deploy:preprocessed
```

### 3. 测试数据访问

```bash
# 测试数据访问
npm run test:preprocessed
```

## 📊 数据格式

### 标准格式

```json
{
  "last_updated": "2025-08-03 08:11:29",
  "today_global": [
    {
      "id": 980477,
      "title": "哪吒之魔童闹海",
      "type": "movie",
      "genreTitle": "动画•奇幻•冒险",
      "rating": 8.1,
      "release_date": "2025-01-29",
      "overview": "天劫之后，哪吒、敖丙的灵魂虽保住了...",
      "poster_url": "https://image.tmdb.org/t/p/original/72pE4JaQ2UPAgweTHzXYbKtXEUX.jpg",
      "title_backdrop": "https://image.tmdb.org/t/p/original/gd9kxeEEONj5SECs4GA8Ddn3czI.jpg",
      "popularity": 1500,
      "vote_count": 1250
    }
  ],
  "week_global_all": [...],
  "popular_movies": [...],
  "popular_tvshows": [...]
}
```

### 必需字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `last_updated` | string | 最后更新时间 |
| `today_global` | array | 今日热门内容 |
| `week_global_all` | array | 本周热门内容 |
| `popular_movies` | array | 热门电影 |
| `popular_tvshows` | array | 热门剧集 |

### 内容项字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 唯一标识符 |
| `title` | string | 标题 |
| `type` | string | 类型 (movie/tv/anime) |
| `genreTitle` | string | 类型标题 |
| `rating` | number | 评分 |
| `release_date` | string | 发布日期 |
| `overview` | string | 简介 |
| `poster_url` | string | 海报URL |
| `title_backdrop` | string | 背景图URL |
| `popularity` | number | 热度 |
| `vote_count` | number | 投票数 |

## 🔧 自定义配置

### 修改数据源

编辑 `create-preprocessed-data.js` 中的配置：

```javascript
const CONFIG = {
    OUTPUT_DIR: 'data',
    OUTPUT_FILE: 'TMDB_Trending.json',
    MAX_ITEMS: 20,
    DATA_SOURCES: {
        SAMPLE: 'sample-data',
        TMDB_API: 'tmdb-api',
        IMDB_DATA: 'imdb-data'
    }
};
```

### 添加新的数据源

在 `generateFromExistingSources()` 方法中添加：

```javascript
// 从TMDB API获取数据
async fetchTmdbData() {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
        console.log('TMDB_API_KEY 未设置');
        return null;
    }
    
    const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data.results;
}
```

### 自定义数据转换

修改 `convertImdbToPreprocessed()` 方法：

```javascript
convertImdbToPreprocessed(imdbData) {
    return imdbData.map(item => ({
        id: item.id,
        title: item.t,
        type: item.mt || 'movie',
        genreTitle: this.generateGenreTitle(item),
        rating: item.r || 0,
        release_date: item.rd || `${item.y}-01-01`,
        overview: item.o || '',
        poster_url: item.p ? `https://image.tmdb.org/t/p/original${item.p}` : null,
        title_backdrop: item.b ? `https://image.tmdb.org/t/p/original${item.b}` : null,
        popularity: item.hs || 0,
        vote_count: 0
    }));
}
```

## 📝 使用步骤

### 1. 生成数据

```bash
# 生成示例数据
node create-preprocessed-data.js

# 或使用npm脚本
npm run generate:preprocessed
```

### 2. 验证数据

```bash
# 检查JSON格式
node -e "JSON.parse(require('fs').readFileSync('data/TMDB_Trending.json', 'utf8'))"

# 查看数据统计
node -e "const data = JSON.parse(require('fs').readFileSync('data/TMDB_Trending.json', 'utf8')); console.log('今日热门:', data.today_global.length);"
```

### 3. 部署数据

```bash
# 部署到GitHub
./deploy-preprocessed-data.sh

# 或使用npm脚本
npm run deploy:preprocessed
```

### 4. 更新代码

在 `fw2.js` 中更新数据源URL：

```javascript
const response = await Widget.http.get("https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/TMDB_Trending.json");
```

## 🔄 自动化更新

### 创建定时任务

```bash
# 设置每天更新
crontab -e

# 添加以下行（每天凌晨2点更新）
0 2 * * * cd /path/to/your/project && npm run generate:preprocessed && npm run deploy:preprocessed
```

### 使用GitHub Actions

创建 `.github/workflows/update-data.yml`：

```yaml
name: Update Preprocessed Data

on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点
  workflow_dispatch:      # 手动触发

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run generate:preprocessed
      - run: npm run deploy:preprocessed
```

## 🧪 测试验证

### 1. 本地测试

```bash
# 测试数据生成
npm run generate:preprocessed

# 验证JSON格式
node -e "JSON.parse(require('fs').readFileSync('data/TMDB_Trending.json', 'utf8'))"
```

### 2. 远程测试

```bash
# 测试GitHub访问
curl -I "https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json"

# 测试数据内容
curl -s "https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json" | head -20
```

### 3. 集成测试

在 `fw2.js` 中测试数据加载：

```javascript
// 测试预处理数据加载
const testData = await loadTmdbTrendingFromPreprocessed({ content_type: "today" });
console.log('加载的数据项数:', testData.length);
```

## 📈 性能优化

### 1. 数据压缩

```javascript
// 压缩数据字段
const compressedData = data.map(item => ({
    id: item.id,
    t: item.title,        // 缩短字段名
    mt: item.type,
    r: item.rating,
    rd: item.release_date,
    o: item.overview,
    p: item.poster_url,
    b: item.title_backdrop
}));
```

### 2. 缓存策略

```javascript
// 添加缓存头
const response = await Widget.http.get(url, {
    headers: {
        'Cache-Control': 'max-age=3600',
        'ETag': dataHash
    }
});
```

### 3. 增量更新

```javascript
// 只更新变化的数据
const lastUpdate = await getLastUpdateTime();
const newData = await fetchNewDataSince(lastUpdate);
```

## 🛠️ 故障排除

### 常见问题

1. **JSON格式错误**
   ```bash
   # 验证JSON格式
   node -e "JSON.parse(require('fs').readFileSync('data/TMDB_Trending.json', 'utf8'))"
   ```

2. **数据源访问失败**
   ```bash
   # 检查网络连接
   curl -I "https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json"
   ```

3. **Git推送失败**
   ```bash
   # 检查Git状态
   git status
   git remote -v
   ```

### 调试技巧

1. **启用详细日志**
   ```javascript
   console.log('数据生成过程:', data);
   ```

2. **验证数据完整性**
   ```javascript
   const requiredFields = ['id', 'title', 'type', 'rating'];
   const missingFields = item => requiredFields.filter(field => !item[field]);
   ```

3. **性能监控**
   ```javascript
   const startTime = Date.now();
   // ... 数据处理
   console.log(`处理时间: ${Date.now() - startTime}ms`);
   ```

## 📚 参考资源

- [TMDB API 文档](https://developers.themoviedb.org/3)
- [GitHub Raw Content](https://docs.github.com/en/rest/reference/repos#get-repository-content)
- [JSON 格式规范](https://www.json.org/json-zh.html)

---

**最后更新**: 2025-08-03
**版本**: 1.0.0
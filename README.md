# # 🎬 TMDB影视榜单小组件 V2

一个集成TMDB API的影视内容小组件，支持自动爬取背景图并生成数据包。

## ✨ 功能特色

### 📺 影视内容模块
- **TMDB热门内容** - 今日热门、本周热门、热门电影
- **TMDB播出平台** - 按平台筛选剧集内容
- **TMDB地区内容** - 按地区和类型筛选
- **TMDB搜索** - 全文搜索影视内容
- **Bangumi热门新番** - 动画新番列表
- **🆕 TMDB背景图数据包** - 高质量背景图的热门影视内容

### 🤖 自动化功能
- **自动爬取** - 定期从TMDB获取最新背景图数据
- **智能筛选** - 只保留有高质量背景图的内容
- **多尺寸支持** - 提供300px到原始尺寸的多种规格
- **定时更新** - GitHub Actions每日自动更新数据包
- **版本控制** - 所有数据变更都有Git记录

## 🚀 快速开始

### 1. 获取TMDB API密钥
1. 访问 [TMDB官网](https://www.themoviedb.org/) 注册账号
2. 进入 [API设置页面](https://www.themoviedb.org/settings/api) 申请API密钥
3. 复制API密钥备用

### 2. 配置环境
```bash
# 克隆仓库
git clone https://github.com/saxdyo/FWWidgets.git
cd FWWidgets

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，填入你的TMDB API密钥
```

### 3. 手动运行爬取
```bash
# 运行爬取脚本
npm run scrape

# 或直接运行
node tmdb-scraper.js
```

### 4. 设置自动化（可选）
如果要启用GitHub Actions自动更新：

1. 在GitHub仓库设置中添加Secrets：
   - `TMDB_API_KEY`: 你的TMDB API密钥

2. Actions将每天自动运行，更新数据包

## 📁 项目结构

```
FWWidgets/
├── fw2.js                          # 主要的小组件脚本
├── tmdb-scraper.js                 # TMDB数据爬取脚本
├── package.json                    # Node.js项目配置
├── .env.example                    # 环境变量示例
├── .github/workflows/              # GitHub Actions工作流
│   └── update-tmdb-data.yml       # 自动更新配置
└── data/                          # 生成的数据包目录
    ├── tmdb-backdrops-full.json   # 完整数据包
    ├── tmdb-backdrops-simple.json # 简化版本
    ├── tmdb-backdrops-movies.json # 电影数据
    ├── tmdb-backdrops-tv.json     # 电视剧数据
    ├── tmdb-backdrops-trending.json # 热门内容
    ├── tmdb-backdrops-top-rated.json # 高分内容
    ├── tmdb-backdrops-metadata.json # 元数据
    └── README.md                  # 数据包说明
```

## 🎨 小组件配置

### TMDB背景图数据包模块参数

| 参数 | 说明 | 可选值 |
|------|------|--------|
| `data_source` | 数据源类型 | `combined`(综合), `movies`(电影), `tv`(电视剧), `trending`(热门), `top_rated`(高分) |
| `media_type` | 媒体类型 | `all`(全部), `movie`(电影), `tv`(电视剧) |
| `min_rating` | 最低评分 | `0`, `6.0`, `7.0`, `8.0`, `9.0` |
| `sort_by` | 排序方式 | `rating_desc`(评分降序), `popularity_desc`(热度降序), `release_date`(发布时间) |
| `backdrop_size` | 背景图尺寸 | `w300`, `w780`, `w1280`, `original` |

## 📊 数据包格式

### 简化版数据结构
```json
{
  "id": 123456,
  "title": "电影标题",
  "mediaType": "movie",
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

### 元数据信息
- 生成时间戳
- 总项目数量
- 分类统计信息
- 数据质量指标

## 🔄 自动更新机制

- **触发时机**: 每天UTC 0:00 (北京时间8:00)
- **检查逻辑**: 数据超过24小时自动更新
- **手动触发**: 支持在GitHub Actions中手动运行
- **智能提交**: 只有数据变更时才会提交到Git

## 🛠️ 开发指南

### 本地测试
```bash
# 运行爬取脚本
node tmdb-scraper.js

# 检查生成的数据
ls -la data/

# 测试小组件（需要在支持的环境中）
# 加载fw2.js并调用loadTmdbBackdropData函数
```

### 自定义配置
在`tmdb-scraper.js`中可以修改：
- 爬取的电影/电视剧数量
- API请求频率限制
- 数据筛选条件
- 输出文件格式

## 📝 版本历史

### V2.0.0 (当前版本)
- ✅ 新增TMDB背景图数据包模块
- ✅ 支持多尺寸背景图
- ✅ GitHub Actions自动化更新
- ✅ 智能数据缓存和去重
- ✅ 详细的数据统计和元数据

### V1.x
- 基础TMDB API集成
- 多种内容类型支持
- 基本缓存功能

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [TMDB](https://www.themoviedb.org/) - 提供优质的电影数据库API
- [Bangumi](https://bgm.tv/) - 动画数据来源
- 所有贡献者和用户的支持

---

⭐ 如果这个项目对你有帮助，请给个星标支持一下！
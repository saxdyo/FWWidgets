# TMDB爬虫与JavaScript小组件集成指南

## 项目概述

本项目包含两个主要组件：
1. **Python爬虫** - 从TMDB API爬取电影数据，生成带片名的背景图，并导出标准化数据包
2. **JavaScript小组件** - 消费Python爬虫生成的数据包，在客户端显示影视内容

## 📋 功能特性

### Python爬虫特性
- ✅ 自动从TMDB API获取热门、高分、最新电影数据
- ✅ 下载高质量电影海报和背景图
- ✅ **生成带片名的背景图（标题海报）**
- ✅ 自动去重和数据清理
- ✅ 生成JavaScript小组件兼容的JSON数据包
- ✅ 自动Git提交和推送
- ✅ 定时任务调度支持
- ✅ 完整的错误处理和日志记录

### JavaScript小组件特性
- ✅ 支持多种显示模式（标题海报、普通海报、背景图）
- ✅ 从GitHub自动获取Python生成的数据包
- ✅ TMDB API回退机制
- ✅ 高效的缓存管理
- ✅ 完全兼容原始fw2.js格式

## 🚀 快速开始

### 第一步：设置Python爬虫

1. **安装和配置**
```bash
# 克隆项目并进入目录
cd /path/to/your/project

# 运行一键安装脚本
./setup.sh

# 配置TMDB API密钥
cp .env.example .env
# 编辑 .env 文件，填入您的TMDB API密钥
```

2. **配置Git仓库**
```bash
# 如果还没有Git仓库，初始化一个
git init
git remote add origin https://github.com/your-username/your-repo.git

# 或者克隆现有仓库
git clone https://github.com/your-username/your-repo.git
```

3. **运行爬虫**
```bash
# 使用交互式菜单
./run.sh

# 或直接运行命令
python main.py run_once          # 单次爬取
python main.py export_widget     # 导出小组件数据
python main.py run_scheduler     # 启动定时任务
```

### 第二步：部署JavaScript小组件

1. **更新小组件配置**

编辑 `enhanced_widget.js` 中的配置：

```javascript
const CONFIG = {
  // 更新为您的GitHub仓库数据源
  GITHUB_DATA_SOURCES: [
    "https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/data/TMDB_Trending.json",
    "https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/data/TMDB_Popular.json", 
    "https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/data/TMDB_TopRated.json"
  ],
  
  // 配置TMDB API密钥（可选，作为回退）
  API_KEY: "your_tmdb_api_key_here"
};
```

2. **使用小组件**

将 `enhanced_widget.js` 部署到您的小组件平台，然后可以使用以下模块：

- **TMDB 标题海报热门** - 显示带片名的背景图
- **TMDB 热门内容** - 标准的电影海报显示

## 📂 数据流程

```
TMDB API → Python爬虫 → 数据处理 → 生成标题海报 → JSON数据包 → Git推送 → JavaScript小组件消费
```

### 数据包格式

Python爬虫生成的JSON数据包格式：

```json
{
  "lastUpdated": "2024-01-01T12:00:00.000Z",
  "version": "2.0.0",
  "dataSource": "TMDB",
  "totalItems": 20,
  "categories": {
    "trending": {
      "title": "今日热门",
      "count": 20,
      "items": [
        {
          "id": "12345",
          "type": "tmdb",
          "title": "电影标题",
          "genreTitle": "动作•冒险",
          "rating": 8.5,
          "description": "电影简介...",
          "releaseDate": "2024-01-01",
          "posterPath": "https://image.tmdb.org/t/p/w500/poster.jpg",
          "backdropPath": "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
          "titlePosterPath": "file:///path/to/title_poster_12345.jpg",
          "mediaType": "movie",
          "popularity": 1234.5,
          "voteCount": 5678
        }
      ]
    }
  },
  "metadata": {
    "generatedBy": "TMDB Movie Background Crawler",
    "includeTitlePosters": true
  }
}
```

## 🎨 标题海报功能

### 生成效果

标题海报是在电影背景图上叠加以下信息：
- 🎬 电影标题
- ⭐ 评分
- 📅 年份
- 🎭 半透明遮罩（可选）

### 配置选项

在 `config.py` 中自定义标题海报样式：

```python
WIDGET_DATA_FORMAT = {
    "include_title_posters": True,
    "title_poster_config": {
        "enable_overlay": True,
        "font_size": 48,
        "font_color": "white", 
        "shadow_color": "black",
        "shadow_offset": (2, 2),
        "title_position": "bottom_left",  # bottom_left, bottom_center, center
        "include_rating": True,
        "include_year": True,
        "overlay_opacity": 0.7,
        "min_backdrop_width": 1280
    }
}
```

## 🔄 自动化部署

### Cron定时任务

使用示例cron配置：

```bash
# 每天早上6点更新数据
0 6 * * * cd /path/to/project && python main.py run_once

# 每周日清理旧数据  
0 3 * * 0 cd /path/to/project && python main.py cleanup --days 30

# 每小时导出小组件数据（如果有更新）
0 * * * * cd /path/to/project && python main.py export_widget
```

### GitHub Actions（可选）

创建 `.github/workflows/update-data.yml`：

```yaml
name: Update TMDB Data
on:
  schedule:
    - cron: '0 6 * * *'  # 每天6点运行
  workflow_dispatch:  # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v3
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      - name: Run crawler
        env:
          TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
        run: |
          python main.py run_once
          python main.py export_widget
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git commit -m "Auto update TMDB data $(date)" || exit 0
          git push
```

## 🔧 配置说明

### 环境变量

在 `.env` 文件中配置：

```bash
# TMDB API配置（必需）
TMDB_API_KEY=your_api_key_here

# Git配置（可选）
GIT_USERNAME=your_username
GIT_EMAIL=your_email@example.com

# 代理配置（可选）
HTTP_PROXY=http://proxy:port
HTTPS_PROXY=https://proxy:port
```

### 小组件参数

JavaScript小组件支持的参数：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `display_mode` | 枚举 | `title_poster` | 显示模式：title_poster, poster, backdrop |
| `category` | 枚举 | `trending` | 分类：trending, popular, top_rated |
| `max_items` | 枚举 | `10` | 显示数量：5, 10, 15, 20 |
| `language` | 语言 | `zh-CN` | 语言设置 |

## 📊 监控和维护

### 查看状态

```bash
python main.py show_status
```

### 清理数据

```bash
# 清理30天前的数据
python main.py cleanup --days 30
```

### 导出数据

```bash
# 导出原始数据
python main.py export_data --output backup.json

# 导出小组件格式数据
python main.py export_widget
```

## 🐛 故障排除

### 常见问题

1. **TMDB API密钥无效**
   - 检查 `.env` 文件中的API密钥
   - 确认API密钥有效且未过期

2. **Git推送失败**
   - 检查Git仓库权限
   - 确认SSH密钥或访问令牌配置正确

3. **字体加载失败**
   - 确认系统已安装中文字体
   - 检查 `image_downloader.py` 中的字体路径

4. **JavaScript小组件无数据**
   - 检查GitHub数据源URL是否正确
   - 确认数据文件已成功推送到GitHub

### 日志查看

```bash
# 查看最新日志
tail -f logs/crawler.log

# 查看错误日志
grep "ERROR" logs/crawler.log
```

## 🔗 相关链接

- [TMDB API文档](https://developers.themoviedb.org/3)
- [Python Pillow文档](https://pillow.readthedocs.io/)
- [GitPython文档](https://gitpython.readthedocs.io/)

## 📝 版本历史

- **v2.1** - 添加标题海报功能和JavaScript小组件集成
- **v2.0** - 重构代码结构，添加模块化设计
- **v1.0** - 基础TMDB爬虫功能

## 📄 许可证

MIT License - 详见 LICENSE 文件
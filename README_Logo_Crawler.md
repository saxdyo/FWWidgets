# Logo背景图爬取系统

这是一个用于爬取影视平台logo和背景图的完整系统，集成了TMDB数据获取和logo爬取功能。

## 功能特性

### 🎯 核心功能
- **TMDB数据获取**：获取热门影视数据
- **Logo爬取**：自动爬取各平台的logo和背景图
- **平台检测**：根据标题和简介自动检测所属平台
- **数据合并**：将logo数据与TMDB数据合并
- **自动更新**：通过GitHub Actions定时更新

### 📺 支持的平台
- **Netflix** - 网飞
- **Disney+** - 迪士尼+
- **HBO Max** - HBO Max
- **Amazon Prime Video** - 亚马逊Prime视频
- **Hulu** - Hulu
- **Apple TV+** - 苹果TV+

## 文件结构

```
├── get_tmdb_data.py                    # 原始TMDB数据获取脚本
├── get_tmdb_data_with_logos.py         # 集成logo功能的TMDB脚本
├── logo_backdrop_crawler.py            # Logo爬取脚本
├── TMDB_Trending.yml                   # 原始工作流
├── TMDB_Trending_with_logos.yml        # 集成logo的工作流
├── requirements.txt                     # Python依赖
└── data/                               # 数据目录
    ├── TMDB_Trending.json              # 原始TMDB数据
    ├── logo_backdrops.json             # Logo数据
    └── TMDB_Trending_with_logos.json   # 合并后的数据
```

## 安装和使用

### 1. 环境准备

```bash
# 安装依赖
pip install -r requirements.txt
```

### 2. 设置环境变量

```bash
# 设置TMDB API密钥
export TMDB_API_KEY="your_tmdb_api_key_here"
```

### 3. 运行脚本

#### 方式一：分别运行
```bash
# 1. 获取TMDB数据
python get_tmdb_data.py

# 2. 爬取logo数据
python logo_backdrop_crawler.py
```

#### 方式二：集成运行
```bash
# 一次性获取TMDB数据并添加logo信息
python get_tmdb_data_with_logos.py
```

### 4. 自动更新（GitHub Actions）

将 `TMDB_Trending_with_logos.yml` 文件放在 `.github/workflows/` 目录下，系统将每15分钟自动更新数据。

## 数据格式

### TMDB数据格式
```json
{
  "last_updated": "2024-01-01 12:00:00",
  "today_global": [
    {
      "id": 123,
      "title": "电影标题",
      "type": "movie",
      "genreTitle": "动作•冒险",
      "rating": 8.5,
      "release_date": "2024-01-01",
      "overview": "电影简介",
      "poster_url": "海报URL",
      "title_backdrop": "背景图URL",
      "platform": "netflix",
      "platform_logo": "平台logo URL",
      "platform_backdrop": "平台背景图 URL"
    }
  ]
}
```

### Logo数据格式
```json
{
  "last_updated": "2024-01-01 12:00:00",
  "total_websites": 6,
  "websites": [
    {
      "website": "netflix",
      "url": "https://www.netflix.com/",
      "logos": [
        {
          "url": "logo URL",
          "alt": "alt文本",
          "title": "title文本",
          "width": 200,
          "height": 100
        }
      ],
      "backdrops": [
        {
          "url": "背景图URL",
          "type": "css_background",
          "source": "style_tag"
        }
      ],
      "crawled_at": "2024-01-01T12:00:00+08:00"
    }
  ]
}
```

## 平台检测逻辑

系统会根据以下关键词自动检测平台：

- **Netflix**: "netflix", "netflix original", "netflix series"
- **Disney+**: "disney", "disney+", "disney plus", "marvel", "star wars"
- **HBO**: "hbo", "hbo max", "warner bros"
- **Amazon**: "amazon", "prime video", "amazon original"
- **Hulu**: "hulu", "hulu original"
- **Apple TV+**: "apple tv", "apple tv+", "apple original"

## 配置说明

### 爬取配置
在 `logo_backdrop_crawler.py` 中可以修改：
- 目标网站列表
- 爬取延迟时间
- 图片匹配模式

### 工作流配置
在 `.github/workflows/TMDB_Trending_with_logos.yml` 中可以修改：
- 执行频率（当前每15分钟）
- Python版本
- 依赖缓存策略

## 注意事项

### ⚠️ 重要提醒
1. **API限制**：TMDB API有请求限制，请合理使用
2. **爬取频率**：避免过于频繁的爬取，以免被目标网站封禁
3. **数据准确性**：平台检测基于关键词匹配，可能存在误判
4. **图片版权**：爬取的图片可能受版权保护，请谨慎使用

### 🔧 故障排除
1. **API密钥错误**：检查TMDB_API_KEY环境变量
2. **网络超时**：增加timeout参数或检查网络连接
3. **依赖安装失败**：确保Python版本兼容（推荐3.11+）
4. **GitHub Actions失败**：检查仓库权限和密钥设置

## 扩展功能

### 添加新平台
1. 在 `get_platform_logos()` 中添加平台logo映射
2. 在 `detect_platform_from_title()` 中添加关键词
3. 在 `get_logo_sources()` 中添加爬取配置

### 自定义爬取规则
1. 修改正则表达式模式
2. 调整图片筛选逻辑
3. 添加新的数据源

## 许可证

本项目仅供学习和研究使用，请遵守相关法律法规和网站使用条款。
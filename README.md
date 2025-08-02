# 🎬 TMDB电影背景图爬虫

一个自动从TMDB (The Movie Database) API爬取电影背景图并自动更新到Git仓库的Python工具。

## ✨ 功能特性

- 🎯 **多分类爬取**: 支持热门、高评分、正在上映、即将上映等多种电影分类
- 🖼️ **高质量图片**: 下载原始分辨率的电影背景图和海报
- 📁 **智能管理**: 自动文件命名、去重、缩略图生成
- ⏰ **定时任务**: 支持定时自动更新
- 🔄 **Git集成**: 自动提交和推送到Git仓库
- 📊 **数据管理**: 完整的电影数据存储和统计
- 🧹 **自动清理**: 定期清理过期数据和文件

## 📋 系统要求

- Python 3.7+
- Git (可选，用于自动提交)
- TMDB API密钥

## 🚀 快速开始

### 1. 获取TMDB API密钥

1. 访问 [TMDB官网](https://www.themoviedb.org/)
2. 注册账号并登录
3. 前往 [API设置页面](https://www.themoviedb.org/settings/api)
4. 申请API密钥 (免费)

### 2. 安装和配置

```bash
# 1. 克隆或下载项目
git clone <your-repo-url>
cd tmdb-movie-backgrounds

# 2. 运行安装脚本
chmod +x setup.sh
./setup.sh

# 3. 配置API密钥
cp .env.example .env
# 编辑 .env 文件，填入你的TMDB API密钥
nano .env
```

### 3. 测试运行

```bash
# 测试API连接
python main.py status

# 运行一次爬取任务
python main.py run

# 或使用便捷脚本
./run.sh
```

## 💻 使用方法

### 命令行界面

```bash
# 查看当前状态
python main.py status

# 单次爬取（默认：热门+高评分电影）
python main.py run

# 自定义爬取分类
python main.py run --categories popular top_rated now_playing

# 自定义爬取页数
python main.py run --pages 5

# 启动定时调度器（每天6:00自动执行）
python main.py schedule

# 清理旧数据（保留30天）
python main.py cleanup --days 30

# 导出数据
python main.py export --output my_export.json
```

### 便捷脚本

```bash
# 交互式菜单
./run.sh
```

### 定时任务 (Crontab)

```bash
# 编辑定时任务
crontab -e

# 添加以下内容（请修改路径）
0 6 * * * cd /path/to/your/project && source venv/bin/activate && python main.py run >> logs/cron.log 2>&1
```

参考 `crontab.example` 文件获取更多定时任务示例。

## 📁 项目结构

```
tmdb-movie-backgrounds/
├── main.py                 # 主程序入口
├── tmdb_client.py          # TMDB API客户端
├── image_downloader.py     # 图片下载器
├── data_manager.py         # 数据管理器
├── git_manager.py          # Git自动化管理器
├── config.py               # 配置文件
├── requirements.txt        # Python依赖
├── setup.sh               # 安装脚本
├── run.sh                 # 便捷运行脚本
├── crontab.example        # 定时任务示例
├── .env.example           # 环境变量示例
├── movie_backgrounds/     # 图片存储目录
│   ├── backdrops/         # 背景图
│   ├── posters/           # 海报
│   └── thumbnails/        # 缩略图
├── data/                  # 数据文件
│   ├── movies.json        # 电影数据
│   ├── download_log.json  # 下载日志
│   └── metadata.json      # 元数据
├── logs/                  # 日志文件
└── venv/                  # Python虚拟环境
```

## ⚙️ 配置说明

### 环境变量 (.env)

```bash
# TMDB API密钥
TMDB_API_KEY=your_tmdb_api_key_here
```

### 主要配置 (config.py)

```python
# 图片配置
MAX_IMAGES_PER_BATCH = 50      # 每批最大下载数量
IMAGES_DIR = 'movie_backgrounds'

# 定时配置
UPDATE_SCHEDULE = {
    'hour': 6,    # 每天6点执行
    'minute': 0
}

# 请求配置
REQUEST_TIMEOUT = 30           # 请求超时时间
REQUEST_DELAY = 1             # 请求间隔（避免API限制）
```

## 📊 数据格式

### 电影数据示例

```json
{
  "id": 550,
  "title": "Fight Club",
  "original_title": "Fight Club",
  "overview": "A ticking-time-bomb insomniac...",
  "release_date": "1999-10-15",
  "vote_average": 8.4,
  "popularity": 63.869,
  "backdrop_path": "/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  "backdrop_url": "https://image.tmdb.org/t/p/original/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
  "category": "popular"
}
```

### 下载结果示例

```json
{
  "movie_id": 550,
  "title": "Fight Club",
  "backdrop": {
    "backdrop_path": "backdrops/550_Fight_Club_abc123.jpg",
    "thumbnail_path": "thumbnails/thumb_550_Fight_Club_abc123.jpg",
    "file_size": 245760,
    "status": "downloaded"
  }
}
```

## 🔧 高级功能

### Git自动化

项目支持自动Git提交和推送：

```python
# 自动添加、提交、推送
git_manager.auto_sync(
    commit_message="Update movie backgrounds",
    push_to_remote=True
)
```

### 数据管理

```python
# 搜索电影
movies = data_manager.search_movies("fight club")

# 获取统计信息
stats = data_manager.get_statistics()

# 导出数据
data_manager.export_data("backup.json")
```

### 图片处理

```python
# 自动生成缩略图
image_downloader.download_movie_images(
    movies,
    download_backdrops=True,
    download_posters=False
)
```

## 🛠️ 故障排除

### 常见问题

1. **API连接失败**
   ```bash
   # 检查API密钥是否正确
   python main.py status
   ```

2. **依赖安装失败**
   ```bash
   # 升级pip并重新安装
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **权限问题**
   ```bash
   # 设置脚本权限
   chmod +x setup.sh run.sh main.py
   ```

4. **Git推送失败**
   ```bash
   # 检查Git配置和远程仓库
   git remote -v
   git status
   ```

### 日志查看

```bash
# 查看定时任务日志
tail -f logs/cron.log

# 查看下载统计
python main.py status
```

## 📈 性能优化

- **API限制**: 自动控制请求频率，避免API限制
- **文件去重**: 基于URL哈希避免重复下载
- **缓存机制**: 已下载文件自动跳过
- **批量处理**: 支持批量下载和处理
- **内存优化**: 流式下载大文件

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 版本历史

- **v1.0.0** - 初始版本
  - 基础爬取功能
  - Git自动化
  - 定时任务支持

## ⚖️ 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [TMDB](https://www.themoviedb.org/) - 提供电影数据API
- [Python](https://www.python.org/) - 开发语言
- [Pillow](https://pillow.readthedocs.io/) - 图片处理
- [GitPython](https://gitpython.readthedocs.io/) - Git操作

## 📞 支持

如有问题或建议，请：

1. 查看 [FAQ](#🛠️-故障排除)
2. 提交 [Issue](https://github.com/your-username/tmdb-movie-backgrounds/issues)
3. 发送邮件至: your-email@example.com

---

**🎬 享受你的电影背景图收藏之旅！**
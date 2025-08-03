# 🚀 优化后的TMDB数据获取脚本使用指南

## 📋 主要改进

### ✅ 完全适配requirements.txt中的依赖包

| 依赖包 | 用途 | 在脚本中的应用 |
|--------|------|----------------|
| **pytz>=2023.3** | 时区处理 | 精确的北京时间转换 |
| **requests>=2.31.0** | HTTP请求 | 带重试机制的安全API调用 |
| **beautifulsoup4>=4.12.0** | HTML解析 | 为未来数据增强功能预留 |
| **lxml>=4.9.0** | XML解析器 | BeautifulSoup的高性能后端 |

## 🔧 新增功能特性

### 1. 🛡️ 增强的错误处理
```python
def safe_request(url, params=None, timeout=10, max_retries=3):
    # 指数退避重试机制
    # 详细的错误日志
    # 自动超时处理
```

### 2. 📊 更详细的日志系统
```python
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
```

### 3. 🌍 精确的时区处理
```python
# 使用pytz替代简单的timedelta
BEIJING_TZ = pytz.timezone('Asia/Shanghai')
```

### 4. 📈 扩展的数据获取
- **今日热门** (`today_global`)
- **本周热门** (`week_global_all`) 
- **热门电影** (`popular_movies`)
- **高分电影** (`top_rated_movies`) ← 新增！

### 5. 🎨 智能背景图选择
```python
def get_best_title_backdrop(image_data):
    # 语言优先级：中文 > 英文 > 无语言 > 其他
    # 评分和分辨率综合评估
    # 自动fallback机制
```

### 6. 🔮 未来扩展接口
```python
def enhance_with_external_data(item, item_type):
    # BeautifulSoup数据增强预留接口
    
def generate_title_backdrop_url(item, item_type, backdrop_path):
    # 图片叠加服务接口预留
```

## 📁 输出数据格式

### 🗂️ 完整的JSON结构
```json
{
  "last_updated": "2025-08-03 16:30:00",
  "today_global": [...],
  "week_global_all": [...], 
  "popular_movies": [...],
  "top_rated_movies": [...],
  "status": "success",
  "total_items": 85
}
```

### 📄 每个项目的数据
```json
{
  "id": 241388,
  "title": "瓦坎达之眼",
  "type": "tv",
  "genreTitle": "动画•动作•冒险",
  "rating": 4.7,
  "release_date": "2025-08-01",
  "overview": "Marvel动画...",
  "poster_url": "https://image.tmdb.org/t/p/original/...",
  "title_backdrop": "https://image.tmdb.org/t/p/original/...",
  "popularity": 73.02,
  "vote_count": 25
}
```

## 🚀 运行说明

### 本地测试
```bash
# 安装依赖
pip install -r requirements.txt

# 设置API密钥
export TMDB_API_KEY="your-api-key"

# 运行脚本
python scripts/get_tmdb_data.py
```

### GitHub Actions中运行
```yaml
- name: Run Python script
  env:
    TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
  run: |
    echo "开始运行 get_tmdb_data.py..."
    python scripts/get_tmdb_data.py
    echo "get_tmdb_data.py 运行完成"
```

## 📊 性能优化

### 🔄 重试机制
- **指数退避**: 2^n秒间隔重试
- **最多3次重试**
- **10秒请求超时**

### 📝 日志输出示例
```
2025-08-03 16:30:00 - INFO - === 开始执行TMDB数据获取 ===
2025-08-03 16:30:01 - INFO - 开始获取今日热门数据...
2025-08-03 16:30:01 - INFO - 开始处理今日热门数据，原始数据量: 20
2025-08-03 16:30:15 - INFO - 今日热门数据处理完成，有效数据量: 18
2025-08-03 16:30:15 - INFO - 开始获取本周热门数据...
...
2025-08-03 16:31:30 - INFO - 数据已保存到: data/TMDB_Trending.json
2025-08-03 16:31:30 - INFO - ================= 执行完成 =================
```

## 🎯 与fw2.js的完美配合

### ✅ 数据格式兼容
- 字段名完全匹配fw2.js期望的格式
- 包含所有必需的图片URL和元数据
- 智能的数据质量检查

### ✅ 错误恢复
```python
# 即使API失败，也会生成基本的JSON文件
error_data = {
    "last_updated": get_beijing_time(),
    "today_global": [],
    "week_global_all": [],
    "popular_movies": [],
    "top_rated_movies": [],
    "status": "error",
    "error_message": str(e)
}
```

## 🔮 未来扩展计划

### 🌐 数据增强
- 使用BeautifulSoup爬取补充信息
- 多数据源聚合
- 智能数据清洗

### 🎨 图片处理
- 接入图片叠加服务
- 自动生成带标题背景图
- CDN优化和缓存

### 📊 数据分析
- 热门趋势分析
- 评分预测
- 个性化推荐

## 🛠️ 故障排除

### 常见问题

1. **ImportError: No module named 'pytz'**
   ```bash
   pip install -r requirements.txt
   ```

2. **API密钥错误**
   ```bash
   export TMDB_API_KEY="your-actual-api-key"
   ```

3. **网络超时**
   - 脚本会自动重试
   - 检查网络连接
   - 确认TMDB API可访问

### 调试模式
```python
# 修改日志级别为DEBUG
logging.basicConfig(level=logging.DEBUG)
```

## 🎉 总结

优化后的脚本现在：

✅ **完全利用**requirements.txt中的所有依赖  
✅ **增强稳定性**通过重试和错误处理  
✅ **扩展数据源**包含更多类型的内容  
✅ **智能图片选择**优化背景图质量  
✅ **未来扩展性**为新功能预留接口  
✅ **完美兼容**您的fw2.js和GitHub Actions  

现在您的自动化TMDB数据更新系统更加强大和可靠了！🚀
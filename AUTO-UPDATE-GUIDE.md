# 预处理数据自动更新指南

## 🎯 概述

本系统提供自动更新预处理数据的功能，从您的TMDB数据源获取最新数据，更新TMDB_Trending.json，并可选择自动部署到GitHub。

## 📁 文件结构

```
/workspace/
├── auto-update-preprocessed.js    # 自动更新脚本
├── auto-update-and-deploy.sh     # 自动更新和部署服务
├── deploy-preprocessed-data.sh    # 部署脚本
├── logs/                         # 日志目录
│   ├── auto-update.log          # 更新日志
│   └── auto-update.pid          # 进程ID文件
└── data/                         # 数据目录
    └── TMDB_Trending.json       # 生成的预处理数据
```

## 🚀 快速开始

### 1. 手动更新

```bash
# 执行一次手动更新
npm run update:preprocessed

# 或者直接运行脚本
node auto-update-preprocessed.js
```

### 2. 启动自动更新服务

```bash
# 启动自动更新服务（每24小时更新一次）
npm run auto:start

# 或者直接运行
./auto-update-and-deploy.sh start
```

### 3. 查看服务状态

```bash
# 查看服务状态和日志
npm run auto:status

# 或者直接运行
./auto-update-and-deploy.sh status
```

### 4. 停止自动更新服务

```bash
# 停止自动更新服务
npm run auto:stop

# 或者直接运行
./auto-update-and-deploy.sh stop
```

## 📊 更新频率

- **默认间隔**: 24小时
- **数据源**: 您的TMDB数据源
- **更新内容**: 热门电影和剧集
- **数据量**: 最多20项

## 🔧 配置选项

### 修改更新间隔

编辑 `auto-update-preprocessed.js` 中的配置：

```javascript
const CONFIG = {
    UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
    MAX_ITEMS: 20
};
```

### 修改数据源

```javascript
const CONFIG = {
    DATA_SOURCES: {
        TRENDING: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-trending.json',
        MOVIES: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-movies.json',
        TV: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-tv.json'
    }
};
```

## 📝 可用命令

### NPM脚本

| 命令 | 说明 |
|------|------|
| `npm run update:preprocessed` | 执行一次手动更新 |
| `npm run auto:start` | 启动自动更新服务 |
| `npm run auto:stop` | 停止自动更新服务 |
| `npm run auto:status` | 查看服务状态 |
| `npm run auto:update` | 手动更新并询问是否部署 |

### 直接脚本

| 命令 | 说明 |
|------|------|
| `./auto-update-and-deploy.sh start` | 启动自动更新服务 |
| `./auto-update-and-deploy.sh stop` | 停止自动更新服务 |
| `./auto-update-and-deploy.sh status` | 查看服务状态 |
| `./auto-update-and-deploy.sh update` | 手动更新 |
| `./auto-update-and-deploy.sh help` | 显示帮助信息 |

## 📈 数据流程

### 1. 数据获取
- 从TMDB热门数据获取8项
- 从TMDB电影数据获取6项
- 从TMDB剧集数据获取6项
- 合并并限制为20项

### 2. 数据转换
- 转换为预处理数据格式
- 生成类型标题
- 构建图片URL
- 添加更新时间戳

### 3. 数据保存
- 保存为TMDB_Trending.json
- 记录更新统计
- 写入日志文件

## 🧪 测试验证

### 1. 测试数据更新

```bash
# 执行更新
npm run update:preprocessed

# 检查生成的数据
ls -la data/TMDB_Trending.json
```

### 2. 测试数据内容

```bash
# 查看数据统计
node -e "const data = JSON.parse(require('fs').readFileSync('data/TMDB_Trending.json', 'utf8')); let count = 0; for (let key in data) { if (key !== 'last_updated') count++; } console.log('数据项数:', count);"
```

### 3. 测试远程访问

```bash
# 部署后测试
npm run test:preprocessed
```

## 🔄 自动化部署

### 1. 手动更新并部署

```bash
# 执行更新
npm run update:preprocessed

# 部署到GitHub
npm run deploy:preprocessed
```

### 2. 自动更新并部署

```bash
# 启动自动更新服务（包含部署）
npm run auto:start
```

## 📊 监控和日志

### 1. 查看服务状态

```bash
npm run auto:status
```

输出示例：
```
📊 自动更新服务状态:
✅ 服务正在运行 (PID: 12345)

📝 最新日志:
[2025-08-03 08:30:50] 启动自动更新服务
[2025-08-03 08:30:51] 更新成功
[2025-08-03 08:30:52] 部署成功
```

### 2. 查看详细日志

```bash
tail -f logs/auto-update.log
```

### 3. 检查进程

```bash
ps aux | grep auto-update
```

## 🛠️ 故障排除

### 1. 服务无法启动

```bash
# 检查PID文件
ls -la logs/auto-update.pid

# 清理PID文件
rm -f logs/auto-update.pid

# 重新启动
npm run auto:start
```

### 2. 数据更新失败

```bash
# 检查网络连接
curl -I "https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-trending.json"

# 手动测试更新
npm run update:preprocessed
```

### 3. 部署失败

```bash
# 检查Git状态
git status

# 手动部署
./deploy-preprocessed-data.sh
```

## 📋 最佳实践

### 1. 定期检查

- 每周检查一次服务状态
- 每月查看更新日志
- 定期验证数据质量

### 2. 备份策略

- 保留最近的数据备份
- 记录重要的更新历史
- 定期清理旧日志

### 3. 监控告警

- 设置更新失败告警
- 监控数据源可用性
- 跟踪更新频率

## 🔧 高级配置

### 1. 自定义更新间隔

```javascript
// 修改为12小时更新一次
UPDATE_INTERVAL: 12 * 60 * 60 * 1000
```

### 2. 添加更多数据源

```javascript
DATA_SOURCES: {
    TRENDING: '...',
    MOVIES: '...',
    TV: '...',
    ANIME: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-anime.json'
}
```

### 3. 自定义数据格式

```javascript
convertToPreprocessedFormat(data) {
    // 自定义转换逻辑
    return customFormat;
}
```

---

**最后更新**: 2025-08-03
**版本**: 1.0.0
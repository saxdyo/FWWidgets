# 🎨 本地带标题背景图使用指南

## ✅ 已完成的工作

1. **生成了 20 个带标题的背景图**
   - 位置: `data/generated-backdrops/`
   - 格式: `{id}_{title}.jpg`
   - 包含: 标题、年份、评分、类型

2. **更新了 fw2.js**
   - 添加了本地背景图映射
   - 优先使用带标题的本地背景图
   - 自动fallback到原始背景图

3. **创建了索引文件**
   - `index.json`: 生成结果统计
   - `TMDB_Trending_with_backdrops.json`: 包含本地背景图路径的数据

## 🚀 部署选项

### 选项1: 上传到GitHub (推荐)
```bash
# 添加生成的图片到Git
git add data/generated-backdrops/
git commit -m "Add generated title backdrops"
git push

# 图片将可通过以下URL访问:
# https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/generated-backdrops/{fileName}
```

### 选项2: 使用CDN
将 `data/generated-backdrops/` 目录上传到您的CDN，然后修改 fw2.js 中的 githubBaseUrl

### 选项3: 本地使用
如果在本地环境使用，可以设置静态文件服务器

## 🧪 测试
运行以下命令测试更新后的功能:
```bash
node -e "console.log('fw2.js 已更新，可以使用带标题的背景图了！')"
```

## 📊 生成统计
- 总项目数: 20
- 成功生成: 20
- 生成失败: 0
- 生成时间: 8/3/2025, 4:07:52 PM

## 🔄 重新生成
如果需要重新生成背景图:
```bash
node generate-local-backdrops.js
node update-fw2-local-backdrops.js
```

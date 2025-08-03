# 🎨 带标题背景图使用说明

## ✅ 当前状态

✅ **已生成**: 19 个带标题背景图
✅ **已配置**: fw2.js包含本地背景图支持  
✅ **已就绪**: 可以立即使用

## 🖼️ 背景图特点

- **分辨率**: 1280x720 高清
- **内容**: 包含标题、年份、评分、类型
- **效果**: 渐变遮罩 + 文字阴影
- **格式**: JPEG，优化压缩

## 🚀 立即使用方法

### 方法1: 上传到GitHub（推荐）

```bash
# 添加背景图到Git
git add data/generated-backdrops/
git commit -m "Add title backdrops"
git push

# 背景图将通过以下URL访问:
# https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/generated-backdrops/{fileName}
```

### 方法2: 使用本地服务器

```bash
# 启动简单的HTTP服务器
cd data/generated-backdrops
python3 -m http.server 8080

# 然后修改fw2.js中的githubBaseUrl为:
# http://localhost:8080/
```

### 方法3: 上传到CDN

将 `data/generated-backdrops/` 上传到您的CDN，然后修改fw2.js中的BASE_URL。

## 🎯 在fw2.js中的效果

当用户选择"预处理数据"模式时，fw2.js会：

1. **优先使用**带标题的本地背景图
2. **自动回退**到原始TMDB背景图（如果本地图片不可用）
3. **保持兼容**所有现有功能

## 📊 生成的背景图列表

1. **瓦坎达之眼** - `241388_瓦坎达之眼.jpg`
2. **哪吒之魔童闹海** - `980477_哪吒之魔童闹海.jpg`
3. **惊变28年** - `1100988_惊变28年.jpg`
4. **爱在牛津的一年** - `1307078_爱在牛津的一年.jpg`
5. **战酋** - `196890_战酋.jpg`
6. **世界大战** - `755898_世界大战.jpg`
7. **神奇4侠：初露锋芒** - `617126_神奇4侠初露锋芒.jpg`
8. **新白头神探** - `1035259_新白头神探.jpg`
9. **世界大战** - `755898_世界大战.jpg`
10. **新·驯龙高手** - `1087192_新驯龙高手.jpg`
11. **鬼灭之刃剧场版：无限城篇Part.1** - `1311031_鬼灭之刃剧场版无限城篇Part1.jpg`
12. **Night Carnage** - `986206_Night Carnage.jpg`
13. **高尔夫球也疯狂2** - `1263256_高尔夫球也疯狂2.jpg`
14. **星际宝贝史迪奇** - `552524_星际宝贝史迪奇.jpg`
15. **Barátok közt** - `50821_Bartok kzt.jpg`
16. **哆啦A梦** - `65733_哆啦A梦.jpg`
17. **拔作岛** - `244808_拔作岛.jpg`
18. **一切从这里开始** - `112470_一切从这里开始.jpg`
19. **黄金渔场之明星电台** - `65270_黄金渔场之明星电台.jpg`
20. **认识的哥哥** - `70672_认识的哥哥.jpg`

## 🔄 重新生成背景图

如果需要重新生成或添加新的背景图：

```bash
# 重新生成所有背景图
node generate-local-backdrops.js

# 更新fw2.js配置
node update-fw2-local-backdrops.js
```

## 🧪 测试功能

在fw2.js中设置参数：
- `use_preprocessed_data`: "true" 
- `content_type`: "today"

应该能看到带标题的背景图！

---
生成时间: 8/3/2025, 4:14:46 PM

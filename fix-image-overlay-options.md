# 🔧 修复Image Overlay背景图服务的选择方案

## 🚨 问题确认

您的观察是正确的！确实存在两个404错误：
1. `https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json` ❌
2. `https://image-overlay.vercel.app/api/backdrop` ❌

## 🎯 解决方案选择

### 选择1：快速修复 - 使用原图而不是带标题的背景图

修改 `fw2.js`，使用原始TMDB背景图：

```javascript
// 在 loadTmdbTrendingFromPreprocessed 函数中修改
const widgetItem = {
  id: item.id.toString(),
  type: "tmdb",
  title: item.title,
  description: item.overview,
  releaseDate: item.release_date || item.releaseDate,
  posterPath: imageUrls.posterPath,
  coverUrl: imageUrls.coverUrl,
  // 使用原始背景图而不是带标题的
  backdropPath: imageUrls.backdropPath,
  backdropUrls: imageUrls.backdropUrls,
  // title_backdrop: item.title_backdrop, // 注释掉这行
  rating: item.rating,
  mediaType: item.type || item.mediaType,
  genreTitle: item.genreTitle,
  popularity: item.popularity || 0,
  voteCount: item.vote_count || item.voteCount || 0,
  link: null,
  duration: 0,
  durationText: "",
  episode: 0,
  childItems: []
};
```

### 选择2：推荐方案 - 部署您自己的Image Overlay服务

1. **按照 `vercel-deployment-guide.md` 部署您的服务**
2. **更新 fw2.js 中的服务URL**

```javascript
// 修改数据生成逻辑，使用您的服务
const generateTitleBackdrop = (originalBackdrop, title, year, rating, type) => {
  const YOUR_SERVICE_URL = "https://您的项目名.vercel.app";
  const params = new URLSearchParams({
    bg: originalBackdrop,
    title: title,
    year: year || '',
    rating: rating || '',
    type: type || 'movie'
  });
  return `${YOUR_SERVICE_URL}/api/backdrop?${params.toString()}`;
};
```

### 选择3：混合方案 - 先修复数据加载，后续添加图片服务

1. **立即修复**：让 fw2.js 正常工作（使用原图）
2. **后续升级**：部署image-overlay服务并更新配置

## 🛠️ 立即可用的修复代码

```javascript
// 在 fw2.js 中添加这个辅助函数
function getBackdropUrl(item) {
  // 如果有title_backdrop且服务可用，使用它
  if (item.title_backdrop && !item.title_backdrop.includes('image-overlay.vercel.app')) {
    return item.title_backdrop;
  }
  
  // 否则使用原始背景图
  if (item.backdropPath) {
    return `https://image.tmdb.org/t/p/original${item.backdropPath}`;
  }
  
  // 从poster_url或posterPath构建背景图URL
  const posterPath = item.poster_url || item.posterPath;
  if (posterPath) {
    if (posterPath.startsWith('https://')) {
      return posterPath.replace('/t/p/original/', '/t/p/w1280/');
    } else {
      return `https://image.tmdb.org/t/p/w1280${posterPath}`;
    }
  }
  
  return null;
}

// 在widgetItem构建时使用
const widgetItem = {
  // ... 其他字段
  backdropPath: getBackdropUrl(item),
  backdropUrls: getBackdropUrl(item) ? [getBackdropUrl(item)] : [],
  // ... 其他字段
};
```

## 📊 推荐执行顺序

1. **立即**：应用"选择1"的快速修复，让系统正常工作
2. **短期内**：按照指南部署您自己的image-overlay服务  
3. **部署完成后**：更新fw2.js使用您的新服务
4. **验证**：确保带标题的背景图正常生成

## 🎉 最终效果

完成后您将拥有：
- ✅ 稳定工作的预处理数据加载
- ✅ 您自己控制的带标题背景图服务
- ✅ 完全独立的解决方案，不依赖外部失效的服务
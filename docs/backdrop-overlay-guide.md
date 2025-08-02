# TMDB带标题背景图CSS叠加方案使用指南

## 📖 概述

本方案使用CSS叠加技术在前端显示带标题的高质量背景图，无需预生成图片，提供最佳性能和用户体验。

## 🚀 快速开始

### 1. 引入CSS样式

```html
<link rel="stylesheet" href="styles/backdrop-overlay.css">
```

### 2. 引入JavaScript渲染器

```html
<script src="js/backdrop-renderer.js"></script>
```

### 3. 创建容器

```html
<div id="backdropContainer"></div>
```

### 4. 初始化渲染器

```javascript
const renderer = new BackdropRenderer(document.getElementById('backdropContainer'), {
    layout: 'grid', // 'grid' | 'list'
    showRating: true,
    showYear: true,
    showType: true,
    animation: true
});

// 渲染数据
renderer.render(backdropData);
```

## 📊 数据格式

### 标准数据格式

```javascript
const backdropData = [
    {
        id: 552524,
        title: "星际宝贝史迪奇",
        type: "movie",
        // CSS叠加所需字段
        originalBackdrop: "https://image.tmdb.org/t/p/original/9qqYLAHCpA4gLUl7Irhm2SBZr5X.jpg",
        backdropTitle: "星际宝贝史迪奇",
        backdropYear: "2025",
        backdropRating: "7.2",
        backdropType: "movie",
        description: "讲述孤独的夏威夷小女孩莉萝和看起来调皮捣蛋的外星生物史迪奇的冒险故事。"
    }
];
```

### fw2.js数据格式

从`fw2.js`的`loadTmdbTitleBackdropData`函数返回的数据已包含所需字段：

```javascript
{
    // 基础字段
    id: item.id,
    title: item.title,
    type: item.type,
    
    // CSS叠加字段
    originalBackdrop: item.original_backdrop || item.title_backdrop,
    backdropTitle: item.backdrop_title || item.title,
    backdropYear: item.backdrop_year || '',
    backdropRating: item.backdrop_rating || '',
    backdropType: item.backdrop_type || item.type,
    
    // 标识字段
    cssBackdropClass: 'backdrop-card-css',
    hasBackdropOverlay: true
}
```

## 🎨 样式定制

### 基础样式类

- `.backdrop-card` - 背景卡片容器
- `.backdrop-overlay` - 渐变遮罩层
- `.backdrop-title` - 标题样式
- `.backdrop-info` - 信息栏容器
- `.backdrop-rating` - 评分样式
- `.backdrop-year` - 年份样式
- `.backdrop-type` - 类型标签样式

### 布局类

- `.backdrop-grid` - 网格布局
- `.backdrop-list` - 列表布局

### 响应式断点

- `@media (max-width: 768px)` - 平板设备
- `@media (max-width: 480px)` - 手机设备

### 主题适配

```css
[data-theme="dark"] .backdrop-card {
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
}
```

## ⚙️ 配置选项

### 渲染器选项

```javascript
const options = {
    layout: 'grid',        // 布局类型: 'grid' | 'list'
    showRating: true,      // 显示评分
    showYear: true,        // 显示年份
    showType: true,        // 显示类型
    animation: true        // 启用动画
};
```

### 动态更新选项

```javascript
// 更新布局
renderer.updateLayout('list');

// 更新显示选项
renderer.updateOptions({
    showRating: false,
    showYear: true
});
```

## 🎯 事件处理

### 点击事件

```javascript
// 监听背景图点击
document.addEventListener('backdropClick', (e) => {
    const { item, element } = e.detail;
    console.log('点击的项目:', item);
    console.log('点击的元素:', element);
});
```

### 自定义点击处理

```javascript
// 重写点击处理
renderer.handleItemClick = (item, element) => {
    // 自定义处理逻辑
    window.location.href = `/detail/${item.type}/${item.id}`;
};
```

## 🔧 与fw2.js集成

### 1. 在fw2.js中调用

```javascript
// 在fw2.js的模块中调用
async function loadTmdbTitleBackdropData(params = {}) {
    // ... 数据获取逻辑 ...
    
    return {
        items: processedItems,
        total: totalItems,
        page: currentPage,
        hasMore: hasMorePages,
        // 添加渲染器标识
        renderer: 'backdrop-overlay',
        cssClass: 'backdrop-card-css'
    };
}
```

### 2. 前端渲染

```javascript
// 在Forward Widget环境中
if (data.renderer === 'backdrop-overlay') {
    const renderer = new BackdropRenderer(container, {
        layout: 'grid',
        showRating: true,
        showYear: true,
        showType: true
    });
    renderer.render(data.items);
}
```

## 📱 响应式设计

### 移动端优化

- 自动调整卡片高度
- 优化字体大小
- 简化信息显示
- 触摸友好的交互

### 性能优化

- 图片懒加载
- CSS动画优化
- 内存管理
- 事件委托

## 🎨 自定义主题

### 创建自定义主题

```css
/* 自定义主题 */
.backdrop-card.custom-theme {
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.backdrop-card.custom-theme .backdrop-overlay {
    background: linear-gradient(
        transparent 0%,
        rgba(255, 0, 0, 0.3) 40%,
        rgba(255, 0, 0, 0.7) 70%,
        rgba(255, 0, 0, 0.9) 100%
    );
}
```

## 🔍 调试和故障排除

### 常见问题

1. **图片不显示**
   - 检查`originalBackdrop`字段
   - 验证图片URL可访问性
   - 检查网络连接

2. **样式不生效**
   - 确认CSS文件已正确引入
   - 检查CSS选择器优先级
   - 验证浏览器兼容性

3. **动画不流畅**
   - 检查设备性能
   - 优化图片大小
   - 减少同时渲染的卡片数量

### 调试工具

```javascript
// 启用调试模式
renderer.debug = true;

// 检查数据格式
console.log('渲染数据:', backdropData);

// 检查DOM结构
console.log('容器元素:', renderer.container);
```

## 📈 性能监控

### 性能指标

- 渲染时间
- 内存使用
- 图片加载时间
- 用户交互响应时间

### 监控代码

```javascript
// 性能监控
const startTime = performance.now();
renderer.render(data);
const endTime = performance.now();
console.log(`渲染耗时: ${endTime - startTime}ms`);
```

## 🔄 更新和维护

### 数据更新

- 每6小时自动更新数据包
- 实时API调用作为备用
- 本地缓存机制

### 版本兼容性

- 向后兼容旧数据格式
- 渐进式功能增强
- 平滑升级路径

## 📚 示例和演示

### 完整示例

查看 `examples/backdrop-demo.html` 获取完整的使用示例。

### 在线演示

访问演示页面查看实际效果和交互。

## 🤝 贡献指南

### 开发环境

1. 克隆仓库
2. 安装依赖
3. 运行示例
4. 提交改进

### 代码规范

- 使用ES6+语法
- 遵循JSDoc注释规范
- 保持代码简洁可读
- 添加适当的错误处理

---

**🎉 恭喜！您已成功部署TMDB带标题背景图CSS叠加方案！**
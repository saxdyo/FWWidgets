# 🔧 title_backdrop 故障排除指南

## ❗ **问题说明**
您的 `title_backdrop` 没有生成标题背景图

## 🔍 **诊断结果**
根据我们的测试，所有功能都应该正常工作：
- ✅ `generateTitleBackdropUrl` 函数正常
- ✅ API模式处理逻辑正确
- ✅ 预处理模式升级逻辑正确
- ✅ OG服务 `og-image.sznm.dev` 可用

## 🛠️ **解决方案**

### 1️⃣ **立即尝试: 清除缓存**
```
1. 打开浏览器开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"
4. 或者按 Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

### 2️⃣ **检查Widget设置**
在您的TMDB Widget设置中确认：
```
数据来源类型: TMDB API（带标题背景图） [推荐]
或
数据来源类型: 预处理数据（实验性）
```

### 3️⃣ **确认使用最新的fw2.js文件**
下载最新版本：
```
https://raw.githubusercontent.com/saxdyo/FWWidgets/main/fw2.js
```

### 4️⃣ **检查浏览器控制台**
1. 打开浏览器开发者工具 (F12)
2. 切换到"控制台"标签
3. 刷新页面，查看是否有以下日志：
   ```
   ✅ 使用OG服务生成: https://og-image.sznm.dev/api/og?title=...
   ```

### 5️⃣ **手动测试生成的URL**
复制以下测试URL到浏览器中打开：
```
https://og-image.sznm.dev/api/og?title=测试电影&subtitle=2024+•+⭐+8.5+•+movie
```
如果能看到图片，说明服务正常。

## 🎯 **具体检查步骤**

### 🔍 **步骤1: 验证Widget设置**
1. 打开您的TMDB Widget设置
2. 找到"数据来源类型"选项
3. 确认选择的是 **API模式** 或 **预处理模式**
4. 保存设置并刷新

### 🔍 **步骤2: 检查数据输出**
在浏览器控制台运行以下代码检查数据：
```javascript
// 检查Widget数据
console.log('Widget Items:', window.widgetItems);
// 查看是否有title_backdrop字段
if (window.widgetItems && window.widgetItems[0]) {
    console.log('First item title_backdrop:', window.widgetItems[0].title_backdrop);
}
```

### 🔍 **步骤3: 手动触发函数**
在控制台运行：
```javascript
// 手动测试生成函数
function testGenerate() {
    const url = generateTitleBackdropUrl('测试', '2024', '8.5', 'movie');
    console.log('Generated URL:', url);
    return url;
}
testGenerate();
```

## 🚨 **可能的具体原因**

### ❌ **原因1: 使用了旧版本fw2.js**
**解决**: 重新下载最新的fw2.js文件

### ❌ **原因2: 浏览器缓存**
**解决**: 强制刷新 (Ctrl+Shift+R)

### ❌ **原因3: Widget设置错误**
**解决**: 确认数据来源设置正确

### ❌ **原因4: 函数未定义**
**解决**: 检查fw2.js文件是否完整加载

### ❌ **原因5: 网络问题**
**解决**: 检查能否访问 `og-image.sznm.dev`

## 🧪 **快速验证**

### 测试API模式：
```javascript
// 模拟API数据
const testItem = {
    title: '复仇者联盟',
    media_type: 'movie', 
    vote_average: 8.5,
    release_date: '2023-01-01',
    backdrop_path: '/test.jpg'
};

// 应该生成：
// title_backdrop: "https://og-image.sznm.dev/api/og?title=复仇者联盟&subtitle=2023+•+⭐+8.5+•+movie"
```

### 测试预处理模式：
```javascript
// 模拟预处理数据（带旧链接）
const testItem = {
    title: '复仇者联盟',
    title_backdrop: 'https://image-overlay.vercel.app/api/backdrop?bg=test&title=复仇者联盟&year=2023&rating=8.5&type=movie'
};

// 应该自动升级为：
// title_backdrop: "https://og-image.sznm.dev/api/og?title=复仇者联盟&subtitle=2023+•+⭐+8.5+•+movie"
```

## ✅ **成功标志**

当一切正常工作时，您应该看到：
1. 🖼️ **电影海报上有标题覆盖**
2. 📱 **控制台显示生成日志**
3. 🔗 **title_backdrop字段包含og-image.sznm.dev链接**
4. 🎨 **图片包含电影标题、年份、评分、类型**

## 🆘 **仍然不工作？**

### 请提供以下信息：
1. **使用的数据源模式**: API 还是 预处理数据？
2. **浏览器控制台输出**: 有什么错误或日志？
3. **网络检查**: 能否访问测试URL？
4. **fw2.js版本**: 文件大小和修改时间？

### 强制调试模式：
```javascript
// 在控制台运行，强制启用调试
localStorage.setItem('tmdb_debug', 'true');
// 然后刷新页面
```

---

## 📋 **诊断清单**

请逐一检查：
- [ ] 使用最新版fw2.js文件
- [ ] 清除浏览器缓存
- [ ] 确认Widget数据源设置
- [ ] 检查控制台错误信息
- [ ] 验证OG服务可访问性
- [ ] 检查title_backdrop字段值

**如果所有步骤都完成但仍有问题，可能需要查看具体的错误日志来进一步诊断。**
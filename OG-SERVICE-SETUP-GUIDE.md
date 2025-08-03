# 🚀 OG服务设置完整指南 - fw-widgets.vercel.app

## 📋 **目标**
在您的域名 `fw-widgets.vercel.app` 上设置OG图片生成服务，用于生成带标题的背景图。

## 🛠️ **步骤1: 创建项目文件**

### 📁 **创建项目目录结构**
```
my-og-service/
├── package.json
├── pages/
│   ├── api/
│   │   └── og.js
│   └── index.js
└── vercel.json (可选)
```

### 📦 **package.json**
```json
{
  "name": "fw-widgets-og-service",
  "version": "1.0.0",
  "description": "OG图片生成服务 for TMDB Widget",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@vercel/og": "^0.6.2"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### 🎨 **pages/api/og.js** (核心文件)
```javascript
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // 获取参数
    const title = searchParams.get('title') || '默认标题';
    const subtitle = searchParams.get('subtitle') || '副标题';
    
    // 解码URL编码的中文
    const decodedTitle = decodeURIComponent(title);
    const decodedSubtitle = decodeURIComponent(subtitle);
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            backgroundImage: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)',
            position: 'relative',
          }}
        >
          {/* 装饰背景 */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)',
              opacity: 0.1,
            }}
          />
          
          {/* 主标题 */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: 20,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              lineHeight: 1.1,
              maxWidth: '90%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {decodedTitle}
          </div>
          
          {/* 副标题 */}
          <div
            style={{
              fontSize: 32,
              color: '#a0a0a0',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {decodedSubtitle}
          </div>
          
          {/* 装饰元素 */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: 24,
              color: '#666',
              display: 'flex',
            }}
          >
            🎬 TMDB Widget
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: await fetch(
              new URL('../../public/fonts/Inter-Bold.woff', import.meta.url)
            ).then((res) => res.arrayBuffer()).catch(() => null),
            weight: 700,
            style: 'normal',
          },
        ].filter(Boolean),
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('生成图片失败', {
      status: 500,
    });
  }
}
```

### 🏠 **pages/index.js** (主页)
```javascript
export default function Home() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>🎬 TMDB Widget OG服务</h1>
      <p>这是为TMDB Widget提供的OG图片生成服务</p>
      
      <h2>📖 使用方法:</h2>
      <p>在URL后面加上参数：</p>
      <code style={{
        backgroundColor: '#f5f5f5',
        padding: '10px',
        display: 'block',
        margin: '20px 0',
        borderRadius: '5px'
      }}>
        /api/og?title=电影标题&subtitle=2024+•+⭐+8.5+•+movie
      </code>
      
      <h2>🎨 示例效果:</h2>
      <img
        src="/api/og?title=瓦坎达之眼&subtitle=2025+•+⭐+4.7+•+tv"
        alt="示例图片"
        style={{ 
          maxWidth: '100%', 
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginTop: '20px'
        }}
      />
      
      <h2>✨ 支持功能:</h2>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>✅ 完美支持中文标题</li>
        <li>✅ 自动URL解码</li>
        <li>✅ 精美的渐变背景</li>
        <li>✅ 专业的排版设计</li>
        <li>✅ 高性能Edge运行时</li>
      </ul>
    </div>
  );
}
```

### ⚙️ **vercel.json** (可选配置)
```json
{
  "functions": {
    "pages/api/og.js": {
      "memory": 1024
    }
  }
}
```

---

## 🚀 **步骤2: 部署到Vercel**

### 🔧 **方法1: 通过Vercel CLI (推荐)**
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 在项目目录中
cd my-og-service
npm install

# 3. 部署
vercel

# 4. 设置自定义域名
vercel domains add fw-widgets.vercel.app
```

### 🌐 **方法2: 通过GitHub + Vercel网站**
1. 将代码推送到GitHub仓库
2. 访问 [vercel.com](https://vercel.com)
3. 点击"Import Project"
4. 选择您的GitHub仓库
5. 在设置中添加自定义域名 `fw-widgets.vercel.app`

---

## 🧪 **步骤3: 测试服务**

### ✅ **测试URL示例**
```
# 中文电影
https://fw-widgets.vercel.app/api/og?title=瓦坎达之眼&subtitle=2025+•+⭐+4.7+•+tv

# 英文电影
https://fw-widgets.vercel.app/api/og?title=Avengers&subtitle=2023+•+⭐+9.0+•+movie

# 测试主页
https://fw-widgets.vercel.app/
```

### 🔍 **验证命令**
```bash
# 检查状态
curl -I "https://fw-widgets.vercel.app/api/og?title=test&subtitle=2024+movie"

# 应该返回:
# HTTP/2 200
# content-type: image/png
```

---

## 🎯 **步骤4: 更新您的Widget配置**

一旦您的OG服务部署成功，数据包中的链接将自动工作：

```javascript
// 示例URL (已经配置好)
title_backdrop: "https://fw-widgets.vercel.app/api/og?title=惊变28年&subtitle=2025+•+⭐+6.9+•+movie"
```

---

## 🎨 **自定义样式 (可选)**

### 🖼️ **修改视觉效果**
您可以在 `pages/api/og.js` 中自定义：

- **背景颜色**: 修改 `backgroundColor` 和 `backgroundImage`
- **字体大小**: 调整 `fontSize` 值
- **颜色方案**: 更改 `color` 属性
- **布局**: 调整 `flexDirection`, `alignItems` 等

### 🎭 **添加更多元素**
```javascript
// 在ImageResponse中添加:
<div style={{
  position: 'absolute',
  top: '20px',
  left: '20px',
  fontSize: 20,
  color: '#fff'
}}>
  🎬 {movieGenre}
</div>
```

---

## 🚨 **常见问题解决**

### ❌ **问题1: 部署失败**
```bash
# 解决方案: 检查package.json
npm install
vercel --debug
```

### ❌ **问题2: 中文显示乱码**
```javascript
// 确保在og.js中正确解码
const decodedTitle = decodeURIComponent(title);
```

### ❌ **问题3: 图片生成慢**
```json
// 在vercel.json中增加内存
{
  "functions": {
    "pages/api/og.js": {
      "memory": 1024
    }
  }
}
```

### ❌ **问题4: 域名无法访问**
1. 检查Vercel项目设置中的Domains部分
2. 确认DNS已正确配置
3. 等待DNS传播 (可能需要几分钟)

---

## ✅ **完成清单**

- [ ] 创建项目文件
- [ ] 配置package.json
- [ ] 实现pages/api/og.js
- [ ] 部署到Vercel
- [ ] 设置自定义域名 fw-widgets.vercel.app
- [ ] 测试OG服务
- [ ] 验证Widget中的title_backdrop链接

---

## 🎉 **成功标志**

当一切设置完成后，您应该能：

1. ✅ 访问 `https://fw-widgets.vercel.app/`
2. ✅ 生成图片 `https://fw-widgets.vercel.app/api/og?title=测试&subtitle=2024`
3. ✅ 在Widget中看到完美的带标题背景图
4. ✅ 支持中文标题显示

**🎬 祝您设置成功！您的TMDB Widget将拥有专属的带标题背景图服务！** ✨
# 🚀 在Vercel部署Image Overlay背景图服务指南

## 📋 概述

这个指南将帮助您在Vercel上部署一个能够生成带标题背景图的服务，类似于 `image-overlay.vercel.app`。

## 🛠️ 准备工作

### 1. 项目结构

创建一个新的项目目录：
```
image-overlay-service/
├── api/
│   └── backdrop.js
├── package.json
├── vercel.json
└── README.md
```

### 2. 创建 package.json

```json
{
  "name": "image-overlay-service",
  "version": "1.0.0",
  "description": "生成带标题的TMDB背景图服务",
  "main": "api/backdrop.js",
  "scripts": {
    "dev": "vercel dev",
    "build": "echo 'Build completed'"
  },
  "dependencies": {
    "sharp": "^0.32.6",
    "axios": "^1.6.0"
  },
  "engines": {
    "node": "18.x"
  }
}
```

## 📝 核心代码

### 创建 `api/backdrop.js`

```javascript
import sharp from 'sharp';
import axios from 'axios';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { bg, title, year, rating, type } = req.query;
    
    if (!bg) {
      return res.status(400).json({ error: '缺少背景图URL参数' });
    }
    
    // 下载背景图
    const backgroundResponse = await axios.get(decodeURIComponent(bg), { 
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageOverlay/1.0)'
      }
    });
    
    const backgroundBuffer = Buffer.from(backgroundResponse.data);
    
    // 获取图片信息并调整尺寸
    const imageInfo = await sharp(backgroundBuffer).metadata();
    const targetWidth = 1280;
    const targetHeight = 720;
    
    // 创建带标题的SVG叠加层
    const titleText = decodeURIComponent(title || '未知标题');
    const yearText = year ? `${year}年` : '';
    const ratingText = rating ? `⭐${rating}分` : '';
    const typeText = type === 'movie' ? '电影' : type === 'tv' ? '剧集' : '';
    
    const svgOverlay = `
      <svg width="${targetWidth}" height="${targetHeight}" xmlns="http://www.w3.org/2000/svg">
        <!-- 渐变遮罩 -->
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0.1)"/>
            <stop offset="60%" style="stop-color:rgba(0,0,0,0.3)"/>
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.7)"/>
          </linearGradient>
        </defs>
        
        <rect width="${targetWidth}" height="${targetHeight}" fill="url(#fadeGradient)"/>
        
        <!-- 主标题 -->
        <text x="${targetWidth/2}" y="${targetHeight/2 - 30}" 
              font-family="Arial, Microsoft YaHei, sans-serif" 
              font-size="52" 
              font-weight="bold" 
              fill="white" 
              text-anchor="middle" 
              stroke="rgba(0,0,0,0.8)" 
              stroke-width="3">
          ${titleText}
        </text>
        
        <!-- 副标题信息 -->
        <text x="${targetWidth/2}" y="${targetHeight/2 + 30}" 
              font-family="Arial, Microsoft YaHei, sans-serif" 
              font-size="28" 
              fill="white" 
              text-anchor="middle" 
              stroke="rgba(0,0,0,0.6)" 
              stroke-width="2">
          ${[yearText, ratingText, typeText].filter(Boolean).join(' • ')}
        </text>
      </svg>
    `;
    
    // 处理图片：调整尺寸并叠加文字
    const result = await sharp(backgroundBuffer)
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ 
        quality: 85,
        progressive: true 
      })
      .toBuffer();
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('CDN-Cache-Control', 'public, max-age=86400');
    
    return res.send(result);
    
  } catch (error) {
    console.error('图片处理失败:', error);
    
    // 返回错误信息
    res.status(500).json({ 
      error: '图片处理失败',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 创建 `vercel.json`

```json
{
  "version": 2,
  "functions": {
    "api/backdrop.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

## 🚀 部署步骤

### 1. 初始化项目

```bash
# 创建项目目录
mkdir image-overlay-service
cd image-overlay-service

# 初始化git仓库
git init
git add .
git commit -m "Initial commit: Image overlay service"
```

### 2. 推送到GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/您的用户名/image-overlay-service.git
git push -u origin main
```

### 3. 在Vercel部署

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. 配置项目：
   - Framework Preset: `Other`
   - Build Command: `echo "Build completed"`
   - Output Directory: 留空
5. 点击 "Deploy"

### 4. 环境变量（可选）

如果需要配置特殊设置：
```
NODE_ENV=production
SHARP_IGNORE_GLOBAL_LIBVIPS=1
```

## 🎯 API使用方法

部署完成后，您的API端点将是：
```
https://您的项目名.vercel.app/api/backdrop
```

### 请求参数

- `bg`: 背景图URL（必需，需要URL编码）
- `title`: 标题文字（可选，需要URL编码）
- `year`: 年份（可选）
- `rating`: 评分（可选）
- `type`: 类型，movie或tv（可选）

### 使用示例

```
https://您的项目名.vercel.app/api/backdrop?bg=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw1280%2FcWO5NDkKqpOuwxu4vFc4PtL8aNF.jpg&title=%E7%93%A6%E5%9D%8E%E8%BE%BE%E4%B9%8B%E7%9C%BC&year=2025&rating=4.7&type=tv
```

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 安装Vercel CLI
npm install -g vercel

# 本地开发
vercel dev
```

本地服务将运行在 `http://localhost:3000`

## 📊 性能优化建议

1. **缓存策略**: 已设置24小时缓存
2. **图片优化**: 使用progressive JPEG
3. **错误处理**: 完整的错误处理和日志
4. **超时设置**: 30秒函数超时限制

## 🛠️ 故障排除

### 常见问题

1. **Sharp模块问题**: 确保使用正确的Node.js版本（18.x）
2. **图片下载失败**: 检查源图片URL是否可访问
3. **文字编码问题**: 确保标题参数正确URL编码

### 调试方法

查看Vercel函数日志：
```bash
vercel logs
```

## 🎉 完成！

现在您就有了自己的图片叠加服务，可以生成带标题的背景图了！🎬✨
const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 图片叠加API
app.get('/api/backdrop', async (req, res) => {
  try {
    const { bg, title, year, rating, type } = req.query;
    
    if (!bg) {
      return res.status(400).json({ error: '缺少背景图URL' });
    }
    
    // 下载背景图
    const backgroundResponse = await axios.get(bg, { responseType: 'arraybuffer' });
    const backgroundBuffer = Buffer.from(backgroundResponse.data);
    
    // 创建SVG文本
    const svgText = `
      <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
        <!-- 半透明黑色遮罩 -->
        <rect width="1280" height="720" fill="rgba(0,0,0,0.3)"/>
        
        <!-- 标题 -->
        <text x="640" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
              fill="white" text-anchor="middle" stroke="black" stroke-width="2">
          ${title || '未知标题'}
        </text>
        
        <!-- 年份和评分 -->
        <text x="640" y="350" font-family="Arial, sans-serif" font-size="24" 
              fill="white" text-anchor="middle" stroke="black" stroke-width="1">
          ${year ? year + '年' : ''} ${rating ? '⭐' + rating + '分' : ''} ${type === 'movie' ? '电影' : 'TV剧'}
        </text>
      </svg>
    `;
    
    // 使用sharp叠加图片和文字
    const result = await sharp(backgroundBuffer)
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: 90 })
      .toBuffer();
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(result);
    
  } catch (error) {
    console.error('图片叠加失败:', error);
    res.status(500).json({ error: '图片叠加失败' });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🖼️ 图片叠加服务运行在 http://localhost:${port}`);
  console.log(`📋 API端点: http://localhost:${port}/api/backdrop`);
});

module.exports = app;
# 🚀 Vercel部署完整中文教程

## 📋 方法一：最简单方式（推荐新手）

### 1️⃣ 注册Vercel账号
1. 打开：https://vercel.com
2. 点击右上角 **"Sign Up"** （注册）
3. 选择 **"Continue with GitHub"** （用GitHub账号注册）
4. 如果没有GitHub账号，先去 https://github.com 注册一个

### 2️⃣ Fork一个现成的项目
选择以下任意一个项目Fork到您的GitHub：

**推荐项目**：
- **简单OG生成器**: https://github.com/dwinugroho/og
- **功能完整**: https://github.com/agustinusnathaniel/og-img  
- **个人定制**: https://github.com/lovelliu/og-image-generator

**如何Fork**：
1. 点击项目页面右上角的 **"Fork"** 按钮
2. 选择Fork到您的账号下
3. 等待Fork完成

### 3️⃣ 在Vercel部署
1. 回到 https://vercel.com 并登录
2. 点击 **"New Project"** （新建项目）
3. 选择您刚才Fork的项目
4. 点击 **"Deploy"** （部署）
5. 等待3-5分钟，部署完成！

## 📋 方法二：从零开始（适合想学习的用户）

### 1️⃣ 创建项目文件
在您的电脑上创建一个文件夹，比如 `my-og-generator`

### 2️⃣ 创建基本文件

**package.json**:
```json
{
  "name": "my-og-generator",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "@vercel/og": "latest"
  }
}
```

**pages/api/og.js**:
```javascript
import { ImageResponse } from '@vercel/og';

export default function handler(req) {
  const { title = '默认标题', subtitle = '副标题' } = req.nextUrl.searchParams;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(to bottom, #667eea, #764ba2)',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
          {title}
        </div>
        <div style={{ fontSize: 30 }}>
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

export const config = {
  runtime: 'edge',
};
```

**pages/index.js**:
```javascript
export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>我的OG图片生成器</h1>
      <p>使用方法：</p>
      <p>在URL后面加上：<code>/api/og?title=您的标题&subtitle=副标题</code></p>
      <br />
      <img 
        src="/api/og?title=测试标题&subtitle=这是副标题" 
        alt="示例图片"
        style={{ maxWidth: '100%', border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

### 3️⃣ 上传到GitHub
1. 在GitHub创建新仓库（Repository）
2. 把文件上传到仓库
3. 或者使用Git命令：
```bash
git init
git add .
git commit -m "初始化OG生成器"
git remote add origin https://github.com/您的用户名/仓库名.git
git push -u origin main
```

### 4️⃣ 部署到Vercel
按照方法一的第3步操作

## 🎯 部署后的使用方法

部署成功后，您会得到一个链接，比如：
```
https://your-project.vercel.app
```

**生成图片的URL格式**：
```
https://your-project.vercel.app/api/og?title=电影标题&subtitle=2024年
```

**在您的fw2.js中使用**：
```javascript
// 替换原来的image-overlay服务
const titleBackdropUrl = `https://your-project.vercel.app/api/og?title=${encodeURIComponent(title)}&year=${year}&rating=${rating}`;
```

## 🔧 常见问题解决

### ❓ 英文界面怎么办？
- 大部分操作都是点击按钮，按照截图操作即可
- 重要按钮：
  - **Sign Up** = 注册
  - **New Project** = 新建项目  
  - **Deploy** = 部署
  - **Fork** = 复制项目

### ❓ 部署失败怎么办？
1. 检查package.json文件格式是否正确
2. 确保所有文件都上传到GitHub
3. 查看Vercel的错误信息（通常有中文翻译）

### ❓ 图片不显示怎么办？
1. 检查API路径是否正确：`/api/og`
2. 确保参数正确传递
3. 在浏览器直接访问API测试

### ❓ 想修改样式怎么办？
修改 `pages/api/og.js` 文件中的样式代码，保存后Vercel会自动重新部署

## 🎉 完成！

按照这个教程，您就可以拥有自己的图片生成服务了！比依赖第三方服务更稳定可靠。

**优势**：
- ✅ 完全免费
- ✅ 自己控制
- ✅ 永不失效
- ✅ 可自定义样式
- ✅ 支持中文
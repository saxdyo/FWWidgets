#!/bin/bash

# TMDB电影背景图爬虫安装脚本
echo "🎬 TMDB电影背景图爬虫安装脚本"
echo "================================"

# 检查Python版本
echo "📋 检查Python环境..."
python3 --version
if [ $? -ne 0 ]; then
    echo "❌ Python3未安装，请先安装Python3"
    exit 1
fi

# 检查pip
pip3 --version
if [ $? -ne 0 ]; then
    echo "❌ pip3未安装，请先安装pip3"
    exit 1
fi

# 创建虚拟环境
echo "🔧 创建Python虚拟环境..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "❌ 虚拟环境创建失败"
    exit 1
fi

# 激活虚拟环境
echo "🔄 激活虚拟环境..."
source venv/bin/activate

# 升级pip
echo "⬆️  升级pip..."
pip install --upgrade pip

# 安装依赖
echo "📦 安装Python依赖..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p movie_backgrounds/backdrops
mkdir -p movie_backgrounds/posters
mkdir -p movie_backgrounds/thumbnails
mkdir -p data
mkdir -p logs

# 复制环境变量模板
echo "⚙️  设置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑并填入你的TMDB API密钥"
else
    echo "⚠️  .env 文件已存在，跳过创建"
fi

# 检查Git
echo "🔧 检查Git环境..."
git --version
if [ $? -ne 0 ]; then
    echo "⚠️  Git未安装，将无法使用自动Git提交功能"
else
    echo "✅ Git环境正常"
    
    # 初始化Git仓库（如果不存在）
    if [ ! -d .git ]; then
        echo "🔄 初始化Git仓库..."
        git init
        git add .
        git commit -m "Initial commit: TMDB movie background crawler"
    fi
fi

# 设置脚本权限
echo "🔧 设置脚本权限..."
chmod +x main.py
chmod +x run.sh

echo ""
echo "🎉 安装完成！"
echo ""
echo "📋 后续步骤："
echo "1. 编辑 .env 文件，填入你的TMDB API密钥"
echo "   获取地址: https://www.themoviedb.org/settings/api"
echo ""
echo "2. 测试连接："
echo "   python main.py status"
echo ""
echo "3. 运行单次爬取："
echo "   python main.py run"
echo ""
echo "4. 启动定时调度器："
echo "   python main.py schedule"
echo ""
echo "5. 或使用便捷脚本："
echo "   ./run.sh"
echo ""
echo "📚 更多使用说明请查看 README.md"
#!/bin/bash

# TMDB电影背景图爬虫便捷运行脚本

# 激活虚拟环境
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "⚠️  虚拟环境不存在，请先运行 ./setup.sh"
    exit 1
fi

# 检查环境变量
if [ ! -f ".env" ]; then
    echo "❌ .env 文件不存在，请先配置TMDB API密钥"
    echo "   复制 .env.example 到 .env 并填入API密钥"
    exit 1
fi

show_menu() {
    clear
    echo "======================================"
    echo "    TMDB 电影背景图爬虫 控制面板"
    echo "======================================"
    echo ""
    echo "请选择操作："
    echo "1. 查看状态"
    echo "2. 运行单次爬取"
    echo "3. 启动定时调度器"
    echo "4. 清理旧数据"
    echo "5. 导出数据"
    echo "6. 导出小组件数据"
    echo "7. 退出"
    echo ""
    echo -n "请输入选项 [1-7]: "
}

# 显示菜单
echo "🎬 TMDB电影背景图爬虫"
echo "===================="
echo ""
echo "请选择操作："
echo "1) 查看状态"
echo "2) 运行一次爬取"
echo "3) 启动定时调度器"
echo "4) 清理旧数据"
echo "5) 导出数据"
echo "6) 导出小组件数据"
echo "7) 退出"
echo ""

read -p "请输入选项 (1-7): " choice

case $choice in
    1)
        echo "📊 查看项目状态..."
        python main.py show_status
        ;;
    2)
        echo "🏃 开始单次爬取..."
        python main.py run_once
        ;;
    3)
        echo "⏰ 启动定时调度器..."
        echo "定时任务将定期执行，按 Ctrl+C 停止调度器"
        python main.py run_scheduler
        ;;
    4)
        echo "🧹 清理旧数据..."
        read -p "保留最近多少天的数据？(默认30): " days
        days=${days:-30}
        python main.py cleanup --days $days
        ;;
    5)
        echo "📦 导出数据..."
        read -p "输出文件名 (默认movie_data_export.json): " filename
        filename=${filename:-movie_data_export.json}
        python main.py export_data --output $filename
        ;;
    6)
        echo "📱 正在导出小组件数据..."
        python main.py export_widget
        ;;
    7)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac
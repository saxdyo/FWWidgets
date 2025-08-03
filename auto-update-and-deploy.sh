#!/bin/bash

# 自动更新和部署预处理数据
# 从TMDB数据源获取最新数据，更新TMDB_Trending.json，并部署到GitHub

set -e

# 配置
UPDATE_SCRIPT="auto-update-preprocessed.js"
DEPLOY_SCRIPT="deploy-preprocessed-data.sh"
LOG_FILE="logs/auto-update.log"
PID_FILE="logs/auto-update.pid"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 创建日志目录
mkdir -p logs

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查是否已在运行
check_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠️ 自动更新服务已在运行 (PID: $PID)${NC}"
            return 0
        else
            rm -f "$PID_FILE"
        fi
    fi
    return 1
}

# 启动自动更新服务
start() {
    echo -e "${GREEN}🚀 启动自动更新和部署服务...${NC}"
    
    if check_running; then
        exit 1
    fi
    
    # 记录PID
    echo $$ > "$PID_FILE"
    
    log "启动自动更新服务"
    
    # 启动自动更新
    node "$UPDATE_SCRIPT" --auto &
    UPDATE_PID=$!
    
    log "自动更新进程已启动 (PID: $UPDATE_PID)"
    
    # 等待并监控
    while true; do
        if ! ps -p "$UPDATE_PID" > /dev/null 2>&1; then
            log "自动更新进程已停止，重新启动..."
            node "$UPDATE_SCRIPT" --auto &
            UPDATE_PID=$!
            log "自动更新进程已重启 (PID: $UPDATE_PID)"
        fi
        
        sleep 60
    done
}

# 停止自动更新服务
stop() {
    echo -e "${YELLOW}🛑 停止自动更新服务...${NC}"
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            kill "$PID"
            log "已停止自动更新服务 (PID: $PID)"
        fi
        rm -f "$PID_FILE"
    fi
    
    # 停止所有相关进程
    pkill -f "$UPDATE_SCRIPT" || true
    
    echo -e "${GREEN}✅ 自动更新服务已停止${NC}"
}

# 状态检查
status() {
    echo -e "${YELLOW}📊 自动更新服务状态:${NC}"
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ 服务正在运行 (PID: $PID)${NC}"
        else
            echo -e "${RED}❌ 服务未运行 (PID文件存在但进程不存在)${NC}"
            rm -f "$PID_FILE"
        fi
    else
        echo -e "${RED}❌ 服务未运行${NC}"
    fi
    
    # 检查日志
    if [ -f "$LOG_FILE" ]; then
        echo -e "${YELLOW}📝 最新日志:${NC}"
        tail -10 "$LOG_FILE"
    fi
}

# 手动执行一次更新
update() {
    echo -e "${GREEN}🔄 执行手动更新...${NC}"
    log "开始手动更新"
    
    # 执行更新
    if node "$UPDATE_SCRIPT"; then
        log "手动更新成功"
        echo -e "${GREEN}✅ 更新成功${NC}"
        
        # 询问是否部署
        read -p "是否立即部署到GitHub? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}🚀 部署到GitHub...${NC}"
            if ./"$DEPLOY_SCRIPT"; then
                log "部署成功"
                echo -e "${GREEN}✅ 部署成功${NC}"
            else
                log "部署失败"
                echo -e "${RED}❌ 部署失败${NC}"
            fi
        fi
    else
        log "手动更新失败"
        echo -e "${RED}❌ 更新失败${NC}"
        exit 1
    fi
}

# 显示帮助
help() {
    echo -e "${GREEN}📖 自动更新和部署服务${NC}"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start    启动自动更新服务"
    echo "  stop     停止自动更新服务"
    echo "  status   查看服务状态"
    echo "  update   执行一次手动更新"
    echo "  help     显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start    # 启动自动更新服务"
    echo "  $0 update   # 执行一次手动更新"
    echo "  $0 status   # 查看服务状态"
}

# 主逻辑
case "${1:-help}" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    update)
        update
        ;;
    help|--help|-h)
        help
        ;;
    *)
        echo -e "${RED}❌ 未知命令: $1${NC}"
        help
        exit 1
        ;;
esac
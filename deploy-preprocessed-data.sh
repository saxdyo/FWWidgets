#!/bin/bash

# 部署预处理数据到GitHub
# 将生成的 TMDB_Trending.json 上传到您的仓库

set -e

# 配置
GITHUB_REPO="saxdyo/FWWidgets"
GITHUB_BRANCH="main"
DATA_DIR="data"
DATA_FILE="TMDB_Trending.json"
GITHUB_RAW_URL="https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_DIR}/${DATA_FILE}"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 开始部署预处理数据到GitHub${NC}"
echo "=================================="

# 检查数据文件是否存在
if [ ! -f "${DATA_DIR}/${DATA_FILE}" ]; then
    echo -e "${RED}❌ 数据文件不存在: ${DATA_DIR}/${DATA_FILE}${NC}"
    echo "请先运行: node create-preprocessed-data.js"
    exit 1
fi

# 检查Git仓库
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 未检测到Git仓库${NC}"
    exit 1
fi

# 检查文件大小
FILE_SIZE=$(stat -c%s "${DATA_DIR}/${DATA_FILE}")
echo -e "${YELLOW}📊 数据文件大小: ${FILE_SIZE} 字节${NC}"

# 验证JSON格式
if ! node -e "JSON.parse(require('fs').readFileSync('${DATA_DIR}/${DATA_FILE}', 'utf8'))" 2>/dev/null; then
    echo -e "${RED}❌ JSON格式验证失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ JSON格式验证通过${NC}"

# 显示数据统计
echo -e "${YELLOW}📈 数据统计:${NC}"
echo "  - 数据文件已生成并验证"

# 添加到Git
echo -e "${YELLOW}📁 添加文件到Git...${NC}"
git add "${DATA_DIR}/${DATA_FILE}"

# 检查是否有变更
if git diff --cached --quiet; then
    echo -e "${YELLOW}ℹ️ 没有新的变更需要提交${NC}"
else
    echo -e "${YELLOW}💾 提交更改...${NC}"
    git commit -m "feat: 更新预处理数据 $(date '+%Y-%m-%d %H:%M:%S')"
    
    echo -e "${YELLOW}🚀 推送到GitHub...${NC}"
    git push origin main
    
    echo -e "${GREEN}✅ 数据已成功部署到GitHub${NC}"
fi

# 测试数据访问
echo -e "${YELLOW}🧪 测试数据访问...${NC}"
sleep 3  # 等待GitHub更新

if curl -s -o /dev/null -w "%{http_code}" "${GITHUB_RAW_URL}" | grep -q "200"; then
    echo -e "${GREEN}✅ 数据访问测试成功${NC}"
    echo -e "${YELLOW}📋 数据源URL: ${GITHUB_RAW_URL}${NC}"
else
    echo -e "${RED}❌ 数据访问测试失败${NC}"
    echo "请稍后手动测试: curl -I ${GITHUB_RAW_URL}"
fi

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo ""
echo -e "${YELLOW}📝 下一步操作:${NC}"
echo "1. 更新 fw2.js 中的数据源URL:"
echo "   const response = await Widget.http.get('${GITHUB_RAW_URL}');"
echo ""
echo "2. 测试数据加载:"
echo "   curl '${GITHUB_RAW_URL}'"
echo ""
echo "3. 验证数据格式:"
echo "   jq '.today_global | length' <(curl -s '${GITHUB_RAW_URL}')"
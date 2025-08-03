#!/usr/bin/env node

// 测试新的Vercel OG服务配置
const VERCEL_OG_SERVICE = "https://fw-widgets-pdb6ftlwx-sams-projects-20fafaa5.vercel.app";

// 模拟fw2.js中的generateTitleBackdropUrl函数
function generateTitleBackdropUrl(title, year, rating, type) {
    const subtitle = `${year} • ⭐ ${rating} • ${type}`;
    
    // 构建服务URL数组（按优先级排序）
    const services = [
        // 您的Vercel服务（多种API路径尝试）
        {
            url: `${VERCEL_OG_SERVICE}/api/og`,
            params: { title: title, subtitle: subtitle }
        },
        {
            url: `${VERCEL_OG_SERVICE}/api/image`, 
            params: { title: title, description: subtitle, layoutName: "Simple", Text: title }
        },
        // 备用服务
        {
            url: "https://og.railway.app/api/image",
            params: { layoutName: "Simple", Text: title, fileType: "png" }
        },
        // 最简单的备用方案
        {
            url: "https://via.placeholder.com/1200x630/667eea/ffffff",
            params: { text: title }
        }
    ];
    
    // 返回第一个服务的URL（实际使用中会依次尝试）
    for (const service of services) {
        try {
            const params = new URLSearchParams(service.params);
            const url = `${service.url}?${params.toString()}`;
            console.log(`✅ 生成URL: ${url}`);
            return url;
        } catch (error) {
            console.warn(`❌ 服务构建失败:`, error);
            continue;
        }
    }
    
    return null;
}

// 测试数据
const testCases = [
    { title: "瓦坎达之眼", year: "2025", rating: "4.7", type: "tv" },
    { title: "哪吒之魔童", year: "2024", rating: "8.4", type: "movie" },
    { title: "Test Movie", year: "2023", rating: "7.5", type: "movie" }
];

console.log("🚀 测试Vercel OG服务配置");
console.log("=" * 50);

testCases.forEach((testCase, index) => {
    console.log(`\n📝 测试案例 ${index + 1}:`);
    console.log(`   标题: ${testCase.title}`);
    console.log(`   年份: ${testCase.year}`);
    console.log(`   评分: ${testCase.rating}`);
    console.log(`   类型: ${testCase.type}`);
    
    const result = generateTitleBackdropUrl(testCase.title, testCase.year, testCase.rating, testCase.type);
    
    if (result) {
        console.log(`✅ 成功生成URL`);
    } else {
        console.log(`❌ URL生成失败`);
    }
});

console.log("\n🎯 测试完成!");
console.log("\n📋 使用说明:");
console.log("1. 您的Vercel服务URL已配置到fw2.js中");
console.log("2. 如果您的服务401错误解决了，它将作为优先选项");
console.log("3. 系统会自动回退到其他可用服务");
console.log("4. 本地生成的图片仍然是最高优先级");

console.log("\n🔧 如需解决401错误，请检查:");
console.log("- Vercel项目是否设置为公开");
console.log("- API路由是否正确部署");
console.log("- 环境变量是否正确配置");
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// TMDB API配置
const TMDB_API_KEY = "f3ae69ddca232b56265600eb919d46ab";
const BASE_URL = "https://api.themoviedb.org/3";

// 工具函数：获取北京时间
function getBeijingTime() {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    return beijingTime.toISOString().replace('T', ' ').substring(0, 19);
}

// 工具函数：发送HTTP请求
async function makeRequest(url, params = {}) {
    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'zh-CN',
        ...params
    });
    
    const response = await fetch(`${url}?${queryParams}`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// TMDB类型映射
const TMDB_GENRES = {
    movie: {
        28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
        18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
        9648: "悬疑", 10749: "爱情", 878: "科幻", 10770: "电视电影", 53: "惊悚",
        10752: "战争", 37: "西部"
    },
    tv: {
        10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
        18: "剧情", 10751: "家庭", 10762: "儿童", 9648: "悬疑", 10763: "新闻",
        10764: "真人秀", 10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀",
        10768: "战争政治", 37: "西部"
    }
};

// 获取类型标题
function getGenreTitle(genreIds, mediaType) {
    if (!genreIds || !Array.isArray(genreIds)) return "";
    const genres = TMDB_GENRES[mediaType] || {};
    const genreNames = genreIds.slice(0, 3).map(id => genres[id]).filter(Boolean);
    return genreNames.join("•");
}

// 处理单个项目数据
function processItem(item, mediaType = null) {
    const type = mediaType || item.media_type || (item.title ? 'movie' : 'tv');
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const genreTitle = getGenreTitle(item.genre_ids, type);
    
    return {
        id: item.id,
        title: title,
        type: type,
        genreTitle: genreTitle,
        rating: item.vote_average || 0,
        release_date: releaseDate || "",
        overview: item.overview || "",
        poster_url: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : "",
        title_backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : ""
    };
}

// 获取今日热门内容
async function getTodayTrending() {
    console.log("🔥 获取今日热门内容...");
    const data = await makeRequest(`${BASE_URL}/trending/all/day`);
    return data.results
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .slice(0, 15)
        .map(item => processItem(item));
}

// 获取本周热门内容
async function getWeekTrending() {
    console.log("📈 获取本周热门内容...");
    const data = await makeRequest(`${BASE_URL}/trending/all/week`);
    return data.results
        .filter(item => item.poster_path && item.backdrop_path && (item.title || item.name))
        .slice(0, 15)
        .map(item => processItem(item));
}

// 获取热门电影
async function getPopularMovies() {
    console.log("🎬 获取热门电影...");
    const data = await makeRequest(`${BASE_URL}/movie/popular`, { region: 'CN' });
    return data.results
        .filter(item => item.poster_path && item.backdrop_path && item.title)
        .slice(0, 15)
        .map(item => processItem(item, 'movie'));
}

// 主函数
async function main() {
    try {
        console.log("🚀 开始生成TMDB数据...");
        
        // 并行获取所有数据
        const [todayGlobal, weekGlobalAll, popularMovies] = await Promise.all([
            getTodayTrending(),
            getWeekTrending(),
            getPopularMovies()
        ]);
        
        // 构建最终数据结构
        const finalData = {
            last_updated: getBeijingTime(),
            today_global: todayGlobal,
            week_global_all: weekGlobalAll,
            popular_movies: popularMovies
        };
        
        // 确保data目录存在
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // 写入文件
        const outputPath = path.join(dataDir, 'TMDB_Trending.json');
        fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf8');
        
        console.log("✅ 数据生成完成!");
        console.log(`📍 文件位置: ${outputPath}`);
        console.log(`🕒 更新时间: ${finalData.last_updated}`);
        console.log(`📊 数据统计:`);
        console.log(`   - 今日热门: ${todayGlobal.length} 项`);
        console.log(`   - 本周热门: ${weekGlobalAll.length} 项`);
        console.log(`   - 热门电影: ${popularMovies.length} 项`);
        
        // 显示部分数据预览
        console.log("\n📋 数据预览:");
        console.log("今日热门前3项:");
        todayGlobal.slice(0, 3).forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.title} (${item.type}) - 评分: ${item.rating}`);
        });
        
    } catch (error) {
        console.error("❌ 生成数据失败:", error.message);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { main, processItem, getGenreTitle };
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// 配置
const CONFIG = {
  TMDB_API_KEY: process.env.TMDB_API_KEY || 'your_tmdb_api_key_here',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  MAX_ITEMS: 50,
  RATE_LIMIT_DELAY: 250,
  OUTPUT_FILE: './data/tmdb-title-backdrops.json',
  LANGUAGE: 'zh-CN'
};

// API请求函数
async function makeRequest(endpoint, params = {}) {
  try {
    await new Promise(resolve => setTimeout(resolve, CONFIG.RATE_LIMIT_DELAY));
    
    const response = await axios.get(`${CONFIG.BASE_URL}${endpoint}`, {
      params: {
        api_key: CONFIG.TMDB_API_KEY,
        language: CONFIG.LANGUAGE,
        ...params
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error(`API请求失败: ${endpoint}`, error.message);
    return null;
  }
}

// 获取热门内容
async function getPopularContent() {
  console.log('🔥 获取热门内容...');
  
  const [movies, tvShows, trending] = await Promise.all([
    makeRequest('/movie/popular', { page: 1 }),
    makeRequest('/tv/popular', { page: 1 }),
    makeRequest('/trending/all/day')
  ]);
  
  const allContent = [];
  
  if (movies && movies.results) {
    allContent.push(...movies.results.map(item => ({ ...item, media_type: 'movie' })));
  }
  
  if (tvShows && tvShows.results) {
    allContent.push(...tvShows.results.map(item => ({ ...item, media_type: 'tv' })));
  }
  
  if (trending && trending.results) {
    allContent.push(...trending.results);
  }
  
  return allContent.slice(0, CONFIG.MAX_ITEMS);
}

// 处理单个项目，生成简单的带标题背景图数据
function processItemWithTitleBackdrop(item) {
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || '未知标题';
  const releaseDate = item.release_date || item.first_air_date || '';
  const rating = item.vote_average || 0;
  
  // 生成带标题的背景图URL（使用image-overlay服务）
  let titleBackdrop = '';
  if (item.backdrop_path) {
    const backdropUrl = `${CONFIG.IMAGE_BASE_URL}/w1280${item.backdrop_path}`;
    const params = new URLSearchParams({
      bg: backdropUrl,
      title: title,
      year: releaseDate ? new Date(releaseDate).getFullYear() : '',
      rating: rating.toFixed(1),
      type: type
    });
    titleBackdrop = `https://image-overlay.vercel.app/api/backdrop?${params.toString()}`;
  }
  
  return {
    id: item.id,
    title: title,
    type: type,
    genreTitle: `${type === 'movie' ? '电影' : 'TV剧'}•${getGenreTitle(item.genre_ids, type)}`,
    rating: rating,
    release_date: releaseDate,
    overview: item.overview || '',
    poster_url: item.poster_path ? `${CONFIG.IMAGE_BASE_URL}/original${item.poster_path}` : '',
    title_backdrop: titleBackdrop
  };
}

// 获取类型标题
function getGenreTitle(genreIds, mediaType) {
  if (!genreIds || !Array.isArray(genreIds)) return '';
  
  const genres = {
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
  
  const genreMap = genres[mediaType] || {};
  const genreNames = genreIds.slice(0, 2).map(id => genreMap[id]).filter(Boolean);
  return genreNames.join("•");
}

// 生成带标题背景图数据
async function generateTitleBackdropData() {
  console.log('🎨 开始生成带标题背景图数据...');
  
  try {
    // 确保输出目录存在
    await fs.ensureDir(path.dirname(CONFIG.OUTPUT_FILE));
    
    // 获取热门内容
    const content = await getPopularContent();
    console.log(`📊 获取到 ${content.length} 个内容项目`);
    
    // 过滤有背景图的内容
    const contentWithBackdrop = content.filter(item => item.backdrop_path);
    console.log(`📊 其中 ${contentWithBackdrop.length} 个有背景图`);
    
    // 处理数据
    const processedData = contentWithBackdrop.map(item => processItemWithTitleBackdrop(item));
    
    // 生成最终数据
    const finalData = {
      last_updated: new Date().toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-'),
      today_global: processedData
    };
    
    // 保存数据
    await fs.writeJson(CONFIG.OUTPUT_FILE, finalData, { spaces: 2 });
    
    console.log(`✅ 成功生成带标题背景图数据:`);
    console.log(`- 文件路径: ${CONFIG.OUTPUT_FILE}`);
    console.log(`- 数据条数: ${processedData.length}`);
    console.log(`- 更新时间: ${finalData.last_updated}`);
    
    // 显示示例数据
    if (processedData.length > 0) {
      console.log('\n📋 示例数据:');
      console.log(JSON.stringify(processedData[0], null, 2));
    }
    
    return finalData;
    
  } catch (error) {
    console.error('❌ 生成带标题背景图数据失败:', error);
    throw error;
  }
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始生成TMDB带标题背景图数据包...');
    await generateTitleBackdropData();
    console.log('✅ 生成完成！');
  } catch (error) {
    console.error('❌ 生成失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { generateTitleBackdropData };
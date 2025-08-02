const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// 配置
const CONFIG = {
  TMDB_API_KEY: process.env.TMDB_API_KEY || 'your_tmdb_api_key_here',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  MAX_MOVIES: parseInt(process.env.MAX_MOVIES) || 100,
  MAX_TV_SHOWS: parseInt(process.env.MAX_TV_SHOWS) || 50,
  RATE_LIMIT_DELAY: 250, // 250ms延迟避免API限制
  OUTPUT_DIR: './data',
  BACKDROP_SIZES: ['w300', 'w780', 'w1280', 'original'],
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

// 获取热门电影
async function getPopularMovies(pages = 5) {
  console.log('📽️ 获取热门电影...');
  const movies = [];
  
  for (let page = 1; page <= pages; page++) {
    console.log(`获取第 ${page} 页电影数据...`);
    const data = await makeRequest('/movie/popular', { page });
    
    if (data && data.results) {
      movies.push(...data.results);
    }
    
    if (movies.length >= CONFIG.MAX_MOVIES) break;
  }
  
  return movies.slice(0, CONFIG.MAX_MOVIES);
}

// 获取热门电视剧
async function getPopularTVShows(pages = 3) {
  console.log('📺 获取热门电视剧...');
  const tvShows = [];
  
  for (let page = 1; page <= pages; page++) {
    console.log(`获取第 ${page} 页电视剧数据...`);
    const data = await makeRequest('/tv/popular', { page });
    
    if (data && data.results) {
      tvShows.push(...data.results);
    }
    
    if (tvShows.length >= CONFIG.MAX_TV_SHOWS) break;
  }
  
  return tvShows.slice(0, CONFIG.MAX_TV_SHOWS);
}

// 获取今日热门内容
async function getTrendingContent() {
  console.log('🔥 获取今日热门内容...');
  const data = await makeRequest('/trending/all/day');
  return data ? data.results || [] : [];
}

// 获取高分内容
async function getTopRatedContent() {
  console.log('⭐ 获取高分内容...');
  const movies = await makeRequest('/movie/top_rated');
  const tvShows = await makeRequest('/tv/top_rated');
  
  const allContent = [];
  if (movies && movies.results) allContent.push(...movies.results);
  if (tvShows && tvShows.results) allContent.push(...tvShows.results);
  
  return allContent;
}

// 处理单个媒体项目
function processMediaItem(item, mediaType = null) {
  const type = mediaType || item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name || '未知标题';
  const releaseDate = item.release_date || item.first_air_date || '';
  
  // 生成多种尺寸的背景图URL
  const backdropUrls = {};
  if (item.backdrop_path) {
    CONFIG.BACKDROP_SIZES.forEach(size => {
      backdropUrls[size] = `${CONFIG.IMAGE_BASE_URL}/${size}${item.backdrop_path}`;
    });
  }
  
  // 生成海报URL
  const posterUrls = {};
  if (item.poster_path) {
    ['w154', 'w342', 'w500', 'w780', 'original'].forEach(size => {
      posterUrls[size] = `${CONFIG.IMAGE_BASE_URL}/${size}${item.poster_path}`;
    });
  }
  
  return {
    id: item.id,
    title: title,
    originalTitle: item.original_title || item.original_name || '',
    overview: item.overview || '',
    mediaType: type,
    releaseDate: releaseDate,
    releaseYear: releaseDate ? new Date(releaseDate).getFullYear() : null,
    rating: item.vote_average || 0,
    voteCount: item.vote_count || 0,
    popularity: item.popularity || 0,
    adult: item.adult || false,
    genreIds: item.genre_ids || [],
    originalLanguage: item.original_language || '',
    backdropPath: item.backdrop_path || '',
    posterPath: item.poster_path || '',
    backdropUrls: backdropUrls,
    posterUrls: posterUrls,
    hasBackdrop: !!item.backdrop_path,
    hasPoster: !!item.poster_path,
    updatedAt: new Date().toISOString()
  };
}

// 生成数据包
async function generateDataPackage() {
  console.log('🚀 开始生成TMDB背景图数据包...');
  
  try {
    // 确保输出目录存在
    await fs.ensureDir(CONFIG.OUTPUT_DIR);
    
    // 获取各种类型的数据
    const [popularMovies, popularTVShows, trendingContent, topRatedContent] = await Promise.all([
      getPopularMovies(),
      getPopularTVShows(),
      getTrendingContent(),
      getTopRatedContent()
    ]);
    
    console.log(`📊 数据统计:`);
    console.log(`- 热门电影: ${popularMovies.length} 部`);
    console.log(`- 热门电视剧: ${popularTVShows.length} 部`);
    console.log(`- 今日热门: ${trendingContent.length} 项`);
    console.log(`- 高分内容: ${topRatedContent.length} 项`);
    
    // 处理数据
    const processedData = {
      popularMovies: popularMovies.filter(item => item.backdrop_path).map(item => processMediaItem(item, 'movie')),
      popularTVShows: popularTVShows.filter(item => item.backdrop_path).map(item => processMediaItem(item, 'tv')),
      trendingContent: trendingContent.filter(item => item.backdrop_path).map(item => processMediaItem(item)),
      topRatedContent: topRatedContent.filter(item => item.backdrop_path).map(item => processMediaItem(item))
    };
    
    // 生成综合数据集（去重）
    const allContent = new Map();
    
    // 添加所有内容到Map中去重
    [...processedData.popularMovies, ...processedData.popularTVShows, 
     ...processedData.trendingContent, ...processedData.topRatedContent].forEach(item => {
      const key = `${item.mediaType}_${item.id}`;
      if (!allContent.has(key) || allContent.get(key).popularity < item.popularity) {
        allContent.set(key, item);
      }
    });
    
    // 转换为数组并按评分排序
    const combinedContent = Array.from(allContent.values())
      .sort((a, b) => (b.rating * b.popularity) - (a.rating * a.popularity));
    
    // 生成元数据
    const metadata = {
      generatedAt: new Date().toISOString(),
      totalItems: combinedContent.length,
      categories: {
        popularMovies: processedData.popularMovies.length,
        popularTVShows: processedData.popularTVShows.length,
        trendingContent: processedData.trendingContent.length,
        topRatedContent: processedData.topRatedContent.length
      },
      statistics: {
        withBackdrop: combinedContent.filter(item => item.hasBackdrop).length,
        withPoster: combinedContent.filter(item => item.hasPoster).length,
        movies: combinedContent.filter(item => item.mediaType === 'movie').length,
        tvShows: combinedContent.filter(item => item.mediaType === 'tv').length,
        averageRating: combinedContent.reduce((sum, item) => sum + item.rating, 0) / combinedContent.length
      },
      config: {
        maxMovies: CONFIG.MAX_MOVIES,
        maxTVShows: CONFIG.MAX_TV_SHOWS,
        language: CONFIG.LANGUAGE
      }
    };
    
    // 保存数据文件
    const files = {
      'tmdb-backdrops-full.json': {
        metadata,
        categories: processedData,
        combined: combinedContent
      },
      'tmdb-backdrops-simple.json': combinedContent.map(item => ({
        id: item.id,
        title: item.title,
        mediaType: item.mediaType,
        backdropUrls: item.backdropUrls,
        rating: item.rating,
        releaseYear: item.releaseYear
      })),
      'tmdb-backdrops-metadata.json': metadata,
      'tmdb-backdrops-movies.json': processedData.popularMovies,
      'tmdb-backdrops-tv.json': processedData.popularTVShows,
      'tmdb-backdrops-trending.json': processedData.trendingContent,
      'tmdb-backdrops-top-rated.json': processedData.topRatedContent
    };
    
    // 写入文件
    for (const [filename, data] of Object.entries(files)) {
      const filepath = path.join(CONFIG.OUTPUT_DIR, filename);
      await fs.writeJSON(filepath, data, { spaces: 2 });
      console.log(`✅ 已生成: ${filename} (${JSON.stringify(data).length} 字符)`);
    }
    
    // 生成README
    const readmeContent = `# TMDB背景图数据包

## 📋 数据概览

- **生成时间**: ${metadata.generatedAt}
- **总计项目**: ${metadata.totalItems} 项
- **包含背景图**: ${metadata.statistics.withBackdrop} 项
- **平均评分**: ${metadata.statistics.averageRating.toFixed(1)}

## 📁 数据文件

- \`tmdb-backdrops-full.json\` - 完整数据包（包含所有信息）
- \`tmdb-backdrops-simple.json\` - 简化版本（仅关键信息）
- \`tmdb-backdrops-metadata.json\` - 元数据信息
- \`tmdb-backdrops-movies.json\` - 热门电影数据
- \`tmdb-backdrops-tv.json\` - 热门电视剧数据
- \`tmdb-backdrops-trending.json\` - 今日热门数据
- \`tmdb-backdrops-top-rated.json\` - 高分内容数据

## 🏷️ 数据结构

每个媒体项目包含以下字段：

\`\`\`json
{
  "id": 123456,
  "title": "电影标题",
  "mediaType": "movie|tv",
  "backdropUrls": {
    "w300": "https://image.tmdb.org/t/p/w300/backdrop.jpg",
    "w780": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
    "w1280": "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
    "original": "https://image.tmdb.org/t/p/original/backdrop.jpg"
  },
  "rating": 8.5,
  "releaseYear": 2024
}
\`\`\`

## 🔄 自动更新

此数据包通过GitHub Actions每24小时自动更新一次。

---
*数据来源：[TMDB (The Movie Database)](https://www.themoviedb.org/)*
`;
    
    await fs.writeFile(path.join(CONFIG.OUTPUT_DIR, 'README.md'), readmeContent);
    console.log('✅ 已生成: README.md');
    
    console.log('\n🎉 数据包生成完成！');
    console.log(`📁 输出目录: ${CONFIG.OUTPUT_DIR}`);
    console.log(`📊 总计: ${combinedContent.length} 个包含背景图的媒体项目`);
    
    return {
      success: true,
      totalItems: combinedContent.length,
      metadata: metadata
    };
    
  } catch (error) {
    console.error('❌ 生成数据包失败:', error);
    return { success: false, error: error.message };
  }
}

// 主函数
async function main() {
  if (!CONFIG.TMDB_API_KEY || CONFIG.TMDB_API_KEY === 'your_tmdb_api_key_here') {
    console.error('❌ 请在.env文件中设置有效的TMDB API密钥');
    console.log('💡 获取API密钥: https://www.themoviedb.org/settings/api');
    process.exit(1);
  }
  
  console.log('🎬 TMDB背景图数据包生成器');
  console.log('================================');
  
  const result = await generateDataPackage();
  
  if (result.success) {
    console.log('\n✨ 任务完成！');
    process.exit(0);
  } else {
    console.log('\n❌ 任务失败！');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateDataPackage,
  CONFIG
};
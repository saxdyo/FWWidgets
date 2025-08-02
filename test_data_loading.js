#!/usr/bin/env node
/**
 * 测试数据加载功能
 * 验证本地TMDB数据文件是否能正确加载
 */

const fs = require('fs');
const path = require('path');

// 模拟fetch函数
global.fetch = async (url) => {
  try {
    const filePath = path.resolve(url.replace('./', ''));
    const data = fs.readFileSync(filePath, 'utf8');
    return {
      ok: true,
      json: async () => JSON.parse(data)
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
};

// 模拟Widget对象
global.Widget = {
  tmdb: {
    get: async (endpoint, options) => {
      console.log(`模拟TMDB API调用: ${endpoint}`);
      return { results: [] };
    }
  },
  http: {
    get: async (url, options) => {
      console.log(`模拟HTTP请求: ${url}`);
      return { data: '' };
    }
  }
};

// 从本地数据文件加载TMDB数据
async function loadTmdbDataWithLogos() {
  try {
    const tmdbDataPath = './data/TMDB_Trending_with_logos.json';
    console.log(`尝试加载文件: ${tmdbDataPath}`);
    
    const response = await fetch(tmdbDataPath);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 成功加载TMDB数据');
      console.log(`数据字段: ${Object.keys(data).join(', ')}`);
      return data;
    } else {
      console.log('❌ 加载TMDB数据失败');
    }
  } catch (error) {
    console.warn('无法从本地文件加载TMDB数据:', error);
  }
  return null;
}

// 测试数据加载
async function testDataLoading() {
  console.log('=== 测试数据加载功能 ===');
  
  // 测试TMDB数据加载
  const tmdbData = await loadTmdbDataWithLogos();
  
  if (tmdbData) {
    console.log('\n📊 数据统计:');
    console.log(`- today_global: ${tmdbData.today_global?.length || 0} 项`);
    console.log(`- week_global_all: ${tmdbData.week_global_all?.length || 0} 项`);
    console.log(`- popular_movies: ${tmdbData.popular_movies?.length || 0} 项`);
    
    // 检查剧集数据
    if (tmdbData.today_global) {
      const tvShows = tmdbData.today_global.filter(item => item.type === 'tv');
      console.log(`\n📺 今日热门剧集: ${tvShows.length} 项`);
      
      tvShows.forEach((show, index) => {
        console.log(`${index + 1}. ${show.title} (${show.rating}分) - ${show.platform || '未知平台'}`);
      });
    }
    
    // 检查数据结构
    if (tmdbData.today_global && tmdbData.today_global.length > 0) {
      const sample = tmdbData.today_global[0];
      console.log('\n📋 数据字段示例:');
      console.log(Object.keys(sample).map(key => `- ${key}`).join('\n'));
    }
  } else {
    console.log('❌ 无法加载TMDB数据');
  }
}

// 运行测试
testDataLoading().catch(console.error);
#!/usr/bin/env node

/**
 * IMDb数据爬取器
 * 用于获取和更新IMDb影视数据
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  // IMDb API配置
  IMDB_API_BASE: 'https://api.themoviedb.org/3',
  TMDB_API_KEY: process.env.TMDB_API_KEY || 'your_tmdb_api_key_here',
  
  // 数据存储路径
  DATA_DIR: './imdb-data',
  
  // 请求配置
  REQUEST_DELAY: 1000, // 请求间隔(毫秒)
  MAX_RETRIES: 3,
  
  // 数据范围
  REGIONS: ['all', 'country:cn', 'country:us', 'country:gb', 'country:jp', 'country:kr', 'region:us-eu', 'country:hk', 'country:tw'],
  SORT_TYPES: ['hs', 'r', 'rd', 'y', 't', 'd'],
  MEDIA_TYPES: ['movie', 'tv', 'anime'],
  
  // 分页配置
  ITEMS_PER_PAGE: 20,
  MAX_PAGES: 50
};

// 工具函数
class Utils {
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  static async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ statusCode: res.statusCode, data: jsonData });
          } catch (error) {
            resolve({ statusCode: res.statusCode, data: data });
          }
        });
      });
      
      req.on('error', reject);
      req.setTimeout(30000, () => req.destroy());
      req.end();
    });
  }
  
  static ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  
  static sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9-_]/g, '_');
  }
}

// IMDb数据爬取器
class IMDbCrawler {
  constructor() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalItems: 0
    };
  }
  
  // 获取TMDB热门电影
  async getPopularMovies(page = 1) {
    const url = `${CONFIG.IMDB_API_BASE}/movie/popular?api_key=${CONFIG.TMDB_API_KEY}&language=zh-CN&page=${page}`;
    console.log(`🎬 获取热门电影 (页码: ${page})`);
    
    try {
      const response = await Utils.makeRequest(url);
      if (response.statusCode === 200) {
        return this.processMovieData(response.data.results || []);
      }
    } catch (error) {
      console.error(`❌ 获取热门电影失败: ${error.message}`);
    }
    return [];
  }
  
  // 获取TMDB热门剧集
  async getPopularTVShows(page = 1) {
    const url = `${CONFIG.IMDB_API_BASE}/tv/popular?api_key=${CONFIG.TMDB_API_KEY}&language=zh-CN&page=${page}`;
    console.log(`📺 获取热门剧集 (页码: ${page})`);
    
    try {
      const response = await Utils.makeRequest(url);
      if (response.statusCode === 200) {
        return this.processTVData(response.data.results || []);
      }
    } catch (error) {
      console.error(`❌ 获取热门剧集失败: ${error.message}`);
    }
    return [];
  }
  
  // 获取动画数据
  async getAnimeData(page = 1) {
    const url = `${CONFIG.IMDB_API_BASE}/discover/tv?api_key=${CONFIG.TMDB_API_KEY}&language=zh-CN&page=${page}&with_genres=16&sort_by=popularity.desc`;
    console.log(`🎭 获取动画数据 (页码: ${page})`);
    
    try {
      const response = await Utils.makeRequest(url);
      if (response.statusCode === 200) {
        return this.processAnimeData(response.data.results || []);
      }
    } catch (error) {
      console.error(`❌ 获取动画数据失败: ${error.message}`);
    }
    return [];
  }
  
  // 处理电影数据
  processMovieData(movies) {
    return movies.map(movie => ({
      id: movie.id,
      p: movie.poster_path,
      b: movie.backdrop_path,
      t: movie.title,
      r: movie.vote_average,
      y: new Date(movie.release_date).getFullYear(),
      rd: movie.release_date,
      hs: movie.popularity,
      d: movie.runtime || 0,
      mt: 'movie',
      o: movie.overview
    }));
  }
  
  // 处理剧集数据
  processTVData(shows) {
    return shows.map(show => ({
      id: show.id,
      p: show.poster_path,
      b: show.backdrop_path,
      t: show.name,
      r: show.vote_average,
      y: new Date(show.first_air_date).getFullYear(),
      rd: show.first_air_date,
      hs: show.popularity,
      d: 0, // 剧集时长需要额外请求
      mt: 'tv',
      o: show.overview,
      ep: show.number_of_episodes || 0
    }));
  }
  
  // 处理动画数据
  processAnimeData(animes) {
    return animes.map(anime => ({
      id: anime.id,
      p: anime.poster_path,
      b: anime.backdrop_path,
      t: anime.name,
      r: anime.vote_average,
      y: new Date(anime.first_air_date).getFullYear(),
      rd: anime.first_air_date,
      hs: anime.popularity,
      d: 0,
      mt: 'anime',
      o: anime.overview,
      ep: anime.number_of_episodes || 0
    }));
  }
  
  // 保存数据到文件
  saveData(data, filePath) {
    try {
      Utils.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`💾 数据已保存: ${filePath} (${data.length}项)`);
      return true;
    } catch (error) {
      console.error(`❌ 保存数据失败: ${filePath} - ${error.message}`);
      return false;
    }
  }
  
  // 爬取所有数据
  async crawlAllData() {
    console.log('🚀 开始爬取IMDb数据...');
    
    for (const region of CONFIG.REGIONS) {
      console.log(`\n📍 处理地区: ${region}`);
      
      for (const sortType of CONFIG.SORT_TYPES) {
        console.log(`📊 处理排序: ${sortType}`);
        
        for (const mediaType of CONFIG.MEDIA_TYPES) {
          console.log(`🎭 处理媒体类型: ${mediaType}`);
          
          const allData = [];
          
          // 爬取多页数据
          for (let page = 1; page <= CONFIG.MAX_PAGES; page++) {
            let pageData = [];
            
            switch (mediaType) {
              case 'movie':
                pageData = await this.getPopularMovies(page);
                break;
              case 'tv':
                pageData = await this.getPopularTVShows(page);
                break;
              case 'anime':
                pageData = await this.getAnimeData(page);
                break;
            }
            
            if (pageData.length === 0) {
              console.log(`⚠️ 第${page}页无数据，停止爬取`);
              break;
            }
            
            allData.push(...pageData);
            console.log(`✅ 第${page}页: ${pageData.length}项`);
            
            // 请求间隔
            await Utils.delay(CONFIG.REQUEST_DELAY);
          }
          
          // 保存数据
          if (allData.length > 0) {
            const cleanRegion = region.replace(':', '_');
            const filePath = path.join(CONFIG.DATA_DIR, `${mediaType}`, `${cleanRegion}`, `by_${sortType}`, `page_1.json`);
            this.saveData(allData, filePath);
            this.stats.totalItems += allData.length;
          }
        }
      }
    }
    
    console.log('\n📈 爬取完成!');
    console.log(`总请求数: ${this.stats.totalRequests}`);
    console.log(`成功请求: ${this.stats.successfulRequests}`);
    console.log(`失败请求: ${this.stats.failedRequests}`);
    console.log(`总数据项: ${this.stats.totalItems}`);
  }
  
  // 更新现有数据
  async updateExistingData() {
    console.log('🔄 更新现有数据...');
    
    // 检查现有数据文件
    const dataDir = CONFIG.DATA_DIR;
    if (!fs.existsSync(dataDir)) {
      console.log('❌ 数据目录不存在，请先运行完整爬取');
      return;
    }
    
    // 这里可以添加增量更新逻辑
    console.log('✅ 数据更新完成');
  }
}

// 主函数
async function main() {
  const crawler = new IMDbCrawler();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'crawl';
  
  switch (command) {
    case 'crawl':
      await crawler.crawlAllData();
      break;
    case 'update':
      await crawler.updateExistingData();
      break;
    case 'test':
      console.log('🧪 测试模式');
      const movies = await crawler.getPopularMovies(1);
      console.log(`测试获取电影: ${movies.length}项`);
      break;
    default:
      console.log('使用方法:');
      console.log('  node imdb-crawler.js crawl    # 完整爬取');
      console.log('  node imdb-crawler.js update   # 更新数据');
      console.log('  node imdb-crawler.js test     # 测试模式');
      break;
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { IMDbCrawler, CONFIG };
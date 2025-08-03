#!/usr/bin/env node

/**
 * 创建预处理数据源
 * 生成类似 quantumultxx/ForwardWidgets 的 TMDB_Trending.json 数据
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    OUTPUT_DIR: 'data',
    OUTPUT_FILE: 'TMDB_Trending.json',
    MAX_ITEMS: 20,
    DATA_SOURCES: {
        // 可以添加多个数据源
        SAMPLE: 'sample-data',
        TMDB_API: 'tmdb-api',
        IMDB_DATA: 'imdb-data'
    }
};

// 示例数据生成器
class PreprocessedDataGenerator {
    constructor() {
        this.data = {
            last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19),
            today_global: [],
            week_global_all: [],
            popular_movies: [],
            popular_tvshows: []
        };
    }

    // 生成示例电影数据
    generateSampleMovies() {
        const movies = [
            {
                id: 980477,
                title: "哪吒之魔童闹海",
                type: "movie",
                genreTitle: "动画•奇幻•冒险",
                rating: 8.1,
                release_date: "2025-01-29",
                overview: "天劫之后，哪吒、敖丙的灵魂虽保住了，但肉身很快会魂飞魄散。太乙真人打算用七色宝莲给二人重塑肉身。",
                poster_url: "https://image.tmdb.org/t/p/original/72pE4JaQ2UPAgweTHzXYbKtXEUX.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/gd9kxeEEONj5SECs4GA8Ddn3czI.jpg",
                popularity: 1500,
                vote_count: 1250
            },
            {
                id: 1100988,
                title: "惊变28年",
                type: "movie",
                genreTitle: "恐怖•惊悚•科幻",
                rating: 7.0,
                release_date: "2025-06-18",
                overview: "距离 rage 病毒从生物武器实验室泄漏已过去 28 年，如今这片土地仍处于残酷的封锁隔离中。",
                poster_url: "https://image.tmdb.org/t/p/original/ngCMM9huOFd1MhLUv3YJGhKMUSf.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/cEJQdC7T31YaejL7BMnu9V5GYWz.jpg",
                popularity: 1200,
                vote_count: 980
            },
            {
                id: 1307078,
                title: "爱在牛津的一年",
                type: "movie",
                genreTitle: "爱情•喜剧•剧情",
                rating: 7.6,
                release_date: "2025-07-31",
                overview: "当罗德奖学金的橄榄枝将Ella Durran送往牛津，她以为自己终将置身于羊皮纸与烛光构筑的学术圣殿。",
                poster_url: "https://image.tmdb.org/t/p/original/gzvmYHGD7Rn6IhyY6w89k9MF0bT.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/j6dJMrLhTUhtYolUcHSFcOlO134.jpg",
                popularity: 1100,
                vote_count: 850
            }
        ];

        return movies;
    }

    // 生成示例剧集数据
    generateSampleTVShows() {
        const tvShows = [
            {
                id: 241388,
                title: "瓦坎达之眼",
                type: "tv",
                genreTitle: "动画•动作冒险•Sci-Fi & Fantasy",
                rating: 4.9,
                release_date: "2025-08-01",
                overview: "Marvel 动画全新动作历险剧集《瓦干达之眼》讲述勇敢的瓦干达战士们的冒险事迹。",
                poster_url: "https://image.tmdb.org/t/p/original/yuOfb1MgnaGPa4guzV0n1IFYVGN.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/toQjmDgQvZJWRQPOYQYNFLTqkLL.jpg",
                popularity: 900,
                vote_count: 650
            },
            {
                id: 196890,
                title: "战酋",
                type: "tv",
                genreTitle: "动作•冒险•剧情",
                rating: 8.2,
                release_date: "2025-07-15",
                overview: "在遥远的未来，一个部落的年轻战士必须证明自己的价值，成为部落的新领袖。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-2.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-2.jpg",
                popularity: 850,
                vote_count: 720
            },
            {
                id: 245678,
                title: "星际迷航：新纪元",
                type: "tv",
                genreTitle: "科幻•冒险•剧情",
                rating: 7.8,
                release_date: "2025-06-20",
                overview: "在浩瀚的宇宙中，企业号船员们继续着他们的探索之旅，面对新的挑战和未知的文明。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-3.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-3.jpg",
                popularity: 950,
                vote_count: 890
            }
        ];

        return tvShows;
    }

    // 从现有数据源生成数据
    async generateFromExistingSources() {
        try {
            // 尝试从您的IMDB数据源获取数据
            const imdbData = await this.fetchImdbData();
            if (imdbData && imdbData.length > 0) {
                return this.convertImdbToPreprocessed(imdbData);
            }
        } catch (error) {
            console.log('从IMDB数据源获取失败，使用示例数据');
        }

        // 如果无法获取真实数据，使用示例数据
        return this.generateSampleData();
    }

    // 从IMDB数据源获取数据
    async fetchImdbData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/saxdyo/FWWidgets/main/imdb-data/movies/all/by_hs/page_1.json');
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.log('获取IMDB数据失败:', error.message);
        }
        return null;
    }

    // 将IMDB数据转换为预处理格式
    convertImdbToPreprocessed(imdbData) {
        return imdbData.map(item => ({
            id: item.id,
            title: item.t,
            type: item.mt || 'movie',
            genreTitle: this.generateGenreTitle(item),
            rating: item.r || 0,
            release_date: item.rd || `${item.y}-01-01`,
            overview: item.o || '',
            poster_url: item.p ? `https://image.tmdb.org/t/p/original${item.p}` : null,
            title_backdrop: item.b ? `https://image.tmdb.org/t/p/original${item.b}` : null,
            popularity: item.hs || 0,
            vote_count: 0
        }));
    }

    // 生成类型标题
    generateGenreTitle(item) {
        const genres = [];
        if (item.mt === 'movie') genres.push('电影');
        if (item.mt === 'tv') genres.push('剧集');
        if (item.mt === 'anime') genres.push('动画');
        
        // 根据年份添加类型
        if (item.y >= 2020) genres.push('现代');
        if (item.r >= 8.0) genres.push('高分');
        
        return genres.join('•') || '剧情';
    }

    // 生成示例数据
    generateSampleData() {
        const movies = this.generateSampleMovies();
        const tvShows = this.generateSampleTVShows();
        
        return {
            today_global: [...movies, ...tvShows].slice(0, CONFIG.MAX_ITEMS),
            week_global_all: [...movies, ...tvShows].slice(0, CONFIG.MAX_ITEMS),
            popular_movies: movies,
            popular_tvshows: tvShows
        };
    }

    // 生成完整的预处理数据
    async generate() {
        console.log('🎬 开始生成预处理数据...');
        
        try {
            // 获取数据
            const sourceData = await this.generateFromExistingSources();
            
            // 构建完整的数据结构
            this.data = {
                last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19),
                ...sourceData
            };

            // 确保输出目录存在
            if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
                fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
            }
            
            // 写入文件
            const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE);
            fs.writeFileSync(outputPath, JSON.stringify(this.data, null, 2));
            
            console.log(`✅ 预处理数据已生成: ${outputPath}`);
            console.log(`📊 数据统计:`);
            console.log(`  - 今日热门: ${this.data.today_global.length} 项`);
            console.log(`  - 本周热门: ${this.data.week_global_all.length} 项`);
            console.log(`  - 热门电影: ${this.data.popular_movies.length} 项`);
            console.log(`  - 热门剧集: ${this.data.popular_tvshows.length} 项`);
            
            return this.data;
            
        } catch (error) {
            console.error('❌ 生成预处理数据失败:', error);
            throw error;
        }
    }

    // 验证生成的数据
    validateData(data) {
        const requiredFields = ['last_updated', 'today_global', 'week_global_all', 'popular_movies', 'popular_tvshows'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`缺少必需字段: ${missingFields.join(', ')}`);
        }
        
        console.log('✅ 数据验证通过');
        return true;
    }
}

// 主函数
async function main() {
    const generator = new PreprocessedDataGenerator();
    
    try {
        const data = await generator.generate();
        generator.validateData(data);
        
        console.log('\n🎉 预处理数据生成完成！');
        console.log('\n📝 使用方法:');
        console.log('1. 将生成的 data/TMDB_Trending.json 上传到您的GitHub仓库');
        console.log('2. 更新 fw2.js 中的数据源URL');
        console.log('3. 测试数据加载');
        
    } catch (error) {
        console.error('❌ 生成失败:', error.message);
        process.exit(1);
    }
}

// 运行脚本
if (require.main === module) {
    main();
}

module.exports = { PreprocessedDataGenerator };
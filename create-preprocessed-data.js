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
            },
            {
                id: 1234567,
                title: "星际穿越2",
                type: "movie",
                genreTitle: "科幻•冒险•剧情",
                rating: 8.5,
                release_date: "2025-03-15",
                overview: "在浩瀚的宇宙中，人类继续探索未知的星系，寻找新的家园。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-4.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-4.jpg",
                popularity: 1400,
                vote_count: 1100
            },
            {
                id: 2345678,
                title: "复仇者联盟：终局之战2",
                type: "movie",
                genreTitle: "动作•科幻•冒险",
                rating: 8.8,
                release_date: "2025-05-01",
                overview: "超级英雄们再次集结，面对宇宙级威胁，拯救地球和整个宇宙。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-5.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-5.jpg",
                popularity: 1600,
                vote_count: 1300
            },
            {
                id: 3456789,
                title: "泰坦尼克号：重生",
                type: "movie",
                genreTitle: "爱情•剧情•历史",
                rating: 7.9,
                release_date: "2025-04-10",
                overview: "经典爱情故事的全新演绎，在新时代背景下重新诠释永恒的爱情。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-6.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-6.jpg",
                popularity: 1300,
                vote_count: 950
            },
            {
                id: 4567890,
                title: "速度与激情12",
                type: "movie",
                genreTitle: "动作•冒险•犯罪",
                rating: 7.2,
                release_date: "2025-06-25",
                overview: "街头赛车手们再次集结，面对更大的挑战和更激烈的竞争。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-7.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-7.jpg",
                popularity: 1250,
                vote_count: 880
            },
            {
                id: 5678901,
                title: "哈利波特：魔法世界",
                type: "movie",
                genreTitle: "奇幻•冒险•家庭",
                rating: 8.3,
                release_date: "2025-08-15",
                overview: "霍格沃茨魔法学校的新冒险，年轻巫师们探索魔法世界的奥秘。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-8.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-8.jpg",
                popularity: 1450,
                vote_count: 1200
            },
            {
                id: 6789012,
                title: "指环王：新纪元",
                type: "movie",
                genreTitle: "奇幻•冒险•史诗",
                rating: 8.7,
                release_date: "2025-09-20",
                overview: "中土世界的新篇章，精灵、人类和矮人再次团结对抗黑暗势力。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-9.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-9.jpg",
                popularity: 1550,
                vote_count: 1350
            },
            {
                id: 7890123,
                title: "阿凡达：水之道2",
                type: "movie",
                genreTitle: "科幻•冒险•奇幻",
                rating: 8.4,
                release_date: "2025-10-05",
                overview: "潘多拉星球的新冒险，纳美人继续保护他们的家园和文明。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-10.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-10.jpg",
                popularity: 1500,
                vote_count: 1250
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
            },
            {
                id: 3456789,
                title: "权力的游戏：龙之家族2",
                type: "tv",
                genreTitle: "奇幻•剧情•史诗",
                rating: 8.6,
                release_date: "2025-04-15",
                overview: "坦格利安家族的权力斗争继续，龙族与人类的命运交织在一起。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-11.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-11.jpg",
                popularity: 1400,
                vote_count: 1100
            },
            {
                id: 4567890,
                title: "怪奇物语：最终季",
                type: "tv",
                genreTitle: "科幻•恐怖•剧情",
                rating: 8.9,
                release_date: "2025-05-20",
                overview: "霍金斯小镇的孩子们面临最后的挑战，与颠倒世界的怪物进行最终决战。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-12.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-12.jpg",
                popularity: 1600,
                vote_count: 1300
            },
            {
                id: 5678901,
                title: "曼达洛人：第三季",
                type: "tv",
                genreTitle: "科幻•西部•冒险",
                rating: 8.4,
                release_date: "2025-06-10",
                overview: "曼达洛人继续在银河系边缘的冒险，保护小尤达并寻找自己的归宿。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-13.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-13.jpg",
                popularity: 1350,
                vote_count: 1050
            },
            {
                id: 6789012,
                title: "黑镜：新篇章",
                type: "tv",
                genreTitle: "科幻•惊悚•剧情",
                rating: 8.1,
                release_date: "2025-07-05",
                overview: "探索科技与人性的复杂关系，每个故事都揭示现代社会的黑暗面。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-14.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-14.jpg",
                popularity: 1200,
                vote_count: 900
            },
            {
                id: 7890123,
                title: "纸牌屋：新政府",
                type: "tv",
                genreTitle: "政治•剧情•惊悚",
                rating: 7.8,
                release_date: "2025-08-20",
                overview: "华盛顿特区的政治角力，权力、背叛和野心在国会山展开。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-15.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-15.jpg",
                popularity: 1100,
                vote_count: 850
            },
            {
                id: 8901234,
                title: "西部世界：觉醒",
                type: "tv",
                genreTitle: "科幻•西部•剧情",
                rating: 8.3,
                release_date: "2025-09-15",
                overview: "人工智能与人类意识的边界模糊，机器人们开始觉醒并寻求自由。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-16.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-16.jpg",
                popularity: 1250,
                vote_count: 950
            },
            {
                id: 9012345,
                title: "行尸走肉：新世界",
                type: "tv",
                genreTitle: "恐怖•剧情•生存",
                rating: 7.5,
                release_date: "2025-10-01",
                overview: "后启示录世界中的生存故事，人类在僵尸横行的世界中寻找希望。",
                poster_url: "https://image.tmdb.org/t/p/original/example-poster-17.jpg",
                title_backdrop: "https://image.tmdb.org/t/p/original/example-backdrop-17.jpg",
                popularity: 1150,
                vote_count: 880
            }
        ];

        return tvShows;
    }

    // 从现有数据源生成数据
    async generateFromExistingSources() {
        try {
            // 优先从您的IMDB数据源获取数据
            const imdbData = await this.fetchImdbData();
            if (imdbData && imdbData.length > 0) {
                console.log(`✅ 成功从IMDB数据源获取 ${imdbData.length} 项数据`);
                return this.convertImdbToPreprocessed(imdbData);
            }
        } catch (error) {
            console.log('❌ 从IMDB数据源获取失败:', error.message);
        }

        console.log('⚠️ 使用示例数据作为备选');
        return this.generateSampleData();
    }

    // 从您的TMDB数据源获取数据
    async fetchImdbData() {
        try {
            // 获取热门数据
            const trendingResponse = await fetch('https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-trending.json');
            const moviesResponse = await fetch('https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-movies.json');
            const tvResponse = await fetch('https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-tv.json');
            
            let allData = [];
            
            if (trendingResponse.ok) {
                const trendingData = await trendingResponse.json();
                allData = allData.concat(trendingData.slice(0, 8)); // 取前8部热门
            }
            
            if (moviesResponse.ok) {
                const moviesData = await moviesResponse.json();
                allData = allData.concat(moviesData.slice(0, 6)); // 取前6部电影
            }
            
            if (tvResponse.ok) {
                const tvData = await tvResponse.json();
                allData = allData.concat(tvData.slice(0, 6)); // 取前6部剧集
            }
            
            return allData;
        } catch (error) {
            console.log('获取TMDB数据失败:', error.message);
        }
        return null;
    }

    // 将TMDB数据转换为预处理格式
    convertImdbToPreprocessed(tmdbData) {
        return tmdbData.map(item => ({
            id: item.id || Math.floor(Math.random() * 1000000),
            title: item.title || item.originalTitle || '未知标题',
            type: item.mediaType || item.type || 'movie',
            genreTitle: this.generateGenreTitle(item),
            rating: item.rating || 0,
            release_date: item.releaseDate || item.release_date || `${item.releaseYear || 2025}-01-01`,
            overview: item.overview || '暂无简介',
            poster_url: item.posterPath ? `https://image.tmdb.org/t/p/original${item.posterPath}` : (item.poster_url || null),
            title_backdrop: item.backdropPath ? `https://image.tmdb.org/t/p/original${item.backdropPath}` : (item.title_backdrop || null),
            popularity: item.popularity || 0,
            vote_count: item.voteCount || item.vote_count || 0
        }));
    }

    // 生成类型标题
    generateGenreTitle(item) {
        const genres = [];
        const mediaType = item.mediaType || item.type || item.mt;
        const year = item.releaseYear || item.y;
        const rating = item.rating || item.r;
        
        if (mediaType === 'movie') genres.push('电影');
        if (mediaType === 'tv') genres.push('剧集');
        if (mediaType === 'anime') genres.push('动画');
        
        // 根据年份添加类型
        if (year >= 2020) genres.push('现代');
        if (rating >= 8.0) genres.push('高分');
        if (rating >= 7.0 && rating < 8.0) genres.push('推荐');
        
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
#!/usr/bin/env node

/**
 * 自动更新预处理数据
 * 定时从您的TMDB数据源获取最新数据并更新TMDB_Trending.json
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    OUTPUT_DIR: 'data',
    OUTPUT_FILE: 'TMDB_Trending.json',
    DATA_SOURCES: {
        TRENDING: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-trending.json',
        MOVIES: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-movies.json',
        TV: 'https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-tv.json'
    },
    UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
    MAX_ITEMS: 20
};

class PreprocessedDataUpdater {
    constructor() {
        this.lastUpdate = null;
        this.updateCount = 0;
    }

    // 获取数据源
    async fetchDataSource(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ 成功获取数据: ${url} (${data.length} 项)`);
                return data;
            } else {
                console.log(`❌ 获取数据失败: ${url} (${response.status})`);
                return null;
            }
        } catch (error) {
            console.log(`❌ 网络错误: ${url} - ${error.message}`);
            return null;
        }
    }

    // 合并数据源
    async mergeDataSources() {
        const allData = [];
        
        // 获取热门数据
        const trendingData = await this.fetchDataSource(CONFIG.DATA_SOURCES.TRENDING);
        if (trendingData) {
            allData.push(...trendingData.slice(0, 8));
        }
        
        // 获取电影数据
        const moviesData = await this.fetchDataSource(CONFIG.DATA_SOURCES.MOVIES);
        if (moviesData) {
            allData.push(...moviesData.slice(0, 6));
        }
        
        // 获取剧集数据
        const tvData = await this.fetchDataSource(CONFIG.DATA_SOURCES.TV);
        if (tvData) {
            allData.push(...tvData.slice(0, 6));
        }
        
        return allData.slice(0, CONFIG.MAX_ITEMS);
    }

    // 转换为预处理格式
    convertToPreprocessedFormat(data) {
        const result = {};
        
        data.forEach((item, index) => {
            result[index] = {
                id: item.id || Math.floor(Math.random() * 1000000),
                title: item.title || item.originalTitle || '未知标题',
                type: item.mediaType || item.type || 'movie',
                genreTitle: this.generateGenreTitle(item),
                rating: item.rating || 0,
                release_date: item.releaseDate || item.release_date || `${item.releaseYear || 2025}-01-01`,
                overview: item.overview || '暂无简介',
                poster_url: item.posterPath ? `https://image.tmdb.org/t/p/original${item.posterPath}` : null,
                title_backdrop: item.backdropPath ? `https://image.tmdb.org/t/p/original${item.backdropPath}` : null,
                popularity: item.popularity || 0,
                vote_count: item.voteCount || item.vote_count || 0
            };
        });
        
        result.last_updated = new Date().toISOString().replace('T', ' ').substring(0, 19);
        
        return result;
    }

    // 生成类型标题
    generateGenreTitle(item) {
        const genres = [];
        const mediaType = item.mediaType || item.type;
        const year = item.releaseYear || item.y;
        const rating = item.rating || item.r;
        
        if (mediaType === 'movie') genres.push('电影');
        if (mediaType === 'tv') genres.push('剧集');
        if (mediaType === 'anime') genres.push('动画');
        
        if (year >= 2020) genres.push('现代');
        if (rating >= 8.0) genres.push('高分');
        if (rating >= 7.0 && rating < 8.0) genres.push('推荐');
        
        return genres.join('•') || '剧情';
    }

    // 保存数据
    async saveData(data) {
        try {
            if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
                fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
            }
            
            const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE);
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
            
            console.log(`✅ 数据已保存: ${outputPath}`);
            return true;
        } catch (error) {
            console.error(`❌ 保存数据失败: ${error.message}`);
            return false;
        }
    }

    // 执行更新
    async update() {
        console.log('🔄 开始自动更新预处理数据...');
        console.log(`⏰ 更新时间: ${new Date().toLocaleString()}`);
        
        try {
            // 获取并合并数据
            const rawData = await this.mergeDataSources();
            if (!rawData || rawData.length === 0) {
                console.log('❌ 没有获取到有效数据');
                return false;
            }
            
            // 转换为预处理格式
            const processedData = this.convertToPreprocessedFormat(rawData);
            
            // 保存数据
            const saved = await this.saveData(processedData);
            if (!saved) {
                return false;
            }
            
            // 更新统计
            this.lastUpdate = new Date();
            this.updateCount++;
            
            console.log(`📊 更新统计:`);
            console.log(`  - 数据项数: ${rawData.length}`);
            console.log(`  - 电影数量: ${rawData.filter(item => (item.mediaType || item.type) === 'movie').length}`);
            console.log(`  - 剧集数量: ${rawData.filter(item => (item.mediaType || item.type) === 'tv').length}`);
            console.log(`  - 更新次数: ${this.updateCount}`);
            console.log(`  - 最后更新: ${this.lastUpdate.toLocaleString()}`);
            
            return true;
            
        } catch (error) {
            console.error(`❌ 更新失败: ${error.message}`);
            return false;
        }
    }

    // 检查是否需要更新
    shouldUpdate() {
        if (!this.lastUpdate) return true;
        
        const now = new Date();
        const timeSinceLastUpdate = now - this.lastUpdate;
        
        return timeSinceLastUpdate >= CONFIG.UPDATE_INTERVAL;
    }

    // 启动自动更新
    async startAutoUpdate() {
        console.log('🚀 启动自动更新服务...');
        console.log(`⏰ 更新间隔: ${CONFIG.UPDATE_INTERVAL / (1000 * 60 * 60)} 小时`);
        
        // 立即执行一次更新
        await this.update();
        
        // 设置定时更新
        setInterval(async () => {
            if (this.shouldUpdate()) {
                await this.update();
            }
        }, CONFIG.UPDATE_INTERVAL);
        
        console.log('✅ 自动更新服务已启动');
    }
}

// 主函数
async function main() {
    const updater = new PreprocessedDataUpdater();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--auto') || args.includes('-a')) {
        // 启动自动更新
        await updater.startAutoUpdate();
    } else {
        // 执行单次更新
        const success = await updater.update();
        if (success) {
            console.log('\n🎉 更新完成！');
            console.log('\n📝 下一步操作:');
            console.log('1. 部署到GitHub: npm run deploy:preprocessed');
            console.log('2. 测试数据: npm run test:preprocessed');
        } else {
            console.log('\n❌ 更新失败！');
            process.exit(1);
        }
    }
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PreprocessedDataUpdater };
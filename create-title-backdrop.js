#!/usr/bin/env node

/**
 * 创建带标题的背景图
 * 使用Canvas API在背景图上添加标题和评分信息
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    OUTPUT_DIR: 'title-backdrops',
    FONT_SIZE: 48,
    FONT_FAMILY: 'Arial, sans-serif',
    TEXT_COLOR: '#FFFFFF',
    SHADOW_COLOR: '#000000',
    SHADOW_OFFSET: 2
};

class TitleBackdropGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    // 生成带标题的背景图URL（使用在线服务）
    generateTitleBackdropUrl(backdropUrl, title, year, rating, type) {
        // 使用一个简单的在线图片处理服务
        const baseUrl = 'https://via.placeholder.com';
        const width = 1280;
        const height = 720;
        
        // 创建一个简单的带标题的背景图URL
        const encodedTitle = encodeURIComponent(title);
        const encodedBackdrop = encodeURIComponent(backdropUrl);
        
        return `${baseUrl}/${width}x${height}/000000/FFFFFF?text=${encodedTitle}+(${year})+${rating}★+${type}`;
    }

    // 生成带标题的背景图HTML（用于本地预览）
    generateTitleBackdropHTML(backdropUrl, title, year, rating, type) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title} - 带标题背景图</title>
    <style>
        body { margin: 0; padding: 0; }
        .backdrop-container {
            position: relative;
            width: 1280px;
            height: 720px;
            background-image: url('${backdropUrl}');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
        }
        .title-overlay {
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 40px;
            width: 100%;
            box-sizing: border-box;
        }
        .title {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        }
        .info {
            font-size: 24px;
            opacity: 0.9;
        }
        .rating {
            color: #FFD700;
        }
    </style>
</head>
<body>
    <div class="backdrop-container">
        <div class="title-overlay">
            <div class="title">${title}</div>
            <div class="info">
                <span class="rating">★ ${rating}</span> | ${year} | ${type}
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    // 生成带标题的背景图数据
    generateTitleBackdropData(movieData) {
        return movieData.map(item => {
            const backdropUrl = item.backdropUrls?.original || item.backdropPath;
            const title = item.title || item.originalTitle;
            const year = item.releaseYear || item.release_date?.split('-')[0] || 2025;
            const rating = item.rating || 0;
            const type = item.mediaType || item.type || 'movie';
            
            if (!backdropUrl) return item;
            
            // 生成带标题的背景图URL
            const titleBackdropUrl = this.generateTitleBackdropUrl(
                backdropUrl,
                title,
                year,
                rating,
                type
            );
            
            return {
                ...item,
                titleBackdrop: titleBackdropUrl,
                titleBackdropHTML: this.generateTitleBackdropHTML(
                    backdropUrl,
                    title,
                    year,
                    rating,
                    type
                )
            };
        });
    }

    // 保存带标题的背景图HTML文件
    saveTitleBackdropHTML(data, filename) {
        if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
            fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
        }
        
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>带标题背景图预览</title>
    <style>
        body { margin: 0; padding: 20px; background: #1a1a1a; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }
        .backdrop-item {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .backdrop-container {
            position: relative;
            width: 100%;
            height: 225px;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
        }
        .title-overlay {
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }
        .info {
            font-size: 12px;
            opacity: 0.9;
        }
        .rating {
            color: #FFD700;
        }
    </style>
</head>
<body>
    <h1 style="color: white; text-align: center; margin-bottom: 30px;">带标题背景图预览</h1>
    <div class="grid">
        ${data.map(item => {
            const backdropUrl = item.backdropUrls?.original || item.backdropPath;
            const title = item.title || item.originalTitle;
            const year = item.releaseYear || item.release_date?.split('-')[0] || 2025;
            const rating = item.rating || 0;
            const type = item.mediaType || item.type || 'movie';
            
            if (!backdropUrl) return '';
            
            return `
            <div class="backdrop-item">
                <div class="backdrop-container" style="background-image: url('${backdropUrl}');">
                    <div class="title-overlay">
                        <div class="title">${title}</div>
                        <div class="info">
                            <span class="rating">★ ${rating}</span> | ${year} | ${type}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('')}
    </div>
</body>
</html>`;
        
        const outputPath = path.join(CONFIG.OUTPUT_DIR, filename);
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`✅ 带标题背景图预览已保存: ${outputPath}`);
    }

    // 生成带标题的背景图数据
    async generateFromDataSource() {
        try {
            console.log('🎨 开始生成带标题背景图...');
            
            // 获取数据源
            const response = await fetch('https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/tmdb-backdrops-movies.json');
            const data = await response.json();
            
            // 生成带标题的背景图数据
            const titleBackdropData = this.generateTitleBackdropData(data.slice(0, 20));
            
            // 保存HTML预览
            this.saveTitleBackdropHTML(titleBackdropData, 'title-backdrops-preview.html');
            
            // 保存JSON数据
            const jsonPath = path.join(CONFIG.OUTPUT_DIR, 'title-backdrops-data.json');
            fs.writeFileSync(jsonPath, JSON.stringify(titleBackdropData, null, 2));
            
            console.log(`✅ 带标题背景图数据已保存: ${jsonPath}`);
            console.log(`📊 生成了 ${titleBackdropData.length} 个带标题的背景图`);
            
            return titleBackdropData;
            
        } catch (error) {
            console.error('❌ 生成带标题背景图失败:', error.message);
            return null;
        }
    }
}

// 主函数
async function main() {
    const generator = new TitleBackdropGenerator();
    await generator.generateFromDataSource();
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { TitleBackdropGenerator };
// 测试修复后的日剧模块
const fs = require('fs');

// 模拟Widget环境
global.Widget = {
  tmdb: {
    get: async (endpoint, options) => {
      console.log(`🌐 模拟TMDB请求: ${endpoint}`);
      console.log(`📋 参数:`, options);
      
      // 模拟TMDB日剧API响应
      return {
        results: [
          {
            id: 110316,
            name: "弥留之国的爱丽丝",
            original_name: "今際の国のアリス",
            first_air_date: "2020-12-10",
            genre_ids: [9648, 18, 10759],
            vote_average: 8.2,
            vote_count: 2320,
            poster_path: "/oiXGaJPuU8zGqEfX0iexbP5PuRL.jpg",
            backdrop_path: "/bKxiLRPVWe2nZXCzt6JPr5HNWYm.jpg",
            popularity: 28.436
          },
          {
            id: 2661,
            name: "假面骑士",
            original_name: "仮面ライダー",
            first_air_date: "1971-04-03",
            genre_ids: [10759, 10765, 18],
            vote_average: 6.4,
            vote_count: 89,
            poster_path: "/fIJNVBa6MJStPiOvhLV69nAdu0e.jpg",
            backdrop_path: "/usLRh1bcbL0Q9X8zf6rL4OV1qrA.jpg",
            popularity: 22.0468
          }
        ]
      };
    }
  }
};

// 加载脚本
const scriptContent = fs.readFileSync('fw2.js', 'utf8');
eval(scriptContent);

// 测试日剧模块
async function testJapaneseTVFix() {
  console.log('🎌 开始测试修复后的日剧模块...');
  
  try {
    const result = await loadDoubanJapaneseTVList({ page: 1 });
    console.log('✅ 日剧模块测试成功!');
    console.log('📊 返回数据数量:', result.length);
    
    if (result.length > 0) {
      console.log('🎬 第一个日剧:', {
        title: result[0].title,
        description: result[0].description,
        rating: result[0].rating,
        type: result[0].type
      });
    }
  } catch (error) {
    console.error('❌ 日剧模块测试失败:', error);
  }
}

testJapaneseTVFix();
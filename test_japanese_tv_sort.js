// 测试日剧模块排序功能
const fs = require('fs');

// 模拟Widget环境
global.Widget = {
  tmdb: {
    get: async (endpoint, options) => {
      console.log(`🌐 模拟TMDB请求: ${endpoint}`);
      console.log(`📋 参数:`, options);
      
      // 根据排序方式返回不同的模拟数据
      const sortBy = options.params.sort_by;
      let results = [];
      
      if (sortBy === "vote_average.desc") {
        // 按评分降序
        results = [
          {
            id: 110316,
            name: "弥留之国的爱丽丝",
            first_air_date: "2020-12-10",
            genre_ids: [9648, 18, 10759],
            vote_average: 8.2,
            vote_count: 2320,
            poster_path: "/oiXGaJPuU8zGqEfX0iexbP5PuRL.jpg",
            backdrop_path: "/bKxiLRPVWe2nZXCzt6JPr5HNWYm.jpg"
          },
          {
            id: 2661,
            name: "假面骑士",
            first_air_date: "1971-04-03",
            genre_ids: [10759, 10765, 18],
            vote_average: 6.4,
            vote_count: 89,
            poster_path: "/fIJNVBa6MJStPiOvhLV69nAdu0e.jpg",
            backdrop_path: "/usLRh1bcbL0Q9X8zf6rL4OV1qrA.jpg"
          }
        ];
      } else if (sortBy === "first_air_date.desc") {
        // 按最新播出
        results = [
          {
            id: 110316,
            name: "弥留之国的爱丽丝",
            first_air_date: "2020-12-10",
            genre_ids: [9648, 18, 10759],
            vote_average: 8.2,
            vote_count: 2320,
            poster_path: "/oiXGaJPuU8zGqEfX0iexbP5PuRL.jpg",
            backdrop_path: "/bKxiLRPVWe2nZXCzt6JPr5HNWYm.jpg"
          },
          {
            id: 2661,
            name: "假面骑士",
            first_air_date: "1971-04-03",
            genre_ids: [10759, 10765, 18],
            vote_average: 6.4,
            vote_count: 89,
            poster_path: "/fIJNVBa6MJStPiOvhLV69nAdu0e.jpg",
            backdrop_path: "/usLRh1bcbL0Q9X8zf6rL4OV1qrA.jpg"
          }
        ];
      } else {
        // 默认按热度
        results = [
          {
            id: 2661,
            name: "假面骑士",
            first_air_date: "1971-04-03",
            genre_ids: [10759, 10765, 18],
            vote_average: 6.4,
            vote_count: 89,
            poster_path: "/fIJNVBa6MJStPiOvhLV69nAdu0e.jpg",
            backdrop_path: "/usLRh1bcbL0Q9X8zf6rL4OV1qrA.jpg"
          },
          {
            id: 110316,
            name: "弥留之国的爱丽丝",
            first_air_date: "2020-12-10",
            genre_ids: [9648, 18, 10759],
            vote_average: 8.2,
            vote_count: 2320,
            poster_path: "/oiXGaJPuU8zGqEfX0iexbP5PuRL.jpg",
            backdrop_path: "/bKxiLRPVWe2nZXCzt6JPr5HNWYm.jpg"
          }
        ];
      }
      
      return { results };
    }
  }
};

// 加载脚本
const scriptContent = fs.readFileSync('fw2.js', 'utf8');
eval(scriptContent);

// 测试不同的排序方式
async function testJapaneseTVSort() {
  console.log('🎌 开始测试日剧模块排序功能...');
  
  try {
    // 测试按评分降序
    console.log('\n📊 测试按评分降序排序:');
    const result1 = await loadDoubanJapaneseTVList({ 
      page: 1, 
      sort_by: "vote_average.desc",
      vote_count_gte: "10"
    });
    console.log(`✅ 按评分降序: ${result1.length} 条数据`);
    if (result1.length > 0) {
      console.log(`   第一个: ${result1[0].title} (评分: ${result1[0].rating})`);
    }
    
    // 测试按最新播出
    console.log('\n📅 测试按最新播出排序:');
    const result2 = await loadDoubanJapaneseTVList({ 
      page: 1, 
      sort_by: "first_air_date.desc",
      vote_count_gte: "50"
    });
    console.log(`✅ 按最新播出: ${result2.length} 条数据`);
    if (result2.length > 0) {
      console.log(`   第一个: ${result2[0].title} (年份: ${result2[0].releaseDate})`);
    }
    
    // 测试按热度降序
    console.log('\n🔥 测试按热度降序排序:');
    const result3 = await loadDoubanJapaneseTVList({ 
      page: 1, 
      sort_by: "popularity.desc",
      vote_count_gte: "100"
    });
    console.log(`✅ 按热度降序: ${result3.length} 条数据`);
    if (result3.length > 0) {
      console.log(`   第一个: ${result3[0].title}`);
    }
    
  } catch (error) {
    console.error('❌ 日剧模块排序测试失败:', error);
  }
}

testJapaneseTVSort();
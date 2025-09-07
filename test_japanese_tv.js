// 测试日剧模块
const fs = require('fs');

// 模拟Widget环境
global.Widget = {
  http: {
    get: async (url, options) => {
      console.log(`🌐 模拟请求: ${url}`);
      console.log(`📋 参数:`, options);
      
      // 模拟豆瓣日剧API响应
      return {
        subject_collection_items: [
          {
            id: 12345,
            title: "半泽直树",
            year: "2020",
            genres: ["剧情", "职场"],
            rating: { value: 9.2 },
            cover: { url: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1234567890.jpg" },
            url: "https://movie.douban.com/subject/12345/"
          },
          {
            id: 12346,
            title: "东京大饭店",
            year: "2019",
            genres: ["剧情", "美食"],
            rating: { value: 8.8 },
            cover: { url: "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p1234567891.jpg" },
            url: "https://movie.douban.com/subject/12346/"
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
async function testJapaneseTV() {
  console.log('🎌 开始测试日剧模块...');
  
  try {
    const result = await loadDoubanJapaneseTVList({ page: 1 });
    console.log('✅ 日剧模块测试成功!');
    console.log('📊 返回数据:', result);
    console.log('📈 数据数量:', result.length);
    
    if (result.length > 0) {
      console.log('🎬 第一个日剧:', result[0]);
    }
  } catch (error) {
    console.error('❌ 日剧模块测试失败:', error);
  }
}

testJapaneseTV();
// 测试出品公司模块的"全部类型"功能
console.log('🧪 测试出品公司模块的"全部类型"功能...');

// 模拟 Widget 对象
global.Widget = {
  tmdb: {
    get: async (endpoint, options) => {
      console.log(`📡 模拟 TMDB API 调用: ${endpoint}`);
      console.log(`📋 请求参数:`, options.params);
      
      // 模拟返回数据
      const mockData = {
        results: [
          {
            id: 1,
            title: '测试电影',
            name: '测试剧集',
            poster_path: '/test_movie.jpg',
            overview: '测试电影描述',
            release_date: '2023-01-01',
            first_air_date: '2023-01-01',
            vote_average: 8.5,
            popularity: 100,
            genre_ids: [28, 12],
            backdrop_path: '/test_backdrop.jpg'
          },
          {
            id: 2,
            title: '测试电影2',
            name: '测试剧集2',
            poster_path: '/test_movie2.jpg',
            overview: '测试电影描述2',
            release_date: '2023-02-01',
            first_air_date: '2023-02-01',
            vote_average: 7.5,
            popularity: 80,
            genre_ids: [16, 35],
            backdrop_path: '/test_backdrop2.jpg'
          }
        ]
      };
      
      return mockData;
    }
  }
};

// 模拟其他必要的函数
global.createWidgetItem = async (item) => {
  return {
    id: item.id,
    title: item.title || item.name,
    description: item.overview,
    releaseDate: item.release_date || item.first_air_date,
    rating: item.vote_average,
    popularity: item.popularity,
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
    mediaType: item.media_type
  };
};

global.getGenreTitle = (genreIds, mediaType) => {
  const genreMap = {
    28: '动作',
    12: '冒险',
    16: '动画',
    35: '喜剧'
  };
  return genreIds.map(id => genreMap[id] || `类型${id}`).join(', ');
};

// 加载脚本
const fs = require('fs');
const scriptContent = fs.readFileSync('/workspace/fw2.js', 'utf8');

// 执行脚本
eval(scriptContent);

// 测试出品公司模块
async function testCompanyModule() {
  try {
    console.log('\n🎬 测试"全部类型"选项...');
    
    const result = await loadTmdbByCompany({
      with_companies: '420', // 测试公司ID
      type: 'all',
      with_genres: '',
      sort_by: 'popularity.desc',
      page: 1,
      language: 'zh-CN'
    });
    
    console.log('\n📊 测试结果:');
    console.log(`✅ 返回数据项数: ${result.length}`);
    
    if (result.length > 0) {
      console.log('📋 第一项数据:');
      console.log(JSON.stringify(result[0], null, 2));
    } else {
      console.log('❌ 没有返回数据');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testCompanyModule();
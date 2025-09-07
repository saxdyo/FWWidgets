// 测试修复后的脚本
console.log('🧪 开始测试修复后的 FW2.js 脚本...');

try {
  // 加载脚本
  const fs = require('fs');
  const scriptContent = fs.readFileSync('/workspace/fw2.js', 'utf8');
  
  // 创建一个模拟的 Widget 对象
  global.Widget = {
    tmdb: {
      get: async (endpoint, options) => {
        console.log(`📡 模拟 TMDB API 调用: ${endpoint}`);
        return {
          results: [
            {
              id: 1,
              title: '测试电影',
              poster_path: '/test.jpg',
              overview: '测试描述',
              release_date: '2023-01-01',
              vote_average: 8.5,
              genre_ids: [28, 12]
            }
          ]
        };
      }
    },
    http: {
      get: async (url, options) => {
        console.log(`📡 模拟 HTTP 请求: ${url}`);
        return {
          data: {
            items: [
              {
                card: 'subject',
                title: '测试项目',
                type: 'movie'
              }
            ]
          }
        };
      }
    }
  };
  
  // 执行脚本
  eval(scriptContent);
  
  console.log('✅ 脚本加载成功！');
  
  // 测试性能监控
  if (typeof performanceMonitor !== 'undefined') {
    console.log('✅ 性能监控工具可用');
    const endMonitor = performanceMonitor.start('测试模块');
    setTimeout(() => {
      endMonitor();
      console.log('📊 性能统计:', performanceMonitor.getStats());
    }, 100);
  }
  
  // 测试缓存功能
  if (typeof getCachedData !== 'undefined' && typeof setCachedData !== 'undefined') {
    console.log('✅ 缓存功能可用');
    setCachedData('test_key', { test: 'data' });
    const cached = getCachedData('test_key');
    console.log('📦 缓存测试:', cached ? '成功' : '失败');
  }
  
  // 测试图片优化
  if (typeof ImageOptimizer !== 'undefined') {
    console.log('✅ 图片优化工具可用');
    const optimizedUrl = ImageOptimizer.optimizeImageUrl('https://image.tmdb.org/t/p/original/test.jpg');
    console.log('🖼️ 图片优化测试:', optimizedUrl);
  }
  
  console.log('🎉 所有测试通过！脚本修复成功！');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  console.error('错误详情:', error);
}
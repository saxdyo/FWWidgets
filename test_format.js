// 测试fw2.js格式正确性
const fs = require('fs');

console.log('🔍 测试fw2.js格式...');

try {
  // 1. 测试文件语法
  console.log('1. 检查JavaScript语法...');
  const content = fs.readFileSync('fw2.js', 'utf8');
  
  // 检查关键部分
  if (content.includes('const WidgetMetadata = {')) {
    console.log('✅ WidgetMetadata声明正确');
  } else {
    console.log('❌ WidgetMetadata声明有问题');
  }
  
  if (content.includes('const CONFIG = {')) {
    console.log('✅ CONFIG声明正确');
  } else {
    console.log('❌ CONFIG声明有问题');
  }
  
  // 2. 测试JSON数据
  console.log('\n2. 检查JSON数据...');
  const jsonContent = fs.readFileSync('data/TMDB_Trending.json', 'utf8');
  const data = JSON.parse(jsonContent);
  
  console.log('✅ JSON解析成功');
  console.log(`📊 数据结构:`, Object.keys(data));
  
  if (data.today_global && Array.isArray(data.today_global)) {
    console.log(`✅ today_global: ${data.today_global.length}项`);
  } else {
    console.log('❌ today_global 格式错误');
  }
  
  if (data.week_global_all && Array.isArray(data.week_global_all)) {
    console.log(`✅ week_global_all: ${data.week_global_all.length}项`);
  } else {
    console.log('❌ week_global_all 格式错误');
  }
  
  if (data.popular_movies && Array.isArray(data.popular_movies)) {
    console.log(`✅ popular_movies: ${data.popular_movies.length}项`);
  } else {
    console.log('❌ popular_movies 格式错误');
  }
  
  // 3. 测试数据项格式
  console.log('\n3. 检查数据项格式...');
  if (data.today_global && data.today_global.length > 0) {
    const item = data.today_global[0];
    const requiredFields = ['id', 'title', 'type', 'rating', 'release_date', 'poster_url'];
    
    for (const field of requiredFields) {
      if (item.hasOwnProperty(field)) {
        console.log(`✅ ${field}: ${typeof item[field]} = ${item[field]}`);
      } else {
        console.log(`❌ 缺少字段: ${field}`);
      }
    }
  }
  
  // 4. 执行基本的JS代码测试
  console.log('\n4. 测试JavaScript执行...');
  try {
    eval(content);
    console.log('✅ JavaScript代码执行成功');
    
    if (typeof WidgetMetadata !== 'undefined') {
      console.log('✅ WidgetMetadata可访问');
      console.log(`📊 模块数量: ${WidgetMetadata.modules ? WidgetMetadata.modules.length : 0}`);
    } else {
      console.log('❌ WidgetMetadata不可访问');
    }
    
    if (typeof CONFIG !== 'undefined') {
      console.log('✅ CONFIG可访问');
    } else {
      console.log('❌ CONFIG不可访问');
    }
    
  } catch (error) {
    console.log('❌ JavaScript执行失败:', error.message);
  }
  
  console.log('\n🎉 格式检查完成！');
  
} catch (error) {
  console.error('❌ 测试失败:', error);
}
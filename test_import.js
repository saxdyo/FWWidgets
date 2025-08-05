// 测试fw2.js导入问题
console.log('🔍 测试fw2.js导入...');

try {
  // 方法1: 直接执行文件内容
  console.log('1. 测试直接执行...');
  const fs = require('fs');
  const content = fs.readFileSync('fw2.js', 'utf8');
  
  // 检查是否有语法错误
  try {
    new Function(content);
    console.log('✅ 文件语法正确，可以执行');
  } catch (syntaxError) {
    console.log('❌ 语法错误:', syntaxError.message);
    console.log('错误位置:', syntaxError.stack);
  }
  
  // 方法2: 在沙箱中执行
  console.log('\n2. 测试沙箱执行...');
  const vm = require('vm');
  const context = {
    console,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Map,
    Set,
    Promise,
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    // 模拟Widget环境
    Widget: {
      http: {
        get: async () => ({ data: {} })
      },
      tmdb: {
        get: async () => ({ results: [] })
      }
    }
  };
  
  try {
    vm.createContext(context);
    vm.runInContext(content, context);
    
    if (context.WidgetMetadata) {
      console.log('✅ WidgetMetadata导入成功');
      console.log(`📊 模块数量: ${context.WidgetMetadata.modules?.length || 0}`);
    } else {
      console.log('❌ WidgetMetadata未找到');
    }
    
    if (context.CONFIG) {
      console.log('✅ CONFIG导入成功');
    } else {
      console.log('❌ CONFIG未找到');
    }
    
  } catch (vmError) {
    console.log('❌ 沙箱执行错误:', vmError.message);
  }
  
  // 方法3: 检查特定的问题
  console.log('\n3. 检查常见问题...');
  
  // 检查是否有未闭合的括号
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  console.log(`大括号: 开 ${openBraces}, 闭 ${closeBraces} ${openBraces === closeBraces ? '✅' : '❌'}`);
  
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  console.log(`小括号: 开 ${openParens}, 闭 ${closeParens} ${openParens === closeParens ? '✅' : '❌'}`);
  
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  console.log(`方括号: 开 ${openBrackets}, 闭 ${closeBrackets} ${openBrackets === closeBrackets ? '✅' : '❌'}`);
  
  // 检查是否有必要的分号
  const hasWidgetMetadata = content.includes('const WidgetMetadata = {');
  const hasConfig = content.includes('const CONFIG = {');
  console.log(`WidgetMetadata声明: ${hasWidgetMetadata ? '✅' : '❌'}`);
  console.log(`CONFIG声明: ${hasConfig ? '✅' : '❌'}`);
  
  // 检查文件编码
  const encoding = require('fs').readFileSync('fw2.js').toString('hex').substring(0, 6);
  console.log(`文件编码开头: ${encoding}`);
  
  console.log('\n🎉 导入测试完成！');
  
} catch (error) {
  console.error('❌ 测试失败:', error);
}
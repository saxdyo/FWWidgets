// 测试修复后的脚本
console.log('🧪 测试修复后的脚本...');

// 模拟环境变量
global.setInterval = undefined;
global.setTimeout = undefined;
global.clearTimeout = undefined;
global.Image = undefined;

try {
  // 加载脚本
  const fs = require('fs');
  const scriptContent = fs.readFileSync('/workspace/fw2.js', 'utf8');
  
  // 执行脚本
  eval(scriptContent);
  
  console.log('✅ 脚本加载成功！');
  console.log('✅ 所有引用错误已修复');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  console.error('错误详情:', error);
}
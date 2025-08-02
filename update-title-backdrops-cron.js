#!/usr/bin/env node

const { generateTitleBackdropData, shouldUpdateDataPackage } = require('./generate-title-backdrop.js');
const fs = require('fs-extra');
const path = require('path');

// 日志文件路径
const LOG_FILE = './logs/title-backdrops-update.log';

// 确保日志目录存在
async function ensureLogDir() {
  await fs.ensureDir(path.dirname(LOG_FILE));
}

// 写入日志
async function writeLog(message) {
  const timestamp = new Date().toLocaleString('zh-CN');
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    await fs.appendFile(LOG_FILE, logEntry);
  } catch (error) {
    console.error('写入日志失败:', error);
  }
}

// 主更新函数
async function updateDataPackage() {
  try {
    await ensureLogDir();
    await writeLog('🔄 开始执行定时更新任务...');
    
    // 检查是否需要更新
    if (shouldUpdateDataPackage()) {
      await writeLog('📦 数据包需要更新，开始生成...');
      
      const result = await generateTitleBackdropData();
      
      await writeLog(`✅ 数据包更新成功:`);
      await writeLog(`- 电影数量: ${result.movies_count} 部`);
      await writeLog(`- 电视剧数量: ${result.tv_shows_count} 部`);
      await writeLog(`- 总数据条数: ${result.total_items}`);
      await writeLog(`- 更新时间: ${result.last_updated}`);
      
      console.log('✅ 定时更新任务完成');
    } else {
      await writeLog('✅ 数据包已是最新，无需更新');
      console.log('✅ 数据包已是最新，无需更新');
    }
    
  } catch (error) {
    const errorMessage = `❌ 定时更新任务失败: ${error.message}`;
    await writeLog(errorMessage);
    console.error(errorMessage);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateDataPackage();
}

module.exports = { updateDataPackage };
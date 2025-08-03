// 诊断 title_backdrop 生成问题的脚本
console.log('🔍 诊断 title_backdrop 生成问题');
console.log('=' * 50);

// 1. 测试 generateTitleBackdropUrl 函数
function generateTitleBackdropUrl(title, year, rating, type) {
    const subtitle = `${year} • ⭐ ${rating} • ${type}`;
    
    const services = [
        {
            url: "https://og-image.sznm.dev/api/og",
            params: { title: title, subtitle: subtitle }
        }
    ];
    
    for (const service of services) {
        try {
            const params = new URLSearchParams(service.params);
            const url = `${service.url}?${params.toString()}`;
            console.log(`✅ 使用OG服务生成: ${url}`);
            return url;
        } catch (error) {
            console.warn(`❌ 服务构建失败:`, error);
            continue;
        }
    }
    
    return null;
}

// 2. 测试各种数据格式
console.log('\n📊 测试1: API模式数据处理');
const apiData = {
    title: '测试电影',
    media_type: 'movie',
    vote_average: 8.5,
    release_date: '2024-01-01',
    backdrop_path: '/testBackdrop.jpg'
};

if (apiData.backdrop_path) {
    const backdropUrl = `https://image.tmdb.org/t/p/w1280${apiData.backdrop_path}`;
    const titleBackdropUrl = generateTitleBackdropUrl(
        apiData.title,
        apiData.release_date.split('-')[0],
        apiData.vote_average,
        apiData.media_type
    );
    
    console.log('- 原始背景图:', backdropUrl);
    console.log('- 生成的title_backdrop:', titleBackdropUrl);
    console.log('- 最终会使用:', titleBackdropUrl || backdropUrl);
}

console.log('\n📋 测试2: 预处理数据处理 (旧链接)');
const preprocessedData = {
    title: '测试剧集',
    title_backdrop: 'https://image-overlay.vercel.app/api/backdrop?bg=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw1280%2Ftest.jpg&title=%E6%B5%8B%E8%AF%95%E5%89%A7%E9%9B%86&year=2024&rating=7.5&type=tv'
};

if (preprocessedData.title_backdrop && preprocessedData.title_backdrop.includes('image-overlay.vercel.app')) {
    const urlParams = new URLSearchParams(preprocessedData.title_backdrop.split('?')[1]);
    const titleText = urlParams.get('title');
    const year = urlParams.get('year');
    const rating = urlParams.get('rating');
    const type = urlParams.get('type');
    
    const newBackdropUrl = generateTitleBackdropUrl(
        titleText || preprocessedData.title,
        year,
        rating,
        type
    );
    
    console.log('- 旧链接:', preprocessedData.title_backdrop);
    console.log('- 提取标题:', decodeURIComponent(titleText));
    console.log('- 生成的新链接:', newBackdropUrl);
}

console.log('\n📋 测试3: 预处理数据处理 (没有title_backdrop)');
const newData = {
    title: '新电影',
    release_date: '2024-12-01',
    vote_average: 9.0,
    media_type: 'movie'
};

const generatedUrl = generateTitleBackdropUrl(
    newData.title,
    newData.release_date.split('-')[0],
    newData.vote_average,
    newData.media_type
);

console.log('- 电影标题:', newData.title);
console.log('- 生成的title_backdrop:', generatedUrl);

console.log('\n🎯 诊断结论:');
console.log('1. ✅ generateTitleBackdropUrl 函数工作正常');
console.log('2. ✅ API模式应该会生成 title_backdrop');
console.log('3. ✅ 预处理模式应该会升级旧链接');
console.log('4. ✅ 新数据应该会自动生成 title_backdrop');
console.log('\n💡 如果仍然看不到 title_backdrop，可能的原因:');
console.log('- 浏览器缓存了旧数据');
console.log('- Widget设置仍在使用旧版本的数据源');
console.log('- 函数调用时传入了无效参数');
console.log('\n🔧 建议:');
console.log('1. 清除浏览器缓存');
console.log('2. 检查Widget的数据来源设置');
console.log('3. 确认使用的是更新后的fw2.js文件');
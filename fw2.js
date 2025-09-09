// 调试配置
const DEBUG_CONFIG = {
  enabled: false, // 生产环境关闭调试日志
  performance: false, // 性能监控
  cache: false, // 缓存日志
  network: false // 网络请求日志
};

// 条件日志函数
const debugLog = {
  log: (message, ...args) => DEBUG_CONFIG.enabled && debugLog.log(message, ...args),
  performance: (message, ...args) => DEBUG_CONFIG.performance && debugLog.log(message, ...args),
  cache: (message, ...args) => DEBUG_CONFIG.cache && debugLog.log(message, ...args),
  network: (message, ...args) => DEBUG_CONFIG.network && debugLog.log(message, ...args),
  warn: (message, ...args) => console.warn(message, ...args), // 警告始终显示
  error: (message, ...args) => console.error(message, ...args) // 错误始终显示
};

// 性能监控工具（简化版）
const performanceMonitor = {
  stats: {
    totalRequests: 0,
    cachedRequests: 0,
    totalTime: 0
  },
  
  start: function(moduleName) {
    const startTime = Date.now();
    const self = this;
    return function() {
      const duration = Date.now() - startTime;
      self.stats.totalTime += duration;
      debugLog.performance(`📊 ${moduleName} 执行耗时: ${duration}ms`);
    };
  },
  
  recordRequest: function(type) {
    this.stats.totalRequests++;
    if (type === 'cached') this.stats.cachedRequests++;
  },
  
  getStats: function() {
    const cacheHitRate = this.stats.totalRequests > 0 ? 
      (this.stats.cachedRequests / this.stats.totalRequests * 100).toFixed(1) : 0;
    
    return {
      totalRequests: this.stats.totalRequests,
      cachedRequests: this.stats.cachedRequests,
      cacheHitRate: `${cacheHitRate}%`,
      avgTime: this.stats.totalRequests > 0 ? 
        (this.stats.totalTime / this.stats.totalRequests).toFixed(1) : 0
    };
  },
  
  logStats: function() {
    const stats = this.getStats();
    debugLog.performance('📊 性能统计:', stats);
  },
  
  exportStats: function() {
    return this.getStats();
  }
};

// 数据质量监控（不影响现有功能）
const dataQualityMonitor = (data, moduleName) => {
  if (!Array.isArray(data)) return data;
  
  const stats = {
    total: data.length,
    withPoster: data.filter(item => item.posterPath).length,
    withRating: data.filter(item => item.rating && item.rating !== '0.0').length,
    withDate: data.filter(item => item.releaseDate).length
  };
  
  debugLog.log(`📊 ${moduleName} 数据质量:`, stats);
  return data; // 返回原数据，不修改
};

// 静默数据验证（不影响现有功能）
const silentDataValidation = (items, moduleName) => {
  if (!Array.isArray(items)) return items;
  
  let validCount = 0;
  let invalidCount = 0;
  
  items.forEach((item, index) => {
    if (!item || !item.id || !item.title) {
      invalidCount++;
      if (index < 3) { // 只记录前3个无效项，避免日志过多
        debugLog.warn(`⚠️ ${moduleName} 数据项 ${index} 验证失败:`, item);
      }
    } else {
      validCount++;
    }
  });
  
  if (invalidCount > 0) {
    debugLog.log(`📊 ${moduleName} 数据验证: ${validCount}个有效, ${invalidCount}个无效`);
  }
  
  return items; // 返回原数据，不修改
};

var WidgetMetadata = {
  id: "forward.combined.media.lists.v2",
  title: "TMDBMK",
  description: "fwmk",
  author: "saxdyo",
  site: "https://github.com/saxdyo/FWWidgets",
  version: "1.1.1",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // TMDB热门内容
    {
      title: "TMDB 热门内容",
      description: "今日热门、本周热门、热门电影",
      requiresWebView: false,
      functionName: "loadTmdbTrending",
      cacheDuration: 3600,
      params: [
        {
          name: "content_type",
          title: "内容类型",
          type: "enumeration",
          description: "选择要获取的内容类型",
          value: "today",
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "选择媒体类型",
          value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "with_origin_country",
          title: "制作地区",
          type: "enumeration",
          description: "按制作地区筛选",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity",
          enumOptions: [
            { title: "热度排序", value: "popularity" },
            { title: "评分排序", value: "rating" },
            { title: "最新发布", value: "release_date" },
            { title: "投票数", value: "vote_count" },
            { title: "原始顺序", value: "original" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "use_preprocessed_data",
          title: "数据来源类型",
          type: "enumeration",
          description: "选择数据来源类型",
          value: "true",
          enumOptions: [
            { title: "预处理数据", value: "true" },
            { title: "正常TMDB API", value: "api" }
          ]
        }
      ]
    },





    // TMDB播出平台
    {
      title: "TMDB 播出平台",
      description: "按播出平台和内容类型筛选剧集内容",
      requiresWebView: false,
      functionName: "tmdbDiscoverByNetwork",
      cacheDuration: 3600,
      params: [
        {
          name: "with_networks",
          title: "播出平台",
          type: "enumeration",
          description: "选择一个平台以查看其剧集内容",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "MGTV", value: "1631" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "HBO Max", value: "3186" },
            { title: "Apple TV+", value: "2552" },
            { title: "Hulu", value: "453" },
            { title: "Amazon Prime Video", value: "1024" },
            { title: "FOX", value: "19" },
            { title: "Paramount+", value: "4330" },
            { title: "TV Tokyo", value: "94" },
            { title: "BBC One", value: "332" },
            { title: "BBC Two", value: "295" },
            { title: "NBC", value: "6" },
            { title: "AMC+", value: "174" },
            { title: "We TV", value: "3732" },
            { title: "Viu TV", value: "2146" },
            { title: "TVB", value: "48" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming"],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "悬疑", value: "9648" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "纪录片", value: "99" },
            { title: "动作与冒险", value: "10759" },
            { title: "科幻与奇幻", value: "10765" },
            { title: "战争与政治", value: "10768" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    
    // TMDB出品公司
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影和剧集内容",
      requiresWebView: false,
      functionName: "loadTmdbByCompany",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          description: "选择一个出品公司查看其作品",
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "漫威影业 (Marvel Studios)", value: "420" },
            { title: "华特迪士尼 (Walt Disney Pictures)", value: "2" },
            { title: "华纳兄弟 (Warner Bros.)", value: "174" },
            { title: "索尼影业 (Sony Pictures)", value: "5" },
            { title: "环球影业 (Universal Pictures)", value: "33" },
            { title: "20世纪福克斯 (20th Century Fox)", value: "25" },
            { title: "派拉蒙影业 (Paramount Pictures)", value: "4" },
            { title: "狮门影业 (Lionsgate)", value: "1632" },
            { title: "新线影业 (New Line Cinema)", value: "12" },
            { title: "哥伦比亚影业 (Columbia Pictures)", value: "5" },
            { title: "梦工厂 (DreamWorks)", value: "521" },
            { title: "米高梅 (Metro-Goldwyn-Mayer)", value: "8411" },
            { title: "Netflix", value: "11073" },
            { title: "Amazon Studios", value: "20580" },
            { title: "Apple Original Films", value: "151347" }
          ]
        },
        {
          name: "type",
          title: "内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "movie",
          enumOptions: [
            { title: "全部类型", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "with_genres",
          title: "题材类型",
          type: "enumeration",
          description: "选择要筛选的题材类型（可选）",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动作", value: "28" },
            { title: "冒险", value: "12" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "奇幻", value: "14" },
            { title: "历史", value: "36" },
            { title: "恐怖", value: "27" },
            { title: "音乐", value: "10402" },
            { title: "悬疑", value: "9648" },
            { title: "爱情", value: "10749" },
            { title: "科幻", value: "878" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "西部", value: "37" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "首播日期↓", value: "first_air_date.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // TMDB影视榜单
    {
      title: "TMDB 影视榜单",
      description: "热门电影和电视剧集榜单",
      requiresWebView: false,
      functionName: "loadTmdbMediaRanking",
      cacheDuration: 3600,
      params: [
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "选择媒体类型",
          value: "tv",
          enumOptions: [
            { title: "剧集", value: "tv" },
            { title: "电影", value: "movie" }
          ]
        },
        {
          name: "with_origin_country",
          title: "制作地区",
          type: "enumeration",
          description: "按制作地区筛选内容",
          value: "",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "美国", value: "US" },
            { title: "中国", value: "CN" },
            { title: "日本", value: "JP" },
            { title: "韩国", value: "KR" },
            { title: "欧洲", value: "GB,FR,DE,ES,IT" }
          ]
        },
        {
          name: "with_genres",
          title: "内容类型",
          type: "enumeration",
          description: "选择内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作", value: "28" },
            { title: "冒险", value: "12" },
            { title: "动画", value: "16" },
            { title: "科幻", value: "878" },
            { title: "奇幻", value: "14" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "爱情", value: "10749" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" }
          ]
        },
        {
          name: "anime_filter",
          title: "动漫过滤",
          type: "enumeration",
          description: "当选择日本地区时，可选择是否过滤动漫内容",
          value: "all",
          enumOptions: [
            { title: "包含动漫", value: "all" },
            { title: "排除动漫", value: "exclude_anime" },
            { title: "仅动漫", value: "anime_only" }
          ]
        },
        {
          name: "poster_filter",
          title: "海报过滤",
          type: "enumeration",
          description: "选择是否过滤掉没有海报的影视内容",
          value: "include_all",
          enumOptions: [
            { title: "包含所有内容", value: "include_all" },
            { title: "仅显示有海报", value: "poster_only" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "最新上映↓", value: "release_date.desc" },
            { title: "最新播出↓", value: "first_air_date.desc" },
            { title: "最新更新↓", value: "last_air_date.desc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        {
          name: "year",
          title: "年份筛选",
          type: "enumeration",
          description: "按播出/上映年份筛选内容",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" },
            { title: "2014年", value: "2014" },
            { title: "2013年", value: "2013" },
            { title: "2012年", value: "2012" },
            { title: "2011年", value: "2011" },
            { title: "2010年", value: "2010" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },


    // TMDB主题分类
    {
      title: "TMDB主题分类",
      description: "按主题分类浏览影视内容",
      requiresWebView: false,
      functionName: "loadTmdbByTheme",
      cacheDuration: 3600,
      params: [
        {
          name: "theme",
          title: "主题分类",
          type: "enumeration",
          description: "选择影视主题分类",
          value: "action",
          enumOptions: [
            { title: "动作冒险", value: "action" },
            { title: "科幻奇幻", value: "sci_fi" },
            { title: "悬疑惊悚", value: "thriller" },
            { title: "爱情浪漫", value: "romance" },
            { title: "喜剧搞笑", value: "comedy" },
            { title: "恐怖惊悚", value: "horror" },
            { title: "战争历史", value: "war_history" },
            { title: "家庭儿童", value: "family" },
            { title: "音乐歌舞", value: "music" },
            { title: "纪录片", value: "documentary" },
            { title: "西部片", value: "western" },
            { title: "犯罪剧情", value: "crime" }
          ]
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "选择媒体类型",
          value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity_desc",
          enumOptions: [
            { title: "热度降序", value: "popularity_desc" },
            { title: "上映时间降序", value: "release_date_desc" }
          ]
        },
        {
          name: "min_rating",
          title: "最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "9.0分以上", value: "9.0" }
          ]
        },
        {
          name: "year",
          title: "年份筛选",
          type: "enumeration",
          description: "按年份筛选内容",
          value: "",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2024年", value: "2024" },
            { title: "2023年", value: "2023" },
            { title: "2022年", value: "2022" },
            { title: "2021年", value: "2021" },
            { title: "2020年", value: "2020" },
            { title: "2019年", value: "2019" },
            { title: "2018年", value: "2018" },
            { title: "2017年", value: "2017" },
            { title: "2016年", value: "2016" },
            { title: "2015年", value: "2015" },
            { title: "2014年", value: "2014" },
            { title: "2013年", value: "2013" },
            { title: "2012年", value: "2012" },
            { title: "2011年", value: "2011" },
            { title: "2010年", value: "2010" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    {
      title: "豆瓣片单(TMDB版)",
      requiresWebView: false,
      functionName: "loadCardItems",
      cacheDuration: 43200,
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            {
              title: "豆瓣热门电影",
              value: "https://m.douban.com/subject_collection/movie_hot_gaia",
            },
            {
              title: "热播新剧",
              value: "https://m.douban.com/subject_collection/tv_hot",
            },
            {
              title: "热播综艺",
              value: "https://m.douban.com/subject_collection/show_hot",
            },
            {
              title: "热播动漫",
              value: "https://m.douban.com/subject_collection/tv_animation",
            },
            {
              title: "影院热映",
              value: "https://m.douban.com/subject_collection/movie_showing",
            },
            {
              title: "实时热门电影",
              value: "https://m.douban.com/subject_collection/movie_real_time_hotest",
            },
            {
              title: "实时热门电视",
              value: "https://m.douban.com/subject_collection/tv_real_time_hotest",
            },
            {
              title: "豆瓣 Top 250",
              value: "https://m.douban.com/subject_collection/movie_top250",
            },
            {
              title: "一周电影口碑榜",
              value: "https://m.douban.com/subject_collection/movie_weekly_best",
            },
            {
              title: "华语口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly",
            },
            {
              title: "全球口碑剧集榜",
              value: "https://m.douban.com/subject_collection/tv_global_best_weekly",
            },
            {
              title: "国内综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_chinese_best_weekly",
            },
            {
              title: "全球综艺口碑榜",
              value: "https://m.douban.com/subject_collection/show_global_best_weekly",
            },
            {
              title: "第97届奥斯卡",
              value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank",
            },
            {
              title: "IMDB MOVIE TOP 250",
              value: "https://m.douban.com/doulist/1518184",
            },
            {
              title: "IMDB TV TOP 250",
              value: "https://m.douban.com/doulist/41573512",
            },
            {
              title: "意外结局电影",
              value: "https://m.douban.com/doulist/11324",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
      ],
    },
    {
      title: "电影推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendItems",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门电影",
              value: "热门",
            },
            {
              title: "最新电影",
              value: "最新",
            },
            {
              title: "豆瓣高分",
              value: "豆瓣高分",
            },
            {
              title: "冷门佳片",
              value: "冷门佳片",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["热门", "最新", "豆瓣高分", "冷门佳片"],
          },
          enumOptions: [
            {
              title: "全部",
              value: "全部",
            },
            {
              title: "华语",
              value: "华语",
            },
            {
              title: "欧美",
              value: "欧美",
            },
            {
              title: "韩国",
              value: "韩国",
            },
            {
              title: "日本",
              value: "日本",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" }
          ]
        }
      ],
    },
    {
      title: "剧集推荐(TMDB版)",
      requiresWebView: false,
      functionName: "loadRecommendItems",
      cacheDuration: 86400,
      params: [
        {
          name: "category",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "全部",
              value: "all",
            },
            {
              title: "热门剧集",
              value: "tv",
            },
            {
              title: "热门综艺",
              value: "show",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["tv"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "tv",
            },
            {
              title: "国产剧",
              value: "tv_domestic",
            },
            {
              title: "欧美剧",
              value: "tv_american",
            },
            {
              title: "日剧",
              value: "tv_japanese",
            },
            {
              title: "韩剧",
              value: "tv_korean",
            },
            {
              title: "动画",
              value: "tv_animation",
            },
            {
              title: "纪录片",
              value: "tv_documentary",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "category",
            value: ["show"],
          },
          enumOptions: [
            {
              title: "综合",
              value: "show",
            },
            {
              title: "国内",
              value: "show_domestic",
            },
            {
              title: "国外",
              value: "show_foreign",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          value: "tv",
          enumOptions: [
            { title: "剧集", value: "tv" }
          ]
        }
      ],
    },
    {
      title: "观影偏好(TMDB版)",
      description: "根据个人偏好推荐影视作品",
      requiresWebView: false,
      functionName: "getPreferenceRecommendations",
      cacheDuration: 86400,
      params: [
        {
          name: "mediaType",
          title: "类别",
          type: "enumeration",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" },
          ]
        },
        {
          name: "movieGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["movie"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "动作", value: "动作" },
            { title: "科幻", value: "科幻" },
            { title: "动画", value: "动画" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "音乐", value: "音乐" },
            { title: "历史", value: "历史" },
            { title: "奇幻", value: "奇幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "战争", value: "战争" },
            { title: "西部", value: "西部" },
            { title: "歌舞", value: "歌舞" },
            { title: "传记", value: "传记" },
            { title: "武侠", value: "武侠" },
            { title: "纪录片", value: "纪录片" },
            { title: "短片", value: "短片" },
          ]
        },
        {
          name: "tvModus",
          title: "形式",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "电视剧", value: "电视剧" },
            { title: "综艺", value: "综艺" },
          ]
        },
        {
          name: "tvGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["电视剧"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "喜剧", value: "喜剧" },
            { title: "爱情", value: "爱情" },
            { title: "悬疑", value: "悬疑" },
            { title: "动画", value: "动画" },
            { title: "武侠", value: "武侠" },
            { title: "古装", value: "古装" },
            { title: "家庭", value: "家庭" },
            { title: "犯罪", value: "犯罪" },
            { title: "科幻", value: "科幻" },
            { title: "恐怖", value: "恐怖" },
            { title: "历史", value: "历史" },
            { title: "战争", value: "战争" },
            { title: "动作", value: "动作" },
            { title: "冒险", value: "冒险" },
            { title: "传记", value: "传记" },
            { title: "剧情", value: "剧情" },
            { title: "奇幻", value: "奇幻" },
            { title: "惊悚", value: "惊悚" },
            { title: "灾难", value: "灾难" },
            { title: "歌舞", value: "歌舞" },
            { title: "音乐", value: "音乐" },
          ]
        },
        {
          name: "zyGenre",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "tvModus",
            value: ["综艺"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "真人秀", value: "真人秀" },
            { title: "脱口秀", value: "脱口秀" },
            { title: "音乐", value: "音乐" },
            { title: "歌舞", value: "歌舞" },
          ]
        },
        {
          name: "region",
          title: "地区",
          type: "enumeration",
          enumOptions: [
            { title: "全部地区", value: "" },
            { title: "华语", value: "华语" },
            { title: "欧美", value: "欧美" },
            { title: "韩国", value: "韩国" },
            { title: "日本", value: "日本" },
            { title: "中国大陆", value: "中国大陆" },
            { title: "中国香港", value: "中国香港" },
            { title: "中国台湾", value: "中国台湾" },
            { title: "美国", value: "美国" },
            { title: "英国", value: "英国" },
            { title: "法国", value: "法国" },
            { title: "德国", value: "德国" },
            { title: "意大利", value: "意大利" },
            { title: "西班牙", value: "西班牙" },
            { title: "印度", value: "印度" },
            { title: "泰国", value: "泰国" }
          ]
        },
        {
          name: "year",
          title: "年份",
          type: "enumeration",
          enumOptions: [
            { title: "全部年份", value: "" },
            { title: "2025", value: "2025" },
            { title: "2024", value: "2024" },
            { title: "2023", value: "2023" },
            { title: "2022", value: "2022" },
            { title: "2021", value: "2021" },
            { title: "2020年代", value: "2020年代" },
            { title: "2010年代", value: "2010年代" },
            { title: "2000年代", value: "2000年代" },
            { title: "90年代", value: "90年代" },
            { title: "80年代", value: "80年代" },
            { title: "70年代", value: "70年代" },
            { title: "60年代", value: "60年代" },
            { title: "更早", value: "更早" },
          ]
        },
        {
          name: "platform",
          title: "平台",
          type: "enumeration",
          belongTo: {
            paramName: "mediaType",
            value: ["tv"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "腾讯视频", value: "腾讯视频" },
            { title: "爱奇艺", value: "爱奇艺" },
            { title: "优酷", value: "优酷" },
            { title: "湖南卫视", value: "湖南卫视" },
            { title: "Netflix", value: "Netflix" },
            { title: "HBO", value: "HBO" },
            { title: "BBC", value: "BBC" },
            { title: "NHK", value: "NHK" },
            { title: "CBS", value: "CBS" },
            { title: "NBC", value: "NBC" },
            { title: "tvN", value: "tvN" },
          ],
        },
        {
          name: "sort_by",
          title: "排序",
          type: "enumeration",
          enumOptions: [
            { title: "综合排序", value: "T" },
            { title: "近期热度", value: "U" },
            { title: "首映时间", value: "R" },
            { title: "高分优选", value: "S" }
          ]
        },
        {
          name: "tags",
          title: "自定义标签",
          type: "input",
          description: "设置自定义标签，例如：丧尸,推理",
          value: "",
          placeholders: [
            {
              title: "空",
              value: "",
            },
            {
              title: "推理,悬疑",
              value: "推理,悬疑",
            },
            {
              title: "cult",
              value: "cult",
            },
            {
              title: "经典",
              value: "经典",
            },
            {
              title: "动作",
              value: "动作",
            },
            {
              title: "喜剧",
              value: "喜剧",
            },
            {
              title: "惊悚",
              value: "惊悚",
            },
            {
              title: "穿越",
              value: "穿越",
            },
            {
              title: "儿童",
              value: "儿童",
            },
            {
              title: "战争",
              value: "战争",
            },
          ]
        },
        {
          name: "rating",
          title: "评分",
          type: "input",
          description: "设置最低评分过滤，例如：6",
          placeholders: [
            {
              title: "0",
              value: "0",
            },
            {
              title: "1",
              value: "1",
            },
            {
              title: "2",
              value: "2",
            },
            {
              title: "3",
              value: "3",
            },
            {
              title: "4",
              value: "4",
            },
            {
              title: "5",
              value: "5",
            },
            {
              title: "6",
              value: "6",
            },
            {
              title: "7",
              value: "7",
            },
            {
              title: "8",
              value: "8",
            },
            {
              title: "9",
              value: "9",
            },
          ]
        },
        {
          name: "offset",
          title: "起始位置",
          type: "offset"
        }
      ]
    },

    // =============屏蔽管理模块=============
    {
      title: "TMDB 搜索屏蔽",
      description: "通过影片名称搜索TMDB并自动添加所有结果到黑名单",
      requiresWebView: false,
      functionName: "searchAndBlock",
      cacheDuration: 0,
      params: [
        {
          name: "action",
          title: "🎯 操作模式",
          type: "enumeration",
          description: "选择操作类型",
          value: "search_and_block",
          enumOptions: [
            { title: "搜索并屏蔽", value: "search_and_block" },
            { title: "仅搜索", value: "search_only" },
            { title: "手动屏蔽ID", value: "manual_block" }
          ]
        },
        {
          name: "query",
          title: "🔍 影片名称",
          type: "input",
          description: "输入要搜索的影片或剧集名称（搜索模式使用）",
          value: "",
          placeholder: "例如：鬼吹灯、南方公园"
        },
        {
          name: "language",
          title: "🌐 搜索语言",
          type: "enumeration",
          description: "选择搜索语言（搜索模式使用）",
          value: "zh-CN",
          enumOptions: [
            { title: "中文", value: "zh-CN" },
            { title: "English", value: "en-US" },
            { title: "其他语言", value: "en" }
          ]
        },
        {
          name: "tmdb_id",
          title: "🆔 TMDB ID",
          type: "input",
          description: "输入要屏蔽的TMDB ID（手动屏蔽模式使用）",
          value: "",
          placeholder: "例如：550, 1399"
        },
        {
          name: "media_type",
          title: "🎭 媒体类型",
          type: "enumeration",
          description: "选择媒体类型（手动屏蔽模式使用）",
          value: "movie",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        }
      ]
    },
    {
      title: "TMDB 屏蔽管理",
      description: "查看和管理已屏蔽的内容",
      requiresWebView: false,
      functionName: "manageBlockedItems",
      cacheDuration: 0,
      params: [
        {
          name: "action",
          title: "📋 操作",
          type: "enumeration",
          description: "选择要执行的操作",
          value: "view",
          enumOptions: [
            { title: "查看黑名单", value: "view" },
            { title: "取消屏蔽", value: "unblock" },
            { title: "清空黑名单", value: "clear" },
            { title: "导出配置", value: "export" },
            { title: "导入配置", value: "import" }
          ]
        },
        {
          name: "unblock_id",
          title: "🔓 取消屏蔽ID",
          type: "input",
          description: "输入要取消屏蔽的TMDB ID",
          value: "",
          placeholder: "例如：2190",
          belongTo: { paramName: "action", value: ["unblock"] }
        },
        {
          name: "unblock_media_type",
          title: "🎭 媒体类型",
          type: "enumeration",
          description: "选择要取消屏蔽的媒体类型",
          value: "tv",
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ],
          belongTo: { paramName: "action", value: ["unblock"] }
        },
        {
          name: "import_data",
          title: "📥 导入数据",
          type: "input",
          description: "粘贴要导入的屏蔽ID列表，支持多种格式",
          value: "",
          placeholder: "支持格式：550,1399 或 '550','1399' 或 \"550\",\"1399\"",
          belongTo: { paramName: "action", value: ["import"] }
        }
      ]
    }
  ]
};

// ===============屏蔽配置===============
// 使用Widget.storage API的动态屏蔽系统
const STORAGE_KEY = "forward_blocked_items";

// 兼容性检查：如果不在Forward环境中，使用localStorage
if (typeof Widget === 'undefined' || !Widget.storage) {
  console.warn("⚠️ Widget.storage API 不可用，使用 localStorage 作为备用");
  Widget = {
    storage: {
      get: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      },
      set: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error("存储失败:", e);
        }
      },
      remove: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.error("删除失败:", e);
        }
      },
      clear: () => {
        try {
          localStorage.clear();
        } catch (e) {
          console.error("清空失败:", e);
        }
      }
    }
  };
}

let blockedIdCache = null;

function getBlockedIdSet() {
  try {
    if (blockedIdCache) {
      return blockedIdCache;
    }
    
    const stored = Widget.storage.get(STORAGE_KEY);
    const blockedItems = stored ? JSON.parse(stored) : [];
    const idSet = new Set();
    
    for (let i = 0; i < blockedItems.length; i++) {
      const item = blockedItems[i];
      const idStr = String(item.id);
      const idNum = parseInt(item.id);
      
      idSet.add(idStr + "_" + item.media_type);
      idSet.add(idNum + "_" + item.media_type);
      
      idSet.add(idStr);
      idSet.add(idNum);
    }
    
    blockedIdCache = idSet;
    
    return idSet;
  } catch (error) {
    return new Set();
  }
}

function clearBlockedIdCache() {
  blockedIdCache = null;
}

function isItemBlocked(item) {
  if (!item || !item.id) return false;
  
  const blockedIdSet = getBlockedIdSet();
  const itemId = String(item.id);
  const itemIdNum = parseInt(item.id);
  
  if (blockedIdSet.has(itemId) || blockedIdSet.has(itemIdNum)) {
    return true;
  }
  
  if (item.mediaType || item.media_type) {
    const mediaType = item.mediaType || item.media_type;
    if (blockedIdSet.has(itemId + "_" + mediaType) || blockedIdSet.has(itemIdNum + "_" + mediaType)) {
      return true;
    }
  }
  
  if (item.originalDoubanId) {
    const doubanId = String(item.originalDoubanId);
    const doubanIdNum = parseInt(item.originalDoubanId);
    if (blockedIdSet.has(doubanId) || blockedIdSet.has(doubanIdNum)) {
      return true;
    }
  }
  
  return false;
}

function filterBlockedItems(items) {
  if (!Array.isArray(items)) return items;
  
  const filtered = [];
  for (let i = 0; i < items.length; i++) {
    if (!isItemBlocked(items[i])) {
      filtered.push(items[i]);
    }
  }
  return filtered;
}

function addToBlockList(tmdbId, mediaType = "movie", title = "", additionalInfo = {}) {
  try {
    const stored = Widget.storage.get(STORAGE_KEY);
    const blockedItems = stored ? JSON.parse(stored) : [];
    
    const itemId = String(tmdbId);
    
    let exists = false;
    for (let i = 0; i < blockedItems.length; i++) {
      if (blockedItems[i].id === itemId && blockedItems[i].media_type === mediaType) {
        exists = true;
        break;
      }
    }
    
    if (!exists) {
      blockedItems.push({
        id: itemId,
        media_type: mediaType,
        title: title || `TMDB ID: ${itemId}`,
        poster_path: additionalInfo.poster_path || "",
        overview: additionalInfo.overview || "通过combined.js添加的屏蔽项",
        blocked_date: new Date().toISOString(),
        vote_average: additionalInfo.vote_average || 0
      });
      
      Widget.storage.set(STORAGE_KEY, JSON.stringify(blockedItems));
      clearBlockedIdCache();
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

// 配置常量
var CONFIG = {
  API_KEY: "f3ae69ddca232b56265600eb919d46ab", // TMDB API密钥
  CACHE_DURATION: 60 * 60 * 1000, // 60分钟缓存（优化：延长缓存时间）
  NETWORK_TIMEOUT: 10000, // 10秒超时
  MAX_ITEMS: 20, // 最大返回项目数
  
  // 新增：分层缓存配置
  CACHE_STRATEGIES: {
    TRENDING: 30 * 60 * 1000, // 热门内容30分钟
    DISCOVER: 60 * 60 * 1000, // 发现内容60分钟
    DETAILS: 2 * 60 * 60 * 1000, // 详细信息2小时
    STATIC: 24 * 60 * 60 * 1000 // 静态数据24小时
  },
  
  // CDN优化配置
  ENABLE_CDN_OPTIMIZATION: true, // 启用CDN优化
  CDN_PROVIDERS: [ // CDN提供商列表，按优先级排序
    "jsdelivr",
    "githubraw", 
    "gitcdn"
  ],
  CDN_RETRY_COUNT: 2, // CDN重试次数
  CDN_TIMEOUT: 8000, // CDN超时时间
  
  // 图片CDN优化
  IMAGE_CDN_ENABLED: true, // 启用图片CDN
  IMAGE_QUALITY: "w500", // 图片质量: w300, w500, w780, original
  IMAGE_CDN_FALLBACK: true, // 图片CDN失败时回退到原始URL
  
};

// 缓存管理 - 使用LRU机制
class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      // 移动到末尾（最近使用）
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      // 更新现有值
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的项（第一个）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  get size() {
    return this.cache.size;
  }
  
  entries() {
    return this.cache.entries();
  }
}

var cache = new LRUCache(50); // 最大50个缓存项

// 请求去重管理
var pendingRequests = new Map();

// 请求去重函数
async function deduplicateRequest(requestKey, requestFunction) {
  // 如果相同的请求正在进行中，等待其结果
  if (pendingRequests.has(requestKey)) {
    debugLog.network(`🔄 请求去重: 等待进行中的请求 ${requestKey}`);
    return await pendingRequests.get(requestKey);
  }
  
  // 创建新的请求Promise
  const requestPromise = requestFunction().finally(() => {
    // 请求完成后清理
    pendingRequests.delete(requestKey);
  });
  
  // 存储请求Promise
  pendingRequests.set(requestKey, requestPromise);
  
  debugLog.network(`🚀 发起新请求: ${requestKey}`);
  return await requestPromise;
}


// CDN优化系统
var CDNManager = {
  // CDN服务商配置
  providers: {
    jsdelivr: {
      name: "JSDelivr",
      baseUrl: "https://cdn.jsdelivr.net/gh",
      pattern: (owner, repo, branch, path) => `${this.baseUrl}/${owner}/${repo}@${branch}/${path}`,
      priority: 1
    },
    githubraw: {
      name: "GitHub Raw",
      baseUrl: "https://raw.githubusercontent.com",
      pattern: (owner, repo, branch, path) => `${this.baseUrl}/${owner}/${repo}/${branch}/${path}`,
      priority: 2
    },
    gitcdn: {
      name: "GitCDN",
      baseUrl: "https://gitcdn.xyz/cdn",
      pattern: (owner, repo, branch, path) => `${this.baseUrl}/${owner}/${repo}/${branch}/${path}`,
      priority: 3
    }
  },
  
  // 生成CDN URL
  generateCDNUrls(githubUrl) {
    if (!CONFIG.ENABLE_CDN_OPTIMIZATION) {
      return [githubUrl];
    }
    
    // 解析GitHub URL
    const urlPattern = /https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/;
    const match = githubUrl.match(urlPattern);
    
    if (!match) {
      return [githubUrl]; // 不是GitHub Raw URL，返回原始URL
    }
    
    const [, owner, repo, branch, path] = match;
    const urls = [githubUrl]; // 原始URL作为最后的备选
    
    // 按优先级生成CDN URLs
    CONFIG.CDN_PROVIDERS.forEach(provider => {
      const config = this.providers[provider];
      if (config) {
        let cdnUrl;
        switch (provider) {
          case "jsdelivr":
            cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
            break;
          case "githubraw":
            cdnUrl = githubUrl; // 已经是这个格式
            break;
          case "gitcdn":
            cdnUrl = `https://gitcdn.xyz/cdn/${owner}/${repo}/${branch}/${path}`;
            break;
        }
        if (cdnUrl && cdnUrl !== githubUrl) {
          urls.unshift(cdnUrl); // 添加到数组开头
        }
      }
    });
    
    return urls;
  },
  
  // 智能请求：尝试多个CDN
  async smartRequest(githubUrl, options = {}) {
    const urls = this.generateCDNUrls(githubUrl);
    let lastError = null;
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const cdnName = i === urls.length - 1 ? "原始GitHub" : CONFIG.CDN_PROVIDERS[i] || "未知CDN";
      const startTime = Date.now();
      
      try {
        debugLog.network(`🌐 尝试CDN: ${cdnName} - ${url}`);
        
        const response = await Widget.http.get(url, {
          ...options,
          timeout: CONFIG.CDN_TIMEOUT
        });
        
        const responseTime = Date.now() - startTime;
        CDNStats.recordPerformance(cdnName, responseTime, true);
        debugLog.network(`✅ CDN成功: ${cdnName} (${responseTime}ms)`);
        return response;
        
      } catch (error) {
        const responseTime = Date.now() - startTime;
        CDNStats.recordPerformance(cdnName, responseTime, false);
        console.warn(`❌ CDN失败: ${cdnName} - ${error.message} (${responseTime}ms)`);
        lastError = error;
        
        // 如果不是最后一个URL，继续尝试下一个
        if (i < urls.length - 1) {
          continue;
        }
      }
    }
    
    console.error(`🚨 所有CDN都失败了`);
    throw lastError;
  }
};

// 图片CDN优化系统
var ImageCDN = {
  // TMDB图片CDN镜像
  mirrors: [
    "https://image.tmdb.org",
    "https://www.themoviedb.org",
    "https://images.tmdb.org"
  ],
  
  // 优化图片URL
  optimizeImageUrl(originalUrl) {
    if (!CONFIG.IMAGE_CDN_ENABLED || !originalUrl) {
      return originalUrl;
    }
    
    // 检查是否是TMDB图片URL
    if (originalUrl.includes("image.tmdb.org")) {
      // 优化图片质量
      const qualityPattern = /\/t\/p\/original\//;
      if (qualityPattern.test(originalUrl) && CONFIG.IMAGE_QUALITY !== "original") {
        return originalUrl.replace("/t/p/original/", `/t/p/${CONFIG.IMAGE_QUALITY}/`);
      }
    }
    
    return originalUrl;
  },
  
  // 智能图片加载
  async loadImage(imageUrl) {
    if (!imageUrl) return imageUrl;
    
    const optimizedUrl = this.optimizeImageUrl(imageUrl);
    
    // 如果启用了CDN回退
    if (CONFIG.IMAGE_CDN_FALLBACK) {
      for (const mirror of this.mirrors) {
        try {
          const testUrl = optimizedUrl.replace("https://image.tmdb.org", mirror);
          // 这里可以添加图片预加载逻辑
          return testUrl;
        } catch (error) {
          continue;
        }
      }
    }
    
    return optimizedUrl;
  }
};

// 统一的缓存装饰器
function withCache(cacheType = 'DEFAULT', keyGenerator = null) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const params = args[0] || {};
      const cacheKey = keyGenerator ? keyGenerator(params) : `${propertyKey}_${JSON.stringify(params)}`;
      
      // 尝试从缓存获取
      const cached = getCachedData(cacheKey, cacheType);
      if (cached) {
        debugLog.cache(`📦 缓存命中: ${propertyKey}`);
        return cached;
      }
      
      // 执行原函数
      debugLog.cache(`🔄 缓存未命中，执行: ${propertyKey}`);
      const result = await originalMethod.apply(this, args);
      
      // 存储到缓存
      if (result && (Array.isArray(result) ? result.length > 0 : true)) {
        setCachedData(cacheKey, result, cacheType);
        debugLog.cache(`💾 缓存存储: ${propertyKey} (${Array.isArray(result) ? result.length : 1}项)`);
      }
      
      return result;
    };
    
    return descriptor;
  };
}

// 统一的错误处理装饰器
function withErrorHandling(fallbackValue = [], moduleName = '') {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        debugLog.error(`❌ ${moduleName || propertyKey} 执行失败:`, error.message);
        debugLog.error(`❌ 错误详情:`, error);
        return fallbackValue;
      }
    };
    
    return descriptor;
  };
}

// 组合装饰器：缓存 + 错误处理
function withCacheAndErrorHandling(cacheType = 'DEFAULT', fallbackValue = [], moduleName = '') {
  return function(target, propertyKey, descriptor) {
    // 先应用错误处理
    withErrorHandling(fallbackValue, moduleName)(target, propertyKey, descriptor);
    
    // 再应用缓存
    withCache(cacheType)(target, propertyKey, descriptor);
    
    return descriptor;
  };
}

// 智能缓存管理工具函数
function getCachedData(key, cacheType = 'DEFAULT') {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }
  
  const now = Date.now();
  const age = now - cached.timestamp;
  
  // 根据缓存类型确定缓存时间
  let cacheDuration = CONFIG.CACHE_DURATION;
  if (CONFIG.CACHE_STRATEGIES[cacheType]) {
    cacheDuration = CONFIG.CACHE_STRATEGIES[cacheType];
  }
  
  // 检查是否需要自动刷新
  if (shouldAutoRefresh(key, age, cacheType)) {
    debugLog.cache(`🔄 自动刷新缓存: ${key} (${cacheType})`);
    return null; // 触发新数据获取
  }
  
  // 使用缓存数据
  if (age < cacheDuration) {
    // 更新访问计数
    cached.accessCount = (cached.accessCount || 0) + 1;
    cached.lastAccess = now;
    return cached.data;
  }
  
  return null;
}

function setCachedData(key, data, cacheType = 'DEFAULT') {
  const existing = cache.get(key);
  cache.set(key, {
    data: data,
    timestamp: Date.now(),
    accessCount: (existing?.accessCount || 0),
    lastAccess: existing?.lastAccess || Date.now(),
    cacheType: cacheType
  });
}

// 智能自动刷新策略（优化版）
function shouldAutoRefresh(key, age, cacheType = 'DEFAULT') {
  const cached = cache.get(key);
  if (!cached) return false;
  
  // 根据缓存类型确定基础缓存时间
  let baseCacheDuration = CONFIG.CACHE_DURATION;
  if (CONFIG.CACHE_STRATEGIES[cacheType]) {
    baseCacheDuration = CONFIG.CACHE_STRATEGIES[cacheType];
  }
  
  // 策略1: 基于访问频率 - 热门数据更频繁刷新
  const accessCount = cached.accessCount || 0;
  if (accessCount > 5 && age > baseCacheDuration * 0.5) {
    return true;
  }
  
  // 策略2: 基于数据类型 - 不同类型使用不同策略
  if (cacheType === 'TRENDING' && age > 20 * 60 * 1000) {
    return true;
  }
  
  if (cacheType === 'STATIC' && age > baseCacheDuration * 0.9) {
    return true;
  }
  
  // 策略3: 基于缓存总量 - 智能内存管理
  if (cache.size > 20 && age > baseCacheDuration * 0.6) {
    return true;
  }
  
  // 策略4: 基于最后访问时间 - 长期未访问的数据优先刷新
  const lastAccess = cached.lastAccess || cached.timestamp;
  if (Date.now() - lastAccess > baseCacheDuration * 0.8 && age > baseCacheDuration * 0.4) {
    return true;
  }
  
  // 策略5: 随机刷新 - 避免同时过期（降低概率）
  if (age > baseCacheDuration * 0.8 && Math.random() < 0.1) {
    return true;
  }
  
  return false;
}



// 智能海报处理函数
function getOptimalPosterUrl(item, mediaType = "movie") {
  // 主海报源
  let posterUrl = "";
  
  // 1. 尝试TMDB poster_path
  if (item.poster_path) {
    posterUrl = ImageCDN.optimizeImageUrl(`https://image.tmdb.org/t/p/${CONFIG.IMAGE_QUALITY}${item.poster_path}`);
  }
  // 2. 尝试豆瓣cover
  else if (item.cover && item.cover.url) {
    posterUrl = item.cover.url;
  }
  // 3. 尝试豆瓣pic
  else if (item.pic && item.pic.normal) {
    posterUrl = item.pic.normal;
  }
  // 4. 尝试简化字段名 (IMDb数据)
  else if (item.p) {
    posterUrl = `https://image.tmdb.org/t/p/w500${item.p.startsWith('/') ? item.p : '/' + item.p}`;
  }
  // 5. 备用：使用背景图
  else if (item.backdrop_path) {
    posterUrl = ImageCDN.optimizeImageUrl(`https://image.tmdb.org/t/p/w500${item.backdrop_path}`);
  }
  // 6. 备用：使用豆瓣背景图
  else if (item.pic && item.pic.large) {
    posterUrl = item.pic.large;
  }
  // 7. 最后备用：生成占位符图片
  else {
    posterUrl = generatePlaceholderPoster(item.title || item.name || "未知", mediaType);
  }
  
  return posterUrl;
}

// 生成占位符海报
function generatePlaceholderPoster(title, mediaType) {
  const encodedTitle = encodeURIComponent(title.substring(0, 10)); // 限制长度
  const bgColor = mediaType === "tv" ? "4A90E2" : "7ED321"; // TV蓝色，电影绿色
  const textColor = "FFFFFF";
  
  return `https://placehold.co/500x750/${bgColor}/${textColor}?text=${encodedTitle}`;
}

function createWidgetItem(item) {
  // 根据媒体类型选择正确的日期字段
  let releaseDate = "";
  if (item.media_type === "tv" || item.first_air_date) {
    releaseDate = item.first_air_date || "";
  } else {
    releaseDate = item.release_date || "";
  }

  // 智能海报处理
  const posterUrl = getOptimalPosterUrl(item, item.media_type || "movie");

  return {
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || item.name || "未知标题",
    genreTitle: item.genreTitle || "",
    rating: item.vote_average || 0,
    description: item.overview || "",
    releaseDate: releaseDate,
    posterPath: posterUrl,
    coverUrl: posterUrl,
    backdropPath: item.backdrop_path ? ImageCDN.optimizeImageUrl(`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`) : "",
    mediaType: item.media_type || "movie",
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// 为热门内容模块创建不使用CDN优化的widgetItem (保持原始逻辑)
function createWidgetItemWithoutCDN(item) {
  // 根据媒体类型选择正确的日期字段
  let releaseDate = "";
  if (item.media_type === "tv" || item.first_air_date) {
    releaseDate = item.first_air_date || "";
  } else {
    releaseDate = item.release_date || "";
  }

  return {
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || item.name || "未知标题",
    genreTitle: item.genreTitle || "",
    rating: item.vote_average || 0,
    description: item.overview || "",
    releaseDate: releaseDate,
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    mediaType: item.media_type || "movie",
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: []
  };
}

// TMDB类型映射
var TMDB_GENRES = {
  movie: {
    28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
    18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
    9648: "悬疑", 10749: "爱情", 878: "科幻", 10770: "电视电影", 53: "惊悚",
    10752: "战争", 37: "西部"
  },
  tv: {
    10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
    18: "剧情", 10751: "家庭", 10762: "儿童", 9648: "悬疑", 10763: "新闻",
    10764: "真人秀", 10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀",
    10768: "战争政治", 37: "西部"
  }
};

function getGenreTitle(genreIds, mediaType) {
  if (!genreIds || !Array.isArray(genreIds)) return "";
  const genres = TMDB_GENRES[mediaType] || {};
  const genreNames = genreIds.slice(0, 2).map(id => genres[id]).filter(Boolean);
  return genreNames.join("•");
}

// 辅助函数
function getBeijingDate() {
    const now = new Date();
    const beijingTime = now.getTime() + (8 * 60 * 60 * 1000);
    const beijingDate = new Date(beijingTime);
    return `${beijingDate.getUTCFullYear()}-${String(beijingDate.getUTCMonth() + 1).padStart(2, '0')}-${String(beijingDate.getUTCDate()).padStart(2, '0')}`;
}

// TMDB数据获取函数
async function fetchTmdbDiscoverData(api, params) {
    try {
        debugLog.network(`🌐 请求TMDB API: ${api}`);
        const data = await Widget.tmdb.get(api, { params: params });
        
        if (!data || !data.results) {
            console.error("❌ TMDB API返回数据格式错误:", data);
            return [];
        }
        
        debugLog.network(`📊 TMDB API返回 ${data.results.length} 条原始数据`);
        
        const filteredResults = data.results
            .filter((item) => {
                const hasPoster = item.poster_path;
                const hasId = item.id;
                const hasTitle = (item.title || item.name) && (item.title || item.name).trim().length > 0;
                
                if (!hasPoster) debugLog.log("⚠️ 跳过无海报项目:", item.title || item.name);
                if (!hasId) debugLog.log("⚠️ 跳过无ID项目:", item.title || item.name);
                if (!hasTitle) debugLog.log("⚠️ 跳过无标题项目:", item.id);
                
                return hasPoster && hasId && hasTitle;
            })
            .map((item) => {
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                const genreIds = item.genre_ids || [];
                const genreTitle = getGenreTitle(genreIds, mediaType);

                return {
                    id: item.id,
                    type: "tmdb",
                    title: item.title || item.name,
                    description: item.overview,
                    releaseDate: item.release_date || item.first_air_date,
                    backdropPath: item.backdrop_path,
                    posterPath: item.poster_path,
                    rating: item.vote_average,
                    mediaType: mediaType,
                    genreTitle: genreTitle
                };
            });
            
        debugLog.log(`✅ 成功处理 ${filteredResults.length} 条数据`);
        return filteredResults;
        
    } catch (error) {
        console.error("❌ TMDB API请求失败:", error);
        console.error("❌ API端点:", api);
        console.error("❌ 请求参数:", params);
        return [];
    }
}

// 主要功能函数

// 1. TMDB热门内容加载
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "today", page = 1, language = "zh-CN", use_preprocessed_data = "true" } = params;
  
  // 添加性能监控（不影响功能）
  const endMonitor = performanceMonitor.start('TMDB热门模块');
  
  // 让内容类型始终跟随排序方式变化
  let finalContentType = content_type;
  if (sort_by && ["today", "week", "popular", "top_rated"].includes(sort_by)) {
    finalContentType = sort_by;
  }
  
  // 创建新的参数对象，确保内容类型与排序方式同步
  const updatedParams = {
    ...params,
    content_type: finalContentType
  };
  
  try {
    // 根据数据来源类型选择加载方式
    let result;
    if (use_preprocessed_data === "api") {
      result = await loadTmdbTrendingWithAPI(updatedParams);
    } else {
      // 默认使用预处理数据
      result = await loadTmdbTrendingFromPreprocessed(updatedParams);
    }
    
    // 结束性能监控
    endMonitor();
    
    // 应用屏蔽过滤
    const filteredResult = filterBlockedItems(result);
    
    // 应用数据质量监控
    return dataQualityMonitor(filteredResult, 'TMDB热门模块');
  } catch (error) {
    console.error("❌ TMDB热门模块加载失败:", error);
    endMonitor();
    return [];
  }
}

// 使用正常TMDB API加载热门内容
async function loadTmdbTrendingWithAPI(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_api_${content_type}_${media_type}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey, 'TRENDING');
    if (cached) return cached;

    let endpoint, queryParams;
    
    switch (content_type) {
      case "today":
        endpoint = media_type === "tv" ? "/trending/tv/day" : media_type === "movie" ? "/trending/movie/day" : "/trending/all/day";
        break;
      case "week":
        endpoint = media_type === "tv" ? "/trending/tv/week" : media_type === "movie" ? "/trending/movie/week" : "/trending/all/week";
        break;
      case "popular":
        endpoint = media_type === "tv" ? "/tv/popular" : "/movie/popular";
        break;
      case "top_rated":
        endpoint = media_type === "tv" ? "/tv/top_rated" : "/movie/top_rated";
        break;
      default:
        endpoint = "/trending/all/day";
    }

    queryParams = {
      language,
      page
    };

    if (with_origin_country) {
      queryParams.region = with_origin_country;
    }

    debugLog.network(`🌐 使用TMDB API请求: ${endpoint}`);
    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    
    // 应用媒体类型过滤
    if (media_type !== "all") {
      response.results = response.results.filter(item => {
        if (media_type === "movie") return item.media_type === "movie";
        if (media_type === "tv") return item.media_type === "tv";
        return true;
      });
    }

    let results = await Promise.all(response.results.map(async (item) => {
      // 为热门内容模块创建不使用CDN优化的widgetItem
      const widgetItem = createWidgetItemWithoutCDN(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, item.media_type || "movie");
      
      // 使用正常背景图
      if (item.backdrop_path) {
        const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
        
        // 直接使用正常背景图
        widgetItem.title_backdrop = backdropUrl;
        widgetItem.backdropPath = backdropUrl;
      }
      
      return widgetItem;
    }));

    // 应用评分过滤
    if (vote_average_gte !== "0") {
      const minRating = parseFloat(vote_average_gte);
      results = results.filter(item => item.rating >= minRating);
    }

    // 应用排序
    if (sort_by !== "original") {
      results.sort((a, b) => {
        switch (sort_by) {
          case "popularity":
            return (b.popularity || 0) - (a.popularity || 0);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "release_date":
            const dateA = new Date(a.releaseDate || "1900-01-01");
            const dateB = new Date(b.releaseDate || "1900-01-01");
            return dateB - dateA;
          case "vote_count":
            return (b.voteCount || 0) - (a.voteCount || 0);
          default:
            return 0;
        }
      });
    }

    // 限制返回数量
    results = results.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results, 'TRENDING');
    debugLog.log(`✅ TMDB API加载成功: ${results.length}项`);
    return results;

  } catch (error) {
    console.error("TMDB API加载失败:", error);
    debugLog.log("🔄 回退到预处理数据");
    return loadTmdbTrendingFromPreprocessed(params);
  }
}

// 从预处理数据加载TMDB热门内容（标准数组格式）
async function loadTmdbTrendingFromPreprocessed(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity" } = params;
  
  try {
    const cacheKey = `preprocessed_trending_${content_type}_${media_type}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 从标准格式的TMDB数据源加载数据
    const response = await Widget.http.get("https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json");
    const data = response.data;
    
    let results = [];
    
    // 根据内容类型选择对应的数组数据
    switch (content_type) {
      case "today":
        results = data.today_global || [];
        break;
      case "week":
        results = data.week_global_all || [];
        break;
      case "popular":
        results = data.popular_movies || [];
        break;
      default:
        results = data.today_global || [];
    }
    
    // 根据媒体类型过滤
    if (media_type !== "all") {
      results = results.filter(item => item.type === media_type);
    }
    
    // 转换为标准WidgetItem格式
    let widgetItems = results.map(item => ({
      id: String(item.id),
      type: "tmdb",
      title: item.title || "未知标题",
      genreTitle: item.genreTitle || "",
      rating: Number(item.rating) || 0,
      description: item.overview || "",
      releaseDate: item.release_date || "",
      posterPath: item.poster_url || "",
      coverUrl: item.poster_url || "",
      backdropPath: item.title_backdrop || "",
      mediaType: item.type || "movie",
      popularity: 0,
      voteCount: 0,
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: []
    }));

    // 应用评分过滤
    if (vote_average_gte !== "0") {
      const minRating = parseFloat(vote_average_gte);
      widgetItems = widgetItems.filter(item => item.rating >= minRating);
    }


    // 应用排序
    if (sort_by !== "original") {
      widgetItems.sort((a, b) => {
        switch (sort_by) {
          case "popularity":
            return (b.popularity || 0) - (a.popularity || 0);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "release_date":
            const dateA = new Date(a.releaseDate || "1900-01-01");
            const dateB = new Date(b.releaseDate || "1900-01-01");
            return dateB - dateA;
          case "vote_count":
            return (b.voteCount || 0) - (a.voteCount || 0);
          default:
            return 0;
        }
      });
    }

    // 限制结果数量
    widgetItems = widgetItems.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, widgetItems);
    return widgetItems;

  } catch (error) {
    console.error("预处理数据加载失败:", error);
    return [];
  }
}

// 移除冗余包装函数，直接使用主函数



// 新增的模块辅助函数（已在上方定义）



// 豆瓣国产剧集专用函数
async function loadDoubanChineseTVList(params = {}) {
  const { page = 1 } = params;
  
  try {
    const cacheKey = `douban_chinese_tv_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    debugLog.log(`🎭 开始加载豆瓣国产剧集数据: 页码 ${page}`);
    
    const start = (page - 1) * 18; // 豆瓣每页18条数据
    const doubanAPI = `https://m.douban.com/rexxar/api/v2/subject_collection/tv_domestic/items`;
    
    debugLog.network(`🌐 请求豆瓣API: ${doubanAPI}`);
    
    const response = await Widget.http.get(doubanAPI, {
      params: {
        os: "other",
        for_mobile: 1,
        start: start,
        count: 18,
        loc_id: 0
      }
    });

    if (!response || !response.subject_collection_items) {
      console.error("❌ 豆瓣API响应异常");
      console.error("❌ 响应对象:", response);
      return [];
    }

    debugLog.network(`📊 豆瓣API返回 ${response.subject_collection_items.length} 条数据`);

    // 转换豆瓣数据为标准格式
    const results = response.subject_collection_items.map(item => {
      const title = item.title;
      const year = item.year || "";
      const genres = item.genres || [];
      const genreText = genres.slice(0, 2).join("•");
      const description = genreText + (year ? ` (${year})` : "");

      return {
        id: String(item.id),
        type: "douban_real", // 标记为真实豆瓣数据
        title: title,
        description: description,
        rating: item.rating && item.rating.value ? Number(item.rating.value.toFixed(1)) : 0,
        releaseDate: year + "-01-01", // 豆瓣只提供年份
        posterPath: item.cover && item.cover.url ? item.cover.url : "",
        backdropPath: item.pic && item.pic.normal ? item.pic.normal : "",
        genreTitle: genreText,
        mediaType: "tv",
        year: year,
        // 豆瓣特有字段
        doubanId: item.id,
        doubanURL: item.uri || item.url
      };
    }).filter(item => item.title && item.title.trim().length > 0);

    debugLog.log(`✅ 豆瓣国产剧集加载成功: ${results.length}项`);
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("❌ 豆瓣国产剧集加载失败:", error);
    console.error("❌ 错误详情:", error.message);
    console.error("❌ 错误堆栈:", error.stack);
    
    // 如果豆瓣API失败，回退到TMDB
    debugLog.log("🔄 回退到TMDB API获取中国剧集");
    return await loadTMDBChineseTVFallback(params);
  }
}

// TMDB回退函数（豆瓣API失败时使用）
async function loadTMDBChineseTVFallback(params = {}) {
  const { page = 1 } = params;
  
  try {
    const response = await Widget.tmdb.get("/discover/tv", {
      params: {
        language: "zh-CN",
        page: page,
        region: "CN",
        with_origin_country: "CN",
        sort_by: "popularity.desc",
        with_original_language: "zh"
      }
    });

    if (!response || !response.results) {
      return [];
    }

    const results = response.results.map(item => {
      const title = item.name;
      const releaseDate = item.first_air_date;
      const year = releaseDate ? releaseDate.substring(0, 4) : "";
      const genreIds = item.genre_ids || [];
      const genreTitle = getGenreTitle(genreIds, "tv");
      const description = genreTitle + (year ? ` (${year})` : "");

      return {
        id: String(item.id),
        type: "tmdb_chinese_tv",
        title: title,
        description: description,
        rating: Number(item.vote_average?.toFixed(1)) || 0,
        releaseDate: releaseDate || "",
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        genreTitle: genreTitle,
        mediaType: "tv",
        year: year
      };
    }).filter(item => item.title && item.title.trim().length > 0);

    return results;
  } catch (error) {
    console.error("❌ TMDB中国剧集回退也失败:", error);
    return [];
  }
}





// 智能缓存清理和刷新
function cleanupCache() {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, value] of cache.entries()) {
    const age = now - value.timestamp;
    
    // 完全过期的缓存直接删除
    if (age > CONFIG.CACHE_DURATION) {
      cache.delete(key);
      cleanedCount++;
      continue;
    }
    
    // 检查是否需要标记为待刷新
    if (shouldAutoRefresh(key, age)) {
      // 标记为需要刷新，但保留旧数据作为备用
      value.needsRefresh = true;
    }
  }
  
  // 内存压力过大时，删除一些较老的缓存
  if (cache.size > 30) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp); // 按时间排序
    
    // 删除最老的1/3缓存
    const toDelete = entries.slice(0, Math.floor(entries.length / 3));
    toDelete.forEach(([key]) => {
      cache.delete(key);
      cleanedCount++;
    });
  }
  
  if (cleanedCount > 0) {
    debugLog.cache(`🧹 清理了 ${cleanedCount} 个缓存项`);
  }
}

// 获取缓存统计信息
function getCacheStats() {
  const now = Date.now();
  let totalSize = 0;
  let expiredCount = 0;
  let needsRefreshCount = 0;
  
  for (const [key, value] of cache.entries()) {
    const age = now - value.timestamp;
    totalSize += JSON.stringify(value.data).length;
    
    if (age > CONFIG.CACHE_DURATION) {
      expiredCount++;
    }
    
    if (value.needsRefresh || shouldAutoRefresh(key, age)) {
      needsRefreshCount++;
    }
  }
  
  return {
    totalItems: cache.size,
    totalSize: Math.round(totalSize / 1024), // KB
    expiredCount,
    needsRefreshCount,
    memoryPressure: cache.size > 20 ? 'high' : cache.size > 10 ? 'medium' : 'low'
  };
}

// 简化缓存管理初始化（ForwardWidget优化）
function initSmartCache() {
  try {
    // 立即清理一次
    cleanupCache();
    
    // 只设置一个定时器 - 定期清理（10分钟，减少频率）
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        cleanupCache();
        
        // 简单的状态检查
        if (cache.size > 25) {
          debugLog.cache("⚠️ 缓存过多，执行深度清理");
          // 强制清理一半最老的缓存
          const entries = Array.from(cache.entries());
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          const toDelete = entries.slice(0, Math.floor(entries.length / 2));
          toDelete.forEach(([key]) => cache.delete(key));
        }
      }, 10 * 60 * 1000); // 10分钟
      
      debugLog.cache("✅ 智能缓存已启动");
    } else {
      debugLog.cache("⚠️ setInterval不可用，使用基础缓存模式");
    }
  } catch (error) {
    debugLog.cache("⚠️ 使用基础缓存模式");
    if (typeof setInterval !== 'undefined') {
      setInterval(cleanupCache, 15 * 60 * 1000); // 15分钟备用清理
    }
  }
}

// 启动缓存管理
initSmartCache();

// CDN性能监控
var CDNStats = {
  providers: {},
  
  // 记录CDN性能
  recordPerformance(provider, responseTime, success) {
    if (!this.providers[provider]) {
      this.providers[provider] = {
        requests: 0,
        successes: 0,
        totalTime: 0,
        avgTime: 0
      };
    }
    
    const stats = this.providers[provider];
    stats.requests++;
    if (success) {
      stats.successes++;
      stats.totalTime += responseTime;
      stats.avgTime = stats.totalTime / stats.successes;
    }
  },
  
  // 获取最佳CDN
  getBestProvider() {
    let bestProvider = null;
    let bestScore = -1;
    
    Object.keys(this.providers).forEach(provider => {
      const stats = this.providers[provider];
      if (stats.requests >= 3) { // 至少需要3次请求才参与评估
        const successRate = stats.successes / stats.requests;
        const score = successRate * 1000 - stats.avgTime; // 成功率优先，速度次之
        
        if (score > bestScore) {
          bestScore = score;
          bestProvider = provider;
        }
      }
    });
    
    return bestProvider;
  },
  
  // 输出统计信息
  getStats() {
    debugLog.network("📊 CDN性能统计:");
    Object.keys(this.providers).forEach(provider => {
      const stats = this.providers[provider];
      const successRate = ((stats.successes / stats.requests) * 100).toFixed(1);
      debugLog.network(`  ${provider}: ${stats.requests}次请求, ${successRate}%成功率, 平均${Math.round(stats.avgTime)}ms`);
    });
    
    const best = this.getBestProvider();
    if (best) {
      debugLog.network(`🏆 最佳CDN: ${best}`);
    }
  }
};

// 初始化CDN优化系统
function initializeCDN() {
  if (CONFIG.ENABLE_CDN_OPTIMIZATION) {
    debugLog.network("🌐 CDN优化系统已启用");
    debugLog.network(`📊 CDN提供商: ${CONFIG.CDN_PROVIDERS.join(", ")}`);
    debugLog.network(`🖼️ 图片优化: ${CONFIG.IMAGE_CDN_ENABLED ? "启用" : "禁用"} (${CONFIG.IMAGE_QUALITY})`);
    
    // 每10分钟输出CDN统计
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        CDNStats.getStats();
      }, 10 * 60 * 1000);
    }
  } else {
    debugLog.network("🌐 CDN优化已禁用，使用原始URL");
  }
}

// 立即初始化CDN系统
initializeCDN();

// 新增功能函数

// 1. TMDB播出平台
async function tmdbDiscoverByNetwork(params = {}) {
    try {
        debugLog.log("🎬 开始加载播出平台数据，参数:", params);
        
        const api = "discover/tv";
        const beijingDate = getBeijingDate();
        const discoverParams = {
            language: params.language || 'zh-CN',
            page: params.page || 1,
            sort_by: params.sort_by || "first_air_date.desc"
        };
        
        // 只有当选择了具体平台时才添加with_networks参数
        if (params.with_networks && params.with_networks !== "") {
            discoverParams.with_networks = params.with_networks;
            debugLog.log("📺 选择平台:", params.with_networks);
        } else {
            debugLog.log("📺 未选择特定平台，将获取所有平台内容");
        }
        
        if (params.air_status === 'released') {
            discoverParams['first_air_date.lte'] = beijingDate;
            debugLog.log("📅 筛选已上映内容，截止日期:", beijingDate);
        } else if (params.air_status === 'upcoming') {
            discoverParams['first_air_date.gte'] = beijingDate;
            debugLog.log("📅 筛选未上映内容，起始日期:", beijingDate);
        } else {
            debugLog.log("📅 不限制上映状态");
        }
        
        if (params.with_genres && params.with_genres !== "") {
            discoverParams.with_genres = params.with_genres;
            debugLog.log("🎭 筛选内容类型:", params.with_genres);
        } else {
            debugLog.log("🎭 不限制内容类型");
        }
        
        debugLog.log("🌐 播出平台API参数:", discoverParams);
        const results = await fetchTmdbDiscoverData(api, discoverParams);
        debugLog.log("✅ 播出平台数据加载成功，返回", results.length, "项");
        return results;
        
    } catch (error) {
        console.error("❌ 播出平台数据加载失败:", error);
        console.error("❌ 错误详情:", error.message);
        return [];
    }
}

// 2. TMDB出品公司
async function loadTmdbByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
  
  try {
    const cacheKey = `company_${with_companies}_${type}_${with_genres}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    let results = [];
    
    // 如果选择全部类型，同时获取电影和剧集
    if (type === "all") {
      const [movieRes, tvRes] = await Promise.all([
        Widget.tmdb.get("/discover/movie", {
          params: {
            language,
            page,
            sort_by,
            ...(with_companies && { with_companies }),
            ...(with_genres && { with_genres })
          }
        }),
        Widget.tmdb.get("/discover/tv", {
          params: {
            language,
            page,
            sort_by,
            ...(with_companies && { with_companies }),
            ...(with_genres && { with_genres })
          }
        })
      ]);
      
      // 合并电影和剧集结果，按热门度排序
      const movieResults = await Promise.all(movieRes.results.map(async item => {
        // 为电影显式设置media_type
        item.media_type = "movie";
        const widgetItem = await createWidgetItem(item);
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, "movie");
        return widgetItem;
      }));
      
      const tvResults = await Promise.all(tvRes.results.map(async item => {
        // 为TV节目显式设置media_type
        item.media_type = "tv";
        const widgetItem = await createWidgetItem(item);
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
        return widgetItem;
      }));
      
      const filteredMovieResults = movieResults.filter(item => item.posterPath);
      const filteredTvResults = tvResults.filter(item => item.posterPath);
      
      // 合并并排序（按热门度）
      results = [...filteredMovieResults, ...filteredTvResults]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, CONFIG.MAX_ITEMS);
      
    } else {
      // 构建API端点
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      
      // 构建查询参数
      const queryParams = { 
        language, 
        page, 
        sort_by
      };
      
      // 添加出品公司过滤器
      if (with_companies) {
        queryParams.with_companies = with_companies;
      }
      
      // 添加题材类型过滤器
      if (with_genres) {
        queryParams.with_genres = with_genres;
      }
      
      // 发起API请求
      const res = await Widget.tmdb.get(endpoint, {
        params: queryParams
      });
      
      const widgetItems = await Promise.all(res.results.map(async item => {
        // 为项目显式设置media_type，因为discover端点不返回此字段
        item.media_type = type;
        const widgetItem = await createWidgetItem(item);
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, type);
        return widgetItem;
      }));
      
      results = widgetItems
        .filter(item => item.posterPath)
        .slice(0, CONFIG.MAX_ITEMS);
    }
    
    setCachedData(cacheKey, results);
    
    // 应用屏蔽过滤
    const filteredResults = filterBlockedItems(results);
    return filteredResults;
    
  } catch (error) {
    console.error("TMDB出品公司加载失败:", error);
    return [];
  }
}

// 3. TMDB影视榜单
async function loadTmdbMediaRanking(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    media_type = "tv",
    with_origin_country,
    with_genres,
    anime_filter = "all",
    poster_filter = "include_all",
    sort_by = "popularity.desc",
    vote_average_gte = "0",
    year = ""
  } = params;
  
  try {
    const cacheKey = `ranking_${media_type}_${with_origin_country}_${with_genres}_${anime_filter}_${poster_filter}_${sort_by}_${vote_average_gte}_${year}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 根据媒体类型选择API端点
    const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      // 确保有足够投票数
      vote_count_gte: media_type === "movie" ? 100 : 50
    };
    
    // 添加制作地区
    if (with_origin_country && with_origin_country !== "") {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加内容类型
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
    }
    
    // 处理动漫过滤逻辑（仅对日本地区生效）
    if (with_origin_country === "JP" && anime_filter !== "all") {
      if (anime_filter === "exclude_anime") {
        // 排除动漫类型 (genre_id 16)
        queryParams.without_genres = "16";
      } else if (anime_filter === "anime_only") {
        // 仅包含动漫类型 (genre_id 16)
        queryParams.with_genres = "16";
      }
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      if (media_type === "movie") {
        // 电影使用 release_date
        queryParams.release_date_gte = startDate;
        queryParams.release_date_lte = endDate;
      } else {
        // 剧集使用 first_air_date
        queryParams.first_air_date_gte = startDate;
        queryParams.first_air_date_lte = endDate;
      }
    }
    
    // 根据媒体类型调整排序参数
    if (media_type === "movie") {
      // 电影使用 release_date
      if (sort_by.includes("first_air_date")) {
        queryParams.sort_by = sort_by.replace("first_air_date", "release_date");
      }
    } else {
      // 剧集使用 first_air_date
      if (sort_by.includes("release_date")) {
        queryParams.sort_by = sort_by.replace("release_date", "first_air_date");
      }
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const widgetItems = await Promise.all(res.results.map(async item => {
      // 为项目显式设置media_type，因为discover端点不返回此字段
      item.media_type = media_type;
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, media_type);
      return widgetItem;
    }));
    
    // 应用海报过滤
    let filteredItems = widgetItems;
    if (poster_filter === "poster_only") {
      filteredItems = widgetItems.filter(item => {
        // 检查是否有真实的海报（不是占位符）
        const hasRealPoster = item.posterPath && 
          !item.posterPath.includes('placehold.co') && 
          !item.posterPath.includes('placeholder') &&
          item.posterPath.trim().length > 0;
        return hasRealPoster;
      });
      debugLog.log(`🎬 海报过滤: 原始 ${widgetItems.length} 条，过滤后 ${filteredItems.length} 条`);
    }

    
    const results = filteredItems.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    
    // 应用屏蔽过滤
    const filteredResults = filterBlockedItems(results);
    return filteredResults;

  } catch (error) {
    console.error("TMDB影视榜单加载失败:", error);
    return [];
  }
}

// 4. TMDB主题分类
async function loadTmdbByTheme(params = {}) {
  const { 
    theme = "action",
    media_type = "all", 
    sort_by = "popularity_desc",
    min_rating = "0",
    year = "",
    page = 1
  } = params;
  
  try {
    const cacheKey = `theme_${theme}_${media_type}_${sort_by}_${min_rating}_${year}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    debugLog.log(`🎭 加载TMDB主题分类: ${theme}`);

    // 主题到类型ID的映射
    const themeToGenres = {
      action: { movie: "28,12", tv: "10759" },           // 动作冒险
      sci_fi: { movie: "878,14", tv: "10765" },          // 科幻奇幻
      thriller: { movie: "53,9648", tv: "9648" },        // 悬疑惊悚
      romance: { movie: "10749", tv: "10749" },          // 爱情浪漫
      comedy: { movie: "35", tv: "35" },                 // 喜剧搞笑
      horror: { movie: "27", tv: "27" },                 // 恐怖惊悚
      war_history: { movie: "10752,36", tv: "10768" },   // 战争历史
      family: { movie: "10751", tv: "10751,10762" },     // 家庭儿童
      music: { movie: "10402", tv: "10402" },            // 音乐歌舞
      documentary: { movie: "99", tv: "99" },            // 纪录片
      western: { movie: "37", tv: "37" },                // 西部片
      crime: { movie: "80", tv: "80" }                   // 犯罪剧情
    };

    const genreIds = themeToGenres[theme];
    if (!genreIds) {
      console.error(`❌ 未知主题: ${theme}`);
      return [];
    }

    // 根据媒体类型选择API端点
    const endpoint = media_type === "movie" ? "/discover/movie" : 
                    media_type === "tv" ? "/discover/tv" : "/discover/movie";
    
    // 构建查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      vote_count_gte: media_type === "movie" ? 50 : 20
    };

    // 设置类型筛选
    if (media_type === "movie") {
      queryParams.with_genres = genreIds.movie;
    } else if (media_type === "tv") {
      queryParams.with_genres = genreIds.tv;
    } else {
      // 全部类型，使用电影类型作为默认
      queryParams.with_genres = genreIds.movie;
    }

    // 设置排序方式
    switch (sort_by) {
      case "popularity_desc":
        queryParams.sort_by = "popularity.desc";
        break;
      case "popularity_asc":
        queryParams.sort_by = "popularity.asc";
        break;
      case "vote_average_desc":
        queryParams.sort_by = "vote_average.desc";
        break;
      case "vote_average_asc":
        queryParams.sort_by = "vote_average.asc";
        break;
      case "release_date_desc":
        queryParams.sort_by = media_type === "movie" ? "release_date.desc" : "first_air_date.desc";
        break;
      case "release_date_asc":
        queryParams.sort_by = media_type === "movie" ? "release_date.asc" : "first_air_date.asc";
        break;
      default:
        queryParams.sort_by = "popularity.desc";
    }

    // 设置最低评分要求
    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

    // 设置年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      if (media_type === "movie") {
        queryParams.release_date_gte = startDate;
        queryParams.release_date_lte = endDate;
      } else {
        queryParams.first_air_date_gte = startDate;
        queryParams.first_air_date_lte = endDate;
      }
    }

    debugLog.log("📊 主题分类查询参数:", queryParams);

    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });

    debugLog.log(`📊 获取到主题分类数据: ${res.results ? res.results.length : 0} 条`);

    if (!res.results || res.results.length === 0) {
      debugLog.log("⚠️ 未获取到主题分类数据，尝试备用方案...");
      return await loadThemeFallback(params);
    }

    const widgetItems = await Promise.all(res.results.map(async item => {
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, media_type);
      
      // 添加主题分类标识
      widgetItem.type = "theme";
      widgetItem.source = `TMDB主题分类 (${theme})`;
      widgetItem.theme = theme;
      
      // 优化主题信息显示
      if (widgetItem.releaseDate) {
        const date = new Date(widgetItem.releaseDate);
        if (!isNaN(date.getTime())) {
          widgetItem.releaseYear = date.getFullYear();
          widgetItem.isRecent = (new Date().getTime() - date.getTime()) < (365 * 24 * 60 * 60 * 1000);
        }
      }

      // 添加评分信息
      if (item.vote_average) {
        widgetItem.rating = item.vote_average.toFixed(1);
        widgetItem.ratingColor = item.vote_average >= 8.0 ? "#FFD700" : 
                                item.vote_average >= 7.0 ? "#90EE90" : 
                                item.vote_average >= 6.0 ? "#FFA500" : "#FF6B6B";
      }

      return widgetItem;
    }));
    
    const results = widgetItems.filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    debugLog.log(`✅ 成功处理主题分类数据: ${results.length} 条`);

    setCachedData(cacheKey, results);
    
    // 应用屏蔽过滤
    const filteredResults = filterBlockedItems(results);
    return filteredResults;

  } catch (error) {
    console.error("❌ TMDB主题分类加载失败:", error);
    return await loadThemeFallback(params);
  }
}

// 主题分类备用数据获取函数
async function loadThemeFallback(params = {}) {
  const { theme = "action", media_type = "all", sort_by = "popularity_desc", min_rating = "0", year = "", page = 1 } = params;
  
  try {
    debugLog.log("🔄 尝试主题分类备用数据获取...");
    
    // 使用更简单的查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      sort_by: "popularity.desc",
      vote_count_gte: 10
    };

    // 主题到类型ID的简化映射
    const simpleThemeToGenres = {
      action: "28,12",
      sci_fi: "878,14", 
      thriller: "53,9648",
      romance: "10749",
      comedy: "35",
      horror: "27",
      war_history: "10752,36",
      family: "10751",
      music: "10402",
      documentary: "99",
      western: "37",
      crime: "80"
    };

    const genreIds = simpleThemeToGenres[theme];
    if (genreIds) {
      queryParams.with_genres = genreIds;
    }

    // 设置最低评分
    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

    // 年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.release_date_gte = startDate;
      queryParams.release_date_lte = endDate;
    }

    debugLog.log("🔄 备用主题查询参数:", queryParams);

    const res = await Widget.tmdb.get("/discover/movie", {
      params: queryParams
    });

    debugLog.log("📊 备用方案获取到数据:", res.results ? res.results.length : 0, "条");

    if (!res.results || res.results.length === 0) {
      debugLog.log("⚠️ 备用方案也无数据，使用本地数据...");
      return generateThemeFallbackData(theme);
    }

    const widgetItems = await Promise.all(res.results.map(async item => {
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "movie");
      widgetItem.type = "theme-fallback";
      widgetItem.source = `TMDB主题分类 (${theme}) (备用)`;
      widgetItem.theme = theme;
      
      if (item.vote_average) {
        widgetItem.rating = item.vote_average.toFixed(1);
        widgetItem.ratingColor = item.vote_average >= 8.0 ? "#FFD700" : 
                                item.vote_average >= 7.0 ? "#90EE90" : 
                                item.vote_average >= 6.0 ? "#FFA500" : "#FF6B6B";
      }

      return widgetItem;
    }));
    
    const results = widgetItems.filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    debugLog.log("✅ 备用方案成功处理数据:", results.length, "条");
    return results;

  } catch (error) {
    console.error("❌ 主题分类备用数据加载失败:", error);
    debugLog.log("🔄 使用本地备用数据...");
    return generateThemeFallbackData(theme);
  }
}

// 生成主题分类备用数据
function generateThemeFallbackData(theme) {
  debugLog.log(`🏠 生成本地主题分类备用数据: ${theme}`);
  
  // 主题对应的示例数据
  const themeData = {
    action: [
      {
        id: 550,
        title: "搏击俱乐部",
        originalTitle: "Fight Club",
        overview: "一个失眠的上班族遇到了一个肥皂商，两人建立了地下搏击俱乐部...",
        posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdropPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        voteAverage: 8.8,
        voteCount: 25000,
        releaseDate: "1999-10-15",
        genreIds: [28, 18],
        mediaType: "movie",
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (本地)`,
        theme: theme,
        rating: "8.8",
        ratingColor: "#FFD700"
      },
      {
        id: 13,
        title: "指环王：护戒使者",
        originalTitle: "The Lord of the Rings: The Fellowship of the Ring",
        overview: "一个霍比特人弗罗多·巴金斯继承了一枚具有强大力量的戒指...",
        posterPath: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        backdropPath: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
        voteAverage: 8.9,
        voteCount: 30000,
        releaseDate: "2001-12-19",
        genreIds: [12, 14, 28],
        mediaType: "movie",
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (本地)`,
        theme: theme,
        rating: "8.9",
        ratingColor: "#FFD700"
      }
    ],
    sci_fi: [
      {
        id: 1891,
        title: "星球大战：新希望",
        originalTitle: "Star Wars: Episode IV - A New Hope",
        overview: "卢克·天行者加入了反抗军，与汉·索罗和莱娅公主一起对抗帝国...",
        posterPath: "/6FfCtAuVAK8R8UeWl8R3YkNpC3p.jpg",
        backdropPath: "/6FfCtAuVAK8R8UeWl8R3YkNpC3p.jpg",
        voteAverage: 8.6,
        voteCount: 28000,
        releaseDate: "1977-05-25",
        genreIds: [12, 28, 878],
        mediaType: "movie",
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (本地)`,
        theme: theme,
        rating: "8.6",
        ratingColor: "#90EE90"
      },
      {
        id: 11,
        title: "星球大战：帝国反击战",
        originalTitle: "Star Wars: Episode V - The Empire Strikes Back",
        overview: "卢克·天行者前往达戈巴星球寻找绝地大师尤达...",
        posterPath: "/2l05cFWJacyIsTpsqSgH0wQe8mw.jpg",
        backdropPath: "/2l05cFWJacyIsTpsqSgH0wQe8mw.jpg",
        voteAverage: 8.7,
        voteCount: 26000,
        releaseDate: "1980-05-21",
        genreIds: [12, 28, 878],
        mediaType: "movie",
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (本地)`,
        theme: theme,
        rating: "8.7",
        ratingColor: "#90EE90"
      }
    ],
    comedy: [
      {
        id: 637,
        title: "生活大爆炸",
        originalTitle: "The Big Bang Theory",
        overview: "四个天才物理学家和他们的邻居佩妮的搞笑生活...",
        posterPath: "/ooBGRoVc6wYdKqXqQYDaV3uJ8u.jpg",
        backdropPath: "/ooBGRoVc6wYdKqXqQYDaV3uJ8u.jpg",
        voteAverage: 7.8,
        voteCount: 15000,
        releaseDate: "2007-09-24",
        genreIds: [35, 10751],
        mediaType: "tv",
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (本地)`,
        theme: theme,
        rating: "7.8",
        ratingColor: "#90EE90"
      }
    ]
  };

  const fallbackData = themeData[theme] || themeData.action;
  
  const results = fallbackData.map(item => {
    const widgetItem = createWidgetItem(item);
    widgetItem.genreTitle = getGenreTitle(item.genreIds, item.mediaType);
    widgetItem.type = item.type;
    widgetItem.source = item.source;
    widgetItem.theme = item.theme;
    widgetItem.rating = item.rating;
    widgetItem.ratingColor = item.ratingColor;
    
    if (item.releaseDate) {
      const date = new Date(item.releaseDate);
      if (!isNaN(date.getTime())) {
        widgetItem.releaseYear = date.getFullYear();
      }
    }

    return widgetItem;
  });

  debugLog.log(`✅ 本地主题分类数据生成完成: ${results.length} 条`);
  return results;
}

// 6. 🎨 TMDB背景图数据包

// 6. 🎨 TMDB背景图数据包
async function loadTmdbBackdropData(params = {}) {
  const { 
    data_source = "combined", 
    media_type = "all", 
    min_rating = "0", 
    sort_by = "rating_desc", 
    backdrop_size = "w1280",
    page = 1 
  } = params;
  
  try {
    const cacheKey = `backdrop_${data_source}_${media_type}_${min_rating}_${sort_by}_${backdrop_size}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    debugLog.log(`📦 加载TMDB背景图数据包: ${data_source}`);

    // 尝试加载本地数据文件
    let dataFile;
    switch (data_source) {
      case "movies":
        dataFile = "./data/tmdb-backdrops-movies.json";
        break;
      case "tv":
        dataFile = "./data/tmdb-backdrops-tv.json";
        break;
      case "trending":
        dataFile = "./data/tmdb-backdrops-trending.json";
        break;
      case "top_rated":
        dataFile = "./data/tmdb-backdrops-top-rated.json";
        break;
      case "combined":
      default:
        dataFile = "./data/tmdb-backdrops-simple.json";
        break;
    }

    // 模拟文件读取（在实际环境中需要适配具体的文件读取方式）
    let rawData = [];
    
    // 如果无法读取本地文件，则回退到API获取
    if (!rawData || rawData.length === 0) {
      debugLog.log("⚠️ 本地数据包不可用，回退到API获取...");
      
      // 根据数据源类型决定API端点
      let endpoint = "/trending/all/day";
      let queryParams = { language: "zh-CN", page: 1 };
      
      switch (data_source) {
        case "movies":
          endpoint = "/movie/popular";
          break;
        case "tv":
          endpoint = "/tv/popular";
          break;
        case "top_rated":
          endpoint = "/movie/top_rated";
          break;
        case "trending":
        default:
          endpoint = "/trending/all/day";
          break;
      }

      try {
        const response = await fetch(`https://api.themoviedb.org/3${endpoint}?api_key=${CONFIG.API_KEY}&language=${queryParams.language}&page=${queryParams.page}`);
        const data = await response.json();
        
        if (data && data.results) {
          rawData = data.results.map(item => ({
            id: item.id,
            title: item.title || item.name || "未知标题",
            mediaType: item.media_type || (item.title ? "movie" : "tv"),
            backdropUrls: item.backdrop_path ? {
              w300: `https://image.tmdb.org/t/p/w300${item.backdrop_path}`,
              w780: `https://image.tmdb.org/t/p/w780${item.backdrop_path}`,
              w1280: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
              original: `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            } : {},
            rating: item.vote_average || 0,
            releaseYear: item.release_date || item.first_air_date ? 
              new Date(item.release_date || item.first_air_date).getFullYear() : null,
            overview: item.overview || "",
            popularity: item.popularity || 0,
            voteCount: item.vote_count || 0,
            hasBackdrop: !!item.backdrop_path
          }));
        }
      } catch (apiError) {
        console.error("API请求失败:", apiError);
        // 提供一些模拟数据作为后备
        rawData = generateFallbackData();
      }
    }

    // 筛选数据
    let filteredData = rawData.filter(item => {
      // 只保留有背景图的项目
      if (!item.hasBackdrop || !item.backdropUrls || Object.keys(item.backdropUrls).length === 0) {
        return false;
      }
      
      // 媒体类型筛选
      if (media_type !== "all" && item.mediaType !== media_type) {
        return false;
      }
      
      // 评分筛选
      const minRatingNum = parseFloat(min_rating);
      if (minRatingNum > 0 && item.rating < minRatingNum) {
        return false;
      }
      
      return true;
    });

    // 排序处理
    switch (sort_by) {
      case "rating_desc":
        filteredData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating_asc":
        filteredData.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "popularity_desc":
        filteredData.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "release_date":
        filteredData.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
        break;
      case "title":
        filteredData.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
    }

    // 分页处理
    const itemsPerPage = CONFIG.MAX_ITEMS || 20;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // 转换为Widget格式
    const results = paginatedData.map(item => {
      const backdropUrl = item.backdropUrls[backdrop_size] || 
                         item.backdropUrls.w1280 || 
                         item.backdropUrls.original || "";
      
      const widgetItem = {
        id: item.id?.toString() || Math.random().toString(),
        type: "tmdb_backdrop",
        title: item.title || "未知标题",
        genreTitle: `${item.mediaType === 'movie' ? '电影' : 'TV剧'} · ${item.releaseYear || 'N/A'}`,
        rating: item.rating || 0,
        description: item.overview || "暂无简介",
        releaseDate: item.releaseYear?.toString() || "",
        posterPath: backdropUrl,
        coverUrl: backdropUrl,
        backdropPath: backdropUrl,
        mediaType: item.mediaType || "movie",
        popularity: item.popularity || 0,
        voteCount: item.voteCount || 0,
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: [],
        // 新增背景图相关字段
        backdropUrls: item.backdropUrls,
        selectedBackdropSize: backdrop_size,
        hasMultipleBackdropSizes: Object.keys(item.backdropUrls || {}).length > 1,
        dataSource: data_source,
        isBackdropData: true
      };
      
      // 优化标题显示
      if (item.rating && item.rating > 0) {
        widgetItem.genreTitle = `${widgetItem.genreTitle} · ⭐${item.rating.toFixed(1)}`;
      }
      
      return widgetItem;
    });

    debugLog.log(`✅ 成功加载 ${results.length} 个背景图项目 (数据源: ${data_source}, 尺寸: ${backdrop_size})`);
    
    setCachedData(cacheKey, results);
    
    // 应用屏蔽过滤
    const filteredResults = filterBlockedItems(results);
    return filteredResults;

  } catch (error) {
    console.error("TMDB背景图数据包加载失败:", error);
    
    // 返回错误信息作为占位项
    return [{
      id: "error",
      type: "error",
      title: "数据加载失败",
      genreTitle: "错误",
      rating: 0,
      description: `无法加载TMDB背景图数据: ${error.message}`,
      releaseDate: "",
      posterPath: "",
      coverUrl: "",
      backdropPath: "",
      mediaType: "error",
      popularity: 0,
      voteCount: 0,
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: []
    }];
  }
}

// 生成后备数据的辅助函数
function generateFallbackData() {
  return [
    {
      id: 1,
      title: "示例电影",
      mediaType: "movie",
      backdropUrls: {
        w300: "https://image.tmdb.org/t/p/w300/sample_backdrop.jpg",
        w780: "https://image.tmdb.org/t/p/w780/sample_backdrop.jpg", 
        w1280: "https://image.tmdb.org/t/p/w1280/sample_backdrop.jpg",
        original: "https://image.tmdb.org/t/p/original/sample_backdrop.jpg"
      },
      rating: 8.5,
      releaseYear: 2024,
      overview: "这是一个示例数据，实际使用时请配置TMDB API密钥",
      popularity: 1000,
      voteCount: 500,
      hasBackdrop: true
    }
  ];
}

// ==================== 新增模块加载函数 ====================





// ==================== 豆瓣片单组件功能函数 ====================





// 基础获取TMDB数据方法
async function searchTmdbData(key, mediaType) {
    const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
        params: {
            query: key,
            language: "zh_CN",
        }
    });
    //打印结果
    // debugLog.log("搜索内容：" + key)
    if (!tmdbResults) {
      return [];
    }
    debugLog.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
    // debugLog.log("tmdbResults.total_results:" + tmdbResults.total_results);
    // debugLog.log("tmdbResults.results[0]:" + tmdbResults.results[0]);
    return tmdbResults.results;
}

function cleanTitle(title) {
    // 特殊替换（最先）
    if (title === "歌手" || title.startsWith("歌手·") || title.match(/^歌手\d{4}$/)) {
        return "我是歌手";
    }

    // 删除括号及其中内容
    title = title.replace(/[（(【\[].*?[）)】\]]/g, '');

    // 删除季数、期数、part等
    const patterns = [
        /[·\-:]\s*[^·\-:]+季/,                // "·慢享季"
        /第[^季]*季/,                        // "第X季"
        /(?:Part|Season|Series)\s*\d+/i,     // "Part 2"
        /\d{4}/,                             // 年份
        /(?:\s+|^)\d{1,2}(?:st|nd|rd|th)?(?=\s|$)/i,  // "2nd"
        /(?<=[^\d\W])\d+\s*$/,               // 数字结尾
        /[·\-:].*$/,                         // 冒号、点之后内容
    ];
    for (let pattern of patterns) {
        title = title.replace(pattern, '');
    }

    // 删除结尾修饰词（但不能把整句删了）
    const tailKeywords = ['前传', '后传', '外传', '番外篇', '番外', '特别篇', '剧场版', 'SP', '最终季', '完结篇', '完结', '电影', 'OVA', '后篇'];
    for (let kw of tailKeywords) {
        title = title.replace(new RegExp(`${kw}$`), '');
    }

    title = title.trim();

    // 对"多个词"的情况，仅保留第一个"主标题"（如"沧元图2 元初山" → "沧元图"）
    // 使用中文词语边界分割
    const parts = title.split(/\s+/);
    if (parts.length > 1) {
        // 保留第一个部分，剔除数字
        return parts[0].replace(/\d+$/, '');
    } else {
        return title.replace(/\d+$/, '');
    }
}

async function fetchImdbItems(scItems) {
  const promises = scItems.map(async (scItem) => {
    // 模拟API请求
    if (!scItem || !scItem.title) {
      return null;
    }
    let title = scItem.type === "tv" ? cleanTitle(scItem.title) : scItem.title;
    debugLog.log("title: ", title, " ; type: ", scItem.type);
    const tmdbDatas = await searchTmdbData(title, scItem.type)

    if (tmdbDatas.length !== 0) {
      return {
        id: tmdbDatas[0].id,
        type: "tmdb",
        title: tmdbDatas[0].title ?? tmdbDatas[0].name,
        description: tmdbDatas[0].overview,
        releaseDate: tmdbDatas[0].release_date ?? tmdbDatas[0].first_air_date,
        backdropPath: tmdbDatas[0].backdrop_path,
        posterPath: tmdbDatas[0].poster_path,
        rating: tmdbDatas[0].vote_average,
        mediaType: scItem.type !== "multi" ? scItem.type : tmdbDatas[0].media_type,
      };
    } else {
      return null;
    }
  });

  // 等待所有请求完成
  const items = (await Promise.all(promises)).filter(Boolean);

  // 去重：保留第一次出现的 title
  const seenTitles = new Set();
  const uniqueItems = items.filter((item) => {
    if (seenTitles.has(item.title)) {
      return false;
    }
    seenTitles.add(item.title);
    return true;
  });

  return uniqueItems;
}

// 解析豆瓣片单
async function loadCardItems(params = {}) {
  try {
    debugLog.log("开始解析豆瓣片单...");
    debugLog.log("参数:", params);
    // 获取片单 URL
    const url = params.url;
    if (!url) {
      console.error("缺少片单 URL");
      throw new Error("缺少片单 URL");
    }
    // 验证 URL 格式
    if (url.includes("douban.com/doulist/")) {
      return loadDefaultList(params);
    } else if (url.includes("douban.com/subject_collection/")) {
      return loadSubjectCollection(params);
    }
  } catch (error) {
    console.error("解析豆瓣片单失败:", error);
    throw error;
  }
}

async function loadDefaultList(params = {}) {
  const url = params.url;
  // 提取片单 ID
  const listId = url.match(/doulist\/(\d+)/)?.[1];
  console.debug("片单 ID:", listId);
  if (!listId) {
    console.error("无法获取片单 ID");
    throw new Error("无法获取片单 ID");
  }

  const page = params.page;
  const count = 25
  const start = (page - 1) * count
  // 构建片单页面 URL
  const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=seq&playable=0&sub_type=`;

  debugLog.log("请求片单页面:", pageUrl);
  // 发送请求获取片单页面
  const response = await Widget.http.get(pageUrl, {
    headers: {
      Referer: `https://movie.douban.com/explore`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取片单数据失败");
  }

  debugLog.log("片单页面数据长度:", response.data.length);
  debugLog.log("开始解析");

  // 解析 HTML 得到文档 ID
  const docId = Widget.dom.parse(response.data);
  if (docId < 0) {
    throw new Error("解析 HTML 失败");
  }
  debugLog.log("解析成功:", docId);

  // 获取所有视频项，得到元素ID数组
  const videoElementIds = Widget.dom.select(docId, ".doulist-item .title a");

  debugLog.log("items:", videoElementIds);

  let doubanIds = [];
  for (const itemId of videoElementIds) {
    const link = await Widget.dom.attr(itemId, "href");
    // 获取元素文本内容并分割
    const text = await Widget.dom.text(itemId);
    // 按空格分割文本并取第一部分
    const chineseTitle = text.trim().split(' ')[0];
    if (chineseTitle) {
      doubanIds.push({ title: chineseTitle, type: "multi" });
    }
  }

  const items = await fetchImdbItems(doubanIds);

  debugLog.log(items)

  return items;
}

async function loadItemsFromApi(params = {}) {
  const url = params.url;
  debugLog.log("请求 API 页面:", url);
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://m.douban.com/subject_collection/${listId}/`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  debugLog.log("请求结果:", response.data);
  if (response.data && response.data.subject_collection_items) {
    const scItems = response.data.subject_collection_items;

    const items = await fetchImdbItems(scItems);

    debugLog.log(items)

    return items;
  }
  return [];
}

async function loadSubjectCollection(params = {}) {
  const listId = params.url.match(/subject_collection\/(\w+)/)?.[1];
  console.debug("合集 ID:", listId);
  if (!listId) {
    console.error("无法获取合集 ID");
    throw new Error("无法获取合集 ID");
  }

  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  let pageUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items?start=${start}&count=${count}&updated_at&items_only=1&type_tag&for_mobile=1`;
  if (params.type) {
    pageUrl += `&type=${params.type}`;
  }
  params.url = pageUrl;
  return await loadItemsFromApi(params);
}

// 移除冗余包装函数，直接使用主函数

async function loadRecommendItems(params = {}) {
  const page = params.page;
  const count = 20
  const start = (page - 1) * count
  const category = params.category || "";
  const categoryType = params.type || "";
  const mediaType = params.media_type || "movie";
  let url = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/${mediaType}?start=${start}&limit=${count}&category=${category}&type=${categoryType}`;
  if (category == "all") {
    url = `https://m.douban.com/rexxar/api/v2/${mediaType}/recommend?refresh=0&start=${start}&count=${count}&selected_categories=%7B%7D&uncollect=false&score_range=0,10&tags=`;
  }
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://movie.douban.com/${mediaType}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  debugLog.log("请求结果:", response.data);
  if (response.data && response.data.items) {
    const recItems = response.data.items;

    const items = await fetchImdbItems(recItems);

    debugLog.log(items)

    return items;
  }
  return [];
}

// 观影偏好
async function getPreferenceRecommendations(params = {}) {
    try {
        const rating = params.rating || "0";
        if (!/^\d$/.test(String(rating))) throw new Error("评分必须为 0～9 的整数");

        const selectedCategories = {
            "类型": params.movieGenre || params.tvGenre || params.zyGenre || "",
            "地区": params.region || "",
            "形式": params.tvModus || "",
        };
        debugLog.log("selectedCategories: ", selectedCategories);

        const tags_sub = [];
        if (params.movieGenre) tags_sub.push(params.movieGenre);
        if (params.tvModus && !params.tvGenre && !params.zyGenre) tags_sub.push(params.tvModus);
        if (params.tvModus && params.tvGenre) tags_sub.push(params.tvGenre);
        if (params.tvModus && params.zyGenre) tags_sub.push(params.zyGenre);
        if (params.region) tags_sub.push(params.region);
        if (params.year) tags_sub.push(params.year);
        if (params.platform) tags_sub.push(params.platform);
        if (params.tags) {
          const customTagsArray = params.tags.split(',').filter(tag => tag.trim() !== '');
          tags_sub.push(...customTagsArray);
        }
        debugLog.log("tags_sub: ", tags_sub);

        const limit = 20;
        const offset = Number(params.offset);
        const url = `https://m.douban.com/rexxar/api/v2/${params.mediaType}/recommend?refresh=0&start=${offset}&count=${Number(offset) + limit}&selected_categories=${encodeURIComponent(JSON.stringify(selectedCategories))}&uncollect=false&score_range=${rating},10&tags=${encodeURIComponent(tags_sub.join(","))}&sort=${params.sort_by}`;

        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://movie.douban.com/explore"
            }
        });

        if (!response.data?.items?.length) throw new Error("未找到匹配的影视作品");

        const validItems = response.data.items.filter(item => item.card === "subject");

        if (!validItems.length) throw new Error("未找到有效的影视作品");

        const items = await fetchImdbItems(validItems);

        debugLog.log(items)

        return items;
    } catch (error) {
        throw error;
    }
}

// 导出性能统计和优化工具（供外部使用）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    performanceMonitor,
    getPerformanceStats: () => performanceMonitor.exportStats()
  };
}

// 全局性能统计导出
if (typeof window !== 'undefined') {
  window.FW2Performance = {
    getStats: () => performanceMonitor.exportStats(),
    logStats: () => performanceMonitor.logStats(),
    clearStats: () => {
      performanceMonitor.stats = {
        totalRequests: 0,
        cachedRequests: 0,
        totalTime: 0
      };
    }
  };
}

// =============屏蔽管理函数实现=============

// 标准数据结构生成函数
function createStandardItem(overrides = {}) {
  return {
    id: "999999",
    type: "tmdb",
    title: "默认标题",
    genreTitle: "",
    rating: 0,
    description: "",
    releaseDate: new Date().toISOString().split('T')[0],
    posterPath: "",
    coverUrl: "",
    backdropPath: "",
    mediaType: "movie",
    popularity: 0,
    voteCount: 0,
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: [],
    ...overrides
  };
}

// TMDB搜索屏蔽功能
async function searchAndBlock(params = {}) {
  const { action = "search_and_block", query = "", language = "zh-CN", tmdb_id = "", media_type = "movie" } = params;
  
  try {
    debugLog.log("🔍 搜索屏蔽模块调用:", params);
    
    if (action === "manual_block") {
      // 手动屏蔽模式
      if (!tmdb_id) {
        return [createStandardItem({
          id: "999001",
          title: "❌ 错误",
          description: "请输入要屏蔽的TMDB ID",
          mediaType: "error",
          genreTitle: "错误"
        })];
      }
      
      const success = addToBlockList(tmdb_id, media_type, `手动屏蔽: ${tmdb_id}`);
      debugLog.log("✅ 手动屏蔽结果:", success);
      
      return [createStandardItem({
        id: success ? String(parseInt(tmdb_id) || 999002) : String(parseInt(tmdb_id) || 999003),
        title: success ? "✅ 屏蔽成功" : "⚠️ 已存在",
        description: success ? `已屏蔽 ${media_type} ID: ${tmdb_id}` : `该ID已在黑名单中`,
        mediaType: "success",
        genreTitle: success ? "屏蔽成功" : "已存在"
      })];
    }
    
    if (action === "search_only" || action === "search_and_block") {
      // 搜索模式
      if (!query) {
        return [createStandardItem({
          id: "999004",
          title: "❌ 错误",
          description: "请输入要搜索的影片名称",
          mediaType: "error",
          genreTitle: "错误"
        })];
      }
      
      // 搜索电影
      const movieResults = await searchTMDB(query, "movie", language);
      // 搜索剧集
      const tvResults = await searchTMDB(query, "tv", language);
      
      const allResults = [...movieResults, ...tvResults];
      
      if (action === "search_and_block") {
        // 自动屏蔽所有搜索结果
        let blockedCount = 0;
        for (const item of allResults) {
          const success = addToBlockList(item.id, item.mediaType, item.title, {
            poster_path: item.posterPath,
            overview: item.description,
            vote_average: item.voteAverage
          });
          if (success) blockedCount++;
        }
        
        return [createStandardItem({
          id: "999005",
          title: "🎯 搜索并屏蔽完成",
          description: `找到 ${allResults.length} 个结果，成功屏蔽 ${blockedCount} 个`,
          mediaType: "success",
          genreTitle: "搜索屏蔽",
          childItems: allResults
        })];
      } else {
        // 仅搜索模式
        return allResults;
      }
    }
    
    return [];
  } catch (error) {
    return [createStandardItem({
      id: "999006",
      title: "❌ 搜索失败",
      description: `错误: ${error.message}`,
      mediaType: "error",
      genreTitle: "错误"
    })];
  }
}

// TMDB屏蔽管理功能
async function manageBlockedItems(params = {}) {
  const { action = "view", unblock_id = "", unblock_media_type = "tv", import_data = "" } = params;
  
  try {
    debugLog.log("📋 屏蔽管理模块调用:", params);
    
    const stored = Widget.storage.get(STORAGE_KEY);
    const blockedItems = stored ? JSON.parse(stored) : [];
    
    debugLog.log("📦 当前屏蔽项目数量:", blockedItems.length);
    
    switch (action) {
      case "view":
        // 查看黑名单
        if (blockedItems.length === 0) {
          return [createStandardItem({
            id: "999007",
            title: "📋 黑名单为空",
            description: "当前没有屏蔽任何内容",
            mediaType: "info",
            genreTitle: "信息"
          })];
        }
        
        const viewItems = blockedItems.map(item => createStandardItem({
          id: String(item.id),
          title: item.title,
          description: `${item.media_type} | 屏蔽时间: ${new Date(item.blocked_date).toLocaleDateString()}`,
          coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          mediaType: item.media_type,
          rating: item.vote_average || 0,
          genreTitle: item.media_type
        }));
        
        return [createStandardItem({
          id: "999008",
          title: `📋 黑名单 (${blockedItems.length}项)`,
          description: "已屏蔽的内容列表",
          mediaType: "list",
          genreTitle: "黑名单",
          childItems: viewItems
        })];
        
      case "unblock":
        // 取消屏蔽
        if (!unblock_id) {
          return [createStandardItem({
            id: "999009",
            title: "❌ 错误",
            description: "请输入要取消屏蔽的ID",
            mediaType: "error",
            genreTitle: "错误"
          })];
        }
        
        const filteredItems = blockedItems.filter(item => 
          !(item.id === unblock_id && item.media_type === unblock_media_type)
        );
        
        if (filteredItems.length === blockedItems.length) {
          return [createStandardItem({
            id: "999010",
            title: "⚠️ 未找到",
            description: `未找到ID为 ${unblock_id} 的 ${unblock_media_type} 项目`,
            mediaType: "warning",
            genreTitle: "警告"
          })];
        }
        
        Widget.storage.set(STORAGE_KEY, JSON.stringify(filteredItems));
        clearBlockedIdCache();
        
        return [createStandardItem({
          id: "999011",
          title: "✅ 取消屏蔽成功",
          description: `已取消屏蔽 ${unblock_media_type} ID: ${unblock_id}`,
          mediaType: "success",
          genreTitle: "成功"
        })];
        
      case "clear":
        // 清空黑名单
        Widget.storage.set(STORAGE_KEY, JSON.stringify([]));
        clearBlockedIdCache();
        
        return [createStandardItem({
          id: "999012",
          title: "🗑️ 清空完成",
          description: "已清空所有屏蔽项目",
          mediaType: "success",
          genreTitle: "成功"
        })];
        
      case "export":
        // 导出配置
        const exportData = blockedItems.map(item => `${item.id}_${item.media_type}`).join(',');
        
        return [createStandardItem({
          id: "999013",
          title: "📤 导出配置",
          description: `共 ${blockedItems.length} 项，复制以下数据:`,
          mediaType: "export",
          genreTitle: "导出",
          durationText: exportData
        })];
        
      case "import":
        // 导入配置
        if (!import_data) {
          return [createStandardItem({
            id: "999014",
            title: "❌ 错误",
            description: "请输入要导入的数据",
            mediaType: "error",
            genreTitle: "错误"
          })];
        }
        
        const importItems = parseImportData(import_data);
        let importedCount = 0;
        
        for (const item of importItems) {
          const success = addToBlockList(item.id, item.media_type, `导入: ${item.id}`);
          if (success) importedCount++;
        }
        
        return [createStandardItem({
          id: "999015",
          title: "📥 导入完成",
          description: `成功导入 ${importedCount}/${importItems.length} 项`,
          mediaType: "success",
          genreTitle: "成功"
        })];
        
      default:
        return [];
    }
  } catch (error) {
    return [createStandardItem({
      id: "999016",
      title: "❌ 操作失败",
      description: `错误: ${error.message}`,
      mediaType: "error",
      genreTitle: "错误"
    })];
  }
}

// 辅助函数：搜索TMDB
async function searchTMDB(query, mediaType, language = "zh-CN") {
  try {
    const apiKey = CONFIG.API_KEY;
    const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=${language}`;
    
    const response = await Widget.http.get(url);
    const data = response.data;
    
    if (!data.results) return [];
    
    return data.results.map(item => createStandardItem({
      id: String(item.id),
      title: item.title || item.name,
      description: item.overview || "暂无简介",
      coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
      backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
      mediaType: mediaType,
      popularity: item.popularity || 0,
      voteCount: item.vote_count || 0,
      rating: item.vote_average || 0,
      releaseDate: item.release_date || item.first_air_date || new Date().toISOString().split('T')[0],
      genreTitle: item.genre_ids ? item.genre_ids.join(', ') : ""
    }));
  } catch (error) {
    console.error("TMDB搜索失败:", error);
    return [];
  }
}

// 辅助函数：解析导入数据
function parseImportData(data) {
  const items = [];
  
  // 支持多种格式: "550,1399" 或 "'550','1399'" 或 '"550","1399"' 或 "550_movie,1399_tv"
  const parts = data.split(',').map(part => part.trim().replace(/['"]/g, ''));
  
  for (const part of parts) {
    if (part.includes('_')) {
      // 格式: "550_movie"
      const [id, media_type] = part.split('_');
      items.push({ id, media_type });
    } else {
      // 格式: "550" (默认为movie)
      items.push({ id: part, media_type: 'movie' });
    }
  }
  
  return items;
}


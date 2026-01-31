// =========================================================================
// 调试配置
// =========================================================================
const DEBUG_CONFIG = {
  enabled: false, // 生产环境关闭调试日志
  performance: false, // 性能监控
  cache: false, // 缓存日志
  network: false, // 网络请求日志
  system: false, // 系统内部日志（如导出配置等）
  widget: false // Widget相关日志
};

const debugLog = {
  log: (message, ...args) => DEBUG_CONFIG.enabled && console.log(message, ...args),
  performance: (message, ...args) => DEBUG_CONFIG.performance && console.log(message, ...args),
  cache: (message, ...args) => DEBUG_CONFIG.cache && console.log(message, ...args),
  network: (message, ...args) => DEBUG_CONFIG.network && console.log(message, ...args),
  system: (message, ...args) => DEBUG_CONFIG.system && console.log(message, ...args),
  widget: (message, ...args) => DEBUG_CONFIG.widget && console.log(message, ...args),
  warn: (message, ...args) => console.warn(message, ...args),
  error: (message, ...args) => console.error(message, ...args)
};

// =========================================================================
// 配置常量
// =========================================================================
const CONFIG = {
  API_KEY: "", // TMDB API密钥
  CACHE_DURATION: 60 * 60 * 1000, // 60分钟缓存
  NETWORK_TIMEOUT: 10000, // 10秒超时
  MAX_ITEMS: 20, // 最大返回项目数
  
  // 分层缓存配置
  CACHE_STRATEGIES: {
    TRENDING: 30 * 60 * 1000, // 热门内容30分钟
    DISCOVER: 60 * 60 * 1000, // 发现内容60分钟
    DETAILS: 2 * 60 * 60 * 1000, // 详细信息2小时
    STATIC: 24 * 60 * 60 * 1000 // 静态数据24小时
  },
  
  // CDN优化配置
  ENABLE_CDN_OPTIMIZATION: true,
  CDN_PROVIDERS: ["jsdelivr", "githubraw", "gitcdn"],
  CDN_RETRY_COUNT: 2,
  CDN_TIMEOUT: 8000,
  
  // 图片CDN优化
  IMAGE_CDN_ENABLED: true,
  IMAGE_QUALITY: "w500",
  IMAGE_CDN_FALLBACK: true,
};

// =========================================================================
// Widget元数据
// =========================================================================
var WidgetMetadata = {
  id: "media.aggregator.pro",
  title: "TMDB",
  author: "saxdyo",
  description: "TMDB、Trakt、TMDB、Bilibili、Bangumi、AniList、MAL",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  site: "https://github.com/saxdyo",
  detailCacheDuration: 60,
  
  globalParams: [
    // Trakt 配置
    { 
      name: "traktUser", 
      title: "🔗 Trakt 用户名 (追剧日历)", 
      type: "input", 
      value: "",
      placeholder: "可选：如需 Trakt 追剧功能，请填写用户名"
    }
  ],

  modules: [
    // ===========================================
    // 模块 0: Trakt 个人追剧 (可选)
    // ===========================================
    {
      title: " Trakt 追剧日历",
      functionName: "loadTraktProfile",
      type: "list",
      cacheDuration: 300,
      params: [
        {
          name: "section",
          title: "浏览区域",
          type: "enumeration",
          value: "updates",
          enumOptions: [
            { title: " 追剧日历", value: "updates" },
            { title: " 待看列表", value: "watchlist" },
            { title: " 收藏列表", value: "collection" },
            { title: " 观看历史", value: "history" }
          ]
        },
        {
          name: "type",
          title: "内容筛选",
          type: "enumeration",
          value: "all",
          belongTo: { paramName: "section", value: ["watchlist", "collection", "history"] },
          enumOptions: [ 
            { title: "全部", value: "all" }, 
            { title: "剧集", value: "shows" }, 
            { title: "电影", value: "movies" } 
          ]
        },
        {
          name: "updateSort",
          title: "追剧模式",
          type: "enumeration",
          value: "future_first",
          belongTo: { paramName: "section", value: ["updates"] },
          enumOptions: [
            { title: " 从今天往后", value: "future_first" },
            { title: " 按更新倒序", value: "air_date_desc" },
            { title: " 按观看倒序", value: "watched_at" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 1: Bilibili 热榜
    // ===========================================
    {
      title: " Bilibili 热榜",
      functionName: "loadBilibiliRank",
      type: "list",
      cacheDuration: 1800,
      params: [
        {
          name: "type",
          title: "榜单分区",
          type: "enumeration",
          value: "1",
          enumOptions: [
            { title: "📺 B站番剧 (日漫)", value: "1" },
            { title: "🇨🇳 B站国创 (国漫)", value: "4" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 2: Bangumi 放送表
    // ===========================================
    {
      title: " Bangumi 追番日历",
      functionName: "loadBangumiCalendar",
      type: "list",
      cacheDuration: 3600,
      params: [
        {
          name: "weekday",
          title: "选择日期",
          type: "enumeration",
          value: "today",
          enumOptions: [
            { title: " 今日更新", value: "today" },
            { title: "周一 (月)", value: "1" },
            { title: "周二 (火)", value: "2" },
            { title: "周三 (水)", value: "3" },
            { title: "周四 (木)", value: "4" },
            { title: "周五 (金)", value: "5" },
            { title: "周六 (土)", value: "6" },
            { title: "周日 (日)", value: "7" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 3: TMDB 原生榜单
    // ===========================================
    {
      title: " TMDB 动漫榜单",
      functionName: "loadTmdbAnimeRanking",
      type: "list",
      cacheDuration: 3600,
      params: [
        {
          name: "sort",
          title: "榜单类型",
          type: "enumeration",
          value: "trending",
          enumOptions: [
            { title: " 实时流行 (Trending)", value: "trending" },
            { title: " 最新首播 (New)", value: "new" },
            { title: " 高分神作 (Top Rated)", value: "top" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 4: AniList 流行榜
    // ===========================================
    {
      title: " AniList 流行榜",
      functionName: "loadAniListRanking",
      type: "list",
      cacheDuration: 7200,
      params: [
        {
          name: "sort",
          title: "排序方式",
          type: "enumeration",
          value: "TRENDING_DESC",
          enumOptions: [
            { title: " 近期趋势 (Trending)", value: "TRENDING_DESC" },
            { title: " 历史人气 (Popularity)", value: "POPULARITY_DESC" },
            { title: " 评分最高 (Score)", value: "SCORE_DESC" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 5: MAL 权威榜单
    // ===========================================
    {
      title: " MAL 权威榜单",
      functionName: "loadMalRanking",
      type: "list",
      cacheDuration: 7200,
      params: [
        {
          name: "filter",
          title: "榜单类型",
          type: "enumeration",
          value: "airing",
          enumOptions: [
            { title: " 当前热播 Top", value: "airing" },
            { title: " 历史总榜 Top", value: "all" },
            { title: " 最佳剧场版", value: "movie" },
            { title: " 即将上映", value: "upcoming" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // ===========================================
    // 模块 6: TMDB 热门内容
    // ===========================================
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

    // ===========================================
    // 模块 7: TMDB 播出平台
    // ===========================================
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
    
    // ===========================================
    // 模块 8: TMDB 出品公司
    // ===========================================
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

    // ===========================================
    // 模块 9: TMDB 影视榜单
    // ===========================================
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

    // ===========================================
    // 模块 10: TMDB主题分类
    // ===========================================
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

    // ===========================================
    // 模块 11: TMDB观影偏好
    // ===========================================
    {
      title: "TMDB观影偏好",
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

    // ===========================================
    // 模块 12: TMDB 搜索屏蔽
    // ===========================================
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

    // ===========================================
    // 模块 13: TMDB 屏蔽管理
    // ===========================================
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

// =========================================================================
// A. 动漫相关模块函数（从第一份代码）
// =========================================================================

// Trakt 内置 Client ID
const TRAKT_CLIENT_ID = "f47aba7aa7ccfebfb782c9b8497f95e4b2fe4a5de73e80d5bc033bde93233fc5";

// 动漫榜单模块函数（共用工具函数）
const GENRE_MAP = {
  16: "动画", 10759: "动作冒险", 35: "喜剧", 18: "剧情", 14: "奇幻", 
  878: "科幻", 9648: "悬疑", 10749: "爱情", 27: "恐怖", 10765: "科幻奇幻"
};

function getGenreText(ids) {
  if (!ids || !Array.isArray(ids)) return "动画";
  const genres = ids.filter(id => id !== 16).map(id => GENRE_MAP[id]).filter(Boolean);
  return genres.length > 0 ? genres.slice(0, 2).join(" / ") : "动画";
}

function getWeekdayName(id) {
  const map = { 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日", 0: "周日" };
  return map[id] || "";
}

function cleanTitle(title) {
  if (!title) return "";
  return title
    .replace(/第[一二三四五六七八九十\d]+[季章]/g, "")
    .replace(/Season \d+/gi, "")
    .replace(/Part \d+/gi, "")
    .replace(/\s*-\s*$/, "")
    .trim();
}

function buildAnimeItem({ id, tmdbId, type, title, year, poster, backdrop, rating, genreText, subTitle, desc }) {
  return {
    id: String(id),
    tmdbId: parseInt(tmdbId) || 0,
    type: "tmdb",
    mediaType: type || "tv",
    title: title || "未知标题",
    genreTitle: [year, genreText].filter(Boolean).join(" • "),
    subTitle: subTitle || "",
    posterPath: poster ? `https://image.tmdb.org/t/p/w500${poster}` : "",
    backdropPath: backdrop ? `https://image.tmdb.org/t/p/w780${backdrop}` : "",
    description: desc || "暂无简介",
    rating: rating ? Number(rating).toFixed(1) : "0.0",
    year: year || ""
  };
}

function formatShortDate(dateStr) {
  if (!dateStr) return "待定";
  const date = new Date(dateStr);
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${m}-${d}`;
}

// =========================================================================
// A.1 Trakt 追剧模块函数
// =========================================================================

async function loadTraktProfile(params = {}) {
  const { traktUser, section, updateSort = "future_first", type = "all", page = 1 } = params;

  // 如果没有填写用户名，显示提示
  if (!traktUser) return [{ 
    id: "trakt_prompt", 
    type: "text", 
    title: "🔗 Trakt 追剧日历", 
    description: "请在全局设置中填写 Trakt 用户名以使用此功能" 
  }];

  // === A. 追剧日历 (Updates) ===
  if (section === "updates") {
    return await loadUpdatesLogic(traktUser, TRAKT_CLIENT_ID, updateSort, page);
  }

  // === B. 常规列表 ===
  let rawItems = [];
  const sortType = "added,desc";
  
  if (type === "all") {
    const [movies, shows] = await Promise.all([
      fetchTraktList(section, "movies", sortType, page, traktUser, TRAKT_CLIENT_ID),
      fetchTraktList(section, "shows", sortType, page, traktUser, TRAKT_CLIENT_ID)
    ]);
    rawItems = [...movies, ...shows];
  } else {
    rawItems = await fetchTraktList(section, type, sortType, page, traktUser, TRAKT_CLIENT_ID);
  }
  
  rawItems.sort((a, b) => new Date(getItemTime(b, section)) - new Date(getItemTime(a, section)));
  
  if (!rawItems || rawItems.length === 0) return page === 1 ? [{ id: "empty", type: "text", title: "列表为空" }] : [];

  const promises = rawItems.map(async (item) => {
    const subject = item.show || item.movie || item;
    if (!subject?.ids?.tmdb) return null;
    let subInfo = "";
    const timeStr = getItemTime(item, section);
    if (timeStr) subInfo = timeStr.split('T')[0];
    if (type === "all") subInfo = `[${item.show ? "剧" : "影"}] ${subInfo}`;
    return await fetchTmdbDetail(subject.ids.tmdb, item.show ? "tv" : "movie", subInfo, subject.title);
  });
  return (await Promise.all(promises)).filter(Boolean);
}

async function loadUpdatesLogic(user, id, sort, page) {
  const url = `https://api.trakt.tv/users/${user}/watched/shows?extended=noseasons&limit=100`;
  try {
    const res = await Widget.http.get(url, {
      headers: { 
        "Content-Type": "application/json", 
        "trakt-api-version": "2", 
        "trakt-api-key": id 
      }
    });
    const data = res.data || [];
    if (data.length === 0) return [{ id: "empty", type: "text", title: "无观看记录" }];

    const enrichedShows = await Promise.all(data.slice(0, 60).map(async (item) => {
      if (!item.show?.ids?.tmdb) return null;
      const tmdb = await fetchTmdbShowDetails(item.show.ids.tmdb);
      if (!tmdb) return null;
      
      const nextAir = tmdb.next_episode_to_air?.air_date;
      const lastAir = tmdb.last_episode_to_air?.air_date;
      const sortDate = nextAir || lastAir || "1970-01-01";
      const today = new Date().toISOString().split('T')[0];
      const isFuture = sortDate >= today;

      return {
        trakt: item, 
        tmdb: tmdb,
        sortDate: sortDate,
        isFuture: isFuture,
        watchedDate: item.last_watched_at
      };
    }));

    const valid = enrichedShows.filter(Boolean);
    
    if (sort === "future_first") {
      const futureShows = valid.filter(s => s.isFuture && s.tmdb.next_episode_to_air);
      const pastShows = valid.filter(s => !s.isFuture || !s.tmdb.next_episode_to_air);
      futureShows.sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));
      pastShows.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
      valid.length = 0; 
      valid.push(...futureShows, ...pastShows);
    } else if (sort === "air_date_desc") {
      valid.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
    } else {
      valid.sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate));
    }

    const start = (page - 1) * 15;
    return valid.slice(start, start + 15).map(item => {
      const d = item.tmdb;
      
      let displayStr = "暂无排期";
      let icon = "📅";
      let epData = null;

      if (d.next_episode_to_air) {
        icon = "🔜";
        epData = d.next_episode_to_air;
      } else if (d.last_episode_to_air) {
        icon = "📅";
        epData = d.last_episode_to_air;
      }

      if (epData) {
        const shortDate = formatShortDate(epData.air_date);
        displayStr = `${icon} ${shortDate} 📺 S${epData.season_number}E${epData.episode_number}`;
      }

      return {
        id: String(d.id), 
        tmdbId: d.id, 
        type: "tmdb", 
        mediaType: "tv",
        title: d.name, 
        genreTitle: displayStr, 
        subTitle: displayStr,
        posterPath: d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : "",
        description: `上次观看: ${item.watchedDate?.split("T")[0] || "未知"}\n${d.overview || "暂无简介"}`
      };
    });
  } catch (e) { 
    console.error("Trakt 更新错误:", e);
    return [{ id: "err", type: "text", title: "Trakt 连接失败", description: "请检查网络或用户名" }]; 
  }
}

async function fetchTraktList(section, type, sort, page, user, id) {
  const limit = 20; 
  const url = `https://api.trakt.tv/users/${user}/${section}/${type}?extended=full&page=${page}&limit=${limit}`;
  try {
    const res = await Widget.http.get(url, {
      headers: { 
        "Content-Type": "application/json", 
        "trakt-api-version": "2", 
        "trakt-api-key": id 
      }
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (e) { 
    console.error(`Trakt ${section} 错误:`, e);
    return []; 
  }
}

async function fetchTmdbDetail(id, type, subInfo, originalTitle) {
  try {
    const d = await Widget.tmdb.get(`/${type}/${id}`, { params: { language: "zh-CN" } });
    const year = (d.first_air_date || d.release_date || "").substring(0, 4);
    return {
      id: String(d.id), 
      tmdbId: d.id, 
      type: "tmdb", 
      mediaType: type,
      title: d.name || d.title || originalTitle || "未知标题",
      genreTitle: year, 
      subTitle: subInfo, 
      description: d.overview || "暂无简介",
      posterPath: d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : ""
    };
  } catch (e) { 
    console.error(`TMDB ${type} 详情错误:`, e);
    return null; 
  }
}

async function fetchTmdbShowDetails(id) {
  try { 
    return await Widget.tmdb.get(`/tv/${id}`, { params: { language: "zh-CN" } }); 
  } catch (e) { 
    console.error("TMDB 剧集详情错误:", e);
    return null; 
  }
}

function getItemTime(item, section) {
  if (section === "watchlist") return item.listed_at;
  if (section === "history") return item.watched_at;
  if (section === "collection") return item.collected_at;
  return item.created_at || "1970-01-01";
}

// =========================================================================
// A.2 Bilibili 热榜
// =========================================================================

async function loadBilibiliRank(params = {}) {
  const { type = "1", page = 1 } = params;
  const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`;
  
  try {
    const res = await Widget.http.get(url, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", 
        "Referer": "https://www.bilibili.com/" 
      }
    });
    
    const data = res.data || {};
    const fullList = data.result?.list || data.data?.list || [];

    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (start >= fullList.length) return [];
    const slicedList = fullList.slice(start, end);

    const promises = slicedList.map(async (item, index) => {
      const rank = start + index + 1;
      const cleanName = cleanTitle(item.title);
      
      const tmdbItem = await searchTmdbBestMatch(cleanName, item.title);
      if (!tmdbItem || !tmdbItem.id) return null;

      return buildAnimeItem({
        id: tmdbItem.id,
        tmdbId: parseInt(tmdbItem.id),
        type: "tv",
        title: tmdbItem.name || tmdbItem.title || cleanName,
        year: (tmdbItem.first_air_date || "").substring(0, 4),
        poster: tmdbItem.poster_path,
        backdrop: tmdbItem.backdrop_path,
        rating: tmdbItem.vote_average,
        genreText: getGenreText(tmdbItem.genre_ids),
        subTitle: `No.${rank} • ${item.new_ep?.index_show || "热播"}`,
        desc: tmdbItem.overview || item.desc || ""
      });
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);

  } catch (e) { 
    console.error("Bilibili 错误:", e);
    return [{ id: "err", type: "text", title: "Bilibili 连接失败" }]; 
  }
}

// =========================================================================
// A.3 Bangumi 日历
// =========================================================================

async function loadBangumiCalendar(params = {}) {
  const { weekday = "today", page = 1 } = params;
  const pageSize = 20;

  let targetDayId = parseInt(weekday);
  if (weekday === "today") {
    const today = new Date();
    const jsDay = today.getDay();
    targetDayId = jsDay === 0 ? 7 : jsDay;
  }
  const dayName = getWeekdayName(targetDayId);

  try {
    const res = await Widget.http.get("https://api.bgm.tv/calendar");
    const data = res.data || [];
    const dayData = data.find(d => d.weekday && d.weekday.id === targetDayId);
    if (!dayData || !dayData.items) return [];

    const allItems = dayData.items;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (start >= allItems.length) return [];
    const pageItems = allItems.slice(start, end);

    const promises = pageItems.map(async (item) => {
      const cnTitle = item.name_cn || item.name;
      const tmdbItem = await searchTmdbBestMatch(cnTitle, item.name);

      if (!tmdbItem || !tmdbItem.id) return null;

      return buildAnimeItem({
        id: tmdbItem.id,
        tmdbId: parseInt(tmdbItem.id),
        type: "tv",
        title: tmdbItem.name || tmdbItem.title || cnTitle,
        year: (tmdbItem.first_air_date || "").substring(0, 4),
        poster: tmdbItem.poster_path,
        backdrop: tmdbItem.backdrop_path,
        rating: item.rating?.score || tmdbItem.vote_average,
        genreText: getGenreText(tmdbItem.genre_ids),
        subTitle: `${dayName} • ${item.air_date || "更新"}`,
        desc: tmdbItem.overview || item.summary || ""
      });
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (e) { 
    console.error("Bangumi 错误:", e);
    return [{ id: "err", type: "text", title: "Bangumi 连接失败" }]; 
  }
}

// =========================================================================
// A.4 TMDB 原生动漫榜单
// =========================================================================

async function loadTmdbAnimeRanking(params = {}) {
  const { sort = "trending", page = 1 } = params;
  
  let queryParams = {
    language: "zh-CN",
    page: page,
    with_genres: "16",
    with_original_language: "ja", 
    include_adult: false
  };
  
  let endpoint = "/discover/tv";

  if (sort === "trending") {
    queryParams.sort_by = "popularity.desc";
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    queryParams["first_air_date.gte"] = d.toISOString().split('T')[0];
  } else if (sort === "new") {
    queryParams.sort_by = "first_air_date.desc";
    queryParams["vote_count.gte"] = 5;
    const today = new Date().toISOString().split('T')[0];
    queryParams["first_air_date.lte"] = today;
  } else if (sort === "top") {
    queryParams.sort_by = "vote_average.desc";
    queryParams["vote_count.gte"] = 300;
  }

  try {
    const res = await Widget.tmdb.get(endpoint, { params: queryParams });
    const data = res || {};
    if (!data.results) return [];

    return data.results.map(item => {
      return buildAnimeItem({
        id: item.id,
        tmdbId: item.id,
        type: "tv",
        title: item.name || item.title || "",
        year: (item.first_air_date || "").substring(0, 4),
        poster: item.poster_path,
        backdrop: item.backdrop_path,
        rating: item.vote_average,
        genreText: getGenreText(item.genre_ids),
        subTitle: `TMDB Hot ${Math.round(item.popularity)}`,
        desc: item.overview || ""
      });
    });
  } catch (e) { 
    console.error("TMDB 榜单错误:", e);
    return [{ id: "err", type: "text", title: "TMDB 连接失败" }]; 
  }
}

// =========================================================================
// A.5 AniList 流行榜
// =========================================================================

async function loadAniListRanking(params = {}) {
  const { sort = "TRENDING_DESC", page = 1 } = params;
  const perPage = 20;

  const query = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      media (sort: ${sort}, type: ANIME) {
        title { native romaji english }
        coverImage { large }
        averageScore
        description
        seasonYear
      }
    }
  }
  `;

  try {
    const res = await Widget.http.post("https://graphql.anilist.co", {
      query: query,
      variables: { page, perPage }
    }, { 
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json" 
      } 
    });

    const data = res.data?.data?.Page?.media || [];
    if (data.length === 0) return [];

    const promises = data.map(async (media) => {
      const searchQ = media.title.native || media.title.romaji;
      const tmdbItem = await searchTmdbBestMatch(searchQ, media.title.english);

      if (!tmdbItem || !tmdbItem.id) return null;

      return buildAnimeItem({
        id: tmdbItem.id,
        tmdbId: parseInt(tmdbItem.id),
        type: "tv",
        title: tmdbItem.name || tmdbItem.title || searchQ,
        year: String(media.seasonYear || (tmdbItem.first_air_date || "").substring(0, 4)),
        poster: tmdbItem.poster_path,
        backdrop: tmdbItem.backdrop_path,
        rating: (media.averageScore / 10).toFixed(1),
        genreText: getGenreText(tmdbItem.genre_ids),
        subTitle: `AniList ${(media.averageScore / 10).toFixed(1)}`,
        desc: tmdbItem.overview || media.description || ""
      });
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (e) { 
    console.error("AniList 错误:", e);
    return [{ id: "err", type: "text", title: "AniList 连接失败" }]; 
  }
}

// =========================================================================
// A.6 MAL 权威榜单
// =========================================================================

async function loadMalRanking(params = {}) {
  const { filter = "airing", page = 1 } = params;
  const baseUrl = "https://api.jikan.moe/v4/top/anime";
  let apiParams = { page: page };
  
  if (filter === "airing") apiParams.filter = "airing";
  else if (filter === "movie") apiParams.type = "movie";
  else if (filter === "upcoming") apiParams.filter = "upcoming";

  try {
    const res = await Widget.http.get(baseUrl, { params: apiParams });
    if (res.statusCode === 429) return [{ id: "err", type: "text", title: "MAL 请求过快，请稍后重试" }];
    
    const data = res.data?.data || [];

    const promises = data.map(async (item) => {
      const searchQ = item.title_japanese || item.title;
      const tmdbItem = await searchTmdbBestMatch(searchQ, item.title_english);

      if (!tmdbItem || !tmdbItem.id) return null;

      return buildAnimeItem({
        id: tmdbItem.id,
        tmdbId: parseInt(tmdbItem.id),
        type: item.type === "Movie" ? "movie" : "tv",
        title: tmdbItem.name || tmdbItem.title || searchQ,
        year: String(item.year || (tmdbItem.first_air_date || "").substring(0, 4)),
        poster: tmdbItem.poster_path,
        backdrop: tmdbItem.backdrop_path,
        rating: item.score || 0,
        genreText: getGenreText(tmdbItem.genre_ids),
        subTitle: `MAL ${item.score || "-"}`,
        desc: tmdbItem.overview || item.synopsis || ""
      });
    });

    const results = await Promise.all(promises);
    return results.filter(Boolean);
  } catch (e) { 
    console.error("MAL 错误:", e);
    return [{ id: "err", type: "text", title: "MAL 连接失败" }]; 
  }
}

// =========================================================================
// A.7 核心：TMDB 智能匹配（动漫用）
// =========================================================================

async function searchTmdbBestMatch(query1, query2) {
  let res = await searchTmdb(query1);
  if (!res && query2 && query2 !== query1) {
    res = await searchTmdb(query2);
  }
  return res;
}

async function searchTmdb(query) {
  if (!query || query.length < 2) return null;
  const cleanQuery = cleanTitle(query);

  try {
    const res = await Widget.tmdb.get("/search/multi", { 
      params: { 
        query: cleanQuery, 
        language: "zh-CN",
        page: 1 
      } 
    });
    const results = res.results || [];
    
    const candidates = results.filter(r => 
      (r.media_type === "tv" || r.media_type === "movie")
    );
    
    if (candidates.length > 0) {
      return candidates.find(r => r.poster_path) || candidates[0];
    }
    
    return null;
  } catch (e) { 
    console.error("TMDB 搜索错误:", e.message);
    return null; 
  }
}

// =========================================================================
// B. TMDB核心模块函数（从第二份代码）
// =========================================================================

// ===============屏蔽配置===============
const STORAGE_KEY = "media_blocked_items";
const PREDEFINED_BLOCKED_ITEMS = [
  // 预定义屏蔽项目
  { id: "999013", media_type: "export", title: "导出配置", reason: "系统导出功能" },
  // ... 其他预定义项目
];

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
    
    // 添加预定义的屏蔽列表
    for (let i = 0; i < PREDEFINED_BLOCKED_ITEMS.length; i++) {
      const item = PREDEFINED_BLOCKED_ITEMS[i];
      const idStr = String(item.id);
      const idNum = parseInt(item.id);
      
      idSet.add(idStr + "_" + item.media_type);
      idSet.add(idNum + "_" + item.media_type);
      
      idSet.add(idStr);
      idSet.add(idNum);
    }
    
    // 添加用户自定义的屏蔽列表
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
        overview: additionalInfo.overview || "通过media.aggregator.pro添加的屏蔽项",
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

// =========================================================================
// 性能监控工具
// =========================================================================

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

// =========================================================================
// 数据质量监控
// =========================================================================

const dataQualityMonitor = (data, moduleName) => {
  if (!Array.isArray(data)) return data;
  
  const stats = {
    total: data.length,
    withPoster: data.filter(item => item.posterPath).length,
    withRating: data.filter(item => item.rating && item.rating !== '0.0').length,
    withDate: data.filter(item => item.releaseDate).length
  };
  
  debugLog.log(`📊 ${moduleName} 数据质量:`, stats);
  return data;
};

// =========================================================================
// 缓存管理 - LRU机制
// =========================================================================

class LRUCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
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

// =========================================================================
// 辅助函数
// =========================================================================

function getCachedData(key, cacheType = 'DEFAULT') {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }
  
  const now = Date.now();
  const age = now - cached.timestamp;
  
  let cacheDuration = CONFIG.CACHE_DURATION;
  if (CONFIG.CACHE_STRATEGIES[cacheType]) {
    cacheDuration = CONFIG.CACHE_STRATEGIES[cacheType];
  }
  
  if (age < cacheDuration) {
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

// =========================================================================
// TMDB类型映射
// =========================================================================

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

function getBeijingDate() {
  const now = new Date();
  const beijingTime = now.getTime() + (8 * 60 * 60 * 1000);
  const beijingDate = new Date(beijingTime);
  return `${beijingDate.getUTCFullYear()}-${String(beijingDate.getUTCMonth() + 1).padStart(2, '0')}-${String(beijingDate.getUTCDate()).padStart(2, '0')}`;
}

// =========================================================================
// B.1 TMDB热门内容加载
// =========================================================================

async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "today", page = 1, language = "zh-CN", use_preprocessed_data = "true" } = params;
  
  const endMonitor = performanceMonitor.start('TMDB热门模块');
  
  let finalContentType = content_type;
  if (sort_by && ["today", "week", "popular", "top_rated"].includes(sort_by)) {
    finalContentType = sort_by;
  }
  
  const updatedParams = {
    ...params,
    content_type: finalContentType
  };
  
  try {
    let result;
    if (use_preprocessed_data === "api") {
      result = await loadTmdbTrendingWithAPI(updatedParams);
    } else {
      result = await loadTmdbTrendingFromPreprocessed(updatedParams);
    }
    
    endMonitor();
    const filteredResult = filterBlockedItems(result);
    return dataQualityMonitor(filteredResult, 'TMDB热门模块');
  } catch (error) {
    console.error("❌ TMDB热门模块加载失败:", error);
    endMonitor();
    return [];
  }
}

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
    
    if (media_type !== "all") {
      response.results = response.results.filter(item => {
        if (media_type === "movie") return item.media_type === "movie";
        if (media_type === "tv") return item.media_type === "tv";
        return true;
      });
    }

    let results = response.results.map(item => {
      const widgetItem = {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: getGenreTitle(item.genre_ids, item.media_type || "movie"),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
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
      
      if (item.backdrop_path) {
        const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
        widgetItem.title_backdrop = backdropUrl;
        widgetItem.backdropPath = backdropUrl;
      }
      
      return widgetItem;
    });

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

async function loadTmdbTrendingFromPreprocessed(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity" } = params;
  
  try {
    const cacheKey = `preprocessed_trending_${content_type}_${media_type}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await Widget.http.get("https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json");
    const data = response.data;
    
    let results = [];
    
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
    
    if (media_type !== "all") {
      results = results.filter(item => item.type === media_type);
    }
    
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

    widgetItems = widgetItems.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, widgetItems);
    return widgetItems;

  } catch (error) {
    console.error("预处理数据加载失败:", error);
    return [];
  }
}

// =========================================================================
// B.2 TMDB播出平台
// =========================================================================

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
    
    const res = await Widget.tmdb.get(api, { params: discoverParams });
    
    if (!res || !res.results) {
      console.error("❌ TMDB API返回数据格式错误:", res);
      return [];
    }
    
    debugLog.log(`📊 TMDB API返回 ${res.results.length} 条原始数据`);
    
    const results = res.results
      .filter((item) => {
        const hasPoster = item.poster_path;
        const hasId = item.id;
        const hasTitle = (item.title || item.name) && (item.title || item.name).trim().length > 0;
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
    
    debugLog.log("✅ 播出平台数据加载成功，返回", results.length, "项");
    return results;
    
  } catch (error) {
    console.error("❌ 播出平台数据加载失败:", error);
    return [];
  }
}

// =========================================================================
// B.3 TMDB出品公司
// =========================================================================

async function loadTmdbByCompany(params = {}) {
  const { language = "zh-CN", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
  
  try {
    const cacheKey = `company_${with_companies}_${type}_${with_genres}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    let results = [];
    
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
      
      const movieResults = movieRes.results.map(item => {
        item.media_type = "movie";
        return {
          id: item.id.toString(),
          type: "tmdb",
          title: item.title || item.name || "未知标题",
          genreTitle: getGenreTitle(item.genre_ids, "movie"),
          rating: item.vote_average || 0,
          description: item.overview || "",
          releaseDate: item.release_date || item.first_air_date || "",
          posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
          mediaType: "movie",
          popularity: item.popularity || 0,
          voteCount: item.vote_count || 0,
          link: null,
          duration: 0,
          durationText: "",
          episode: 0,
          childItems: []
        };
      });
      
      const tvResults = tvRes.results.map(item => {
        item.media_type = "tv";
        return {
          id: item.id.toString(),
          type: "tmdb",
          title: item.title || item.name || "未知标题",
          genreTitle: getGenreTitle(item.genre_ids, "tv"),
          rating: item.vote_average || 0,
          description: item.overview || "",
          releaseDate: item.release_date || item.first_air_date || "",
          posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
          mediaType: "tv",
          popularity: item.popularity || 0,
          voteCount: item.vote_count || 0,
          link: null,
          duration: 0,
          durationText: "",
          episode: 0,
          childItems: []
        };
      });
      
      const filteredMovieResults = movieResults.filter(item => item.posterPath);
      const filteredTvResults = tvResults.filter(item => item.posterPath);
      
      results = [...filteredMovieResults, ...filteredTvResults]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, CONFIG.MAX_ITEMS);
      
    } else {
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      
      const queryParams = { 
        language, 
        page, 
        sort_by
      };
      
      if (with_companies) {
        queryParams.with_companies = with_companies;
      }
      
      if (with_genres) {
        queryParams.with_genres = with_genres;
      }
      
      const res = await Widget.tmdb.get(endpoint, {
        params: queryParams
      });
      
      const widgetItems = res.results.map(item => {
        item.media_type = type;
        return {
          id: item.id.toString(),
          type: "tmdb",
          title: item.title || item.name || "未知标题",
          genreTitle: getGenreTitle(item.genre_ids, type),
          rating: item.vote_average || 0,
          description: item.overview || "",
          releaseDate: item.release_date || item.first_air_date || "",
          posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
          mediaType: type,
          popularity: item.popularity || 0,
          voteCount: item.vote_count || 0,
          link: null,
          duration: 0,
          durationText: "",
          episode: 0,
          childItems: []
        };
      });
      
      results = widgetItems
        .filter(item => item.posterPath)
        .slice(0, CONFIG.MAX_ITEMS);
    }
    
    setCachedData(cacheKey, results);
    const filteredResults = filterBlockedItems(results);
    return filteredResults;
    
  } catch (error) {
    console.error("TMDB出品公司加载失败:", error);
    return [];
  }
}

// =========================================================================
// B.4 TMDB影视榜单
// =========================================================================

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

    const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
    
    const queryParams = { 
      language, 
      page, 
      sort_by,
      vote_count_gte: media_type === "movie" ? 100 : 50
    };
    
    if (with_origin_country && with_origin_country !== "") {
      queryParams.with_origin_country = with_origin_country;
    }
    
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
    }
    
    if (with_origin_country === "JP" && anime_filter !== "all") {
      if (anime_filter === "exclude_anime") {
        queryParams.without_genres = "16";
      } else if (anime_filter === "anime_only") {
        queryParams.with_genres = "16";
      }
    }
    
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
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
    
    if (media_type === "movie") {
      if (sort_by.includes("first_air_date")) {
        queryParams.sort_by = sort_by.replace("first_air_date", "release_date");
      }
    } else {
      if (sort_by.includes("release_date")) {
        queryParams.sort_by = sort_by.replace("release_date", "first_air_date");
      }
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const widgetItems = res.results.map(item => {
      item.media_type = media_type;
      return {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: getGenreTitle(item.genre_ids, media_type),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        mediaType: media_type,
        popularity: item.popularity || 0,
        voteCount: item.vote_count || 0,
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: []
      };
    });
    
    let filteredItems = widgetItems;
    if (poster_filter === "poster_only") {
      filteredItems = widgetItems.filter(item => {
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
    const filteredResults = filterBlockedItems(results);
    return filteredResults;

  } catch (error) {
    console.error("TMDB影视榜单加载失败:", error);
    return [];
  }
}

// =========================================================================
// B.5 TMDB主题分类
// =========================================================================

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

    const themeToGenres = {
      action: { movie: "28,12", tv: "10759" },
      sci_fi: { movie: "878,14", tv: "10765" },
      thriller: { movie: "53,9648", tv: "9648" },
      romance: { movie: "10749", tv: "10749" },
      comedy: { movie: "35", tv: "35" },
      horror: { movie: "27", tv: "27" },
      war_history: { movie: "10752,36", tv: "10768" },
      family: { movie: "10751", tv: "10751,10762" },
      music: { movie: "10402", tv: "10402" },
      documentary: { movie: "99", tv: "99" },
      western: { movie: "37", tv: "37" },
      crime: { movie: "80", tv: "80" }
    };

    const genreIds = themeToGenres[theme];
    if (!genreIds) {
      console.error(`❌ 未知主题: ${theme}`);
      return [];
    }

    const endpoint = media_type === "movie" ? "/discover/movie" : 
                    media_type === "tv" ? "/discover/tv" : "/discover/movie";
    
    const queryParams = {
      language: "zh-CN",
      page: page,
      vote_count_gte: media_type === "movie" ? 50 : 20
    };

    if (media_type === "movie") {
      queryParams.with_genres = genreIds.movie;
    } else if (media_type === "tv") {
      queryParams.with_genres = genreIds.tv;
    } else {
      queryParams.with_genres = genreIds.movie;
    }

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

    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

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

    const widgetItems = res.results.map(item => {
      const widgetItem = {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: getGenreTitle(item.genre_ids, media_type),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        mediaType: media_type,
        popularity: item.popularity || 0,
        voteCount: item.vote_count || 0,
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: [],
        type: "theme",
        source: `TMDB主题分类 (${theme})`,
        theme: theme
      };
      
      if (item.vote_average) {
        widgetItem.rating = item.vote_average.toFixed(1);
        widgetItem.ratingColor = item.vote_average >= 8.0 ? "#FFD700" : 
                                item.vote_average >= 7.0 ? "#90EE90" : 
                                item.vote_average >= 6.0 ? "#FFA500" : "#FF6B6B";
      }

      return widgetItem;
    });
    
    const results = widgetItems.filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    debugLog.log(`✅ 成功处理主题分类数据: ${results.length} 条`);

    setCachedData(cacheKey, results);
    const filteredResults = filterBlockedItems(results);
    return filteredResults;

  } catch (error) {
    console.error("❌ TMDB主题分类加载失败:", error);
    return await loadThemeFallback(params);
  }
}

async function loadThemeFallback(params = {}) {
  const { theme = "action", media_type = "all", sort_by = "popularity_desc", min_rating = "0", year = "", page = 1 } = params;
  
  try {
    debugLog.log("🔄 尝试主题分类备用数据获取...");
    
    const queryParams = {
      language: "zh-CN",
      page: page,
      sort_by: "popularity.desc",
      vote_count_gte: 10
    };

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

    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

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

    const widgetItems = res.results.map(item => {
      return {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: getGenreTitle(item.genre_ids, "movie"),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        coverUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        mediaType: "movie",
        popularity: item.popularity || 0,
        voteCount: item.vote_count || 0,
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: [],
        type: "theme-fallback",
        source: `TMDB主题分类 (${theme}) (备用)`,
        theme: theme
      };
    });
    
    const results = widgetItems.filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    debugLog.log("✅ 备用方案成功处理数据:", results.length, "条");
    return results;

  } catch (error) {
    console.error("❌ 主题分类备用数据加载失败:", error);
    debugLog.log("🔄 使用本地备用数据...");
    return generateThemeFallbackData(theme);
  }
}

function generateThemeFallbackData(theme) {
  debugLog.log(`🏠 生成本地主题分类备用数据: ${theme}`);
  
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
      }
    ]
  };

  const fallbackData = themeData[theme] || themeData.action;
  
  const results = fallbackData.map(item => {
    return {
      id: item.id.toString(),
      type: "tmdb",
      title: item.title || "未知标题",
      genreTitle: getGenreTitle(item.genreIds, item.mediaType),
      rating: item.voteAverage || 0,
      description: item.overview || "",
      releaseDate: item.releaseDate || "",
      posterPath: item.posterPath || "",
      coverUrl: item.posterPath || "",
      backdropPath: item.backdropPath || "",
      mediaType: item.mediaType || "movie",
      popularity: 0,
      voteCount: item.voteCount || 0,
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: [],
      type: "theme-fallback",
      source: item.source,
      theme: item.theme,
      rating: item.rating,
      ratingColor: item.ratingColor
    };
  });

  debugLog.log(`✅ 本地主题分类数据生成完成: ${results.length} 条`);
  return results;
}

// =========================================================================
// B.6 观影偏好
// =========================================================================

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

async function searchTmdbData(key, mediaType) {
  const tmdbResults = await Widget.tmdb.get(`/search/${mediaType}`, {
    params: {
      query: key,
      language: "zh_CN",
    }
  });
  
  if (!tmdbResults) {
    return [];
  }
  
  debugLog.log("tmdbResults:" + JSON.stringify(tmdbResults, null, 2));
  return tmdbResults.results;
}

async function fetchImdbItems(scItems) {
  const promises = scItems.map(async (scItem) => {
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

  const items = (await Promise.all(promises)).filter(Boolean);

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

// =========================================================================
// B.7 TMDB搜索屏蔽功能
// =========================================================================

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

async function searchAndBlock(params = {}) {
  const { action = "search_and_block", query = "", language = "zh-CN", tmdb_id = "", media_type = "movie" } = params;
  
  try {
    debugLog.log("🔍 搜索屏蔽模块调用:", params);
    
    if (action === "manual_block") {
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
      if (!query) {
        return [createStandardItem({
          id: "999004",
          title: "❌ 错误",
          description: "请输入要搜索的影片名称",
          mediaType: "error",
          genreTitle: "错误"
        })];
      }
      
      const movieResults = await searchTMDB(query, "movie", language);
      const tvResults = await searchTMDB(query, "tv", language);
      
      const allResults = [...movieResults, ...tvResults];
      
      if (action === "search_and_block") {
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

// =========================================================================
// B.8 TMDB屏蔽管理功能
// =========================================================================

async function manageBlockedItems(params = {}) {
  const { action = "view", unblock_id = "", unblock_media_type = "tv", import_data = "" } = params;
  
  try {
    debugLog.log("📋 屏蔽管理模块调用:", params);
    
    const stored = Widget.storage.get(STORAGE_KEY);
    const blockedItems = stored ? JSON.parse(stored) : [];
    
    debugLog.log("📦 当前屏蔽项目数量:", blockedItems.length);
    
    switch (action) {
      case "view":
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

function parseImportData(data) {
  const items = [];
  
  const parts = data.split(',').map(part => part.trim().replace(/['"]/g, ''));
  
  for (const part of parts) {
    if (part.includes('_')) {
      const [id, media_type] = part.split('_');
      items.push({ id, media_type });
    } else {
      items.push({ id: part, media_type: 'movie' });
    }
  }
  
  return items;
}

// =========================================================================
// 缓存清理和初始化
// =========================================================================

function cleanupCache() {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, value] of cache.entries()) {
    const age = now - value.timestamp;
    
    if (age > CONFIG.CACHE_DURATION) {
      cache.delete(key);
      cleanedCount++;
      continue;
    }
  }
  
  if (cache.size > 30) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
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

function initSmartCache() {
  try {
    cleanupCache();
    
    if (typeof setInterval !== 'undefined') {
      setInterval(() => {
        cleanupCache();
        
        if (cache.size > 25) {
          debugLog.cache("⚠️ 缓存过多，执行深度清理");
          const entries = Array.from(cache.entries());
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          const toDelete = entries.slice(0, Math.floor(entries.length / 2));
          toDelete.forEach(([key]) => cache.delete(key));
        }
      }, 10 * 60 * 1000);
      
      debugLog.cache("✅ 智能缓存已启动");
    } else {
      debugLog.cache("⚠️ setInterval不可用，使用基础缓存模式");
    }
  } catch (error) {
    debugLog.cache("⚠️ 使用基础缓存模式");
    if (typeof setInterval !== 'undefined') {
      setInterval(cleanupCache, 15 * 60 * 1000);
    }
  }
}

// 启动缓存管理
initSmartCache();

// =========================================================================
// 全局性能统计导出
// =========================================================================

if (typeof window !== 'undefined') {
  window.MediaAggregatorPerformance = {
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

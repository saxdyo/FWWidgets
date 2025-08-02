WidgetMetadata = {
  id: "forward.combined.media.lists.v2",
  title: "TMDB影视榜单 V2",
  description: "优化的TMDB影视动画榜单",
  author: "saxdyo",
  site: "https://github.com/saxdyo/FWWidgets",
  version: "2.0.0",
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
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },

    // TMDB播出平台
    {
      title: "TMDB 播出平台",
      description: "按播出平台和内容类型筛选剧集内容",
      requiresWebView: false,
      functionName: "loadTmdbByNetwork",
      cacheDuration: 3600,
      params: [
        { 
          name: "with_networks",
          title: "播出平台",
          type: "enumeration",
          description: "选择一个平台以查看其剧集内容",
          value: "",
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
            { title: "Paramount", value: "576" },
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
          title: "内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "儿童", value: "10762" },
            { title: "悬疑", value: "9648" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "肥皂剧", value: "10766" },
            { title: "纪录片", value: "99" },
            { title: "动作与冒险", value: "10759" },
            { title: "科幻与奇幻", value: "10765" },
            { title: "战争与政治", value: "10768" },
            { title: "动作", value: "28" },
            { title: "科幻", value: "878" },
            { title: "爱情", value: "10749" }
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
            { title: "未上映", value: "upcoming" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" }
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
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "上映日期↓", value: "release_date.desc" },
            { title: "上映日期↑", value: "release_date.asc" },
            { title: "首播日期↓", value: "first_air_date.desc" },
            { title: "首播日期↑", value: "first_air_date.asc" }
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
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "最新上映↓", value: "release_date.desc" },
            { title: "最早上映↑", value: "release_date.asc" },
            { title: "最新播出↓", value: "first_air_date.desc" },
            { title: "最早播出↑", value: "first_air_date.asc" },
            { title: "最新更新↓", value: "last_air_date.desc" },
            { title: "最早更新↑", value: "last_air_date.asc" }
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
    // Bangumi热门新番
    {
      title: "Bangumi 热门新番",
      description: "最新热门新番动画",
      requiresWebView: false,
      functionName: "loadBangumiHotNewAnime",
      cacheDuration: 1800,
      params: [
        {
          name: "with_origin_country",
          title: "制作地区",
          type: "enumeration",
          description: "选择动画制作地区",
          value: "JP",
          enumOptions: [
            { title: "日本动画", value: "JP" },
            { title: "中国动画", value: "CN" },
            { title: "韩国动画", value: "KR" },
            { title: "全部地区", value: "" }
          ]
        },
        {
          name: "with_genres",
          title: "动画类型",
          type: "enumeration",
          description: "选择动画类型",
          value: "16",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "动画", value: "16" },
            { title: "奇幻", value: "14" },
            { title: "科幻", value: "878" },
            { title: "冒险", value: "12" },
            { title: "喜剧", value: "35" },
            { title: "爱情", value: "10749" },
            { title: "动作", value: "28" },
            { title: "悬疑", value: "9648" },
            { title: "音乐", value: "10402" },
            { title: "运动", value: "10770" },
            { title: "家庭", value: "10751" },
            { title: "犯罪", value: "80" },
            { title: "历史", value: "36" },
            { title: "战争", value: "10752" },
            { title: "恐怖", value: "27" }
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
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "最新播出↓", value: "first_air_date.desc" },
            { title: "最早播出↑", value: "first_air_date.asc" },
            { title: "最新更新↓", value: "last_air_date.desc" },
            { title: "最早更新↑", value: "last_air_date.asc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "最低评分",
          type: "enumeration",
          description: "设置最低评分要求",
          value: "6.0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "6.0分以上", value: "6.0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" },
            { title: "8.5分以上", value: "8.5" }
          ]
        },
        {
          name: "year",
          title: "年份筛选",
          type: "enumeration",
          description: "按播出年份筛选动画",
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
    // ✨ 动画
    {
      title: "✨ 动画",
      description: "按地区筛选的动画内容",
      requiresWebView: false,
      functionName: "loadAnimeList",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "选择地区/语言",
          type: "enumeration",
          value: "all",
          enumOptions: [
            { title: "全部地区", value: "all" },
            { title: "中国大陆", value: "country:cn" },
            { title: "美国", value: "country:us" },
            { title: "英国", value: "country:gb" },
            { title: "日本", value: "country:jp" },
            { title: "韩国", value: "country:kr" },
            { title: "欧美", value: "region:us-eu" },
            { title: "香港", value: "country:hk" },
            { title: "台湾", value: "country:tw" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "hs_desc",
          enumOptions: [
            { title: "热门度↓", value: "hs_desc" },
            { title: "热门度↑", value: "hs_asc" },
            { title: "评分↓", value: "r_desc" },
            { title: "评分↑", value: "r_asc" },
            { title: "播出时间↓", value: "date_desc" },
            { title: "播出时间↑", value: "date_asc" }
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
            { title: "5.0分以上", value: "5.0" },
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
          description: "按播出年份筛选动画",
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
        { name: "page", title: "页码", type: "page", value: "1" }
      ]
    },
    // 豆瓣片单
    {
      title: "豆瓣片单",
      description: "豆瓣热门片单内容",
      requiresWebView: false,
      functionName: "loadDoubanList",
      cacheDuration: 7200,
      params: [
        {
          name: "url",
          title: "片单地址",
          type: "input",
          description: "豆瓣片单地址",
          placeholders: [
            { title: "豆瓣热门电影", value: "https://m.douban.com/subject_collection/movie_hot_gaia" },
            { title: "热播新剧", value: "https://m.douban.com/subject_collection/tv_hot" },
            { title: "热播动漫", value: "https://m.douban.com/subject_collection/tv_animation" },
            { title: "豆瓣 Top 250", value: "https://m.douban.com/subject_collection/movie_top250" },
            { title: "实时热门电影", value: "https://m.douban.com/subject_collection/movie_real_time_hotest" },
            { title: "实时热门电视", value: "https://m.douban.com/subject_collection/tv_real_time_hotest" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

// 配置常量
const CONFIG = {
  API_KEY: "your_tmdb_api_key_here", // 请替换为您的TMDB API密钥
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  NETWORK_TIMEOUT: 10000, // 10秒超时
  MAX_ITEMS: 20 // 最大返回项目数
};

// 平台logo映射
const PLATFORM_LOGOS = {
  "netflix": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    backdrop: "https://assets.nflxext.com/ffe/siteui/acquisition/home/nflxlogo.png"
  },
  "disney": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
    backdrop: "https://www.disney.com/static/app/images/disney-plus-logo.png"
  },
  "hbo": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
    backdrop: "https://www.hbo.com/static/app/images/hbo-logo.png"
  },
  "amazon": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/27/Amazon_Prime_Video_logo.svg",
    backdrop: "https://www.amazon.com/static/app/images/prime-video-logo.png"
  },
  "hulu": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
    backdrop: "https://www.hulu.com/static/app/images/hulu-logo.png"
  },
  "apple": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Apple_TV_Plus_logo.svg",
    backdrop: "https://www.apple.com/static/app/images/apple-tv-plus-logo.png"
  }
};

// 平台检测函数
function detectPlatform(title, overview = "") {
  const titleLower = title.toLowerCase();
  const overviewLower = overview.toLowerCase();
  
  const platformKeywords = {
    "netflix": ["netflix", "netflix original", "netflix series"],
    "disney": ["disney", "disney+", "disney plus", "marvel", "star wars"],
    "hbo": ["hbo", "hbo max", "warner bros"],
    "amazon": ["amazon", "prime video", "amazon original"],
    "hulu": ["hulu", "hulu original"],
    "apple": ["apple tv", "apple tv+", "apple original"]
  };
  
  for (const [platform, keywords] of Object.entries(platformKeywords)) {
    for (const keyword of keywords) {
      if (titleLower.includes(keyword) || overviewLower.includes(keyword)) {
        return platform;
      }
    }
  }
  
  return null;
}

// 缓存管理
const cache = new Map();

// 工具函数
function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  cache.set(key, {
    data: data,
    timestamp: Date.now()
  });
}

function createWidgetItem(item) {
  const baseItem = {
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || item.name || "未知标题",
    genreTitle: item.genreTitle || "",
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
  
  // 检测平台并添加logo信息
  const detectedPlatform = detectPlatform(item.title || item.name, item.overview);
  if (detectedPlatform && PLATFORM_LOGOS[detectedPlatform]) {
    baseItem.platform = detectedPlatform;
    baseItem.platformLogo = PLATFORM_LOGOS[detectedPlatform].logo;
    baseItem.platformBackdrop = PLATFORM_LOGOS[detectedPlatform].backdrop;
  }
  
  return baseItem;
}

// TMDB类型映射
const TMDB_GENRES = {
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

// 主要功能函数

// 1. TMDB热门内容加载（支持logo背景图）
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_with_logos_${content_type}_${media_type}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 首先尝试从本地数据文件加载带logo的数据
    try {
      console.log(`尝试从本地文件加载 ${content_type} 数据...`);
      const localData = await loadTmdbDataWithLogos();
      
      if (localData && localData[`${content_type}_global`]) {
        let results = localData[`${content_type}_global`];
        console.log(`✅ 成功加载本地数据: ${results.length} 项`);
        
        // 应用过滤条件
        if (media_type !== "all") {
          const beforeFilter = results.length;
          results = results.filter(item => item.type === media_type);
          console.log(`📺 过滤 ${media_type}: ${beforeFilter} → ${results.length} 项`);
        }
        
        if (vote_average_gte !== "0") {
          const minRating = parseFloat(vote_average_gte);
          const beforeFilter = results.length;
          results = results.filter(item => item.rating >= minRating);
          console.log(`⭐ 过滤评分 ${vote_average_gte}: ${beforeFilter} → ${results.length} 项`);
        }
        
        // 处理带片名的背景图数据，使用增强的处理函数
        results = await Promise.all(results.map(async item => {
          const processedItem = await createWidgetItemWithDynamicLogo(item);
          // 确保带片名的背景图字段正确传递
          if (item.title_backdrop) {
            processedItem.titleBackdrop = item.title_backdrop;
            processedItem.backdropPath = item.title_backdrop; // 优先使用带片名的背景图
          }
          return processedItem;
        }));
        
        results = results.slice(0, CONFIG.MAX_ITEMS);
        console.log(`🎯 最终返回: ${results.length} 项`);
        setCachedData(cacheKey, results);
        return results;
      } else {
        console.log(`❌ 本地数据中未找到 ${content_type}_global 字段`);
        if (localData) {
          console.log(`可用字段: ${Object.keys(localData).join(', ')}`);
        }
      }
    } catch (error) {
      console.warn('无法从本地文件加载logo数据，使用API调用:', error);
    }

    // 如果本地数据不可用，使用API调用
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
      page,
      api_key: CONFIG.API_KEY
    };

    if (with_origin_country) {
      queryParams.region = with_origin_country;
    }

    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    
    let results = await Promise.all(response.results.map(async item => {
      const widgetItem = await createWidgetItemWithDynamicLogo(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, item.media_type || "movie");
      return widgetItem;
    }));

    // 应用评分过滤
    if (vote_average_gte !== "0") {
      const minRating = parseFloat(vote_average_gte);
      results = results.filter(item => item.rating >= minRating);
    }

    // 限制返回数量
    results = results.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("TMDB热门内容加载失败:", error);
    return [];
  }
}

// 从TMDB数据文件加载带logo的数据
async function loadTmdbDataWithLogos() {
  try {
    const tmdbDataPath = './data/TMDB_Trending_with_logos.json';
    console.log(`📁 尝试加载文件: ${tmdbDataPath}`);
    
    const response = await fetch(tmdbDataPath);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ 成功加载TMDB数据文件`);
      console.log(`📊 数据字段: ${Object.keys(data).join(', ')}`);
      return data;
    } else {
      console.log(`❌ 文件加载失败: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('无法从本地文件加载TMDB数据:', error);
    console.log('可能的原因:');
    console.log('- 文件不存在');
    console.log('- 文件权限问题');
    console.log('- JavaScript环境不支持fetch');
  }
  return null;
}

// 从本地数据文件加载logo数据
async function loadLogoDataFromFile() {
  try {
    const logoDataPath = './data/logo_backdrops.json';
    const response = await fetch(logoDataPath);
    if (response.ok) {
      const data = await response.json();
      return processLogoData(data);
    }
  } catch (error) {
    console.warn('无法从本地文件加载logo数据:', error);
  }
  
  return getDefaultLogoMapping();
}

// 处理爬取的logo数据
function processLogoData(data) {
  const logoMapping = {};
  
  if (data.websites) {
    data.websites.forEach(website => {
      const platform = website.website;
      if (website.logos && website.logos.length > 0) {
        logoMapping[platform] = {
          logo: website.logos[0].url,
          backdrop: website.backdrops && website.backdrops.length > 0 
            ? website.backdrops[0].url 
            : getDefaultBackdrop(platform)
        };
      }
    });
  }
  
  return logoMapping;
}

// 获取默认背景图
function getDefaultBackdrop(platform) {
  const defaultBackdrops = {
    "netflix": "https://assets.nflxext.com/ffe/siteui/acquisition/home/nflxlogo.png",
    "disney": "https://www.disney.com/static/app/images/disney-plus-logo.png",
    "hbo": "https://www.hbo.com/static/app/images/hbo-logo.png",
    "amazon": "https://www.amazon.com/static/app/images/prime-video-logo.png",
    "hulu": "https://www.hulu.com/static/app/images/hulu-logo.png",
    "apple": "https://www.apple.com/static/app/images/apple-tv-plus-logo.png"
  };
  return defaultBackdrops[platform] || "";
}

// 增强的createWidgetItem函数，支持动态logo数据和带片名的背景图
async function createWidgetItemWithDynamicLogo(item) {
  const baseItem = {
    id: item.id.toString(),
    type: "tmdb",
    title: item.title || item.name || "未知标题",
    genreTitle: item.genreTitle || "",
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
  
  // 优先使用带片名的背景图（title_backdrop）
  if (item.title_backdrop) {
    baseItem.titleBackdrop = item.title_backdrop;
    baseItem.backdropPath = item.title_backdrop; // 使用带片名的背景图作为主要背景
  }
  
  // 检测平台
  const detectedPlatform = detectPlatform(item.title || item.name, item.overview);
  if (detectedPlatform) {
    baseItem.platform = detectedPlatform;
    
    // 尝试加载动态logo数据
    try {
      const logoMapping = await loadLogoDataFromFile();
      if (logoMapping[detectedPlatform]) {
        baseItem.platformLogo = logoMapping[detectedPlatform].logo;
        baseItem.platformBackdrop = logoMapping[detectedPlatform].backdrop;
      } else {
        // 使用默认映射
        const defaultMapping = getDefaultLogoMapping();
        if (defaultMapping[detectedPlatform]) {
          baseItem.platformLogo = defaultMapping[detectedPlatform].logo;
          baseItem.platformBackdrop = defaultMapping[detectedPlatform].backdrop;
        }
      }
    } catch (error) {
      console.warn('加载logo数据失败，使用默认映射:', error);
      const defaultMapping = getDefaultLogoMapping();
      if (defaultMapping[detectedPlatform]) {
        baseItem.platformLogo = defaultMapping[detectedPlatform].logo;
        baseItem.platformBackdrop = defaultMapping[detectedPlatform].backdrop;
      }
    }
  }
  
  return baseItem;
}



// 3. 豆瓣片单加载
async function loadDoubanList(params = {}) {
  const { url, page = 1 } = params;
  
  if (!url) {
    return [];
  }

  try {
    const cacheKey = `douban_${url}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 这里需要根据实际的豆瓣API或网页解析来实现
    // 由于原脚本中的豆瓣解析逻辑比较复杂，这里提供一个简化版本
    const response = await Widget.http.get(url, {
      timeout: CONFIG.NETWORK_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      }
    });

    // 简化的豆瓣数据解析（实际使用时需要根据豆瓣的具体结构调整）
    const results = [];
    
    // 这里应该根据实际的豆瓣页面结构来解析数据
    // 由于豆瓣的反爬虫机制，实际实现可能需要更复杂的处理
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("豆瓣片单加载失败:", error);
    return [];
  }
}

// 清理过期缓存
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if ((now - value.timestamp) > CONFIG.CACHE_DURATION) {
      cache.delete(key);
    }
  }
}

// 定期清理缓存
setInterval(cleanupCache, 5 * 60 * 1000); // 每5分钟清理一次

// 新增功能函数

// 1. TMDB播出平台
async function loadTmdbByNetwork(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_networks, 
    with_genres,
    air_status = "released",
    sort_by = "first_air_date.desc" 
  } = params;

  try {
    const cacheKey = `network_${with_networks}_${with_genres}_${air_status}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const discoverParams = {
      language,
      page,
      sort_by,
      api_key: CONFIG.API_KEY
    };

    if (with_networks) {
      discoverParams.with_networks = with_networks;
    }

    if (with_genres) {
      discoverParams.with_genres = with_genres;
    }

    if (air_status === 'released') {
      discoverParams['first_air_date.lte'] = new Date().toISOString().split('T')[0];
    } else if (air_status === 'upcoming') {
      discoverParams['first_air_date.gte'] = new Date().toISOString().split('T')[0];
    }

    const res = await Widget.tmdb.get("/discover/tv", {
      params: discoverParams
    });

    const results = res.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
      return widgetItem;
    }).slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("TMDB播出平台加载失败:", error);
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
            api_key: CONFIG.API_KEY,
            ...(with_companies && { with_companies }),
            ...(with_genres && { with_genres })
          }
        }),
        Widget.tmdb.get("/discover/tv", {
          params: {
            language,
            page,
            sort_by,
            api_key: CONFIG.API_KEY,
            ...(with_companies && { with_companies }),
            ...(with_genres && { with_genres })
          }
        })
      ]);
      
      // 合并电影和剧集结果，按热门度排序
      const movieResults = movieRes.results
        .map(item => {
          const widgetItem = createWidgetItem(item);
          widgetItem.genreTitle = getGenreTitle(item.genre_ids, "movie");
          return widgetItem;
        })
        .filter(item => item.posterPath);
        
      const tvResults = tvRes.results
        .map(item => {
          const widgetItem = createWidgetItem(item);
          widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
          return widgetItem;
        })
        .filter(item => item.posterPath);
      
      // 合并并排序（按热门度）
      results = [...movieResults, ...tvResults]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, CONFIG.MAX_ITEMS);
      
    } else {
      // 构建API端点
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      
      // 构建查询参数
      const queryParams = { 
        language, 
        page, 
        sort_by,
        api_key: CONFIG.API_KEY
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
      
      results = res.results
        .map(item => {
          const widgetItem = createWidgetItem(item);
          widgetItem.genreTitle = getGenreTitle(item.genre_ids, type);
          return widgetItem;
        })
        .filter(item => item.posterPath)
        .slice(0, CONFIG.MAX_ITEMS);
    }
    
    setCachedData(cacheKey, results);
    return results;
    
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
    sort_by = "popularity.desc",
    vote_average_gte = "0",
    year = ""
  } = params;
  
  try {
    const cacheKey = `ranking_${media_type}_${with_origin_country}_${with_genres}_${sort_by}_${vote_average_gte}_${year}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 根据媒体类型选择API端点
    const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: CONFIG.API_KEY,
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
    
    const results = res.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, media_type);
      return widgetItem;
    }).slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("TMDB影视榜单加载失败:", error);
    return [];
  }
}

// 4. Bangumi热门新番
async function loadBangumiHotNewAnime(params = {}) {
  const { 
    language = "zh-CN", 
    page = 1, 
    with_origin_country = "JP",
    with_genres = "16",
    sort_by = "popularity.desc",
    vote_average_gte = "6.0",
    year = ""
  } = params;

  try {
    const cacheKey = `bangumi_${with_origin_country}_${with_genres}_${sort_by}_${vote_average_gte}_${year}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const endpoint = "/discover/tv";

    // 构建查询参数 - 支持多类型动画
    const queryParams = { 
      language, 
      page, 
      sort_by,
      api_key: CONFIG.API_KEY,
      vote_count_gte: 10  // 新番投票较少，降低门槛
    };
    
    // 动画类型筛选 - 确保只获取动画内容
    if (with_genres && with_genres !== "") {
      queryParams.with_genres = with_genres;
      // 确保包含动画类型
      if (!queryParams.with_genres.includes("16")) {
        queryParams.with_genres = `${queryParams.with_genres},16`;
      }
    } else {
      queryParams.with_genres = "16"; // 默认动画
    }
    
    // 添加制作地区
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    // 添加最低评分要求
    if (vote_average_gte && vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 添加年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
    }
    
    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });
    
    const results = res.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
      // 添加Bangumi新番标识
      widgetItem.type = "bangumi-new";
      widgetItem.source = "Bangumi热门新番";
      widgetItem.isNewAnime = true;
      
      // 优化日期显示
      if (widgetItem.releaseDate) {
        const date = new Date(widgetItem.releaseDate);
        if (!isNaN(date.getTime())) {
          widgetItem.airDate = widgetItem.releaseDate;
          widgetItem.airYear = date.getFullYear();
          widgetItem.isRecent = (new Date().getTime() - date.getTime()) < (365 * 24 * 60 * 60 * 1000); // 一年内
        }
      }
      
      return widgetItem;
    }).filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;
    
  } catch (error) {
    console.error("Bangumi热门新番加载失败:", error);
    return [];
  }
}

// 5. ✨ 动画
async function loadAnimeList(params = {}) {
  const { region = "all", sort_by = "hs_desc", min_rating = "0", year = "", page = 1 } = params;
  
  try {
    const cacheKey = `anime_${region}_${sort_by}_${min_rating}_${year}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 这里需要根据实际的动画数据源来实现
    // 由于原脚本中的动画模块使用了复杂的数据源，这里提供一个简化版本
    // 实际使用时需要根据具体的数据源来调整
    
    // 简化的动画数据获取（实际使用时需要根据具体的数据源来调整）
    const results = [];
    
    // 这里应该根据实际的动画数据源来获取数据
    // 由于原脚本中的动画模块使用了复杂的数据源，这里提供一个简化版本
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("动画列表加载失败:", error);
    return [];
  }
}
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
    },

    // TMDB背景图数据包
    {
      title: "TMDB 背景图数据包",
      description: "使用本地数据包，提供高质量背景图的热门影视内容",
      requiresWebView: false,
      functionName: "loadTmdbBackdropData",
      cacheDuration: 1800, // 30分钟缓存
      params: [
        {
          name: "data_source",
          title: "数据源",
          type: "enumeration",
          description: "选择数据来源",
          value: "combined",
          enumOptions: [
            { title: "综合数据", value: "combined" },
            { title: "热门电影", value: "movies" },
            { title: "热门电视剧", value: "tv" },
            { title: "今日热门", value: "trending" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "筛选媒体类型",
          value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" }
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
          name: "sort_by",
          title: "排序方式",
          type: "enumeration", 
          description: "选择排序方式",
          value: "rating_desc",
          enumOptions: [
            { title: "评分降序", value: "rating_desc" },
            { title: "评分升序", value: "rating_asc" },
            { title: "热度降序", value: "popularity_desc" },
            { title: "发布时间", value: "release_date" },
            { title: "标题排序", value: "title" }
          ]
        },
        {
          name: "backdrop_size",
          title: "背景图尺寸",
          type: "enumeration",
          description: "选择背景图片尺寸",
          value: "w1280",
          enumOptions: [
            { title: "小尺寸 (300px)", value: "w300" },
            { title: "中等尺寸 (780px)", value: "w780" },
            { title: "高清尺寸 (1280px)", value: "w1280" },
            { title: "原始尺寸", value: "original" }
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
  return {
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

// 1. TMDB热门内容加载
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_${content_type}_${media_type}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
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
      page,
      api_key: CONFIG.API_KEY
    };

    if (with_origin_country) {
      queryParams.region = with_origin_country;
    }

    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    
    let results = response.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, item.media_type || "movie");
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

    // 限制返回数量
    results = results.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("TMDB热门内容加载失败:", error);
    return [];
  }
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

    console.log("🎬 正在获取动画数据...", params);

    // 使用 TMDB API 获取动画数据
    const endpoint = "/discover/tv";
    
    // 构建查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      api_key: CONFIG.API_KEY,
      with_genres: "16", // 动画类型
      vote_count_gte: 10,
      include_adult: false
    };

    // 根据排序方式设置参数
    switch (sort_by) {
      case "hs_desc":
        queryParams.sort_by = "popularity.desc";
        break;
      case "hs_asc":
        queryParams.sort_by = "popularity.asc";
        break;
      case "r_desc":
        queryParams.sort_by = "vote_average.desc";
        break;
      case "r_asc":
        queryParams.sort_by = "vote_average.asc";
        break;
      case "date_desc":
        queryParams.sort_by = "first_air_date.desc";
        break;
      case "date_asc":
        queryParams.sort_by = "first_air_date.asc";
        break;
      default:
        queryParams.sort_by = "popularity.desc";
    }

    // 设置最低评分要求
    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

    // 根据地区筛选
    if (region && region !== "all") {
      if (region.startsWith("country:")) {
        const country = region.split(":")[1];
        queryParams.with_origin_country = country.toUpperCase();
      } else if (region.startsWith("region:")) {
        const regionCode = region.split(":")[1];
        if (regionCode === "us-eu") {
          queryParams.with_origin_country = "US,GB,DE,FR,IT,ES";
        }
      }
    }

    // 年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
    }

    console.log("📊 查询参数:", queryParams);

    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });

    console.log("📊 获取到动画数据:", res.results ? res.results.length : 0, "条");

    if (!res.results || res.results.length === 0) {
      console.log("⚠️ 未获取到动画数据，使用备用方案...");
      return await loadAnimeFallback(params);
    }

    const results = res.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
      
      // 添加动画特定标识
      widgetItem.type = "anime";
      widgetItem.source = "✨ 动画";
      widgetItem.isAnime = true;
      
      // 优化动画信息显示
      if (widgetItem.releaseDate) {
        const date = new Date(widgetItem.releaseDate);
        if (!isNaN(date.getTime())) {
          widgetItem.airDate = widgetItem.releaseDate;
          widgetItem.airYear = date.getFullYear();
          widgetItem.isRecent = (new Date().getTime() - date.getTime()) < (365 * 24 * 60 * 60 * 1000);
        }
      }

      // 添加动画评分信息
      if (item.vote_average) {
        widgetItem.rating = item.vote_average.toFixed(1);
        widgetItem.ratingColor = item.vote_average >= 8.0 ? "#FFD700" : 
                                item.vote_average >= 7.0 ? "#90EE90" : 
                                item.vote_average >= 6.0 ? "#FFA500" : "#FF6B6B";
      }

      // 添加动画状态信息
      if (item.status) {
        widgetItem.status = item.status;
        widgetItem.isOngoing = item.status === "Returning Series";
        widgetItem.isCompleted = item.status === "Ended";
      }

      // 添加动画集数信息
      if (item.number_of_seasons) {
        widgetItem.seasons = item.number_of_seasons;
      }
      if (item.number_of_episodes) {
        widgetItem.episodes = item.number_of_episodes;
      }

      return widgetItem;
    }).filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    console.log("✅ 成功处理动画数据:", results.length, "条");

    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("❌ 动画列表加载失败:", error);
    return await loadAnimeFallback(params);
  }
}

// 动画备用数据获取函数
async function loadAnimeFallback(params = {}) {
  const { region = "all", sort_by = "hs_desc", min_rating = "0", year = "", page = 1 } = params;
  
  try {
    console.log("🔄 尝试备用动画数据获取...");
    
    // 使用更简单的查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      api_key: CONFIG.API_KEY,
      with_genres: "16", // 动画类型
      sort_by: "popularity.desc",
      vote_count_gte: 1, // 降低投票数要求
      include_adult: false
    };

    // 设置最低评分
    if (min_rating && min_rating !== "0") {
      queryParams.vote_average_gte = min_rating;
    }

    // 年份筛选
    if (year && year !== "") {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      queryParams.first_air_date_gte = startDate;
      queryParams.first_air_date_lte = endDate;
    }

    console.log("🔄 备用查询参数:", queryParams);

    const res = await Widget.tmdb.get("/discover/tv", {
      params: queryParams
    });

    console.log("📊 备用方案获取到数据:", res.results ? res.results.length : 0, "条");

    if (!res.results || res.results.length === 0) {
      console.log("⚠️ 备用方案也无数据，使用本地数据...");
      return generateAnimeFallbackData();
    }

    const results = res.results.map(item => {
      const widgetItem = createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
      widgetItem.type = "anime-fallback";
      widgetItem.source = "✨ 动画 (备用)";
      widgetItem.isAnime = true;
      
      if (item.vote_average) {
        widgetItem.rating = item.vote_average.toFixed(1);
        widgetItem.ratingColor = item.vote_average >= 8.0 ? "#FFD700" : 
                                item.vote_average >= 7.0 ? "#90EE90" : 
                                item.vote_average >= 6.0 ? "#FFA500" : "#FF6B6B";
      }

      return widgetItem;
    }).filter(item => item.posterPath).slice(0, CONFIG.MAX_ITEMS);

    console.log("✅ 备用方案成功处理数据:", results.length, "条");
    return results;

  } catch (error) {
    console.error("❌ 动画备用数据加载失败:", error);
    console.log("🔄 使用本地备用数据...");
    return generateAnimeFallbackData();
  }
}

// 生成动画备用数据
function generateAnimeFallbackData() {
  console.log("🏠 生成本地动画备用数据...");
  
  const fallbackAnime = [
    {
      id: 1399,
      title: "进击的巨人",
      originalTitle: "Attack on Titan",
      overview: "人类为了对抗巨人而建造了三道城墙，但平静的生活被超大型巨人的出现打破...",
      posterPath: "/8C6T2Jq6r4SFvHXIM3ONt0JqPKq.jpg",
      backdropPath: "/8C6T2Jq6r4SFvHXIM3ONt0JqPKq.jpg",
      voteAverage: 9.0,
      voteCount: 5000,
      releaseDate: "2013-04-07",
      genreIds: [16, 28, 12],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "9.0",
      ratingColor: "#FFD700"
    },
    {
      id: 1396,
      title: "死亡笔记",
      originalTitle: "Death Note",
      overview: "天才高中生夜神月捡到一本名为\"死亡笔记\"的神秘笔记本，只要在上面写下名字就能杀死对方...",
      posterPath: "/iigTJJSkWpVk0mWckxYKrS8VfGV.jpg",
      backdropPath: "/iigTJJSkWpVk0mWckxYKrS8VfGV.jpg",
      voteAverage: 8.9,
      voteCount: 4500,
      releaseDate: "2006-10-03",
      genreIds: [16, 80, 9648],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.9",
      ratingColor: "#FFD700"
    },
    {
      id: 1398,
      title: "火影忍者",
      originalTitle: "Naruto",
      overview: "漩涡鸣人是一个孤独的少年，体内封印着九尾妖狐，他梦想成为火影...",
      posterPath: "/v6CumzCoMKZxQ5JEMlt0mnIQTJg.jpg",
      backdropPath: "/v6CumzCoMKZxQ5JEMlt0mnIQTJg.jpg",
      voteAverage: 8.3,
      voteCount: 3800,
      releaseDate: "2002-10-03",
      genreIds: [16, 28, 12],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.3",
      ratingColor: "#90EE90"
    },
    {
      id: 1397,
      title: "海贼王",
      originalTitle: "One Piece",
      overview: "蒙奇·D·路飞为了寻找传说中的宝藏\"One Piece\"而踏上冒险之旅...",
      posterPath: "/fcXdJlbSdUEeMSJFsXMsSzWbfbG.jpg",
      backdropPath: "/fcXdJlbSdUEeMSJFsXMsSzWbfbG.jpg",
      voteAverage: 8.7,
      voteCount: 4200,
      releaseDate: "1999-10-20",
      genreIds: [16, 28, 12],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.7",
      ratingColor: "#90EE90"
    },
    {
      id: 1395,
      title: "龙珠",
      originalTitle: "Dragon Ball",
      overview: "孙悟空是一个拥有尾巴的少年，他与布尔玛一起寻找七颗龙珠...",
      posterPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      backdropPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      voteAverage: 8.2,
      voteCount: 3500,
      releaseDate: "1986-02-26",
      genreIds: [16, 28, 12],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.2",
      ratingColor: "#90EE90"
    },
    {
      id: 1394,
      title: "鬼灭之刃",
      originalTitle: "Demon Slayer",
      overview: "炭治郎为了拯救变成鬼的妹妹，踏上了斩鬼之旅...",
      posterPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      backdropPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      voteAverage: 8.5,
      voteCount: 4000,
      releaseDate: "2019-04-06",
      genreIds: [16, 28, 12],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.5",
      ratingColor: "#90EE90"
    },
    {
      id: 1393,
      title: "间谍过家家",
      originalTitle: "Spy x Family",
      overview: "为了维护世界和平，顶级间谍必须组建一个假家庭...",
      posterPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      backdropPath: "/3iFm6Kz9i08Y1yxyW6VRb76oNuP.jpg",
      voteAverage: 8.4,
      voteCount: 3500,
      releaseDate: "2022-04-09",
      genreIds: [16, 35, 10751],
      mediaType: "tv",
      type: "anime-fallback",
      source: "✨ 动画 (本地)",
      isAnime: true,
      rating: "8.4",
      ratingColor: "#90EE90"
    }
  ];

  const results = fallbackAnime.map(item => {
    const widgetItem = createWidgetItem(item);
    widgetItem.genreTitle = getGenreTitle(item.genreIds, "tv");
    widgetItem.type = item.type;
    widgetItem.source = item.source;
    widgetItem.isAnime = item.isAnime;
    widgetItem.rating = item.rating;
    widgetItem.ratingColor = item.ratingColor;
    
    if (item.releaseDate) {
      const date = new Date(item.releaseDate);
      if (!isNaN(date.getTime())) {
        widgetItem.airDate = item.releaseDate;
        widgetItem.airYear = date.getFullYear();
      }
    }

    return widgetItem;
  });

  console.log("✅ 本地动画数据生成完成:", results.length, "条");
  return results;
}

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

    console.log(`📦 加载TMDB背景图数据包: ${data_source}`);

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
      console.log("⚠️ 本地数据包不可用，回退到API获取...");
      
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

    console.log(`✅ 成功加载 ${results.length} 个背景图项目 (数据源: ${data_source}, 尺寸: ${backdrop_size})`);
    
    setCachedData(cacheKey, results);
    return results;

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
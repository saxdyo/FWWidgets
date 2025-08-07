var WidgetMetadata = {
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
            value: ["released","upcoming",""],
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
            value: ["released","upcoming",""],
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

    // TMDB预处理背景 (复制自热门内容模块)
    {
      title: "TMDB 预处理背景",
      description: "预处理数据背景图版本",
      requiresWebView: false,
      functionName: "loadTmdbTrending",
      cacheDuration: 3600,
      params: [
        {
          name: "content_type",
          title: "内容类型",
          type: "enumeration",
          description: "选择内容类型",
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
          name: "backup_content_type",
          title: "备用内容来源",
          type: "enumeration",
          description: "选择要获取的备用内容来源",
          value: "today",
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "today",
          enumOptions: [
            { title: "今日热门", value: "today" },
            { title: "本周热门", value: "week" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
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

    // IMDb动画模块
    {
      title: "IMDb 动画",
      description: "IMDb热门动画内容",
      requiresWebView: false,
      functionName: "loadImdbAnimeModule",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "地区选择",
          type: "enumeration",
          description: "选择动画制作地区",
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
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "时长↓", value: "duration.desc" },
            { title: "时长↑", value: "duration.asc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
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
            { title: "热度升序", value: "popularity_asc" },
            { title: "评分降序", value: "vote_average_desc" },
            { title: "评分升序", value: "vote_average_asc" },
            { title: "上映时间降序", value: "release_date_desc" },
            { title: "上映时间升序", value: "release_date_asc" }
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

    // 豆瓣风格片单（基于TMDB数据）
    {
      title: "豆瓣风格片单",
      description: "模拟豆瓣片单，使用TMDB数据源",
      requiresWebView: false,
      functionName: "loadDoubanStyleList",
      cacheDuration: 3600,
      params: [
        {
          name: "list_type",
          title: "片单类型",
          type: "enumeration",
          description: "选择片单类型",
          value: "hot_movies",
          enumOptions: [
            { title: "热门电影", value: "hot_movies" },
            { title: "高分电影", value: "top_movies" },
            { title: "热门剧集", value: "hot_tv" },
            { title: "高分剧集", value: "top_tv" },
            { title: "国产热门剧集", value: "chinese_hot_tv" },
            { title: "最新电影", value: "latest_movies" },
            { title: "最新剧集", value: "latest_tv" },
            { title: "动作大片", value: "action_movies" },
            { title: "爱情片", value: "romance_movies" },
            { title: "喜剧片", value: "comedy_movies" },
            { title: "科幻片", value: "scifi_movies" },
            { title: "动画片", value: "animation" },
            { title: "纪录片", value: "documentary" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    // 4. IMDb影视榜单模块加载 (改为使用TMDB API)
    {
      title: "IMDb 影视榜单",
      description: "IMDb热门影视内容",
      requiresWebView: false,
      functionName: "loadImdbMovieListModule",
      cacheDuration: 3600,
      params: [
        {
          name: "region",
          title: "地区选择",
          type: "enumeration",
          description: "选择影视内容地区",
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
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "热门度↑", value: "popularity.asc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "评分↑", value: "vote_average.asc" },
            { title: "上映时间↓", value: "release_date.desc" },
            { title: "上映时间↑", value: "release_date.asc" },
            { title: "年份↓", value: "year.desc" },
            { title: "年份↑", value: "year.asc" },
            { title: "标题A-Z", value: "title.asc" },
            { title: "标题Z-A", value: "title.desc" },
            { title: "时长↓", value: "duration.desc" },
            { title: "时长↑", value: "duration.asc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "选择影视内容类型",
          value: "all",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" },
            { title: "动画", value: "anime" }
          ]
        }
      ]
    }
  ]
};

// 配置常量
var CONFIG = {
  API_KEY: "f3ae69ddca232b56265600eb919d46ab", // TMDB API密钥
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟缓存
  NETWORK_TIMEOUT: 10000, // 10秒超时
  MAX_ITEMS: 20, // 最大返回项目数
  
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
  IMAGE_CDN_FALLBACK: true // 图片CDN失败时回退到原始URL
};

// 缓存管理
var cache = new Map();

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
        console.log(`🌐 尝试CDN: ${cdnName} - ${url}`);
        
        const response = await Widget.http.get(url, {
          ...options,
          timeout: CONFIG.CDN_TIMEOUT
        });
        
        const responseTime = Date.now() - startTime;
        CDNStats.recordPerformance(cdnName, responseTime, true);
        console.log(`✅ CDN成功: ${cdnName} (${responseTime}ms)`);
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

// 智能缓存管理工具函数
function getCachedData(key) {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }
  
  const now = Date.now();
  const age = now - cached.timestamp;
  
  // 检查是否需要自动刷新
  if (shouldAutoRefresh(key, age)) {
    console.log(`🔄 自动刷新缓存: ${key}`);
    return null; // 触发新数据获取
  }
  
  // 使用缓存数据
  if (age < CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  
  return null;
}

function setCachedData(key, data) {
  cache.set(key, {
    data: data,
    timestamp: Date.now(),
    accessCount: (cache.get(key)?.accessCount || 0) + 1
  });
}

// 自动刷新策略（ForwardWidget优化版）
function shouldAutoRefresh(key, age) {
  const cached = cache.get(key);
  if (!cached) return false;
  
  // 策略1: 基于访问频率 - 热门数据更频繁刷新
  const accessCount = cached.accessCount || 0;
  if (accessCount > 3 && age > CONFIG.CACHE_DURATION * 0.6) { // 降低门槛
    return true;
  }
  
  // 策略2: 基于数据类型 - 热门内容更频繁刷新
  if (key.includes('trending') && age > 20 * 60 * 1000) { // 20分钟，更保守
    return true;
  }
  
  // 策略3: 基于缓存总量 - 避免内存过载（主要策略）
  if (cache.size > 15 && age > CONFIG.CACHE_DURATION * 0.7) {
    return true;
  }
  
  // 策略4: 简单的随机刷新 - 避免所有缓存同时过期
  if (age > CONFIG.CACHE_DURATION * 0.8 && Math.random() < 0.3) {
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
async function fetchTmdbData(api, params) {
    const data = await Widget.tmdb.get(api, { params: params });

    return data.results
        .filter((item) => {
            return item.poster_path &&
                   item.id &&
                   (item.title || item.name) &&
                   (item.title || item.name).trim().length > 0;
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
}

// 主要功能函数

// 1. TMDB热门内容加载
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "today", page = 1, language = "zh-CN", use_preprocessed_data = "true" } = params;
  
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
  
  // 根据数据来源类型选择加载方式
  if (use_preprocessed_data === "api") {
    return loadTmdbTrendingWithAPI(updatedParams);
  }
  
  // 默认使用预处理数据
  return loadTmdbTrendingFromPreprocessed(updatedParams);
}

// 使用正常TMDB API加载热门内容
async function loadTmdbTrendingWithAPI(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_api_${content_type}_${media_type}_${sort_by}_${page}`;
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
      page
    };

    if (with_origin_country) {
      queryParams.region = with_origin_country;
    }

    console.log(`🌐 使用TMDB API请求: ${endpoint}`);
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
    
    setCachedData(cacheKey, results);
    console.log(`✅ TMDB API加载成功: ${results.length}项`);
    return results;

  } catch (error) {
    console.error("TMDB API加载失败:", error);
    console.log("🔄 回退到预处理数据");
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

// 按照您代码中的实现方式，添加一些辅助函数
async function loadTodayGlobalMedia(params = {}) {
  return loadTmdbTrendingFromPreprocessed({ ...params, content_type: "today" });
}

async function loadWeekGlobalMovies(params = {}) {
  return loadTmdbTrendingFromPreprocessed({ ...params, content_type: "week" });
}

async function tmdbPopularMovies(params = {}) {
  return loadTmdbTrendingFromPreprocessed({ ...params, content_type: "popular" });
}



// 新增的模块辅助函数（已在上方定义）

// 3. IMDb动画模块加载
async function loadImdbAnimeModule(params = {}) {
  const { region = "all", sort_by = "popularity.desc", page = "1" } = params;
  
  try {
    console.log(`🎬 [DEBUG] 开始加载IMDb动画模块`);
    console.log(`🎬 [DEBUG] 参数: region=${region}, sort_by=${sort_by}, page=${page}`);
    
    const cacheKey = `imdb_anime_${region}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log(`🎬 [DEBUG] 使用缓存数据: ${cached.length}项`);
      return cached;
    }

    console.log(`🎬 加载IMDb动画模块数据 (地区: ${region}, 排序: ${sort_by}, 页码: ${page})`);

    // 构建请求URL - 使用原始IMDb数据源
    const GITHUB_OWNER = "opix-maker"; // 原始数据源
    const GITHUB_REPO = "Forward"; // 原始仓库
    const GITHUB_BRANCH = "main"; // 主分支
    const DATA_PATH = "imdb-data-platform/dist"; // 原始数据路径
    
    const baseUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_PATH}`;
    const cleanRegion = region.replace(':', '_');
    console.log(`🎬 [DEBUG] 清理后的地区: ${cleanRegion}`);
    
    // 映射排序方式到数据文件键
    const sortMapping = {
      'popularity.desc': 'hs',
      'popularity.asc': 'hs',
      'vote_average.desc': 'r',
      'vote_average.asc': 'r',
      'duration.desc': 'd',
      'duration.asc': 'd'
    };
    
    const sortKey = sortMapping[sort_by] || 'hs';
    console.log(`🎬 [DEBUG] 排序键: ${sort_by} -> ${sortKey}`);
    
    const fullPath = `anime/${cleanRegion}/by_${sortKey}/page_${page}.json`;
    const requestUrl = `${baseUrl}/${fullPath}?cache_buster=${Math.floor(Date.now() / (1000 * 60 * 30))}`;

    console.log(`🌐 请求URL: ${requestUrl}`);

    // 检查Widget.http是否可用
    if (!Widget || !Widget.http || typeof Widget.http.get !== 'function') {
      console.error(`❌ [DEBUG] Widget.http 不可用`);
      console.error(`❌ [DEBUG] Widget:`, Widget);
      return [];
    }

    console.log(`🎬 [DEBUG] 发起网络请求...`);
    // 发起网络请求
    const response = await Widget.http.get(requestUrl, { 
      timeout: 15000, 
      headers: {'User-Agent': 'ForwardWidget/IMDb-v2'} 
    });

    console.log(`🎬 [DEBUG] 请求完成，状态码: ${response ? response.statusCode : 'N/A'}`);
    console.log(`🎬 [DEBUG] 响应数据类型: ${response && response.data ? typeof response.data : 'N/A'}`);

    if (!response || response.statusCode !== 200 || !response.data) {
      console.error(`❌ IMDb动画数据加载失败: Status ${response ? response.statusCode : 'N/A'}`);
      if (response && response.data) {
        console.error(`❌ [DEBUG] 响应数据:`, response.data);
      }
      return [];
    }

    // 处理数据
    console.log(`🎬 [DEBUG] 开始处理响应数据`);
    const rawData = Array.isArray(response.data) ? response.data : [];
    console.log(`🎬 [DEBUG] 原始数据类型: ${Array.isArray(response.data) ? '数组' : typeof response.data}`);
    console.log(`🎬 [DEBUG] 原始数据长度: ${rawData.length}`);
    
    if (rawData.length === 0) {
      console.warn(`⚠️ [DEBUG] 原始数据为空`);
      return [];
    }
    
    console.log(`🎬 [DEBUG] 第一个项目示例:`, rawData[0]);
    
    // 动态排序函数
    function sortData(data, sortBy) {
      // 基础排序类型，数据已经预排序
      if (['popularity.desc', 'vote_average.desc', 'duration.desc'].includes(sortBy)) {
        return data;
      }
      
      const sortedData = [...data];
      
      switch (sortBy) {
        case 'popularity.asc': // 热度升序
          sortedData.sort((a, b) => (a.hs || 0) - (b.hs || 0));
          break;
          
        case 'vote_average.asc': // 评分升序
          sortedData.sort((a, b) => (a.r || 0) - (b.r || 0));
          break;
          
        case 'duration.asc': // 时长升序
          sortedData.sort((a, b) => (a.d || 0) - (b.d || 0));
          break;
          
        default:
          // 默认排序，保持原顺序
          break;
      }
      
      return sortedData;
    }
    
    // 应用排序
    const sortedData = sortData(rawData, sort_by);
    console.log(`🎬 [DEBUG] 排序后数据长度: ${sortedData.length}`);
    
    const widgetItems = sortedData.map((item, index) => {
      if (index < 3) {
        console.log(`🎬 [DEBUG] 处理第${index + 1}个项目:`, item);
      }
      if (!item || typeof item.id === 'undefined' || item.id === null) return null;
      
      // 智能海报处理 - 使用统一的海报获取函数
      const posterUrl = getOptimalPosterUrl(item, 'tv');
      const backdropUrl = item.b ? `https://image.tmdb.org/t/p/w780${item.b.startsWith('/') ? item.b : '/' + item.b}` : "";
      
      // 处理发布日期
      const releaseDate = item.rd ? item.rd : (item.y ? `${String(item.y)}-01-01` : '');

      return {
        id: String(item.id),
        type: "tmdb",
        title: item.t || '未知标题',
        description: item.o || '',
        releaseDate: releaseDate,
        posterPath: posterUrl,
        backdropPath: backdropUrl,
        coverUrl: posterUrl,
        rating: typeof item.r === 'number' ? item.r.toFixed(1) : '0.0',
        mediaType: 'tv', // 动画归类为TV类型
        genreTitle: "动画",
        popularity: item.hs || 0,
        voteCount: 0,
        link: null,
        duration: item.d || 0,
        durationText: item.d ? `${Math.floor(item.d / 60)}分钟` : "",
        episode: item.ep || 0,
        childItems: [],
        // 添加IMDB特有字段
        imdbData: {
          year: item.y,
          releaseDate: item.rd,
          popularity: item.hs,
          duration: item.d,
          episodes: item.ep
        }
      };
    }).filter(Boolean);

    console.log(`🎬 [DEBUG] 过滤后的items数量: ${widgetItems.length}`);
    if (widgetItems.length > 0) {
      console.log(`🎬 [DEBUG] 第一个最终item:`, widgetItems[0]);
    }

    setCachedData(cacheKey, widgetItems);
    console.log(`✅ IMDb动画模块加载成功: ${widgetItems.length}项`);
    return widgetItems;
    
  } catch (error) {
    console.error("❌ [DEBUG] IMDb动画模块加载失败:", error);
    console.error("❌ [DEBUG] 错误堆栈:", error.stack);
    console.error("❌ [DEBUG] 错误类型:", error.name);
    console.error("❌ [DEBUG] 错误消息:", error.message);
    return [];
  }
}

// 豆瓣国产剧集专用函数
async function loadDoubanChineseTVList(params = {}) {
  const { page = 1 } = params;
  
  try {
    const cacheKey = `douban_chinese_tv_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`🎭 开始加载豆瓣国产剧集数据: 页码 ${page}`);
    
    const start = (page - 1) * 18; // 豆瓣每页18条数据
    const doubanAPI = `https://m.douban.com/rexxar/api/v2/subject_collection/tv_domestic/items`;
    
    console.log(`🌐 请求豆瓣API: ${doubanAPI}`);
    
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

    console.log(`📊 豆瓣API返回 ${response.subject_collection_items.length} 条数据`);

    // 转换豆瓣数据为标准格式
    const results = response.subject_collection_items.map(item => {
      const title = item.title;
      const year = item.year || "";
      const genres = item.genres || [];
      const genreText = genres.slice(0, 2).join("•");
      const description = genreText + (year ? ` (${year})` : "");

      // 智能海报处理
      const posterUrl = getOptimalPosterUrl(item, "tv");

      return {
        id: String(item.id),
        type: "douban_real", // 标记为真实豆瓣数据
        title: title,
        description: description,
        rating: item.rating && item.rating.value ? Number(item.rating.value.toFixed(1)) : 0,
        releaseDate: year + "-01-01", // 豆瓣只提供年份
        posterPath: posterUrl,
        backdropPath: item.pic && item.pic.normal ? item.pic.normal : "",
        genreTitle: genreText,
        mediaType: "tv",
        year: year,
        // 豆瓣特有字段
        doubanId: item.id,
        doubanURL: item.uri || item.url
      };
    }).filter(item => item.title && item.title.trim().length > 0);

    console.log(`✅ 豆瓣国产剧集加载成功: ${results.length}项`);
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("❌ 豆瓣国产剧集加载失败:", error);
    console.error("❌ 错误详情:", error.message);
    console.error("❌ 错误堆栈:", error.stack);
    
    // 如果豆瓣API失败，回退到TMDB
    console.log("🔄 回退到TMDB API获取中国剧集");
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

// 豆瓣风格片单加载（基于TMDB数据）
async function loadDoubanStyleList(params = {}) {
  const { list_type = "hot_movies", page = 1 } = params;
  
  try {
    const cacheKey = `douban_style_${list_type}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`🎭 开始加载豆瓣风格片单: ${list_type}, 页码: ${page}`);

    let endpoint = "";
    let params_obj = {
      language: "zh-CN",
      page: page,
      region: "CN"
    };

    // 根据片单类型选择不同的TMDB API端点
    switch (list_type) {
      case "hot_movies":
        endpoint = "/movie/popular";
        break;
      case "top_movies":
        endpoint = "/movie/top_rated";
        params_obj["vote_count.gte"] = 1000; // 需要足够投票数
        break;
      case "hot_tv":
        endpoint = "/tv/popular";
        break;
      case "top_tv":
        endpoint = "/tv/top_rated";
        params_obj["vote_count.gte"] = 500;
        break;
      case "chinese_hot_tv":
        // 直接使用豆瓣API获取国产剧集数据
        return await loadDoubanChineseTVList(params);
        break;
      case "latest_movies":
        endpoint = "/movie/now_playing";
        break;
      case "latest_tv":
        endpoint = "/tv/on_the_air";
        break;
      case "action_movies":
        endpoint = "/discover/movie";
        params_obj.with_genres = 28; // 动作类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      case "romance_movies":
        endpoint = "/discover/movie";
        params_obj.with_genres = 10749; // 爱情类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      case "comedy_movies":
        endpoint = "/discover/movie";
        params_obj.with_genres = 35; // 喜剧类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      case "scifi_movies":
        endpoint = "/discover/movie";
        params_obj.with_genres = 878; // 科幻类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      case "animation":
        endpoint = "/discover/movie";
        params_obj.with_genres = 16; // 动画类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      case "documentary":
        endpoint = "/discover/movie";
        params_obj.with_genres = 99; // 纪录片类型ID
        params_obj.sort_by = "popularity.desc";
        break;
      default:
        endpoint = "/movie/popular";
    }

    console.log(`🌐 请求TMDB API: ${endpoint}`);

    // 请求TMDB数据
    console.log(`🌐 请求参数:`, params_obj);
    const response = await Widget.tmdb.get(endpoint, { params: params_obj });

    if (!response || !response.results) {
      console.error("❌ TMDB API响应异常");
      console.error("❌ 响应对象:", response);
      return [];
    }

    console.log(`📊 TMDB API返回 ${response.results.length} 条数据`);

    // 转换为豆瓣风格的数据格式
    const results = response.results.map(item => {
      const isMovie = !!item.title; // 有title字段的是电影，有name字段的是电视剧
      const mediaType = isMovie ? "movie" : "tv";
      const title = item.title || item.name;
      const releaseDate = item.release_date || item.first_air_date;
      const year = releaseDate ? releaseDate.substring(0, 4) : "";
      
      // 使用现有的getGenreTitle函数生成类型标签
      const genreIds = item.genre_ids || [];
      const genreTitle = getGenreTitle(genreIds, mediaType);
      
      // 豆瓣风格的描述
      const description = genreTitle + (year ? ` (${year})` : "");

      // 智能海报处理
      const posterUrl = getOptimalPosterUrl(item, mediaType);

      return {
        id: String(item.id),
        type: "douban_tmdb", // 标记为豆瓣风格但使用TMDB数据
        title: title,
        description: description,
        rating: Number(item.vote_average?.toFixed(1)) || 0,
        releaseDate: releaseDate || "",
        posterPath: posterUrl,
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
        genreTitle: genreTitle,
        mediaType: mediaType,
        // 豆瓣风格的额外字段
        year: year
      };
    }).filter(item => item.title && item.title.trim().length > 0);

    console.log(`✅ 豆瓣风格片单加载成功: ${results.length}项`);
    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("❌ 豆瓣风格片单加载失败:", error);
    console.error("❌ 错误详情:", error.message);
    console.error("❌ 错误堆栈:", error.stack);
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
    console.log(`🧹 清理了 ${cleanedCount} 个缓存项`);
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
    setInterval(() => {
      cleanupCache();
      
      // 简单的状态检查
      if (cache.size > 25) {
        console.log("⚠️ 缓存过多，执行深度清理");
        // 强制清理一半最老的缓存
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toDelete = entries.slice(0, Math.floor(entries.length / 2));
        toDelete.forEach(([key]) => cache.delete(key));
      }
    }, 10 * 60 * 1000); // 10分钟
    
    console.log("✅ 智能缓存已启动");
  } catch (error) {
    console.log("⚠️ 使用基础缓存模式");
    setInterval(cleanupCache, 15 * 60 * 1000); // 15分钟备用清理
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
    console.log("📊 CDN性能统计:");
    Object.keys(this.providers).forEach(provider => {
      const stats = this.providers[provider];
      const successRate = ((stats.successes / stats.requests) * 100).toFixed(1);
      console.log(`  ${provider}: ${stats.requests}次请求, ${successRate}%成功率, 平均${Math.round(stats.avgTime)}ms`);
    });
    
    const best = this.getBestProvider();
    if (best) {
      console.log(`🏆 最佳CDN: ${best}`);
    }
  }
};

// 初始化CDN优化系统
function initializeCDN() {
  if (CONFIG.ENABLE_CDN_OPTIMIZATION) {
    console.log("🌐 CDN优化系统已启用");
    console.log(`📊 CDN提供商: ${CONFIG.CDN_PROVIDERS.join(", ")}`);
    console.log(`🖼️ 图片优化: ${CONFIG.IMAGE_CDN_ENABLED ? "启用" : "禁用"} (${CONFIG.IMAGE_QUALITY})`);
    
    // 每10分钟输出CDN统计
    setInterval(() => {
      CDNStats.getStats();
    }, 10 * 60 * 1000);
  } else {
    console.log("🌐 CDN优化已禁用，使用原始URL");
  }
}

// 立即初始化CDN系统
initializeCDN();

// 新增功能函数

// 1. TMDB播出平台
async function tmdbDiscoverByNetwork(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        with_networks: params.with_networks,
        sort_by: params.sort_by || "first_air_date.desc",
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
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
    
    const widgetItems = await Promise.all(res.results.map(async item => {
      // 为项目显式设置media_type，因为discover端点不返回此字段
      item.media_type = media_type;
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, media_type);
      return widgetItem;
    }));
    
    const results = widgetItems.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    return results;

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

    console.log(`🎭 加载TMDB主题分类: ${theme}`);

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
      include_adult: false,
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

    console.log("📊 主题分类查询参数:", queryParams);

    const res = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });

    console.log(`📊 获取到主题分类数据: ${res.results ? res.results.length : 0} 条`);

    if (!res.results || res.results.length === 0) {
      console.log("⚠️ 未获取到主题分类数据，尝试备用方案...");
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

    console.log(`✅ 成功处理主题分类数据: ${results.length} 条`);

    setCachedData(cacheKey, results);
    return results;

  } catch (error) {
    console.error("❌ TMDB主题分类加载失败:", error);
    return await loadThemeFallback(params);
  }
}

// 主题分类备用数据获取函数
async function loadThemeFallback(params = {}) {
  const { theme = "action", media_type = "all", sort_by = "popularity_desc", min_rating = "0", year = "", page = 1 } = params;
  
  try {
    console.log("🔄 尝试主题分类备用数据获取...");
    
    // 使用更简单的查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      sort_by: "popularity.desc",
      vote_count_gte: 10,
      include_adult: false
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

    console.log("🔄 备用主题查询参数:", queryParams);

    const res = await Widget.tmdb.get("/discover/movie", {
      params: queryParams
    });

    console.log("📊 备用方案获取到数据:", res.results ? res.results.length : 0, "条");

    if (!res.results || res.results.length === 0) {
      console.log("⚠️ 备用方案也无数据，使用本地数据...");
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

    console.log("✅ 备用方案成功处理数据:", results.length, "条");
    return results;

  } catch (error) {
    console.error("❌ 主题分类备用数据加载失败:", error);
    console.log("🔄 使用本地备用数据...");
    return generateThemeFallbackData(theme);
  }
}

// 生成主题分类备用数据
function generateThemeFallbackData(theme) {
  console.log(`🏠 生成本地主题分类备用数据: ${theme}`);
  
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

  console.log(`✅ 本地主题分类数据生成完成: ${results.length} 条`);
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

// ==================== 新增模块加载函数 ====================



// 4. IMDb影视榜单模块加载 (改为使用TMDB API)
async function loadImdbMovieListModule(params = {}) {
  const { 
    region = "all", 
    sort_by = "popularity.desc", 
    page = "1",
    media_type = "all"
  } = params;
  
  try {
    const cacheKey = `tmdb_movie_list_${region}_${sort_by}_${page}_${media_type}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`🎬 加载影视榜单数据 (地区: ${region}, 排序: ${sort_by}, 媒体类型: ${media_type}, 页码: ${page})`);

    let endpoint = "/discover/movie";
    const queryParams = {
      language: "zh-CN",
      page: parseInt(page),
      sort_by: sort_by,
      vote_count_gte: 50
    };

    // 根据媒体类型选择端点
    if (media_type === "tv") {
      endpoint = "/discover/tv";
    } else if (media_type === "anime") {
      endpoint = "/discover/tv";
      queryParams.with_genres = "16"; // 动画类型
    }

    // 处理地区参数
    if (region && region !== "all") {
      const regionMap = {
        "country:cn": "CN",
        "country:us": "US", 
        "country:gb": "GB",
        "country:jp": "JP",
        "country:kr": "KR",
        "country:hk": "HK",
        "country:tw": "TW",
        "region:us-eu": "US,GB,FR,DE,ES,IT"
      };
      
      const mappedRegion = regionMap[region] || region;
      if (endpoint === "/discover/movie") {
        queryParams.with_origin_country = mappedRegion;
      } else {
        queryParams.with_origin_country = mappedRegion;
      }
    }

    const response = await Widget.tmdb.get(endpoint, {
      params: queryParams
    });

    if (!response || !response.results) {
      console.error("❌ TMDB API响应无效");
      return [];
    }

    const widgetItems = await Promise.all(response.results.map(async item => {
      // 为项目显式设置media_type，因为discover端点不返回此字段
      const itemMediaType = endpoint.includes("tv") ? "tv" : "movie";
      item.media_type = itemMediaType;
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, itemMediaType);
      return widgetItem;
    }));

    const results = widgetItems.slice(0, CONFIG.MAX_ITEMS);
    
    setCachedData(cacheKey, results);
    console.log(`✅ 影视榜单加载成功: ${results.length}项`);
    return results;
    
  } catch (error) {
    console.error("影视榜单加载失败:", error);
    return [];
  }
}

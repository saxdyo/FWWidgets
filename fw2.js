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
            { title: "今日热门剧集", value: "popular_tv" },
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
            { title: "上映时间↓", value: "release_date.desc" },
            { title: "上映时间↑", value: "release_date.asc" },
            { title: "年份↓", value: "year.desc" },
            { title: "年份↑", value: "year.asc" },
            { title: "标题A-Z", value: "title.asc" },
            { title: "标题Z-A", value: "title.desc" },
            { title: "剧集数↓", value: "episodes.desc" },
            { title: "剧集数↑", value: "episodes.asc" },
            { title: "时长↓", value: "duration.desc" },
            { title: "时长↑", value: "duration.asc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
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

    // 4. IMDb影视榜单模块加载
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
const CONFIG = {
  API_KEY: "f3ae69ddca232b56265600eb919d46ab", // 请替换为您的TMDB API密钥
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
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "zh-CN", use_preprocessed_data = "true" } = params;
  
  // 根据数据来源类型选择加载方式
  if (use_preprocessed_data === "api") {
    return loadTmdbTrendingWithAPI(params);
  }
  
  // 默认使用预处理数据
  return loadTmdbTrendingFromPreprocessed(params);
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
      case "popular_tv":
        endpoint = "/tv/popular";
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
      const widgetItem = createWidgetItem(item);
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

// 从预处理数据加载TMDB热门内容（包含title_backdrop字段）
async function loadTmdbTrendingFromPreprocessed(params = {}) {
  const { content_type = "today", media_type = "all" } = params;
  
  try {
    const cacheKey = `preprocessed_trending_${content_type}_${media_type}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 从您的TMDB数据源加载数据
    const response = await Widget.http.get("https://raw.githubusercontent.com/saxdyo/FWWidgets/main/data/TMDB_Trending.json");
    const data = response.data;
    
    let results = [];
    
    // 将对象格式转换为数组
    let allItems = [];
    for (let key in data) {
      if (key !== 'last_updated' && data[key]) {
        allItems.push(data[key]);
      }
    }
    
    // 根据内容类型过滤数据
    switch (content_type) {
      case "today":
      case "week":
        // 使用所有数据作为今日/本周热门
        results = allItems;
        break;
      case "popular":
        // 过滤出电影
        results = allItems.filter(item => item.type === 'movie');
        break;
      case "popular_tv":
        // 过滤出剧集
        results = allItems.filter(item => item.type === 'tv');
        break;
      default:
        results = allItems;
    }
    
    // 使用CDN优化的WidgetItem格式转换
    const widgetItems = await Promise.all(results.map(async (item) => {
      // 构建优化的图片URL
      const buildImageUrls = (posterPath, backdropPath) => {
        const baseUrl = "https://image.tmdb.org/t/p/";
        // 使用更可靠的图片尺寸
        const posterUrl = posterPath ? `${baseUrl}original${posterPath}` : null;
        const backdropUrl = backdropPath ? `${baseUrl}original${backdropPath}` : null;
        
        return {
          posterPath: posterUrl,
          coverUrl: posterUrl,
          backdropPath: backdropUrl,
          backdropUrls: backdropUrl ? [backdropUrl] : []
        };
      };
      
      // 检查预处理数据中的URL格式
      let posterPath = null;
      let backdropPath = null;
      
      // 处理海报URL
      if (item.poster_url) {
        if (item.poster_url.startsWith('https://image.tmdb.org/')) {
          // 已经是完整URL，提取文件名
          posterPath = item.poster_url.split('/').pop();
        } else {
          // 只是文件名
          posterPath = item.poster_url;
        }
      }
      
      // 处理背景图URL
      if (item.title_backdrop) {
        if (item.title_backdrop.startsWith('https://image.tmdb.org/')) {
          // 已经是完整URL，提取文件名
          backdropPath = item.title_backdrop.split('/').pop();
        } else {
          // 只是文件名
          backdropPath = item.title_backdrop;
        }
      }
      
      const imageUrls = buildImageUrls(posterPath, backdropPath);
      
      const widgetItem = {
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: imageUrls.posterPath,
        coverUrl: imageUrls.coverUrl,
        backdropPath: imageUrls.backdropPath,
        backdropUrls: imageUrls.backdropUrls,
        title_backdrop: item.title_backdrop,
        rating: item.rating,
        mediaType: item.type,
        genreTitle: item.genreTitle,
        popularity: item.popularity || 0,
        voteCount: item.vote_count || 0,
        link: null,
        duration: 0,
        durationText: "",
        episode: 0,
        childItems: []
      };
      
      // 如果存在带logo的背景图，同时保存正常背景图作为备用
      if (item.title_backdrop && item.title_backdrop.includes('image-overlay.vercel.app')) {
        const normalBackdrop = item.title_backdrop.replace('https://image-overlay.vercel.app/api/backdrop?bg=', '').split('&')[0];
        widgetItem.normalBackdrop = normalBackdrop;
      }
      
      return widgetItem;
    }));
    
    setCachedData(cacheKey, widgetItems);
    return widgetItems;
    
  } catch (error) {
    console.error("预处理TMDB数据加载失败:", error);
    // 如果预处理数据加载失败，返回空数组
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

async function tmdbPopularTVShows(params = {}) {
  return loadTmdbTrendingFromPreprocessed({ ...params, content_type: "popular_tv" });
}

// 新增的模块辅助函数（已在上方定义）

// 3. IMDb动画模块加载
async function loadImdbAnimeModule(params = {}) {
  const { region = "all", sort_by = "popularity.desc", page = "1" } = params;
  
  try {
    const cacheKey = `imdb_anime_${region}_${sort_by}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`🎬 加载IMDb动画模块数据 (地区: ${region}, 排序: ${sort_by}, 页码: ${page})`);

    // 构建请求URL - 使用原始IMDb数据源
    const GITHUB_OWNER = "opix-maker"; // 原始数据源
    const GITHUB_REPO = "Forward"; // 原始仓库
    const GITHUB_BRANCH = "main"; // 主分支
    const DATA_PATH = "imdb-data-platform/dist"; // 原始数据路径
    
    const baseUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_PATH}`;
    const cleanRegion = region.replace(':', '_');
    
    // 映射排序方式到数据文件键
    const sortMapping = {
      'popularity.desc': 'hs',
      'popularity.asc': 'hs',
      'vote_average.desc': 'r',
      'vote_average.asc': 'r',
      'release_date.desc': 'rd',
      'release_date.asc': 'rd',
      'year.desc': 'y',
      'year.asc': 'y',
      'title.desc': 't',
      'title.asc': 't',
      'episodes.desc': 'ep',
      'episodes.asc': 'ep',
      'duration.desc': 'd',
      'duration.asc': 'd'
    };
    
    const sortKey = sortMapping[sort_by] || 'hs';
    const fullPath = `anime/${cleanRegion}/by_${sortKey}/page_${page}.json`;
    const requestUrl = `${baseUrl}/${fullPath}?cache_buster=${Math.floor(Date.now() / (1000 * 60 * 30))}`;

    console.log(`🌐 请求URL: ${requestUrl}`);

    // 发起网络请求
    const response = await Widget.http.get(requestUrl, { 
      timeout: 15000, 
      headers: {'User-Agent': 'ForwardWidget/IMDb-v2'} 
    });

    if (!response || response.statusCode !== 200 || !response.data) {
      console.error(`❌ IMDb动画数据加载失败: Status ${response ? response.statusCode : 'N/A'}`);
      return [];
    }

    // 处理数据
    const rawData = Array.isArray(response.data) ? response.data : [];
    
    // 动态排序函数
    function sortData(data, sortBy) {
      // 基础排序类型，数据已经预排序
      if (['popularity.desc', 'vote_average.desc', 'release_date.desc', 'year.desc', 'title.desc', 'episodes.desc', 'duration.desc'].includes(sortBy)) {
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
          
        case 'release_date.asc': // 上映时间升序
          sortedData.sort((a, b) => {
            const dateA = a.rd ? new Date(a.rd) : new Date(a.y + '-01-01');
            const dateB = b.rd ? new Date(b.rd) : new Date(b.y + '-01-01');
            return dateA - dateB;
          });
          break;
          
        case 'episodes.asc': // 剧集数升序
          sortedData.sort((a, b) => (a.ep || 0) - (b.ep || 0));
          break;
          
        case 'duration.asc': // 时长升序
          sortedData.sort((a, b) => (a.d || 0) - (b.d || 0));
          break;
          
        case 'title.asc': // 标题A-Z
          sortedData.sort((a, b) => (a.t || '').localeCompare(b.t || '', 'zh-CN'));
          break;
          
        case 'year.asc': // 年份升序
          sortedData.sort((a, b) => (a.y || 0) - (b.y || 0));
          break;
          
        default:
          // 默认排序，保持原顺序
          break;
      }
      
      return sortedData;
    }
    
    // 应用排序
    const sortedData = sortData(rawData, sort_by);
    
    const widgetItems = sortedData.map(item => {
      if (!item || typeof item.id === 'undefined' || item.id === null) return null;
      
      // 构建图片URL
      const posterUrl = item.p ? `https://image.tmdb.org/t/p/w500${item.p.startsWith('/') ? item.p : '/' + item.p}` : null;
      const backdropUrl = item.b ? `https://image.tmdb.org/t/p/w780${item.b.startsWith('/') ? item.b : '/' + item.b}` : null;
      
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

    setCachedData(cacheKey, widgetItems);
    console.log(`✅ IMDb动画模块加载成功: ${widgetItems.length}项`);
    return widgetItems;
    
  } catch (error) {
    console.error("IMDb动画模块加载失败:", error);
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

    const results = await Promise.all(res.results.map(async item => {
      const widgetItem = await createWidgetItem(item);
      widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
      return widgetItem;
    }));
    
    const finalResults = results.slice(0, CONFIG.MAX_ITEMS);
    
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
      const movieResults = await Promise.all(movieRes.results.map(async item => {
        const widgetItem = await createWidgetItem(item);
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, "movie");
        return widgetItem;
      }));
      
      const tvResults = await Promise.all(tvRes.results.map(async item => {
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
      
      const widgetItems = await Promise.all(res.results.map(async item => {
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
    
    const widgetItems = await Promise.all(res.results.map(async item => {
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
      api_key: CONFIG.API_KEY,
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
      api_key: CONFIG.API_KEY,
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



// 4. IMDb影视榜单模块加载
async function loadImdbMovieListModule(params = {}) {
  const { 
    region = "all", 
    sort_by = "popularity.desc", 
    page = "1",
    media_type = "all" // 新增媒体类型参数
  } = params;
  
  try {
    const cacheKey = `imdb_movie_list_${region}_${sort_by}_${page}_${media_type}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    console.log(`🎬 加载IMDb影视榜单数据 (地区: ${region}, 排序: ${sort_by}, 媒体类型: ${media_type}, 页码: ${page})`);

    // 构建请求URL - 使用IMDb数据源
    const GITHUB_OWNER = "opix-maker";
    const GITHUB_REPO = "Forward";
    const GITHUB_BRANCH = "main";
    const DATA_PATH = "imdb-data-platform/dist";
    
    const baseUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${DATA_PATH}`;
    const cleanRegion = region.replace(':', '_');
    
    // 映射排序方式到数据文件键
    const sortMapping = {
      'popularity.desc': 'hs',
      'popularity.asc': 'hs',
      'vote_average.desc': 'r',
      'vote_average.asc': 'r',
      'release_date.desc': 'rd',
      'release_date.asc': 'rd',
      'year.desc': 'y',
      'year.asc': 'y',
      'title.desc': 't',
      'title.asc': 't',
      'duration.desc': 'd',
      'duration.asc': 'd'
    };
    
    const sortKey = sortMapping[sort_by] || 'hs';
    
    // 根据媒体类型选择数据路径
    let dataPaths = [];
    if (media_type === 'movie') {
      dataPaths = [`movies/${cleanRegion}/by_${sortKey}/page_${page}.json`];
    } else if (media_type === 'tv') {
      // 剧集数据不可用，使用动画数据作为替代
      dataPaths = [`anime/${cleanRegion}/by_${sortKey}/page_${page}.json`];
    } else if (media_type === 'anime') {
      dataPaths = [`anime/${cleanRegion}/by_${sortKey}/page_${page}.json`];
    } else {
      // 混合数据 - 获取电影和动画数据
      dataPaths = [
        `movies/${cleanRegion}/by_${sortKey}/page_${page}.json`,
        `anime/${cleanRegion}/by_${sortKey}/page_${page}.json`
      ];
    }
    
    let allData = [];
    
    // 尝试获取所有可用的数据源
    for (const dataPath of dataPaths) {
      const requestUrl = `${baseUrl}/${dataPath}?cache_buster=${Math.floor(Date.now() / (1000 * 60 * 30))}`;
      console.log(`🌐 尝试请求URL: ${requestUrl}`);

      try {
        const response = await Widget.http.get(requestUrl, { 
          timeout: 15000, 
          headers: {'User-Agent': 'ForwardWidget/IMDb-v2'} 
        });

        if (response && response.statusCode === 200 && response.data) {
          const rawData = Array.isArray(response.data) ? response.data : [];
          console.log(`✅ 成功获取数据: ${dataPath} (${rawData.length}项)`);
          allData = allData.concat(rawData);
        } else {
          console.log(`⚠️ 数据获取失败: ${dataPath} (Status: ${response ? response.statusCode : 'N/A'})`);
        }
      } catch (error) {
        console.log(`❌ 请求失败: ${dataPath} - ${error.message}`);
      }
    }
    
    if (allData.length === 0) {
      console.error(`❌ 所有数据源都无法获取数据`);
      return [];
    }

    // 动态排序函数
    function sortData(data, sortBy) {
      // 基础排序类型，数据已经预排序
      if (['popularity.desc', 'vote_average.desc', 'release_date.desc', 'year.desc', 'title.desc', 'duration.desc'].includes(sortBy)) {
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
          
        case 'release_date.asc': // 上映时间升序
          sortedData.sort((a, b) => {
            const dateA = a.rd ? new Date(a.rd) : new Date(a.y + '-01-01');
            const dateB = b.rd ? new Date(b.rd) : new Date(b.y + '-01-01');
            return dateA - dateB;
          });
          break;
          
        case 'duration.asc': // 时长升序
          sortedData.sort((a, b) => (a.d || 0) - (b.d || 0));
          break;
          
        case 'title.asc': // 标题A-Z
          sortedData.sort((a, b) => (a.t || '').localeCompare(b.t || '', 'zh-CN'));
          break;
          
        case 'year.asc': // 年份升序
          sortedData.sort((a, b) => (a.y || 0) - (b.y || 0));
          break;
          
        default:
          // 默认排序，保持原顺序
          break;
      }
      
      return sortedData;
    }
    
    // 应用排序
    const sortedData = sortData(allData, sort_by);
    
    const widgetItems = sortedData.map(item => {
      if (!item || typeof item.id === 'undefined' || item.id === null) return null;
      
      // 构建图片URL
      const posterUrl = item.p ? `https://image.tmdb.org/t/p/w500${item.p.startsWith('/') ? item.p : '/' + item.p}` : null;
      const backdropUrl = item.b ? `https://image.tmdb.org/t/p/w780${item.b.startsWith('/') ? item.b : '/' + item.b}` : null;
      
      // 处理发布日期
      const releaseDate = item.rd ? item.rd : (item.y ? `${String(item.y)}-01-01` : '');
      
      // 确定媒体类型
      const itemMediaType = item.mt || (item.ep ? 'tv' : 'movie');
      const genreTitle = getGenreTitleForMediaType(itemMediaType);

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
        mediaType: itemMediaType,
        genreTitle: genreTitle,
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
          episodes: item.ep,
          mediaType: itemMediaType
        }
      };
    }).filter(Boolean);

    setCachedData(cacheKey, widgetItems);
    console.log(`✅ IMDb影视榜单加载成功: ${widgetItems.length}项`);
    return widgetItems;
    
  } catch (error) {
    console.error("IMDb影视榜单加载失败:", error);
    return [];
  }
}

// 辅助函数：根据媒体类型获取分类标题
function getGenreTitleForMediaType(mediaType) {
  switch (mediaType) {
    case 'movie':
      return "电影";
    case 'tv':
      return "剧集";
    case 'anime':
      return "动画";
    default:
      return "影视";
  }
}



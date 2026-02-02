var WidgetMetadata = {
  id: "ultimate_media_hub_mega",
  title: "TMDB",
  description: "TMDB + Trakt",
  author: "sax",
  site: "https://github.com/saxdyo/FWWidgets",
  version: "3.0.2",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  
  globalParams: [
    {
      name: "traktClientId",
      title: "Trakt Client ID (选填)",
      type: "input",
      description: "Trakt 功能专用，不填则使用默认 ID",
      value: ""
    },
    {
      name: "traktUser",
      title: " Trakt 用户名 (追剧日历)",
      type: "input",
      value: "",
      placeholder: "可选：如需 Trakt 追剧功能，请填写用户名"
    }
  ],
  
  modules: [
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
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "Apple TV+", value: "2552" },
            { title: "Amazon Prime", value: "1024" },
            { title: "Hulu", value: "453" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" }
          ]
        },
        {
          name: "with_genres",
          title: "内容类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "悬疑", value: "9648" },
            { title: "纪录片", value: "99" },
            { title: "科幻与奇幻", value: "10765" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" },
            { title: "全部", value: "" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    
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
          value: "",
          enumOptions: [
            { title: "全部", value: "" },
            { title: "漫威影业", value: "420" },
            { title: "华特迪士尼", value: "2" },
            { title: "华纳兄弟", value: "174" },
            { title: "索尼影业", value: "5" },
            { title: "环球影业", value: "33" },
            { title: "派拉蒙影业", value: "4" },
            { title: "Netflix", value: "11073" },
            { title: "Amazon Studios", value: "20580" }
          ]
        },
        {
          name: "type",
          title: "内容类型",
          type: "enumeration",
          value: "movie",
          enumOptions: [
            { title: "全部类型", value: "all" },
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "上映日期↓", value: "release_date.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    
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
          name: "with_genres",
          title: "内容类型",
          type: "enumeration",
          value: "",
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "剧情", value: "18" },
            { title: "喜剧", value: "35" },
            { title: "犯罪", value: "80" },
            { title: "动作", value: "28" },
            { title: "科幻", value: "878" },
            { title: "悬疑", value: "9648" }
          ]
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          value: "popularity.desc",
          enumOptions: [
            { title: "热门度↓", value: "popularity.desc" },
            { title: "评分↓", value: "vote_average.desc" },
            { title: "最新上映↓", value: "release_date.desc" }
          ]
        },
        {
          name: "vote_average_gte",
          title: "最低评分",
          type: "enumeration",
          value: "0",
          enumOptions: [
            { title: "无要求", value: "0" },
            { title: "7.0分以上", value: "7.0" },
            { title: "8.0分以上", value: "8.0" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },

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
            { title: "纪录片", value: "documentary" }
          ]
        },
        {
          name: "media_type",
          title: "媒体类型",
          type: "enumeration",
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
          value: "popularity.desc",
          enumOptions: [
            { title: "热度降序", value: "popularity.desc" },
            { title: "评分降序", value: "vote_average.desc" },
            { title: "上映时间降序", value: "release_date.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    
    {
      title: "全球热榜聚合",
      description: "聚合Trakt、豆瓣、B站、Bangumi等权威榜单",
      requiresWebView: false,
      functionName: "loadTrendHub",
      cacheDuration: 3600,
      params: [
        {
          name: "sort_by",
          title: "数据源榜单",
          type: "enumeration",
          value: "trakt_trending",
          enumOptions: [
            { title: "Trakt - 实时热播", value: "trakt_trending" },
            { title: "豆瓣 - 热门国产剧", value: "db_tv_cn" },
            { title: "豆瓣 - 热门电影", value: "db_movie" },
            { title: "B站 - 番剧热播", value: "bili_bgm" },
            { title: "Bangumi - 每日放送", value: "bgm_daily" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    {
      title: "Trakt 追剧日历",
      description: "个人追剧日历、待看列表、收藏记录",
      requiresWebView: false,
      functionName: "loadTraktProfile",
      cacheDuration: 300,
      params: [
        {
          name: "section",
          title: "浏览区域",
          type: "enumeration",
          value: "updates",
          enumOptions: [
            { title: "追剧日历", value: "updates" },
            { title: "待看列表", value: "watchlist" },
            { title: "收藏列表", value: "collection" }
          ]
        },
        {
          name: "type",
          title: "内容筛选",
          type: "enumeration",
          value: "all",
          belongTo: { paramName: "section", value: ["watchlist", "collection"] },
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "剧集", value: "shows" },
            { title: "电影", value: "movies" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    },

    {
      title: "动漫权威榜单",
      description: "AniList、MAL等动漫权威榜单",
      requiresWebView: false,
      functionName: "loadAnimeRanking",
      cacheDuration: 7200,
      params: [
        {
          name: "sort_by",
          title: "榜单源选择",
          type: "enumeration",
          value: "anilist_trending",
          enumOptions: [
            { title: "AniList - 近期趋势榜", value: "anilist_trending" },
            { title: "AniList - 评分最高榜", value: "anilist_score" },
            { title: "MAL - 当前热播榜", value: "mal_airing" },
            { title: "MAL - 最佳剧场版", value: "mal_movie" }
          ]
        },
        { name: "page", title: "页码", type: "page" }
      ]
    }
  ]
};

// ==================== 精简配置 ====================
const CONFIG = {
  CACHE_DURATION: 30 * 60 * 1000,
  MAX_ITEMS: 20,
  DEFAULT_TRAKT_ID: "f47aba7aa7ccfebfb782c9b8497f95e4b2fe4a5de73e80d5bc033bde93233fc5"
};

// ==================== 统一类型映射 ====================
const GENRE_MAP = {
  28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
  18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
  9648: "悬疑", 10749: "爱情", 878: "科幻", 53: "惊悚", 10752: "战争", 37: "西部",
  10759: "动作冒险", 10762: "儿童", 10763: "新闻", 10764: "真人秀", 
  10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀", 10768: "战争政治"
};

// ==================== 缓存管理（精简版） ====================
const cache = new Map();

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > CONFIG.CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

// ==================== 工具函数 ====================
function getGenreText(ids, mediaType) {
  if (!ids || !Array.isArray(ids)) return "";
  const names = ids.map(id => GENRE_MAP[id]).filter(Boolean);
  return names.slice(0, 2).join("•");
}

function cleanTitle(title) {
  if (!title) return "";
  return title.replace(/第[一二三四五六七八九十\d]+[季章]/g, "")
              .replace(/Season \d+/gi, "")
              .replace(/Part \d+/gi, "")
              .trim();
}

function buildItem({ id, tmdbId, type, title, year, poster, backdrop, rating, genreText, subTitle, desc }) {
  return {
    id: String(id || tmdbId),
    tmdbId: parseInt(tmdbId) || 0,
    type: "tmdb",
    mediaType: type || "tv",
    title: title || "未知标题",
    genreTitle: [year, genreText].filter(Boolean).join(" • "),
    subTitle: subTitle || "",
    posterPath: poster ? `https://image.tmdb.org/t/p/w500${poster}` : "",
    backdropPath: backdrop ? `https://image.tmdb.org/t/p/w780${backdrop}` : "",
    description: desc || "",
    rating: rating ? Number(rating).toFixed(1) : "0.0"
  };
}

// ==================== 核心数据获取 ====================
async function fetchTmdbList(endpoint, params, mediaType) {
  try {
    const res = await Widget.tmdb.get(endpoint, { params });
    return (res.results || [])
      .filter(item => item.poster_path && (item.title || item.name))
      .map(item => {
        const mType = mediaType || item.media_type || (item.title ? "movie" : "tv");
        return buildItem({
          id: item.id,
          tmdbId: item.id,
          type: mType,
          title: item.title || item.name,
          year: (item.release_date || item.first_air_date || "").substring(0, 4),
          poster: item.poster_path,
          backdrop: item.backdrop_path,
          rating: item.vote_average,
          genreText: getGenreText(item.genre_ids, mType),
          desc: item.overview
        });
      });
  } catch (e) {
    console.error(`TMDB请求失败 ${endpoint}:`, e.message);
    return [];
  }
}

// ==================== 模块函数（精简优化版） ====================

// 1. 热门内容 - 移除预处理数据依赖，直接使用API
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "zh-CN" } = params;
  
  const cacheKey = `trend_${content_type}_${media_type}_${page}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  let results = [];
  
  // 构建查询
  if (content_type === "today" || content_type === "week") {
    const timeWindow = content_type === "today" ? "day" : "week";
    if (media_type === "all") {
      const [movies, tvs] = await Promise.all([
        fetchTmdbList(`/trending/movie/${timeWindow}`, { language, page }, "movie"),
        fetchTmdbList(`/trending/tv/${timeWindow}`, { language, page }, "tv")
      ]);
      results = [...movies, ...tvs].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else {
      results = await fetchTmdbList(`/trending/${media_type}/${timeWindow}`, { language, page }, media_type);
    }
  } else {
    // popular 或 top_rated
    if (media_type === "all") {
      const [movies, tvs] = await Promise.all([
        fetchTmdbList(`/${content_type === "popular" ? "movie/popular" : "movie/top_rated"}`, { language, page, region: with_origin_country }, "movie"),
        fetchTmdbList(`/${content_type === "popular" ? "tv/popular" : "tv/top_rated"}`, { language, page }, "tv")
      ]);
      results = [...movies, ...tvs];
    } else {
      const endpoint = content_type === "popular" ? `/${media_type}/popular` : `/${media_type}/top_rated`;
      results = await fetchTmdbList(endpoint, { language, page, region: with_origin_country }, media_type);
    }
  }

  // 评分过滤
  if (vote_average_gte !== "0") {
    results = results.filter(item => parseFloat(item.rating) >= parseFloat(vote_average_gte));
  }

  // 本地排序
  if (sort_by === "rating") {
    results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (sort_by === "release_date") {
    results.sort((a, b) => (b.year || "0").localeCompare(a.year || "0"));
  }

  results = results.slice(0, CONFIG.MAX_ITEMS);
  setCache(cacheKey, results);
  return results;
}

// 2. 播出平台
async function tmdbDiscoverByNetwork(params = {}) {
  const { with_networks, with_genres, air_status = "released", sort_by = "first_air_date.desc", page = 1, language = "zh-CN" } = params;
  
  const today = new Date().toISOString().split('T')[0];
  const queryParams = {
    language,
    page,
    sort_by,
    include_adult: false,
    ...(with_networks && { with_networks }),
    ...(with_genres && { with_genres }),
    ...(air_status === 'released' ? { "first_air_date.lte": today } : air_status === 'upcoming' ? { "first_air_date.gte": today } : {})
  };

  return await fetchTmdbList("/discover/tv", queryParams, "tv");
}

// 3. 出品公司
async function loadTmdbByCompany(params = {}) {
  const { with_companies, type = "movie", sort_by = "popularity.desc", page = 1, language = "zh-CN" } = params;
  
  if (type === "all") {
    const [movies, tvs] = await Promise.all([
      fetchTmdbList("/discover/movie", { language, page, sort_by, ...(with_companies && { with_companies }) }, "movie"),
      fetchTmdbList("/discover/tv", { language, page, sort_by, ...(with_companies && { with_companies }) }, "tv")
    ]);
    return [...movies, ...tvs].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, CONFIG.MAX_ITEMS);
  }
  
  return await fetchTmdbList(`/discover/${type}`, { language, page, sort_by, ...(with_companies && { with_companies }) }, type);
}

// 4. 影视榜单
async function loadTmdbMediaRanking(params = {}) {
  const { media_type = "tv", with_origin_country, with_genres, sort_by = "popularity.desc", vote_average_gte = "0", page = 1, language = "zh-CN" } = params;
  
  const queryParams = {
    language,
    page,
    sort_by,
    include_adult: false,
    vote_count_gte: media_type === "movie" ? 200 : 100,
    ...(with_origin_country && { with_origin_country }),
    ...(with_genres && { with_genres }),
    ...(vote_average_gte !== "0" && { vote_average_gte })
  };

  // 修正排序字段
  if (media_type === "movie" && sort_by.includes("first_air_date")) {
    queryParams.sort_by = sort_by.replace("first_air_date", "release_date");
  } else if (media_type === "tv" && sort_by.includes("release_date")) {
    queryParams.sort_by = sort_by.replace("release_date", "first_air_date");
  }

  return await fetchTmdbList(`/discover/${media_type}`, queryParams, media_type);
}

// 5. 主题分类（简化版）
async function loadTmdbByTheme(params = {}) {
  const { theme = "action", media_type = "all", sort_by = "popularity.desc", page = 1 } = params;
  
  const themeGenres = {
    action: { movie: "28,12", tv: "10759" },
    sci_fi: { movie: "878,14", tv: "10765" },
    thriller: { movie: "53,9648", tv: "9648" },
    romance: { movie: "10749", tv: "10749" },
    comedy: { movie: "35", tv: "35" },
    horror: { movie: "27", tv: "27" },
    war_history: { movie: "10752,36", tv: "10768" },
    family: { movie: "10751", tv: "10751" },
    documentary: { movie: "99", tv: "99" }
  };

  const genres = themeGenres[theme];
  if (!genres) return [];

  const queryParams = {
    language: "zh-CN",
    page,
    sort_by,
    include_adult: false,
    vote_count_gte: 20
  };

  if (media_type === "all") {
    const [movies, tvs] = await Promise.all([
      fetchTmdbList("/discover/movie", { ...queryParams, with_genres: genres.movie }, "movie"),
      fetchTmdbList("/discover/tv", { ...queryParams, with_genres: genres.tv }, "tv")
    ]);
    return [...movies, ...tvs].slice(0, CONFIG.MAX_ITEMS);
  }

  const genreId = media_type === "movie" ? genres.movie : genres.tv;
  return await fetchTmdbList(`/discover/${media_type}`, { ...queryParams, with_genres: genreId }, media_type);
}

// ==================== 聚合与第三方 ====================

async function loadTrendHub(params = {}) {
  const { sort_by = "trakt_trending", page = 1 } = params;
  
  if (sort_by.startsWith("trakt_")) {
    return await loadTraktTrending(sort_by.replace("trakt_", ""), page);
  } else if (sort_by.startsWith("db_")) {
    return await loadDoubanList(sort_by, page);
  } else if (sort_by.startsWith("bili_")) {
    return await loadBilibili(sort_by === "bili_cn" ? 4 : 1, page);
  } else if (sort_by === "bgm_daily") {
    return await loadBangumiDaily();
  }
  return [];
}

async function loadTraktTrending(listType, page) {
  try {
    const res = await Widget.http.get(`https://api.trakt.tv/movies/${listType}?limit=20&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": CONFIG.DEFAULT_TRAKT_ID
      }
    });
    
    const items = res.data || [];
    const promises = items.slice(0, 10).map(async (item, index) => {
      if (!item.movie?.ids?.tmdb) return null;
      const detail = await fetchTmdbDetail(item.movie.ids.tmdb, "movie");
      if (detail) {
        detail.subTitle = listType === "trending" ? `🔥 ${item.watchers} 人在看` : `No.${(page-1)*20+index+1}`;
      }
      return detail;
    });
    
    return (await Promise.all(promises)).filter(Boolean);
  } catch (e) {
    return [];
  }
}

async function loadDoubanList(sortBy, page) {
  const map = {
    "db_tv_cn": "tv_domestic",
    "db_movie": "movie_weekly_best"
  };
  
  try {
    const res = await Widget.http.get(`https://m.douban.com/rexxar/api/v2/subject_collection/${map[sortBy]}/items`, {
      params: { start: (page-1)*20, count: 20 },
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
        "Referer": "https://m.douban.com/"
      }
    });
    
    return (res.data?.subject_collection_items || []).map((item, i) => ({
      id: `db_${item.id}`,
      type: "douban",
      title: `${(page-1)*20+i+1}. ${item.title}`,
      posterPath: item.cover?.url || "",
      rating: item.rating?.value || 0,
      genreTitle: (item.genres || []).slice(0,2).join("•"),
      description: item.card_subtitle || ""
    }));
  } catch (e) {
    return [];
  }
}

async function loadBilibili(seasonType, page) {
  try {
    const res = await Widget.http.get(`https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${seasonType}`, {
      headers: { "Referer": "https://www.bilibili.com/" }
    });
    
    const list = (res.data?.result?.list || []).slice((page-1)*15, page*15);
    return list.map((item, i) => ({
      id: `bili_${i}`,
      type: "bilibili",
      title: `${(page-1)*15+i+1}. ${item.title}`,
      posterPath: item.cover,
      subTitle: item.new_ep?.index_show || ""
    }));
  } catch (e) {
    return [];
  }
}

async function loadBangumiDaily() {
  try {
    const res = await Widget.http.get("https://api.bgm.tv/calendar");
    const dayId = new Date().getDay() || 7;
    const items = res.data?.find(d => d.weekday.id === dayId)?.items || [];
    
    return items.slice(0, 15).map(item => ({
      id: `bgm_${item.id}`,
      type: "bangumi",
      title: item.name_cn || item.name,
      posterPath: item.images?.large || ""
    }));
  } catch (e) {
    return [];
  }
}

// ==================== Trakt功能 ====================
async function loadTraktProfile(params = {}) {
  const { traktUser, section, type = "all", page = 1 } = params;
  
  if (!traktUser) {
    return [{ id: "prompt", type: "text", title: "请设置Trakt用户名" }];
  }
  
  try {
    if (section === "updates") {
      return await loadTraktUpdates(traktUser, page);
    }
    
    const items = await fetchTraktUserList(traktUser, section, type, page);
    const promises = items.map(async item => {
      const subject = item.show || item.movie;
      if (!subject?.ids?.tmdb) return null;
      return await fetchTmdbDetail(subject.ids.tmdb, item.show ? "tv" : "movie");
    });
    
    return (await Promise.all(promises)).filter(Boolean);
  } catch (e) {
    return [{ id: "err", type: "text", title: "Trakt获取失败" }];
  }
}

async function loadTraktUpdates(user, page) {
  try {
    const res = await Widget.http.get(`https://api.trakt.tv/users/${user}/watched/shows`, {
      headers: {
        "trakt-api-version": "2",
        "trakt-api-key": CONFIG.DEFAULT_TRAKT_ID
      }
    });
    
    const shows = res.data || [];
    const enriched = await Promise.all(shows.slice(0, 30).map(async item => {
      if (!item.show?.ids?.tmdb) return null;
      const detail = await Widget.tmdb.get(`/tv/${item.show.ids.tmdb}`, { params: { language: "zh-CN" } });
      if (!detail) return null;
      
      const nextEp = detail.next_episode_to_air;
      const lastEp = detail.last_episode_to_air;
      const ep = nextEp || lastEp;
      
      return {
        id: String(detail.id),
        tmdbId: detail.id,
        type: "tmdb",
        mediaType: "tv",
        title: detail.name,
        posterPath: detail.poster_path ? `https://image.tmdb.org/t/p/w500${detail.poster_path}` : "",
        genreTitle: ep ? `${ep.air_date || ""} S${ep.season_number}E${ep.episode_number}` : "暂无更新",
        description: detail.overview || ""
      };
    }));
    
    return enriched.filter(Boolean).slice((page-1)*15, page*15);
  } catch (e) {
    return [];
  }
}

async function fetchTraktUserList(user, section, type, page) {
  if (type === "all") {
    const [movies, shows] = await Promise.all([
      fetchTraktList(user, section, "movies", page),
      fetchTraktList(user, section, "shows", page)
    ]);
    return [...movies, ...shows];
  }
  return await fetchTraktList(user, section, type, page);
}

async function fetchTraktList(user, section, type, page) {
  try {
    const res = await Widget.http.get(`https://api.trakt.tv/users/${user}/${section}/${type}?page=${page}&limit=20`, {
      headers: {
        "trakt-api-version": "2",
        "trakt-api-key": CONFIG.DEFAULT_TRAKT_ID
      }
    });
    return res.data || [];
  } catch (e) {
    return [];
  }
}

// ==================== 动漫榜单 ====================
async function loadAnimeRanking(params = {}) {
  const { sort_by = "anilist_trending", page = 1 } = params;
  
  if (sort_by.startsWith("anilist_")) {
    return await loadAniList(sort_by.replace("anilist_", ""), page);
  } else if (sort_by.startsWith("mal_")) {
    return await loadMAL(sort_by.replace("mal_", ""), page);
  }
  return [];
}

async function loadAniList(sort, page) {
  const sortMap = { trending: "TRENDING_DESC", score: "SCORE_DESC" };
  const query = `query($p:Int){Page(page:$p,perPage:20){media(sort:${sortMap[sort]||"TRENDING_DESC"},type:ANIME){title{native}coverImage{large}averageScore}}}`;
  
  try {
    const res = await Widget.http.post("https://graphql.anilist.co", { query, variables: { p: page } });
    const media = res.data?.data?.Page?.media || [];
    
    return await Promise.all(media.map(async m => {
      const search = await searchTmdb(m.title.native, "tv");
      if (!search) return null;
      return buildItem({
        id: search.id,
        tmdbId: search.id,
        type: "tv",
        title: search.name || m.title.native,
        poster: search.poster_path,
        rating: (m.averageScore / 10).toFixed(1),
        genreText: "动画",
        subTitle: `AniList ${(m.averageScore/10).toFixed(1)}`
      });
    })).then(arr => arr.filter(Boolean));
  } catch (e) {
    return [];
  }
}

async function loadMAL(filter, page) {
  try {
    const res = await Widget.http.get(`https://api.jikan.moe/v4/top/anime`, {
      params: { page, filter: filter === "movie" ? undefined : filter, type: filter === "movie" ? "movie" : undefined }
    });
    
    return await Promise.all((res.data?.data || []).slice(0, 10).map(async item => {
      const search = await searchTmdb(item.title_japanese || item.title, item.type === "Movie" ? "movie" : "tv");
      if (!search) return null;
      return buildItem({
        id: search.id,
        tmdbId: search.id,
        type: item.type === "Movie" ? "movie" : "tv",
        title: search.name || item.title,
        poster: search.poster_path,
        rating: item.score,
        genreText: "动画",
        subTitle: `MAL ${item.score}`
      });
    })).then(arr => arr.filter(Boolean));
  } catch (e) {
    return [];
  }
}

// ==================== 搜索辅助 ====================
async function searchTmdb(query, type = "multi") {
  if (!query) return null;
  try {
    const endpoint = type === "multi" ? "/search/multi" : `/search/${type}`;
    const res = await Widget.tmdb.get(endpoint, { params: { query: cleanTitle(query), language: "zh-CN" } });
    return (res.results || []).find(r => r.poster_path) || res.results?.[0];
  } catch (e) {
    return null;
  }
}

async function fetchTmdbDetail(id, type) {
  try {
    const d = await Widget.tmdb.get(`/${type}/${id}`, { params: { language: "zh-CN" } });
    return buildItem({
      id: d.id,
      tmdbId: d.id,
      type,
      title: d.name || d.title,
      year: (d.first_air_date || d.release_date || "").substring(0, 4),
      poster: d.poster_path,
      backdrop: d.backdrop_path,
      rating: d.vote_average,
      genreText: getGenreText(d.genres?.map(g => g.id) || [], type),
      desc: d.overview
    });
  } catch (e) {
    return null;
  }
}

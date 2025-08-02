// ========== Enhanced TMDB Widget with Title Poster Support ==========
// 增强版TMDB小组件，支持标题海报功能
// 基于原始fw2.js，添加标题海报和Python数据包集成

WidgetMetadata = {
  id: "tmdb.enhanced.widget.v2",
  title: "增强版TMDB影视榜单",
  description: "支持标题海报的TMDB影视榜单小组件",
  author: "TMDB Background Crawler",
  site: "https://github.com/your-repo/tmdb-crawler",
  version: "2.1.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // TMDB标题海报热门
    {
      title: "TMDB 标题海报热门",
      description: "显示带有片名的热门电影背景图",
      requiresWebView: false,
      functionName: "loadTmdbTitlePosters",
      cacheDuration: 3600,
      params: [
        {
          name: "display_mode",
          title: "显示模式",
          type: "enumeration",
          description: "选择海报显示模式",
          value: "title_poster",
          enumOptions: [
            { title: "标题海报", value: "title_poster" },
            { title: "普通海报", value: "poster" },
            { title: "背景图", value: "backdrop" }
          ]
        },
        {
          name: "category",
          title: "内容分类",
          type: "enumeration",
          description: "选择内容分类",
          value: "trending",
          enumOptions: [
            { title: "今日热门", value: "trending" },
            { title: "热门电影", value: "popular" },
            { title: "高分内容", value: "top_rated" }
          ]
        },
        {
          name: "max_items",
          title: "显示数量",
          type: "enumeration",
          description: "设置显示项目数量",
          value: "10",
          enumOptions: [
            { title: "5个", value: "5" },
            { title: "10个", value: "10" },
            { title: "15个", value: "15" },
            { title: "20个", value: "20" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },

    // 原有的TMDB热门内容（兼容）
    {
      title: "TMDB 热门内容",
      description: "标准的TMDB热门内容",
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
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    }
  ]
};

// 配置常量
const CONFIG = {
  // GitHub数据源配置
  GITHUB_DATA_SOURCES: [
    "https://raw.githubusercontent.com/your-username/your-repo/main/data/TMDB_Trending.json",
    "https://raw.githubusercontent.com/your-username/your-repo/main/data/TMDB_Popular.json", 
    "https://raw.githubusercontent.com/your-username/your-repo/main/data/TMDB_TopRated.json"
  ],
  
  // 缓存配置
  CACHE_DURATION: 30 * 60 * 1000, // 30分钟
  NETWORK_TIMEOUT: 15000, // 15秒超时
  MAX_ITEMS: 20,
  
  // TMDB API配置
  API_KEY: "your_tmdb_api_key_here", // 需要替换为实际的API密钥
  
  // 标题海报配置
  TITLE_POSTER_CONFIG: {
    enable_overlay: true,
    font_size: 28,
    font_color: "white",
    shadow_color: "rgba(0,0,0,0.8)",
    title_position: "bottom_left",
    include_rating: true,
    include_year: true
  }
};

// 缓存管理器
class EnhancedCache {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new EnhancedCache();

// 数据获取管理器
class DataFetcher {
  
  static async fetchFromGitHub(category = "trending") {
    const sourceMap = {
      "trending": 0,
      "popular": 1, 
      "top_rated": 2
    };
    
    const sourceIndex = sourceMap[category] || 0;
    const url = CONFIG.GITHUB_DATA_SOURCES[sourceIndex];
    
    try {
      const response = await Widget.http.get(url, {
        timeout: CONFIG.NETWORK_TIMEOUT,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Enhanced-TMDB-Widget/2.1'
        }
      });
      
      if (response && response.data) {
        return this.parseGitHubData(response.data, category);
      }
      
      return null;
    } catch (error) {
      console.log(`GitHub数据获取失败 (${category}): ${error.message}`);
      return null;
    }
  }
  
  static parseGitHubData(data, category) {
    try {
      // 解析Python脚本生成的数据格式
      if (data.categories && data.categories[category]) {
        return data.categories[category].items || [];
      }
      
      // 兼容旧格式
      if (Array.isArray(data)) {
        return data;
      }
      
      return [];
    } catch (error) {
      console.log(`数据解析失败: ${error.message}`);
      return [];
    }
  }
  
  static async fetchFromTMDB(endpoint, params = {}) {
    try {
      const queryParams = {
        ...params,
        api_key: CONFIG.API_KEY,
        language: params.language || "zh-CN"
      };
      
      const response = await Widget.tmdb.get(endpoint, { params: queryParams });
      return response.results || [];
    } catch (error) {
      console.log(`TMDB API请求失败: ${error.message}`);
      return [];
    }
  }
}

// 数据处理器
class DataProcessor {
  
  static createWidgetItem(item) {
    return {
      id: item.id?.toString() || "",
      type: "tmdb",
      title: item.title || item.name || "未知标题",
      genreTitle: item.genreTitle || "",
      rating: parseFloat(item.rating || item.vote_average || 0),
      description: item.description || item.overview || "",
      releaseDate: item.releaseDate || item.release_date || item.first_air_date || "",
      posterPath: item.posterPath || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ""),
      coverUrl: item.coverUrl || item.posterPath || (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ""),
      backdropPath: item.backdropPath || (item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : ""),
      titlePosterPath: item.titlePosterPath || "", // 标题海报路径
      mediaType: item.mediaType || item.media_type || "movie",
      popularity: parseFloat(item.popularity || 0),
      voteCount: parseInt(item.voteCount || item.vote_count || 0),
      link: null,
      duration: 0,
      durationText: "",
      episode: 0,
      childItems: []
    };
  }
  
  static processItems(items, displayMode = "poster", maxItems = 10) {
    if (!Array.isArray(items)) return [];
    
    return items
      .map(item => this.createWidgetItem(item))
      .filter(item => {
        // 根据显示模式过滤
        switch (displayMode) {
          case "title_poster":
            return item.titlePosterPath || item.backdropPath;
          case "backdrop":
            return item.backdropPath;
          default:
            return item.posterPath || item.coverUrl;
        }
      })
      .slice(0, parseInt(maxItems))
      .map(item => {
        // 根据显示模式调整图片URL
        if (displayMode === "title_poster" && item.titlePosterPath) {
          item.coverUrl = item.titlePosterPath;
        } else if (displayMode === "backdrop" && item.backdropPath) {
          item.coverUrl = item.backdropPath;
        }
        return item;
      });
  }
}

// 主要功能函数

// 新增：标题海报热门内容
async function loadTmdbTitlePosters(params = {}) {
  const { 
    display_mode = "title_poster", 
    category = "trending", 
    max_items = "10",
    language = "zh-CN" 
  } = params;
  
  try {
    const cacheKey = `title_posters_${category}_${display_mode}_${max_items}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    // 首先尝试从GitHub获取数据
    let items = await DataFetcher.fetchFromGitHub(category);
    
    // 如果GitHub数据不可用，回退到TMDB API
    if (!items || items.length === 0) {
      console.log("GitHub数据不可用，使用TMDB API");
      items = await loadTmdbTrendingFallback(category, language);
    }
    
    // 处理数据
    const processedItems = DataProcessor.processItems(items, display_mode, max_items);
    
    // 添加标题海报特有的元数据
    const result = processedItems.map(item => ({
      ...item,
      displayMode: display_mode,
      hasTitlePoster: !!item.titlePosterPath,
      dataSource: items.length > 0 ? "GitHub" : "TMDB_API"
    }));
    
    cache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error("加载标题海报内容失败:", error);
    return [];
  }
}

// 兼容原有的热门内容函数
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_${content_type}_${media_type}_${page}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    let endpoint, queryParams;
    
    switch (content_type) {
      case "today":
        endpoint = media_type === "tv" ? "/trending/tv/day" : 
                  media_type === "movie" ? "/trending/movie/day" : "/trending/all/day";
        break;
      case "week":
        endpoint = media_type === "tv" ? "/trending/tv/week" : 
                  media_type === "movie" ? "/trending/movie/week" : "/trending/all/week";
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

    const items = await DataFetcher.fetchFromTMDB(endpoint, { language, page });
    const processedItems = DataProcessor.processItems(items, "poster", CONFIG.MAX_ITEMS);
    
    cache.set(cacheKey, processedItems);
    return processedItems;

  } catch (error) {
    console.error("TMDB热门内容加载失败:", error);
    return [];
  }
}

// 回退函数：当GitHub数据不可用时使用
async function loadTmdbTrendingFallback(category, language = "zh-CN") {
  const endpoints = {
    "trending": "/trending/all/day",
    "popular": "/movie/popular", 
    "top_rated": "/movie/top_rated"
  };
  
  const endpoint = endpoints[category] || endpoints["trending"];
  return await DataFetcher.fetchFromTMDB(endpoint, { language });
}

// 工具函数
function getGenreTitle(genreIds, mediaType) {
  // 简化的类型映射
  const TMDB_GENRES = {
    movie: {
      28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪",
      18: "剧情", 10751: "家庭", 14: "奇幻", 27: "恐怖", 9648: "悬疑",
      10749: "爱情", 878: "科幻", 53: "惊悚", 10752: "战争"
    },
    tv: {
      10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪",
      18: "剧情", 10751: "家庭", 9648: "悬疑", 10765: "科幻奇幻"
    }
  };
  
  if (!genreIds || !Array.isArray(genreIds)) return "";
  const genres = TMDB_GENRES[mediaType] || {};
  const genreNames = genreIds.slice(0, 2).map(id => genres[id]).filter(Boolean);
  return genreNames.join("•");
}

// 清理过期缓存
function cleanupCache() {
  // 实现缓存清理逻辑
  cache.clear();
}

// 定期清理缓存
setInterval(cleanupCache, 10 * 60 * 1000); // 每10分钟清理一次

// 初始化
console.log("Enhanced TMDB Widget v2.1 已加载");
console.log("支持功能: 标题海报、GitHub数据源、增强缓存");
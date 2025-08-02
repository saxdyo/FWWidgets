// Logo数据集成模块
// 将爬取的logo背景图数据集成到fw2.js模块中

// 从本地数据文件加载logo数据
async function loadLogoDataFromFile() {
  try {
    // 尝试从本地文件加载logo数据
    const logoDataPath = './data/logo_backdrops.json';
    const response = await fetch(logoDataPath);
    if (response.ok) {
      const data = await response.json();
      return processLogoData(data);
    }
  } catch (error) {
    console.warn('无法从本地文件加载logo数据:', error);
  }
  
  // 如果本地文件不可用，返回默认映射
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

// 获取默认logo映射
function getDefaultLogoMapping() {
  return {
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

// 增强的createWidgetItem函数，支持动态logo数据
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

// 从TMDB数据文件加载带logo的数据
async function loadTmdbDataWithLogos() {
  try {
    const tmdbDataPath = './data/TMDB_Trending_with_logos.json';
    const response = await fetch(tmdbDataPath);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('无法从本地文件加载TMDB数据:', error);
  }
  return null;
}

// 增强的TMDB热门内容加载函数
async function loadTmdbTrendingWithLogos(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", page = 1, language = "zh-CN" } = params;
  
  try {
    const cacheKey = `trending_with_logos_${content_type}_${media_type}_${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // 首先尝试从本地数据文件加载
    const localData = await loadTmdbDataWithLogos();
    if (localData && localData[`${content_type}_global`]) {
      let results = localData[`${content_type}_global`];
      
      // 应用过滤条件
      if (media_type !== "all") {
        results = results.filter(item => item.type === media_type);
      }
      
      if (vote_average_gte !== "0") {
        const minRating = parseFloat(vote_average_gte);
        results = results.filter(item => item.rating >= minRating);
      }
      
      results = results.slice(0, CONFIG.MAX_ITEMS);
      setCachedData(cacheKey, results);
      return results;
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

// 导出函数供fw2.js使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadLogoDataFromFile,
    createWidgetItemWithDynamicLogo,
    loadTmdbDataWithLogos,
    loadTmdbTrendingWithLogos,
    processLogoData,
    getDefaultLogoMapping
  };
}
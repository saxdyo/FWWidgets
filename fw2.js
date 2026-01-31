// 在文件开头添加一个全局序号管理器
const itemCounter = {
  counter: 0,
  
  // 重置计数器
  reset: function() {
    this.counter = 0;
  },
  
  // 获取下一个序号
  next: function() {
    this.counter++;
    return this.counter;
  },
  
  // 格式化序号（如：01, 02, ...）
  formatted: function() {
    const num = this.next();
    return num < 10 ? `0${num}` : `${num}`;
  }
};

// 修改 createWidgetItem 函数，添加序号功能
function createWidgetItem(item, options = {}) {
  // 根据媒体类型选择正确的日期字段
  let releaseDate = "";
  if (item.media_type === "tv" || item.first_air_date) {
    releaseDate = item.first_air_date || "";
  } else {
    releaseDate = item.release_date || "";
  }

  // 智能海报处理 - 优先获取英语海报
  const posterUrl = getOptimalPosterUrl(item, item.media_type || "movie");
  
  // 获取序号（如果有）
  let itemIndex = options.index || 0;
  let formattedIndex = "";
  
  if (options.showIndex) {
    if (options.startIndex !== undefined) {
      itemIndex = options.startIndex + (options.index || 0);
    }
    formattedIndex = itemIndex < 10 ? `0${itemIndex}` : `${itemIndex}`;
  }

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
    childItems: [],
    // 新增序号字段
    index: formattedIndex,
    hasIndex: options.showIndex || false
  };
}

// 为热门内容模块创建不使用CDN优化的widgetItem (保持原始逻辑)
function createWidgetItemWithoutCDN(item, options = {}) {
  // 根据媒体类型选择正确的日期字段
  let releaseDate = "";
  if (item.media_type === "tv" || item.first_air_date) {
    releaseDate = item.first_air_date || "";
  } else {
    releaseDate = item.release_date || "";
  }

  // 优先获取英语海报
  let posterUrl = "";
  if (item.poster_path) {
    // 如果有images数据，尝试获取英语海报
    if (item.images && item.images.posters) {
      const enPoster = item.images.posters.find(p => 
        p.iso_639_1 === "en" || p.iso_639_1 === "en-US"
      );
      if (enPoster && enPoster.file_path) {
        posterUrl = `https://image.tmdb.org/t/p/w500${enPoster.file_path}`;
      } else {
        posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";
      }
    } else {
      posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "";
    }
  }
  
  // 获取序号（如果有）
  let itemIndex = options.index || 0;
  let formattedIndex = "";
  
  if (options.showIndex) {
    if (options.startIndex !== undefined) {
      itemIndex = options.startIndex + (options.index || 0);
    }
    formattedIndex = itemIndex < 10 ? `0${itemIndex}` : `${itemIndex}`;
  }

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
    backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : "",
    mediaType: item.media_type || "movie",
    popularity: item.popularity || 0,
    voteCount: item.vote_count || 0,
    link: null,
    duration: 0,
    durationText: "",
    episode: 0,
    childItems: [],
    // 新增序号字段
    index: formattedIndex,
    hasIndex: options.showIndex || false
  };
}

// 修改各个模块函数，添加序号功能：

// 1. TMDB热门内容加载
async function loadTmdbTrending(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "today", page = 1, language = "en-US", use_preprocessed_data = "true" } = params;
  
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

// 修改 loadTmdbTrendingWithAPI 函数，添加序号
async function loadTmdbTrendingWithAPI(params = {}) {
  const { content_type = "today", media_type = "all", with_origin_country = "", vote_average_gte = "0", sort_by = "popularity", page = 1, language = "en-US" } = params;
  
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

    let results = await Promise.all(response.results.map(async (item, index) => {
      try {
        // 获取带有图片详情的项目
        const itemWithImages = await getTmdbItemWithImages(
          item.id, 
          item.media_type || "movie", 
          params.language || "en-US"
        );
        
        // 合并数据
        const mergedItem = {
          ...item,
          images: itemWithImages?.images || null
        };
        
        // 为热门内容模块创建不使用CDN优化的widgetItem，添加序号
        const widgetItem = createWidgetItemWithoutCDN(mergedItem, {
          showIndex: true,
          index: index + 1
        });
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, item.media_type || "movie");
        
        // 使用正常背景图
        if (item.backdrop_path) {
          const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
          widgetItem.title_backdrop = backdropUrl;
          widgetItem.backdropPath = backdropUrl;
        }
        
        return widgetItem;
      } catch (error) {
        // 如果获取图片失败，使用原始数据
        console.error(`获取项目 ${item.id} 图片失败:`, error);
        const widgetItem = createWidgetItemWithoutCDN(item, {
          showIndex: true,
          index: index + 1
        });
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, item.media_type || "movie");
        
        if (item.backdrop_path) {
          const backdropUrl = `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`;
          widgetItem.title_backdrop = backdropUrl;
          widgetItem.backdropPath = backdropUrl;
        }
        
        return widgetItem;
      }
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
      
      // 排序后重新分配序号
      results = results.map((item, index) => ({
        ...item,
        index: (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`,
        hasIndex: true
      }));
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

// 2. TMDB播出平台函数，添加序号
async function tmdbDiscoverByNetwork(params = {}) {
    try {
        debugLog.log("🎬 开始加载播出平台数据，参数:", params);
        
        const api = "discover/tv";
        const beijingDate = getBeijingDate();
        const discoverParams = {
            language: params.language || 'en-US',
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
        const response = await Widget.tmdb.get(api, { params: discoverParams });
        
        if (!response || !response.results) {
            return [];
        }
        
        const results = response.results.map((item, index) => {
          const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
          const genreIds = item.genre_ids || [];
          const genreTitle = getGenreTitle(genreIds, mediaType);
          
          // 添加序号
          const itemIndex = index + 1;
          const formattedIndex = itemIndex < 10 ? `0${itemIndex}` : `${itemIndex}`;
          
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
              genreTitle: genreTitle,
              // 序号字段
              index: formattedIndex,
              hasIndex: true
          };
        });
        
        debugLog.log("✅ 播出平台数据加载成功，返回", results.length, "项");
        return results;
        
    } catch (error) {
        console.error("❌ 播出平台数据加载失败:", error);
        console.error("❌ 错误详情:", error.message);
        return [];
    }
}

// 3. TMDB出品公司函数，添加序号
async function loadTmdbByCompany(params = {}) {
  const { language = "en-US", page = 1, with_companies, type = "movie", with_genres, sort_by = "popularity.desc" } = params;
  
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
      const movieResults = await Promise.all(movieRes.results.map(async (item, index) => {
        // 为电影显式设置media_type
        item.media_type = "movie";
        const widgetItem = await createWidgetItem(item, {
          showIndex: true,
          index: index + 1
        });
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, "movie");
        return widgetItem;
      }));
      
      const tvResults = await Promise.all(tvRes.results.map(async (item, index) => {
        // 为TV节目显式设置media_type
        item.media_type = "tv";
        const widgetItem = await createWidgetItem(item, {
          showIndex: true,
          index: index + 1
        });
        widgetItem.genreTitle = getGenreTitle(item.genre_ids, "tv");
        return widgetItem;
      }));
      
      const filteredMovieResults = movieResults.filter(item => item.posterPath);
      const filteredTvResults = tvResults.filter(item => item.posterPath);
      
      // 合并并排序（按热门度）
      results = [...filteredMovieResults, ...filteredTvResults]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, CONFIG.MAX_ITEMS);
      
      // 重新分配序号
      results = results.map((item, index) => ({
        ...item,
        index: (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`,
        hasIndex: true
      }));
      
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
      
      const widgetItems = await Promise.all(res.results.map(async (item, index) => {
        // 为项目显式设置media_type，因为discover端点不返回此字段
        item.media_type = type;
        const widgetItem = await createWidgetItem(item, {
          showIndex: true,
          index: index + 1
        });
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

// 4. TMDB影视榜单函数，添加序号
async function loadTmdbMediaRanking(params = {}) {
  const { 
    language = "en-US", 
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
    
    const widgetItems = await Promise.all(res.results.map(async (item, index) => {
      // 为项目显式设置media_type，因为discover端点不返回此字段
      item.media_type = media_type;
      const widgetItem = await createWidgetItem(item, {
        showIndex: true,
        index: index + 1
      });
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

// 5. TMDB主题分类函数，添加序号
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
      language: "en-US",
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

    const widgetItems = await Promise.all(res.results.map(async (item, index) => {
      const widgetItem = await createWidgetItem(item, {
        showIndex: true,
        index: index + 1
      });
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

// 6. TMDB观影偏好，添加序号
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
        
        // 添加序号
        const itemsWithIndex = items.map((item, index) => ({
          ...item,
          index: (index + 1) < 10 ? `0${index + 1}` : `${index + 1}`,
          hasIndex: true
        }));

        debugLog.log(itemsWithIndex)

        return itemsWithIndex;
    } catch (error) {
        throw error;
    }
}

// 7. 标准数据结构生成函数，添加序号
function createStandardItem(overrides = {}) {
  const index = overrides.index || 0;
  const formattedIndex = index > 0 ? (index < 10 ? `0${index}` : `${index}`) : "";
  
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
    // 序号字段
    index: formattedIndex,
    hasIndex: index > 0,
    ...overrides
  };
}

// 辅助函数：搜索TMDB，添加序号
async function searchTMDB(query, mediaType, language = "en-US") {
  try {
    const apiKey = CONFIG.API_KEY;
    const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=${language}`;
    
    const response = await Widget.http.get(url);
    const data = response.data;
    
    if (!data.results) return [];
    
    return data.results.map((item, index) => createStandardItem({
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
      genreTitle: item.genre_ids ? item.genre_ids.join(', ') : "",
      // 序号
      index: index + 1,
      hasIndex: true
    }));
  } catch (error) {
    console.error("TMDB搜索失败:", error);
    return [];
  }
}

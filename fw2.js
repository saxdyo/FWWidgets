// =========================================================================
// Widget 元数据配置
// =========================================================================
var WidgetMetadata = {
  id: "media.aggregator.pro",
  title: "媒体聚合专业版",
  description: "整合Trakt、TMDB、Bilibili、Bangumi、AniList、MAL等多平台媒体信息",
  author: "saxdyo",
  site: "https://github.com/saxdyo",
  version: "2.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  
  globalParams: [
    {
      name: "traktUser",
      title: "🔗 Trakt用户名",
      type: "input",
      description: "如需Trakt追剧功能，请填写用户名",
      value: "",
      placeholder: "请输入Trakt用户名"
    }
  ],

  modules: [
    // ===========================================
    // 模块 1: Trakt 追剧日历
    // ===========================================
    {
      title: "Trakt 追剧日历",
      description: "Trakt个人追剧日历和收藏管理",
      requiresWebView: false,
      functionName: "loadTraktProfile",
      sectionMode: false,
      cacheDuration: 300,
      params: [
        {
          name: "section",
          title: "浏览区域",
          type: "enumeration",
          description: "选择要浏览的内容区域",
          value: "updates",
          enumOptions: [
            { title: "📅 追剧日历", value: "updates" },
            { title: "📜 待看列表", value: "watchlist" },
            { title: "📦 收藏列表", value: "collection" },
            { title: "🕒 观看历史", value: "history" }
          ]
        },
        {
          name: "type",
          title: "内容筛选",
          type: "enumeration",
          description: "筛选剧集或电影内容",
          value: "all",
          belongTo: {
            paramName: "section",
            value: ["watchlist", "collection", "history"]
          },
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "剧集", value: "shows" },
            { title: "电影", value: "movies" }
          ]
        },
        {
          name: "updateSort",
          title: "排序方式",
          type: "enumeration",
          description: "追剧日历的排序方式",
          value: "future_first",
          belongTo: {
            paramName: "section",
            value: ["updates"]
          },
          enumOptions: [
            { title: "🔜 从今天往后", value: "future_first" },
            { title: "🔄 按更新倒序", value: "air_date_desc" },
            { title: "👁️ 按观看倒序", value: "watched_at" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 2: Bilibili 热榜
    // ===========================================
    {
      title: "Bilibili 热榜",
      description: "B站番剧和国创热榜",
      requiresWebView: false,
      functionName: "loadBilibiliRank",
      sectionMode: false,
      cacheDuration: 1800,
      params: [
        {
          name: "type",
          title: "榜单分区",
          type: "enumeration",
          description: "选择B站榜单分区",
          value: "1",
          enumOptions: [
            { title: "📺 B站番剧 (日漫)", value: "1" },
            { title: "🇨🇳 B站国创 (国漫)", value: "4" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 3: Bangumi 放送表
    // ===========================================
    {
      title: "Bangumi 追番日历",
      description: "Bangumi日本动画播出日历",
      requiresWebView: false,
      functionName: "loadBangumiCalendar",
      sectionMode: false,
      cacheDuration: 3600,
      params: [
        {
          name: "weekday",
          title: "选择日期",
          type: "enumeration",
          description: "选择要查看的播出日期",
          value: "today",
          enumOptions: [
            { title: "📅 今日更新", value: "today" },
            { title: "周一 (月)", value: "1" },
            { title: "周二 (火)", value: "2" },
            { title: "周三 (水)", value: "3" },
            { title: "周四 (木)", value: "4" },
            { title: "周五 (金)", value: "5" },
            { title: "周六 (土)", value: "6" },
            { title: "周日 (日)", value: "7" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 4: TMDB 动漫榜单
    // ===========================================
    {
      title: "TMDB 动漫榜单",
      description: "TMDB平台动漫内容榜单",
      requiresWebView: false,
      functionName: "loadTmdbAnimeRanking",
      sectionMode: false,
      cacheDuration: 3600,
      params: [
        {
          name: "sort",
          title: "榜单类型",
          type: "enumeration",
          description: "选择榜单排序方式",
          value: "trending",
          enumOptions: [
            { title: "🔥 实时流行", value: "trending" },
            { title: "📅 最新首播", value: "new" },
            { title: "👑 高分神作", value: "top" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 5: AniList 流行榜
    // ===========================================
    {
      title: "AniList 流行榜",
      description: "AniList动漫流行榜单",
      requiresWebView: false,
      functionName: "loadAniListRanking",
      sectionMode: false,
      cacheDuration: 7200,
      params: [
        {
          name: "sort",
          title: "排序方式",
          type: "enumeration",
          description: "选择排序方式",
          value: "TRENDING_DESC",
          enumOptions: [
            { title: "📈 近期趋势", value: "TRENDING_DESC" },
            { title: "💖 历史人气", value: "POPULARITY_DESC" },
            { title: "⭐ 评分最高", value: "SCORE_DESC" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 6: MAL 权威榜单
    // ===========================================
    {
      title: "MAL 权威榜单",
      description: "MyAnimeList权威动漫榜单",
      requiresWebView: false,
      functionName: "loadMalRanking",
      sectionMode: false,
      cacheDuration: 7200,
      params: [
        {
          name: "filter",
          title: "榜单类型",
          type: "enumeration",
          description: "选择榜单类型",
          value: "airing",
          enumOptions: [
            { title: "🔥 当前热播", value: "airing" },
            { title: "🏆 历史总榜", value: "all" },
            { title: "🎥 最佳剧场版", value: "movie" },
            { title: "🔜 即将上映", value: "upcoming" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 7: TMDB 热门内容
    // ===========================================
    {
      title: "TMDB 热门内容",
      description: "TMDB今日热门、本周热门等内容",
      requiresWebView: false,
      functionName: "loadTmdbTrending",
      sectionMode: false,
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
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        },
        {
          name: "language",
          title: "语言",
          type: "enumeration",
          description: "选择显示语言",
          value: "zh-CN",
          enumOptions: [
            { title: "中文", value: "zh-CN" },
            { title: "English", value: "en-US" }
          ]
        }
      ]
    },

    // ===========================================
    // 模块 8: TMDB 播出平台
    // ===========================================
    {
      title: "TMDB 播出平台",
      description: "按播出平台筛选剧集内容",
      requiresWebView: false,
      functionName: "loadTmdbNetwork",
      sectionMode: false,
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
            value: ["released", "upcoming"]
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
            { title: "Apple TV+", value: "2552" },
            { title: "Amazon Prime", value: "1024" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "选择上映状态",
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
          description: "选择内容排序方式",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" }
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 9: TMDB 出品公司
    // ===========================================
    {
      title: "TMDB 出品公司",
      description: "按出品公司筛选电影和剧集内容",
      requiresWebView: false,
      functionName: "loadTmdbByCompany",
      sectionMode: false,
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
            { title: "漫威影业", value: "420" },
            { title: "华特迪士尼", value: "2" },
            { title: "华纳兄弟", value: "174" },
            { title: "索尼影业", value: "5" },
            { title: "环球影业", value: "33" }
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
        {
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 10: TMDB 影视榜单
    // ===========================================
    {
      title: "TMDB 影视榜单",
      description: "热门电影和电视剧集榜单",
      requiresWebView: false,
      functionName: "loadTmdbMediaRanking",
      sectionMode: false,
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
            { title: "韩国", value: "KR" }
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
            { title: "最新播出↓", value: "first_air_date.desc" }
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
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 11: TMDB 主题分类
    // ===========================================
    {
      title: "TMDB 主题分类",
      description: "按主题分类浏览影视内容",
      requiresWebView: false,
      functionName: "loadTmdbByTheme",
      sectionMode: false,
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
            { title: "喜剧搞笑", value: "comedy" }
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
          name: "page",
          title: "页码",
          type: "page",
          description: "选择页码",
          value: 1
        }
      ]
    },

    // ===========================================
    // 模块 12: TMDB 屏蔽管理
    // ===========================================
    {
      title: "TMDB 屏蔽管理",
      description: "查看和管理已屏蔽的内容",
      requiresWebView: false,
      functionName: "manageBlockedItems",
      sectionMode: false,
      cacheDuration: 0,
      params: [
        {
          name: "action",
          title: "操作",
          type: "enumeration",
          description: "选择要执行的操作",
          value: "view",
          enumOptions: [
            { title: "查看黑名单", value: "view" },
            { title: "取消屏蔽", value: "unblock" },
            { title: "清空黑名单", value: "clear" },
            { title: "导出配置", value: "export" }
          ]
        },
        {
          name: "unblock_id",
          title: "取消屏蔽ID",
          type: "input",
          description: "输入要取消屏蔽的TMDB ID",
          value: "",
          placeholder: "例如：2190",
          belongTo: {
            paramName: "action",
            value: ["unblock"]
          }
        },
        {
          name: "unblock_media_type",
          title: "媒体类型",
          type: "enumeration",
          description: "选择要取消屏蔽的媒体类型",
          value: "tv",
          belongTo: {
            paramName: "action",
            value: ["unblock"]
          },
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ]
        }
      ]
    }
  ]
};

// =========================================================================
// 常量定义
// =========================================================================
const CONFIG = {
  TRAKT_CLIENT_ID: "f47aba7aa7ccfebfb782c9b8497f95e4b2fe4a5de73e80d5bc033bde93233fc5",
  STORAGE_KEY: "media_blocked_items",
  MAX_ITEMS: 20,
  CACHE_DURATION: 60 * 60 * 1000
};

// =========================================================================
// 通用工具函数
// =========================================================================

/**
 * 格式化短日期
 */
function formatShortDate(dateStr) {
  if (!dateStr) return "待定";
  try {
    const date = new Date(dateStr);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${m}-${d}`;
  } catch (e) {
    return "待定";
  }
}

/**
 * 清理标题
 */
function cleanTitle(title) {
  if (!title) return "";
  return title
    .replace(/第[一二三四五六七八九十\d]+[季章]/g, "")
    .replace(/Season \d+/gi, "")
    .replace(/Part \d+/gi, "")
    .replace(/\s*-\s*$/, "")
    .trim();
}

/**
 * 获取星期名称
 */
function getWeekdayName(id) {
  const map = { 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日", 0: "周日" };
  return map[id] || "";
}

/**
 * 获取TMDB类型文本
 */
function getTmdbGenreText(genreIds, mediaType) {
  if (!genreIds || !Array.isArray(genreIds)) return "";
  
  const TMDB_GENRES = {
    movie: {
      28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
      18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
      9648: "悬疑", 10749: "爱情", 878: "科幻", 53: "惊悚", 10752: "战争", 37: "西部"
    },
    tv: {
      10759: "动作冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
      18: "剧情", 10751: "家庭", 9648: "悬疑", 10765: "科幻奇幻", 10768: "战争政治"
    }
  };
  
  const genres = TMDB_GENRES[mediaType] || {};
  const genreNames = genreIds.slice(0, 2).map(id => genres[id]).filter(Boolean);
  return genreNames.join("•");
}

/**
 * 获取动漫类型文本
 */
function getAnimeGenreText(ids) {
  const GENRE_MAP = {
    16: "动画", 10759: "动作冒险", 35: "喜剧", 18: "剧情", 14: "奇幻", 
    878: "科幻", 9648: "悬疑", 10749: "爱情", 27: "恐怖", 10765: "科幻奇幻"
  };
  
  if (!ids || !Array.isArray(ids)) return "动画";
  const genres = ids.filter(id => id !== 16).map(id => GENRE_MAP[id]).filter(Boolean);
  return genres.length > 0 ? genres.slice(0, 2).join(" / ") : "动画";
}

/**
 * 构建标准的视频项目
 */
function buildVideoItem(itemData) {
  const {
    id,
    type = "tmdb",
    title,
    genreTitle = "",
    rating = 0,
    description = "",
    releaseDate = "",
    posterPath = "",
    backdropPath = "",
    mediaType = "tv",
    duration = 0,
    episode = 0,
    link = null,
    childItems = []
  } = itemData;
  
  return {
    id: type === "tmdb" ? `${mediaType}.${id}` : String(id),
    type: type,
    title: title || "未知标题",
    genreTitle: genreTitle,
    rating: Number(rating) || 0,
    description: description,
    releaseDate: releaseDate,
    posterPath: posterPath,
    backdropPath: backdropPath,
    mediaType: mediaType,
    duration: duration,
    durationText: duration > 0 ? formatDuration(duration) : "",
    episode: episode,
    link: link,
    childItems: childItems
  };
}

/**
 * 格式化时长
 */
function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
}

// =========================================================================
// 屏蔽管理系统
// =========================================================================

/**
 * 获取屏蔽ID集合
 */
function getBlockedIdSet() {
  try {
    const stored = Widget.storage.get(CONFIG.STORAGE_KEY);
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
    
    return idSet;
  } catch (error) {
    return new Set();
  }
}

/**
 * 检查项目是否被屏蔽
 */
function isItemBlocked(item) {
  if (!item || !item.id) return false;
  
  const blockedIdSet = getBlockedIdSet();
  const itemId = String(item.id);
  const itemIdNum = parseInt(item.id);
  
  if (blockedIdSet.has(itemId) || blockedIdSet.has(itemIdNum)) {
    return true;
  }
  
  if (item.mediaType) {
    if (blockedIdSet.has(itemId + "_" + item.mediaType) || blockedIdSet.has(itemIdNum + "_" + item.mediaType)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 过滤屏蔽的项目
 */
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

/**
 * 添加到屏蔽列表
 */
function addToBlockList(tmdbId, mediaType = "movie", title = "") {
  try {
    const stored = Widget.storage.get(CONFIG.STORAGE_KEY);
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
        title: title || `ID: ${itemId}`,
        blocked_date: new Date().toISOString()
      });
      
      Widget.storage.set(CONFIG.STORAGE_KEY, JSON.stringify(blockedItems));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("添加到屏蔽列表失败:", error);
    return false;
  }
}

// =========================================================================
// 模块处理函数
// =========================================================================

/**
 * 模块 1: Trakt 追剧日历
 */
async function loadTraktProfile(params = {}) {
  try {
    const { traktUser, section = "updates", type = "all", updateSort = "future_first", page = 1 } = params;
    
    // 1. 参数验证
    if (!traktUser) {
      return [buildVideoItem({
        id: "trakt_prompt",
        type: "text",
        title: "🔗 Trakt 追剧日历",
        description: "请在全局设置中填写 Trakt 用户名以使用此功能",
        genreTitle: "提示"
      })];
    }
    
    // 2. 发送请求
    if (section === "updates") {
      return await loadTraktUpdates(traktUser, updateSort, page);
    }
    
    // 处理其他列表
    const rawItems = await fetchTraktList(section, type, page, traktUser);
    if (!rawItems || rawItems.length === 0) {
      return page === 1 ? [buildVideoItem({
        id: "empty",
        type: "text",
        title: "列表为空",
        genreTitle: "提示"
      })] : [];
    }
    
    // 3. 处理数据
    const promises = rawItems.map(async (item) => {
      const subject = item.show || item.movie || item;
      if (!subject?.ids?.tmdb) return null;
      
      const mediaType = item.show ? "tv" : "movie";
      let subInfo = "";
      const timeStr = getTraktItemTime(item, section);
      if (timeStr) subInfo = timeStr.split('T')[0];
      if (type === "all") subInfo = `[${item.show ? "剧" : "影"}] ${subInfo}`;
      
      try {
        const tmdbData = await Widget.tmdb.get(`/${mediaType}/${subject.ids.tmdb}`, {
          params: { language: "zh-CN" }
        });
        
        const year = (tmdbData.first_air_date || tmdbData.release_date || "").substring(0, 4);
        const genreTitle = getTmdbGenreText(tmdbData.genre_ids, mediaType);
        
        return buildVideoItem({
          id: tmdbData.id,
          type: "tmdb",
          title: tmdbData.name || tmdbData.title || subject.title,
          genreTitle: year + (genreTitle ? ` • ${genreTitle}` : ""),
          rating: tmdbData.vote_average || 0,
          description: tmdbData.overview || "暂无简介",
          releaseDate: tmdbData.first_air_date || tmdbData.release_date || "",
          posterPath: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : "",
          backdropPath: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbData.backdrop_path}` : "",
          mediaType: mediaType
        });
      } catch (error) {
        console.error("获取TMDB详情失败:", error);
        return null;
      }
    });
    
    const results = (await Promise.all(promises)).filter(Boolean);
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("Trakt模块处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "Trakt连接失败",
      description: error.message || "请检查网络或用户名",
      genreTitle: "错误"
    })];
  }
}

/**
 * 加载Trakt更新
 */
async function loadTraktUpdates(user, sort, page) {
  try {
    const url = `https://api.trakt.tv/users/${user}/watched/shows?extended=noseasons&limit=100`;
    
    const response = await Widget.http.get(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": CONFIG.TRAKT_CLIENT_ID
      }
    });
    
    const data = response.data || [];
    if (data.length === 0) {
      return [buildVideoItem({
        id: "empty",
        type: "text",
        title: "无观看记录",
        genreTitle: "提示"
      })];
    }
    
    // 处理数据
    const enrichedShows = [];
    for (let i = 0; i < Math.min(data.length, 60); i++) {
      const item = data[i];
      if (!item.show?.ids?.tmdb) continue;
      
      try {
        const tmdb = await Widget.tmdb.get(`/tv/${item.show.ids.tmdb}`, {
          params: { language: "zh-CN" }
        });
        
        if (!tmdb) continue;
        
        const nextAir = tmdb.next_episode_to_air?.air_date;
        const lastAir = tmdb.last_episode_to_air?.air_date;
        const sortDate = nextAir || lastAir || "1970-01-01";
        const today = new Date().toISOString().split('T')[0];
        const isFuture = sortDate >= today;
        
        enrichedShows.push({
          trakt: item,
          tmdb: tmdb,
          sortDate: sortDate,
          isFuture: isFuture,
          watchedDate: item.last_watched_at
        });
      } catch (error) {
        continue;
      }
    }
    
    // 排序
    if (sort === "future_first") {
      const futureShows = enrichedShows.filter(s => s.isFuture && s.tmdb.next_episode_to_air);
      const pastShows = enrichedShows.filter(s => !s.isFuture || !s.tmdb.next_episode_to_air);
      futureShows.sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));
      pastShows.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
      enrichedShows.length = 0;
      enrichedShows.push(...futureShows, ...pastShows);
    } else if (sort === "air_date_desc") {
      enrichedShows.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
    } else {
      enrichedShows.sort((a, b) => new Date(b.watchedDate) - new Date(a.watchedDate));
    }
    
    // 分页
    const start = (page - 1) * 15;
    const paginatedShows = enrichedShows.slice(start, start + 15);
    
    // 转换为视频项目
    const results = paginatedShows.map(item => {
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
      
      return buildVideoItem({
        id: d.id,
        type: "tmdb",
        title: d.name,
        genreTitle: displayStr,
        rating: d.vote_average || 0,
        description: `上次观看: ${item.watchedDate?.split("T")[0] || "未知"}\n${d.overview || "暂无简介"}`,
        releaseDate: d.first_air_date || "",
        posterPath: d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : "",
        backdropPath: d.backdrop_path ? `https://image.tmdb.org/t/p/w780${d.backdrop_path}` : "",
        mediaType: "tv"
      });
    });
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("Trakt更新加载失败:", error);
    throw error;
  }
}

/**
 * 获取Trakt列表
 */
async function fetchTraktList(section, type, page, user) {
  const limit = 20;
  const url = `https://api.trakt.tv/users/${user}/${section}/${type}?extended=full&page=${page}&limit=${limit}`;
  
  try {
    const response = await Widget.http.get(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": CONFIG.TRAKT_CLIENT_ID
      }
    });
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Trakt ${section} 列表获取失败:`, error);
    return [];
  }
}

/**
 * 获取Trakt项目时间
 */
function getTraktItemTime(item, section) {
  if (section === "watchlist") return item.listed_at;
  if (section === "history") return item.watched_at;
  if (section === "collection") return item.collected_at;
  return item.created_at || "1970-01-01";
}

/**
 * 模块 2: Bilibili 热榜
 */
async function loadBilibiliRank(params = {}) {
  try {
    const { type = "1", page = 1 } = params;
    
    const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`;
    
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.bilibili.com/"
      }
    });
    
    const data = response.data || {};
    const fullList = data.result?.list || data.data?.list || [];
    
    // 分页
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (start >= fullList.length) return [];
    
    const slicedList = fullList.slice(start, end);
    
    // 处理数据
    const results = [];
    for (let i = 0; i < slicedList.length; i++) {
      const item = slicedList[i];
      const rank = start + i + 1;
      const cleanName = cleanTitle(item.title);
      
      try {
        // 搜索TMDB匹配
        const tmdbItem = await searchTmdbBestMatch(cleanName, item.title);
        if (!tmdbItem || !tmdbItem.id) continue;
        
        const year = (tmdbItem.first_air_date || "").substring(0, 4);
        const genreText = getAnimeGenreText(tmdbItem.genre_ids);
        
        results.push(buildVideoItem({
          id: tmdbItem.id,
          type: "tmdb",
          title: tmdbItem.name || tmdbItem.title || cleanName,
          genreTitle: `${year} • ${genreText}`,
          rating: tmdbItem.vote_average || 0,
          description: tmdbItem.overview || item.desc || "",
          releaseDate: tmdbItem.first_air_date || "",
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : "",
          backdropPath: tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "",
          mediaType: "tv"
        }));
      } catch (error) {
        console.error("Bilibili项目处理失败:", error);
        continue;
      }
    }
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("Bilibili模块处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "Bilibili连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 3: Bangumi 放送表
 */
async function loadBangumiCalendar(params = {}) {
  try {
    const { weekday = "today", page = 1 } = params;
    const pageSize = 20;
    
    let targetDayId = parseInt(weekday);
    if (weekday === "today") {
      const today = new Date();
      const jsDay = today.getDay();
      targetDayId = jsDay === 0 ? 7 : jsDay;
    }
    
    const dayName = getWeekdayName(targetDayId);
    
    const response = await Widget.http.get("https://api.bgm.tv/calendar");
    const data = response.data || [];
    const dayData = data.find(d => d.weekday && d.weekday.id === targetDayId);
    
    if (!dayData || !dayData.items) return [];
    
    const allItems = dayData.items;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (start >= allItems.length) return [];
    
    const pageItems = allItems.slice(start, end);
    
    // 处理数据
    const results = [];
    for (let i = 0; i < pageItems.length; i++) {
      const item = pageItems[i];
      const cnTitle = item.name_cn || item.name;
      
      try {
        const tmdbItem = await searchTmdbBestMatch(cnTitle, item.name);
        if (!tmdbItem || !tmdbItem.id) continue;
        
        const year = (tmdbItem.first_air_date || "").substring(0, 4);
        const genreText = getAnimeGenreText(tmdbItem.genre_ids);
        
        results.push(buildVideoItem({
          id: tmdbItem.id,
          type: "tmdb",
          title: tmdbItem.name || tmdbItem.title || cnTitle,
          genreTitle: `${dayName} • ${year} • ${genreText}`,
          rating: item.rating?.score || tmdbItem.vote_average || 0,
          description: tmdbItem.overview || item.summary || "",
          releaseDate: item.air_date || tmdbItem.first_air_date || "",
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : "",
          backdropPath: tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "",
          mediaType: "tv"
        }));
      } catch (error) {
        console.error("Bangumi项目处理失败:", error);
        continue;
      }
    }
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("Bangumi模块处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "Bangumi连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 4: TMDB 动漫榜单
 */
async function loadTmdbAnimeRanking(params = {}) {
  try {
    const { sort = "trending", page = 1 } = params;
    
    let queryParams = {
      language: "zh-CN",
      page: page,
      with_genres: "16",
      with_original_language: "ja",
      include_adult: false
    };
    
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
    
    const response = await Widget.tmdb.get("/discover/tv", { params: queryParams });
    const data = response || {};
    
    if (!data.results) return [];
    
    const results = data.results.map(item => {
      const year = (item.first_air_date || "").substring(0, 4);
      const genreText = getAnimeGenreText(item.genre_ids);
      
      return buildVideoItem({
        id: item.id,
        type: "tmdb",
        title: item.name || item.title || "",
        genreTitle: `${year} • ${genreText}`,
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: "tv"
      });
    });
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("TMDB动漫榜单处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 5: AniList 流行榜
 */
async function loadAniListRanking(params = {}) {
  try {
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
    
    const response = await Widget.http.post("https://graphql.anilist.co", {
      query: query,
      variables: { page, perPage }
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    
    const data = response.data?.data?.Page?.media || [];
    if (data.length === 0) return [];
    
    // 处理数据
    const results = [];
    for (let i = 0; i < data.length; i++) {
      const media = data[i];
      const searchQ = media.title.native || media.title.romaji;
      
      try {
        const tmdbItem = await searchTmdbBestMatch(searchQ, media.title.english);
        if (!tmdbItem || !tmdbItem.id) continue;
        
        const year = String(media.seasonYear || (tmdbItem.first_air_date || "").substring(0, 4));
        const genreText = getAnimeGenreText(tmdbItem.genre_ids);
        
        results.push(buildVideoItem({
          id: tmdbItem.id,
          type: "tmdb",
          title: tmdbItem.name || tmdbItem.title || searchQ,
          genreTitle: `${year} • ${genreText}`,
          rating: (media.averageScore / 10).toFixed(1),
          description: tmdbItem.overview || media.description || "",
          releaseDate: tmdbItem.first_air_date || "",
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : "",
          backdropPath: tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "",
          mediaType: "tv"
        }));
      } catch (error) {
        console.error("AniList项目处理失败:", error);
        continue;
      }
    }
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("AniList模块处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "AniList连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 6: MAL 权威榜单
 */
async function loadMalRanking(params = {}) {
  try {
    const { filter = "airing", page = 1 } = params;
    const baseUrl = "https://api.jikan.moe/v4/top/anime";
    
    let apiParams = { page: page };
    if (filter === "airing") apiParams.filter = "airing";
    else if (filter === "movie") apiParams.type = "movie";
    else if (filter === "upcoming") apiParams.filter = "upcoming";
    
    const response = await Widget.http.get(baseUrl, { params: apiParams });
    
    if (response.statusCode === 429) {
      return [buildVideoItem({
        id: "error",
        type: "text",
        title: "请求过快",
        description: "MAL请求过快，请稍后重试",
        genreTitle: "提示"
      })];
    }
    
    const data = response.data?.data || [];
    
    // 处理数据
    const results = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const searchQ = item.title_japanese || item.title;
      
      try {
        const tmdbItem = await searchTmdbBestMatch(searchQ, item.title_english);
        if (!tmdbItem || !tmdbItem.id) continue;
        
        const mediaType = item.type === "Movie" ? "movie" : "tv";
        const year = String(item.year || (tmdbItem.first_air_date || "").substring(0, 4));
        const genreText = getAnimeGenreText(tmdbItem.genre_ids);
        
        results.push(buildVideoItem({
          id: tmdbItem.id,
          type: "tmdb",
          title: tmdbItem.name || tmdbItem.title || searchQ,
          genreTitle: `${year} • ${genreText}`,
          rating: item.score || 0,
          description: tmdbItem.overview || item.synopsis || "",
          releaseDate: tmdbItem.first_air_date || tmdbItem.release_date || "",
          posterPath: tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : "",
          backdropPath: tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "",
          mediaType: mediaType
        }));
      } catch (error) {
        console.error("MAL项目处理失败:", error);
        continue;
      }
    }
    
    return filterBlockedItems(results);
    
  } catch (error) {
    console.error("MAL模块处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "MAL连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * TMDB智能匹配搜索
 */
async function searchTmdbBestMatch(query1, query2) {
  try {
    let result = await searchTmdb(query1);
    if (!result && query2 && query2 !== query1) {
      result = await searchTmdb(query2);
    }
    return result;
  } catch (error) {
    console.error("TMDB搜索失败:", error);
    return null;
  }
}

/**
 * TMDB搜索
 */
async function searchTmdb(query) {
  if (!query || query.length < 2) return null;
  const cleanQuery = cleanTitle(query);
  
  try {
    const response = await Widget.tmdb.get("/search/multi", {
      params: {
        query: cleanQuery,
        language: "zh-CN",
        page: 1
      }
    });
    
    const results = response.results || [];
    const candidates = results.filter(r => (r.media_type === "tv" || r.media_type === "movie"));
    
    if (candidates.length > 0) {
      return candidates.find(r => r.poster_path) || candidates[0];
    }
    
    return null;
  } catch (error) {
    console.error("TMDB搜索错误:", error.message);
    return null;
  }
}

/**
 * 模块 7: TMDB 热门内容
 */
async function loadTmdbTrending(params = {}) {
  try {
    const { 
      content_type = "today", 
      media_type = "all", 
      with_origin_country = "", 
      vote_average_gte = "0", 
      sort_by = "popularity", 
      page = 1, 
      language = "zh-CN" 
    } = params;
    
    // 确定端点
    let endpoint;
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
    
    // 构建查询参数
    const queryParams = {
      language,
      page
    };
    
    if (with_origin_country) {
      queryParams.region = with_origin_country;
    }
    
    // 发送请求
    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    
    // 过滤媒体类型
    let results = response.results || [];
    if (media_type !== "all") {
      results = results.filter(item => {
        if (media_type === "movie") return item.media_type === "movie";
        if (media_type === "tv") return item.media_type === "tv";
        return true;
      });
    }
    
    // 转换为视频项目
    const videoItems = results.map(item => {
      const mediaType = item.media_type || (item.title ? "movie" : "tv");
      const year = (item.release_date || item.first_air_date || "").substring(0, 4);
      const genreText = getTmdbGenreText(item.genre_ids, mediaType);
      
      return buildVideoItem({
        id: item.id,
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: `${year} • ${genreText}`,
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: mediaType,
        popularity: item.popularity || 0
      });
    });
    
    // 评分过滤
    if (vote_average_gte !== "0") {
      const minRating = parseFloat(vote_average_gte);
      videoItems = videoItems.filter(item => item.rating >= minRating);
    }
    
    // 排序
    if (sort_by !== "original") {
      videoItems.sort((a, b) => {
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
    
    // 限制数量
    videoItems = videoItems.slice(0, CONFIG.MAX_ITEMS);
    
    return filterBlockedItems(videoItems);
    
  } catch (error) {
    console.error("TMDB热门内容处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 8: TMDB 播出平台
 */
async function loadTmdbNetwork(params = {}) {
  try {
    const { 
      with_networks = "", 
      air_status = "released", 
      sort_by = "first_air_date.desc", 
      page = 1 
    } = params;
    
    // 构建查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      sort_by: sort_by,
      with_networks: with_networks || undefined
    };
    
    // 上映状态过滤
    const today = new Date().toISOString().split('T')[0];
    if (air_status === "released") {
      queryParams["first_air_date.lte"] = today;
    } else if (air_status === "upcoming") {
      queryParams["first_air_date.gte"] = today;
    }
    
    // 发送请求
    const response = await Widget.tmdb.get("/discover/tv", { params: queryParams });
    const results = response.results || [];
    
    // 转换为视频项目
    const videoItems = results.map(item => {
      const year = (item.first_air_date || "").substring(0, 4);
      const genreText = getTmdbGenreText(item.genre_ids, "tv");
      
      return buildVideoItem({
        id: item.id,
        type: "tmdb",
        title: item.name || "未知标题",
        genreTitle: `${year} • ${genreText}`,
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: "tv"
      });
    });
    
    return filterBlockedItems(videoItems);
    
  } catch (error) {
    console.error("TMDB播出平台处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 9: TMDB 出品公司
 */
async function loadTmdbByCompany(params = {}) {
  try {
    const { 
      with_companies = "", 
      type = "movie", 
      sort_by = "popularity.desc", 
      page = 1 
    } = params;
    
    let results = [];
    
    if (type === "all") {
      // 同时获取电影和剧集
      const [movieRes, tvRes] = await Promise.all([
        Widget.tmdb.get("/discover/movie", {
          params: {
            language: "zh-CN",
            page: page,
            sort_by: sort_by,
            with_companies: with_companies || undefined
          }
        }),
        Widget.tmdb.get("/discover/tv", {
          params: {
            language: "zh-CN",
            page: page,
            sort_by: sort_by,
            with_companies: with_companies || undefined
          }
        })
      ]);
      
      // 合并结果
      const movieItems = (movieRes.results || []).map(item => ({
        id: item.id,
        type: "tmdb",
        title: item.title || "未知标题",
        genreTitle: getTmdbGenreText(item.genre_ids, "movie"),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: "movie"
      }));
      
      const tvItems = (tvRes.results || []).map(item => ({
        id: item.id,
        type: "tmdb",
        title: item.name || "未知标题",
        genreTitle: getTmdbGenreText(item.genre_ids, "tv"),
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: "tv"
      }));
      
      results = [...movieItems, ...tvItems]
        .filter(item => item.posterPath)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, CONFIG.MAX_ITEMS);
      
    } else {
      // 单类型获取
      const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
      
      const response = await Widget.tmdb.get(endpoint, {
        params: {
          language: "zh-CN",
          page: page,
          sort_by: sort_by,
          with_companies: with_companies || undefined
        }
      });
      
      results = (response.results || []).map(item => {
        const mediaType = type;
        const year = (item.release_date || item.first_air_date || "").substring(0, 4);
        const genreText = getTmdbGenreText(item.genre_ids, mediaType);
        
        return {
          id: item.id,
          type: "tmdb",
          title: item.title || item.name || "未知标题",
          genreTitle: `${year} • ${genreText}`,
          rating: item.vote_average || 0,
          description: item.overview || "",
          releaseDate: item.release_date || item.first_air_date || "",
          posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
          backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
          mediaType: mediaType
        };
      });
      
      results = results
        .filter(item => item.posterPath)
        .slice(0, CONFIG.MAX_ITEMS);
    }
    
    return filterBlockedItems(results.map(item => buildVideoItem(item)));
    
  } catch (error) {
    console.error("TMDB出品公司处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 10: TMDB 影视榜单
 */
async function loadTmdbMediaRanking(params = {}) {
  try {
    const { 
      media_type = "tv", 
      with_origin_country = "", 
      sort_by = "popularity.desc", 
      vote_average_gte = "0", 
      page = 1 
    } = params;
    
    const endpoint = media_type === "movie" ? "/discover/movie" : "/discover/tv";
    
    // 构建查询参数
    const queryParams = {
      language: "zh-CN",
      page: page,
      sort_by: sort_by.includes("release_date") && media_type === "tv" ? 
        sort_by.replace("release_date", "first_air_date") : sort_by,
      vote_count_gte: media_type === "movie" ? 100 : 50
    };
    
    if (with_origin_country) {
      queryParams.with_origin_country = with_origin_country;
    }
    
    if (vote_average_gte !== "0") {
      queryParams.vote_average_gte = vote_average_gte;
    }
    
    // 发送请求
    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    const results = response.results || [];
    
    // 转换为视频项目
    const videoItems = results.map(item => {
      const mediaType = media_type;
      const year = (item.release_date || item.first_air_date || "").substring(0, 4);
      const genreText = getTmdbGenreText(item.genre_ids, mediaType);
      
      return buildVideoItem({
        id: item.id,
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: `${year} • ${genreText}`,
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: mediaType
      });
    });
    
    return filterBlockedItems(videoItems.slice(0, CONFIG.MAX_ITEMS));
    
  } catch (error) {
    console.error("TMDB影视榜单处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 11: TMDB 主题分类
 */
async function loadTmdbByTheme(params = {}) {
  try {
    const { 
      theme = "action", 
      media_type = "all", 
      sort_by = "popularity_desc", 
      page = 1 
    } = params;
    
    // 主题到类型ID的映射
    const themeToGenres = {
      action: { movie: "28,12", tv: "10759" },
      sci_fi: { movie: "878,14", tv: "10765" },
      thriller: { movie: "53,9648", tv: "9648" },
      romance: { movie: "10749", tv: "10749" },
      comedy: { movie: "35", tv: "35" }
    };
    
    const genreIds = themeToGenres[theme];
    if (!genreIds) {
      return [buildVideoItem({
        id: "error",
        type: "text",
        title: "未知主题",
        description: `不支持的的主题分类: ${theme}`,
        genreTitle: "错误"
      })];
    }
    
    // 确定端点和类型
    const endpoint = media_type === "movie" ? "/discover/movie" : 
                    media_type === "tv" ? "/discover/tv" : "/discover/movie";
    
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
      queryParams.with_genres = genreIds.movie;
    }
    
    // 设置排序
    switch (sort_by) {
      case "popularity_desc":
        queryParams.sort_by = "popularity.desc";
        break;
      case "release_date_desc":
        queryParams.sort_by = media_type === "movie" ? "release_date.desc" : "first_air_date.desc";
        break;
      default:
        queryParams.sort_by = "popularity.desc";
    }
    
    // 发送请求
    const response = await Widget.tmdb.get(endpoint, { params: queryParams });
    const results = response.results || [];
    
    // 转换为视频项目
    const videoItems = results.map(item => {
      const mediaType = media_type === "all" ? "movie" : media_type;
      const year = (item.release_date || item.first_air_date || "").substring(0, 4);
      const genreText = getTmdbGenreText(item.genre_ids, mediaType);
      
      return buildVideoItem({
        id: item.id,
        type: "tmdb",
        title: item.title || item.name || "未知标题",
        genreTitle: `${year} • ${genreText}`,
        rating: item.vote_average || 0,
        description: item.overview || "",
        releaseDate: item.release_date || item.first_air_date || "",
        posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        backdropPath: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "",
        mediaType: mediaType
      });
    });
    
    return filterBlockedItems(videoItems.slice(0, CONFIG.MAX_ITEMS));
    
  } catch (error) {
    console.error("TMDB主题分类处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "TMDB连接失败",
      description: error.message || "请检查网络连接",
      genreTitle: "错误"
    })];
  }
}

/**
 * 模块 12: TMDB 屏蔽管理
 */
async function manageBlockedItems(params = {}) {
  try {
    const { action = "view", unblock_id = "", unblock_media_type = "tv" } = params;
    
    const stored = Widget.storage.get(CONFIG.STORAGE_KEY);
    const blockedItems = stored ? JSON.parse(stored) : [];
    
    switch (action) {
      case "view":
        if (blockedItems.length === 0) {
          return [buildVideoItem({
            id: "empty",
            type: "text",
            title: "📋 黑名单为空",
            description: "当前没有屏蔽任何内容",
            genreTitle: "提示"
          })];
        }
        
        const viewItems = blockedItems.map(item => buildVideoItem({
          id: item.id,
          type: "text",
          title: item.title,
          description: `${item.media_type} | 屏蔽时间: ${new Date(item.blocked_date).toLocaleDateString()}`,
          genreTitle: "已屏蔽"
        }));
        
        return [buildVideoItem({
          id: "list",
          type: "text",
          title: `📋 黑名单 (${blockedItems.length}项)`,
          description: "已屏蔽的内容列表",
          genreTitle: "管理",
          childItems: viewItems
        })];
        
      case "unblock":
        if (!unblock_id) {
          return [buildVideoItem({
            id: "error",
            type: "text",
            title: "❌ 错误",
            description: "请输入要取消屏蔽的ID",
            genreTitle: "错误"
          })];
        }
        
        const filteredItems = blockedItems.filter(item => 
          !(item.id === unblock_id && item.media_type === unblock_media_type)
        );
        
        if (filteredItems.length === blockedItems.length) {
          return [buildVideoItem({
            id: "error",
            type: "text",
            title: "⚠️ 未找到",
            description: `未找到ID为 ${unblock_id} 的 ${unblock_media_type} 项目`,
            genreTitle: "警告"
          })];
        }
        
        Widget.storage.set(CONFIG.STORAGE_KEY, JSON.stringify(filteredItems));
        
        return [buildVideoItem({
          id: "success",
          type: "text",
          title: "✅ 取消屏蔽成功",
          description: `已取消屏蔽 ${unblock_media_type} ID: ${unblock_id}`,
          genreTitle: "成功"
        })];
        
      case "clear":
        Widget.storage.set(CONFIG.STORAGE_KEY, JSON.stringify([]));
        
        return [buildVideoItem({
          id: "success",
          type: "text",
          title: "🗑️ 清空完成",
          description: "已清空所有屏蔽项目",
          genreTitle: "成功"
        })];
        
      case "export":
        const exportData = blockedItems.map(item => `${item.id}_${item.media_type}`).join(',');
        
        return [buildVideoItem({
          id: "export",
          type: "text",
          title: "📤 导出配置",
          description: `共 ${blockedItems.length} 项，复制以下数据: ${exportData}`,
          genreTitle: "导出"
        })];
        
      default:
        return [buildVideoItem({
          id: "error",
          type: "text",
          title: "❌ 未知操作",
          description: `不支持的操作: ${action}`,
          genreTitle: "错误"
        })];
    }
    
  } catch (error) {
    console.error("屏蔽管理处理失败:", error);
    return [buildVideoItem({
      id: "error",
      type: "text",
      title: "❌ 操作失败",
      description: error.message || "请重试",
      genreTitle: "错误"
    })];
  }
}

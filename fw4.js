WidgetMetadata = {
    id: "ultimate_media_hub_mega",
    title: "全球影视追剧聚合",
    author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖 & sax",
    description: "整合版：全球追剧日历+热榜聚合+平台分流+动漫榜单+Trakt追剧",
    version: "3.0.0",
    requiredVersion: "0.0.1",
    site: "https://www.themoviedb.org",
    
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
            title: "🔗 Trakt 用户名 (追剧日历)",
            type: "input",
            value: "",
            placeholder: "可选：如需 Trakt 追剧功能，请填写用户名"
        }
    ],

    modules: [
        // ===========================================
        // 模块 1: 全球追剧日历 (原全球追剧时刻表)
        // ===========================================
        {
            title: "📅 全球追剧日历",
            functionName: "loadTvCalendar",
            type: "list",
            cacheDuration: 3600,
            params: [
                {
                    name: "mode",
                    title: "时间范围",
                    type: "enumeration",
                    value: "update_today",
                    enumOptions: [
                        { title: "今日更新", value: "update_today" },
                        { title: "明日首播", value: "premiere_tomorrow" },
                        { title: "7天内首播", value: "premiere_week" },
                        { title: "30天内首播", value: "premiere_month" }
                    ]
                },
                {
                    name: "region",
                    title: "地区偏好",
                    type: "enumeration",
                    value: "Global",
                    enumOptions: [
                        { title: "全球聚合", value: "Global" },
                        { title: "美国 (US)", value: "US" },
                        { title: "日本 (JP)", value: "JP" },
                        { title: "韩国 (KR)", value: "KR" },
                        { title: "中国 (CN)", value: "CN" },
                        { title: "英国 (GB)", value: "GB" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 2: 综艺时刻
        // ===========================================
        {
            title: "🎤 综艺时刻",
            functionName: "loadVarietyCalendar",
            type: "list",
            cacheDuration: 3600,
            params: [
                {
                    name: "region",
                    title: "综艺地区",
                    type: "enumeration",
                    value: "cn",
                    enumOptions: [
                        { title: "🇨🇳 国产综艺", value: "cn" },
                        { title: "🇰🇷 韩国综艺", value: "kr" },
                        { title: "🇺🇸 欧美综艺", value: "us" },
                        { title: "🇯🇵 日本综艺", value: "jp" },
                        { title: "🌍 全球热门", value: "global" }
                    ]
                },
                {
                    name: "mode",
                    title: "时间范围",
                    type: "enumeration",
                    value: "today",
                    enumOptions: [
                        { title: "今日更新", value: "today" },
                        { title: "明日预告", value: "tomorrow" },
                        { title: "近期热播", value: "trending" }
                    ]
                }
            ]
        },

        // ===========================================
        // 模块 3: 动漫周更
        // ===========================================
        {
            title: "🌸 动漫周更",
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
                        { title: "📅 今天", value: "today" },
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
        // 模块 4: 全球热榜聚合
        // ===========================================
        {
            title: "🔥 全球热榜聚合",
            functionName: "loadTrendHub",
            type: "list",
            cacheDuration: 3600,
            params: [
                {
                    name: "source",
                    title: "选择榜单",
                    type: "enumeration",
                    value: "trakt_trending",
                    enumOptions: [
                        { title: "🌍 Trakt - 实时热播", value: "trakt_trending" },
                        { title: "🌍 Trakt - 最受欢迎", value: "trakt_popular" },
                        { title: "🌍 Trakt - 最受期待", value: "trakt_anticipated" },
                        { title: "🇨🇳 豆瓣 - 热门国产剧", value: "db_tv_cn" },
                        { title: "🇨🇳 豆瓣 - 热门综艺", value: "db_variety" },
                        { title: "🇨🇳 豆瓣 - 热门电影", value: "db_movie" },
                        { title: "🇺🇸 豆瓣 - 热门美剧", value: "db_tv_us" },
                        { title: "📺 B站 - 番剧热播", value: "bili_bgm" },
                        { title: "📺 B站 - 国创热播", value: "bili_cn" },
                        { title: "🌸 Bangumi - 每日放送", value: "bgm_daily" }
                    ]
                },
                {
                    name: "traktType",
                    title: "Trakt 类型",
                    type: "enumeration",
                    value: "all",
                    belongTo: { paramName: "source", value: ["trakt_trending", "trakt_popular", "trakt_anticipated"] },
                    enumOptions: [
                        { title: "全部 (剧集+电影)", value: "all" },
                        { title: "剧集", value: "shows" },
                        { title: "电影", value: "movies" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 5: 平台分流片库
        // ===========================================
        {
            title: "📺 平台分流片库",
            functionName: "loadPlatformMatrix",
            type: "list",
            cacheDuration: 3600,
            params: [
                {
                    name: "platformId",
                    title: "播出平台",
                    type: "enumeration",
                    value: "2007",
                    enumOptions: [
                        { title: "腾讯视频", value: "2007" },
                        { title: "爱奇艺", value: "1330" },
                        { title: "优酷", value: "1419" },
                        { title: "芒果TV", value: "1631" },
                        { title: "Bilibili", value: "1605" },
                        { title: "Netflix", value: "213" },
                        { title: "Disney+", value: "2739" },
                        { title: "HBO", value: "49" },
                        { title: "Apple TV+", value: "2552" }
                    ]
                },
                {
                    name: "category",
                    title: "内容分类",
                    type: "enumeration",
                    value: "tv_drama",
                    enumOptions: [
                        { title: "📺 电视剧", value: "tv_drama" },
                        { title: "🎤 综艺", value: "tv_variety" },
                        { title: "🐲 动漫", value: "tv_anime" },
                        { title: "🎬 电影", value: "movie" }
                    ]
                },
                {
                    name: "sort",
                    title: "排序",
                    type: "enumeration",
                    value: "popularity.desc",
                    enumOptions: [
                        { title: "🔥 热度最高", value: "popularity.desc" },
                        { title: "📅 最新首播", value: "first_air_date.desc" },
                        { title: "⭐ 评分最高", value: "vote_average.desc" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 6: Trakt 追剧日历
        // ===========================================
        {
            title: "🔗 Trakt 追剧日历",
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
                        { title: "🔜 从今天往后", value: "future_first" },
                        { title: "🔄 按更新倒序", value: "air_date_desc" },
                        { title: "👁️ 按观看倒序", value: "watched_at" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 7: TMDB 动漫榜单
        // ===========================================
        {
            title: "🎬 TMDB 动漫榜单",
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
                        { title: "🔥 实时流行", value: "trending" },
                        { title: "📅 最新首播", value: "new" },
                        { title: "👑 高分神作", value: "top" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 8: 动漫权威榜单
        // ===========================================
        {
            title: "🏆 动漫权威榜单",
            functionName: "loadAnimeRanking",
            type: "list",
            cacheDuration: 7200,
            params: [
                {
                    name: "source",
                    title: "榜单源",
                    type: "enumeration",
                    value: "anilist",
                    enumOptions: [
                        { title: "🌐 AniList 流行榜", value: "anilist" },
                        { title: "🎯 MAL 权威榜单", value: "mal" }
                    ]
                },
                {
                    name: "sort",
                    title: "排序方式",
                    type: "enumeration",
                    value: "TRENDING_DESC",
                    belongTo: { paramName: "source", value: ["anilist"] },
                    enumOptions: [
                        { title: "📈 近期趋势", value: "TRENDING_DESC" },
                        { title: "💖 历史人气", value: "POPULARITY_DESC" },
                        { title: "⭐ 评分最高", value: "SCORE_DESC" }
                    ]
                },
                {
                    name: "filter",
                    title: "榜单类型",
                    type: "enumeration",
                    value: "airing",
                    belongTo: { paramName: "source", value: ["mal"] },
                    enumOptions: [
                        { title: "🔥 当前热播", value: "airing" },
                        { title: "🏆 历史总榜", value: "all" },
                        { title: "🎥 最佳剧场版", value: "movie" },
                        { title: "🔜 即将上映", value: "upcoming" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ]
};

// =========================================================================
// 0. 通用工具函数
// =========================================================================

// 统一使用一个 Trakt ID
const DEFAULT_TRAKT_ID = "f47aba7aa7ccfebfb782c9b8497f95e4b2fe4a5de73e80d5bc033bde93233fc5";

// 统一 Genre Map
const GENRE_MAP = {
    28: "动作", 12: "冒险", 16: "动画", 35: "喜剧", 80: "犯罪", 99: "纪录片",
    18: "剧情", 10751: "家庭", 14: "奇幻", 36: "历史", 27: "恐怖", 10402: "音乐",
    9648: "悬疑", 10749: "爱情", 878: "科幻", 10770: "电视电影", 53: "惊悚",
    10752: "战争", 37: "西部", 10759: "动作冒险", 10762: "儿童", 10763: "新闻",
    10764: "真人秀", 10765: "科幻奇幻", 10766: "肥皂剧", 10767: "脱口秀", 10768: "战争政治"
};

function getGenreText(ids, isAnime = false) {
    if (!ids || !Array.isArray(ids)) return isAnime ? "动画" : "";
    const genres = ids.map(id => GENRE_MAP[id]).filter(Boolean);
    if (genres.length === 0) return isAnime ? "动画" : "";
    return genres.slice(0, isAnime ? 2 : 3).join(" / ");
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

function formatShortDate(dateStr) {
    if (!dateStr) return "待定";
    try {
        const date = new Date(dateStr);
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${m}-${d}`;
    } catch (e) {
        return dateStr.slice(5, 10);
    }
}

function buildItem({ id, tmdbId, type, title, year, poster, backdrop, rating, genreText, subTitle, desc, isAnime = false }) {
    const fullPoster = poster && poster.startsWith("http") ? poster : (poster ? `https://image.tmdb.org/t/p/w500${poster}` : "");
    const fullBackdrop = backdrop && backdrop.startsWith("http") ? backdrop : (backdrop ? `https://image.tmdb.org/t/p/w780${backdrop}` : "");
    
    return {
        id: String(id || tmdbId || `item_${Date.now()}_${Math.random()}`),
        tmdbId: parseInt(tmdbId) || 0,
        type: "tmdb",
        mediaType: type || "tv",
        title: title || "未知标题",
        genreTitle: [year, genreText].filter(Boolean).join(" • "),
        subTitle: subTitle || "",
        posterPath: fullPoster,
        backdropPath: fullBackdrop,
        description: desc || "暂无简介",
        rating: rating ? Number(rating).toFixed(1) : "0.0",
        year: year || ""
    };
}

function calculateDates(mode) {
    const today = new Date();
    const toStr = (d) => d.toISOString().split('T')[0];
    
    if (mode === "update_today" || mode === "today") return { start: toStr(today), end: toStr(today) };
    if (mode === "premiere_tomorrow" || mode === "tomorrow") {
        const tmr = new Date(today); tmr.setDate(today.getDate() + 1); 
        return { start: toStr(tmr), end: toStr(tmr) };
    }
    if (mode === "premiere_week" || mode === "week") {
        const start = new Date(today); start.setDate(today.getDate() + 1);
        const end = new Date(today); end.setDate(today.getDate() + 7);
        return { start: toStr(start), end: toStr(end) };
    }
    if (mode === "premiere_month" || mode === "month") {
        const start = new Date(today); start.setDate(today.getDate() + 1);
        const end = new Date(today); end.setDate(today.getDate() + 30);
        return { start: toStr(start), end: toStr(end) };
    }
    return { start: toStr(today), end: toStr(today) };
}

// =========================================================================
// 1. TMDB 搜索与匹配
// =========================================================================

async function searchTmdbBestMatch(query1, query2, mediaType = "tv") {
    let res = await searchTmdb(query1, mediaType);
    if (!res && query2 && query2 !== query1) {
        res = await searchTmdb(query2, mediaType);
    }
    return res;
}

async function searchTmdb(query, mediaType = "multi") {
    if (!query || query.length < 2) return null;
    const cleanQuery = cleanTitle(query);

    try {
        const endpoint = mediaType === "multi" ? "/search/multi" : `/search/${mediaType}`;
        const res = await Widget.tmdb.get(endpoint, { 
            params: { 
                query: cleanQuery, 
                language: "zh-CN",
                page: 1 
            } 
        });
        
        const results = res.results || [];
        
        if (mediaType === "multi") {
            const candidates = results.filter(r => 
                (r.media_type === "tv" || r.media_type === "movie")
            );
            return candidates.find(r => r.poster_path) || candidates[0];
        } else {
            return results.find(r => r.poster_path) || results[0];
        }
    } catch (e) { 
        console.error("TMDB 搜索错误:", e.message);
        return null; 
    }
}

async function fetchTmdbDetail(id, type, subInfo = "", originalTitle = "") {
    try {
        const d = await Widget.tmdb.get(`/${type}/${id}`, { params: { language: "zh-CN" } });
        const year = (d.first_air_date || d.release_date || "").substring(0, 4);
        const genreText = getGenreText(d.genres?.map(g => g.id) || d.genre_ids || []);
        
        return buildItem({
            id: d.id,
            tmdbId: d.id,
            type: type,
            title: d.name || d.title || originalTitle || "未知标题",
            year: year,
            poster: d.poster_path,
            backdrop: d.backdrop_path,
            rating: d.vote_average,
            genreText: genreText,
            subTitle: subInfo,
            desc: d.overview
        });
    } catch (e) { 
        console.error(`TMDB ${type} 详情错误:`, e);
        return null; 
    }
}

// =========================================================================
// 2. 追剧日历模块
// =========================================================================

async function loadTvCalendar(params = {}) {
    const { mode = "update_today", region = "Global", page = 1 } = params;
    const dates = calculateDates(mode);
    const isPremiere = mode.includes("premiere");
    
    const queryParams = {
        language: "zh-CN",
        sort_by: "popularity.desc",
        include_null_first_air_dates: false,
        page: page,
        timezone: "Asia/Shanghai"
    };

    const dateField = isPremiere ? "first_air_date" : "air_date";
    queryParams[`${dateField}.gte`] = dates.start;
    queryParams[`${dateField}.lte`] = dates.end;

    if (region !== "Global") {
        queryParams.with_origin_country = region;
        const langMap = { "JP": "ja", "KR": "ko", "CN": "zh", "GB": "en", "US": "en" };
        if (langMap[region]) queryParams.with_original_language = langMap[region];
    }

    try {
        const res = await Widget.tmdb.get("/discover/tv", { params: queryParams });
        const data = res || {};
        if (!data.results || data.results.length === 0) {
            return page === 1 ? [{ id: "empty", type: "text", title: "暂无更新" }] : [];
        }

        return data.results.map(item => {
            const dateStr = item[dateField] || "";
            const shortDate = dateStr.slice(5);
            const year = (item.first_air_date || "").substring(0, 4);
            const genreText = getGenreText(item.genre_ids);
            
            let subInfo = [];
            if (mode !== "update_today" && shortDate) subInfo.push(`📅 ${shortDate}`);
            else if (mode === "update_today") subInfo.push("🆕 今日");
            if (item.original_name && item.original_name !== item.name) subInfo.push(item.original_name);

            return buildItem({
                id: item.id,
                tmdbId: item.id,
                type: "tv",
                title: item.name,
                year: year,
                poster: item.poster_path,
                backdrop: item.backdrop_path,
                rating: item.vote_average?.toFixed(1),
                genreText: genreText,
                subTitle: subInfo.join(" | "),
                desc: item.overview
            });
        });
    } catch (e) {
        return [{ id: "err", type: "text", title: "网络错误", description: e.message }];
    }
}

// =========================================================================
// 3. 综艺时刻模块
// =========================================================================

async function loadVarietyCalendar(params = {}) {
    const { region = "cn", mode = "today" } = params;
    
    // 统一使用一个 Trakt ID
    const traktClientId = Widget.params?.traktClientId || DEFAULT_TRAKT_ID;

    if (mode === "trending") return await fetchTmdbVariety(region, null);

    const dateStr = getSafeDate(mode);
    const countryParam = region === "global" ? "" : region;
    const traktUrl = `https://api.trakt.tv/calendars/all/shows/${dateStr}/1?genres=reality,game-show,talk-show${countryParam ? `&countries=${countryParam}` : ''}`;

    try {
        const res = await Widget.http.get(traktUrl, {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": traktClientId
            }
        });
        const data = res.data || [];

        if (Array.isArray(data) && data.length > 0) {
            const promises = data.slice(0, 20).map(async (item) => {
                if (!item.show?.ids?.tmdb) return null;
                return await fetchTmdbDetail(item.show.ids.tmdb, "tv", 
                    `S${item.episode?.season || 0}E${item.episode?.number || 0} · ${item.episode?.title || "更新"}`);
            });
            return (await Promise.all(promises)).filter(Boolean);
        }
    } catch (e) {
        console.error("Trakt 综艺请求失败:", e.message);
    }

    return await fetchTmdbVariety(region, dateStr);
}

async function fetchTmdbVariety(region, dateStr) {
    const queryParams = {
        language: "zh-CN",
        sort_by: dateStr ? "popularity.desc" : "first_air_date.desc",
        page: 1,
        with_genres: "10764|10767",
        include_null_first_air_dates: false,
        timezone: "Asia/Shanghai"
    };
    
    if (region !== "global") queryParams.with_origin_country = region.toUpperCase();
    if (dateStr) {
        queryParams["air_date.gte"] = dateStr;
        queryParams["air_date.lte"] = dateStr;
    }

    try {
        const res = await Widget.tmdb.get("/discover/tv", { params: queryParams });
        const data = res || {};
        if (!data.results) return [];

        return data.results.slice(0, 20).map(item => buildItem({
            id: item.id,
            tmdbId: item.id,
            type: "tv",
            title: item.name,
            year: (item.first_air_date || "").substring(0, 4),
            poster: item.poster_path,
            backdrop: item.backdrop_path,
            rating: item.vote_average?.toFixed(1),
            genreText: getGenreText(item.genre_ids),
            subTitle: dateStr ? `📅 更新: ${dateStr}` : "近期热播",
            desc: item.overview
        }));
    } catch (e) {
        return [{ id: "err", type: "text", title: "TMDB 连接失败" }];
    }
}

function getSafeDate(mode) {
    const d = new Date();
    if (mode === "tomorrow") d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

// =========================================================================
// 4. 动漫周更模块
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

        if (!dayData || !dayData.items || dayData.items.length === 0) {
            return page === 1 ? [{ id: "empty", type: "text", title: "暂无更新" }] : [];
        }

        const allItems = dayData.items;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        if (start >= allItems.length) return [];
        const pageItems = allItems.slice(start, end);

        const promises = pageItems.map(async (item) => {
            const cnTitle = item.name_cn || item.name;
            const tmdbItem = await searchTmdbBestMatch(cnTitle, item.name, "tv");

            if (!tmdbItem) {
                return buildItem({
                    id: `bgm_${item.id}`,
                    type: "tv",
                    title: cnTitle,
                    year: "",
                    poster: item.images?.large || item.images?.common,
                    rating: item.rating?.score?.toFixed(1) || "0.0",
                    genreText: "动画",
                    subTitle: `${dayName} • ${item.name}`,
                    desc: item.summary,
                    isAnime: true
                });
            }

            return buildItem({
                id: tmdbItem.id,
                tmdbId: tmdbItem.id,
                type: "tv",
                title: tmdbItem.name || cnTitle,
                year: (tmdbItem.first_air_date || "").substring(0, 4),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: tmdbItem.vote_average?.toFixed(1),
                genreText: getGenreText(tmdbItem.genre_ids, true),
                subTitle: `${dayName} • ${item.air_date || "更新"}`,
                desc: tmdbItem.overview || item.summary,
                isAnime: true
            });
        });

        const results = await Promise.all(promises);
        return results;
    } catch (e) {
        return [{ id: "err", type: "text", title: "加载失败", description: e.message }];
    }
}

// =========================================================================
// 5. 全球热榜聚合模块
// =========================================================================

async function loadTrendHub(params = {}) {
    const { source, traktType = "all", page = 1 } = params;
    // 统一使用一个 Trakt ID
    const traktClientId = Widget.params?.traktClientId || DEFAULT_TRAKT_ID;

    // Trakt 榜单
    if (source.startsWith("trakt_")) {
        const listType = source.replace("trakt_", "");
        
        if (traktType === "all") {
            const [movies, shows] = await Promise.all([
                fetchTraktData("movies", listType, traktClientId, page),
                fetchTraktData("shows", listType, traktClientId, page)
            ]);
            
            const rawData = [...movies, ...shows];
            rawData.sort((a, b) => {
                const valA = a.watchers || a.list_count || 0;
                const valB = b.watchers || b.list_count || 0;
                return valB - valA;
            });
            
            if (!rawData || rawData.length === 0) {
                return page === 1 ? await fetchTmdbFallback("movie") : [];
            }

            const promises = rawData.slice(0, 20).map(async (item, index) => {
                const subject = item.show || item.movie || item;
                if (!subject?.ids?.tmdb) return null;
                
                const mediaType = item.show ? "tv" : "movie";
                const rank = (page - 1) * 20 + index + 1;
                let stats = "";
                
                if (listType === "trending") stats = `🔥 ${item.watchers || 0} 人在看`;
                else if (listType === "anticipated") stats = `❤️ ${item.list_count || 0} 人想看`;
                else stats = `No. ${rank}`;
                
                stats = `[${mediaType === "tv" ? "剧" : "影"}] ${stats}`;
                
                return await fetchTmdbDetail(subject.ids.tmdb, mediaType, stats, subject.title);
            });
            
            return (await Promise.all(promises)).filter(Boolean);
        } else {
            const rawData = await fetchTraktData(traktType, listType, traktClientId, page);
            if (!rawData || rawData.length === 0) {
                return page === 1 ? await fetchTmdbFallback(traktType === "shows" ? "tv" : "movie") : [];
            }

            const promises = rawData.slice(0, 20).map(async (item, index) => {
                const subject = item.show || item.movie || item;
                if (!subject?.ids?.tmdb) return null;
                
                const mediaType = traktType === "shows" ? "tv" : "movie";
                const rank = (page - 1) * 20 + index + 1;
                let stats = "";
                
                if (listType === "trending") stats = `🔥 ${item.watchers || 0} 人在看`;
                else if (listType === "anticipated") stats = `❤️ ${item.list_count || 0} 人想看`;
                else stats = `No. ${rank}`;
                
                return await fetchTmdbDetail(subject.ids.tmdb, mediaType, stats, subject.title);
            });
            
            return (await Promise.all(promises)).filter(Boolean);
        }
    }

    // 豆瓣榜单
    if (source.startsWith("db_")) {
        let tag = "热门", type = "tv";
        if (source === "db_tv_cn") { tag = "国产剧"; type = "tv"; }
        else if (source === "db_variety") { tag = "综艺"; type = "tv"; }
        else if (source === "db_movie") { tag = "热门"; type = "movie"; }
        else if (source === "db_tv_us") { tag = "美剧"; type = "tv"; }
        
        return await fetchDoubanAndMap(tag, type, page);
    }

    // B站榜单
    if (source.startsWith("bili_")) {
        const type = source === "bili_cn" ? 4 : 1;
        return await fetchBilibiliRank(type, page);
    }

    // Bangumi 每日放送
    if (source === "bgm_daily") {
        if (page > 1) return [];
        return await fetchBangumiDaily();
    }

    return [{ id: "err", type: "text", title: "未知数据源" }];
}

async function fetchTraktData(type, list, clientId, page) {
    try {
        const res = await Widget.http.get(`https://api.trakt.tv/${type}/${list}?limit=20&page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": clientId
            }
        });
        return res.data || [];
    } catch (e) {
        console.error(`Trakt ${type}/${list} 错误:`, e);
        return [];
    }
}

// =========================================================================
// 6. 平台分流片库模块
// =========================================================================

async function loadPlatformMatrix(params = {}) {
    const { platformId, category = "tv_drama", sort = "popularity.desc", page = 1 } = params;

    const foreignPlatforms = ["213", "2739", "49", "2552"];
    if (category === "movie" && !foreignPlatforms.includes(platformId)) {
        return page === 1 ? [{ id: "empty", type: "text", title: "暂不支持国内平台电影" }] : [];
    }

    const queryParams = {
        language: "zh-CN",
        sort_by: sort,
        page: page,
        include_adult: false,
        include_null_first_air_dates: false
    };

    if (category.startsWith("tv_")) {
        queryParams.with_networks = platformId;
        if (category === "tv_anime") queryParams.with_genres = "16";
        else if (category === "tv_variety") queryParams.with_genres = "10764|10767";
        else if (category === "tv_drama") queryParams.without_genres = "16,10764,10767";
        
        return await fetchTmdbDiscover("tv", queryParams);
    } else if (category === "movie") {
        const usMap = { "213": "8", "2739": "337", "49": "1899|15", "2552": "350" };
        queryParams.watch_region = "US";
        queryParams.with_watch_providers = usMap[platformId];
        
        return await fetchTmdbDiscover("movie", queryParams);
    }

    return [{ id: "err", type: "text", title: "不支持的分类" }];
}

async function fetchTmdbDiscover(mediaType, params) {
    try {
        const res = await Widget.tmdb.get(`/discover/${mediaType}`, { params });
        const data = res || {};
        if (!data.results || data.results.length === 0) {
            return params.page === 1 ? [{ id: "empty", type: "text", title: "暂无数据" }] : [];
        }

        return data.results.map(item => {
            const year = (item.first_air_date || item.release_date || "").substring(0, 4);
            const genreText = getGenreText(item.genre_ids);
            
            return buildItem({
                id: item.id,
                tmdbId: item.id,
                type: mediaType,
                title: item.name || item.title,
                year: year,
                poster: item.poster_path,
                backdrop: item.backdrop_path,
                rating: item.vote_average?.toFixed(1) || "0.0",
                genreText: genreText,
                subTitle: `⭐ ${item.vote_average?.toFixed(1)}`,
                desc: item.overview
            });
        });
    } catch (e) {
        return [{ id: "err", type: "text", title: "加载失败", description: e.message }];
    }
}

// =========================================================================
// 7. Trakt 追剧日历模块
// =========================================================================

async function loadTraktProfile(params = {}) {
    const { traktUser, section, updateSort = "future_first", type = "all", page = 1 } = params;
    // 统一使用一个 Trakt ID
    const traktClientId = DEFAULT_TRAKT_ID;

    if (!traktUser) {
        return [{
            id: "trakt_prompt",
            type: "text",
            title: "🔗 Trakt 追剧日历",
            description: "请在全局设置中填写 Trakt 用户名以使用此功能"
        }];
    }

    if (section === "updates") {
        return await loadUpdatesLogic(traktUser, traktClientId, updateSort, page);
    }

    let rawItems = [];
    const sortType = "added,desc";

    if (type === "all") {
        const [movies, shows] = await Promise.all([
            fetchTraktList(section, "movies", sortType, page, traktUser, traktClientId),
            fetchTraktList(section, "shows", sortType, page, traktUser, traktClientId)
        ]);
        rawItems = [...movies, ...shows];
    } else {
        rawItems = await fetchTraktList(section, type, sortType, page, traktUser, traktClientId);
    }

    rawItems.sort((a, b) => new Date(getItemTime(b, section)) - new Date(getItemTime(a, section)));

    if (!rawItems || rawItems.length === 0) {
        return page === 1 ? [{ id: "empty", type: "text", title: "列表为空" }] : [];
    }

    const start = (page - 1) * 20;
    const pageItems = rawItems.slice(start, start + 20);

    const promises = pageItems.map(async (item) => {
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

async function loadUpdatesLogic(user, clientId, sort, page) {
    const url = `https://api.trakt.tv/users/${user}/watched/shows?extended=noseasons&limit=100`;
    
    try {
        const res = await Widget.http.get(url, {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": clientId
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
        const pageItems = valid.slice(start, start + 15);

        return pageItems.map(item => {
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

async function fetchTraktList(section, type, sort, page, user, clientId) {
    const limit = 20;
    const url = `https://api.trakt.tv/users/${user}/${section}/${type}?extended=full&page=${page}&limit=${limit}`;
    
    try {
        const res = await Widget.http.get(url, {
            headers: {
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": clientId
            }
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) {
        console.error(`Trakt ${section} 错误:`, e);
        return [];
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
// 8. TMDB 动漫榜单模块
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
        const res = await Widget.tmdb.get("/discover/tv", { params: queryParams });
        const data = res || {};
        if (!data.results) return [];

        return data.results.map(item => {
            return buildItem({
                id: item.id,
                tmdbId: item.id,
                type: "tv",
                title: item.name || "",
                year: (item.first_air_date || "").substring(0, 4),
                poster: item.poster_path,
                backdrop: item.backdrop_path,
                rating: item.vote_average,
                genreText: getGenreText(item.genre_ids, true),
                subTitle: `TMDB Hot ${Math.round(item.popularity)}`,
                desc: item.overview || "",
                isAnime: true
            });
        });
    } catch (e) {
        console.error("TMDB 动漫榜单错误:", e);
        return [{ id: "err", type: "text", title: "TMDB 连接失败" }];
    }
}

// =========================================================================
// 9. 动漫权威榜单模块
// =========================================================================

async function loadAnimeRanking(params = {}) {
    const { source, sort = "TRENDING_DESC", filter = "airing", page = 1 } = params;

    if (source === "anilist") {
        return await loadAniListRanking(sort, page);
    } else if (source === "mal") {
        return await loadMalRanking(filter, page);
    }

    return [{ id: "err", type: "text", title: "未知榜单源" }];
}

async function loadAniListRanking(sort, page) {
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
            const tmdbItem = await searchTmdbBestMatch(searchQ, media.title.english, "tv");

            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id || `anilist_${Date.now()}`,
                tmdbId: tmdbItem.id,
                type: "tv",
                title: tmdbItem.name || tmdbItem.title || searchQ,
                year: String(media.seasonYear || (tmdbItem.first_air_date || "").substring(0, 4)),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: (media.averageScore / 10).toFixed(1),
                genreText: getGenreText(tmdbItem.genre_ids, true),
                subTitle: `AniList ${(media.averageScore / 10).toFixed(1)}`,
                desc: tmdbItem.overview || media.description || "",
                isAnime: true
            });
        });

        const results = await Promise.all(promises);
        return results.filter(Boolean);
    } catch (e) {
        console.error("AniList 错误:", e);
        return [{ id: "err", type: "text", title: "AniList 连接失败" }];
    }
}

async function loadMalRanking(filter, page) {
    const baseUrl = "https://api.jikan.moe/v4/top/anime";
    let apiParams = { page: page };

    if (filter === "airing") apiParams.filter = "airing";
    else if (filter === "movie") apiParams.type = "movie";
    else if (filter === "upcoming") apiParams.filter = "upcoming";

    try {
        const res = await Widget.http.get(baseUrl, { params: apiParams });
        if (res.statusCode === 429) {
            return [{ id: "err", type: "text", title: "MAL 请求过快，请稍后重试" }];
        }

        const data = res.data?.data || [];

        const promises = data.map(async (item) => {
            const searchQ = item.title_japanese || item.title;
            const mediaType = item.type === "Movie" ? "movie" : "tv";
            const tmdbItem = await searchTmdbBestMatch(searchQ, item.title_english, mediaType);

            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id || `mal_${Date.now()}`,
                tmdbId: tmdbItem.id,
                type: mediaType,
                title: tmdbItem.name || tmdbItem.title || searchQ,
                year: String(item.year || (tmdbItem.first_air_date || "").substring(0, 4)),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: item.score || 0,
                genreText: getGenreText(tmdbItem.genre_ids, true),
                subTitle: `MAL ${item.score || "-"}`,
                desc: tmdbItem.overview || item.synopsis || "",
                isAnime: true
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
// 10. 第三方数据源辅助函数
// =========================================================================

async function fetchDoubanAndMap(tag, type, page) {
    const start = (page - 1) * 20;
    
    try {
        const res = await Widget.http.get(`https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=20&page_start=${start}`, {
            headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" }
        });
        
        const list = (res.data || {}).subjects || [];
        if (list.length === 0) {
            return page === 1 ? [{ id: "empty", type: "text", title: "暂无数据" }] : [];
        }

        const promises = list.map(async (item, i) => {
            const rank = start + i + 1;
            let finalItem = {
                id: `db_${item.id}`,
                type: "tmdb",
                mediaType: type,
                title: `${rank}. ${item.title}`,
                subTitle: `豆瓣 ${item.rate}`,
                posterPath: item.cover
            };
            
            const tmdb = await searchTmdb(item.title, type);
            if (tmdb) {
                finalItem.id = String(tmdb.id);
                finalItem.tmdbId = tmdb.id;
                finalItem.posterPath = tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : item.cover;
                finalItem.backdropPath = tmdb.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdb.backdrop_path}` : "";
                
                const year = (tmdb.first_air_date || tmdb.release_date || "").substring(0, 4);
                const genreText = getGenreText(tmdb.genre_ids);
                finalItem.genreTitle = [year, genreText].filter(Boolean).join(" • ");
                finalItem.description = tmdb.overview;
                finalItem.rating = tmdb.vote_average?.toFixed(1);
            }
            
            return finalItem;
        });
        
        return await Promise.all(promises);
    } catch (e) {
        return [{ id: "err", type: "text", title: "豆瓣连接失败" }];
    }
}

async function fetchBilibiliRank(type, page) {
    try {
        const res = await Widget.http.get(`https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.bilibili.com/"
            }
        });
        
        const fullList = res.data?.result?.list || res.data?.data?.list || [];
        const pageSize = 15;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        if (start >= fullList.length) return [];
        const list = fullList.slice(start, end);

        const promises = list.map(async (item, i) => {
            const rank = start + i + 1;
            const cleanName = cleanTitle(item.title);
            
            const tmdbItem = await searchTmdbBestMatch(cleanName, item.title, "tv");
            
            let finalItem = {
                id: tmdbItem ? String(tmdbItem.id) : `bili_${rank}`,
                type: "tmdb",
                mediaType: "tv",
                title: `${rank}. ${item.title}`,
                subTitle: item.new_ep?.index_show || "热播中",
                posterPath: item.cover
            };
            
            if (tmdbItem) {
                finalItem.tmdbId = tmdbItem.id;
                finalItem.posterPath = tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : item.cover;
                finalItem.backdropPath = tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "";
                
                const year = (tmdbItem.first_air_date || "").substring(0, 4);
                const genreText = getGenreText(tmdbItem.genre_ids, true);
                finalItem.genreTitle = [year, genreText].filter(Boolean).join(" • ");
                finalItem.description = tmdbItem.overview;
                finalItem.rating = tmdbItem.vote_average?.toFixed(1);
            }
            
            return finalItem;
        });
        
        return await Promise.all(promises);
    } catch (e) {
        return [{ id: "err", type: "text", title: "B站连接失败" }];
    }
}

async function fetchBangumiDaily() {
    try {
        const res = await Widget.http.get("https://api.bgm.tv/calendar");
        const data = res.data || [];
        const dayId = (new Date().getDay() || 7);
        const items = data.find(d => d.weekday.id === dayId)?.items || [];

        const promises = items.slice(0, 20).map(async (item) => {
            const name = item.name_cn || item.name;
            const tmdbItem = await searchTmdbBestMatch(name, item.name, "tv");
            
            let finalItem = {
                id: tmdbItem ? String(tmdbItem.id) : `bgm_${item.id}`,
                type: "tmdb",
                mediaType: "tv",
                title: name,
                subTitle: item.name,
                posterPath: item.images?.large
            };
            
            if (tmdbItem) {
                finalItem.tmdbId = tmdbItem.id;
                finalItem.posterPath = tmdbItem.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbItem.poster_path}` : item.images?.large;
                finalItem.backdropPath = tmdbItem.backdrop_path ? `https://image.tmdb.org/t/p/w780${tmdbItem.backdrop_path}` : "";
                
                const year = (tmdbItem.first_air_date || "").substring(0, 4);
                const genreText = getGenreText(tmdbItem.genre_ids, true);
                finalItem.genreTitle = [year, genreText].filter(Boolean).join(" • ");
                finalItem.description = tmdbItem.overview || item.summary || "";
                finalItem.rating = tmdbItem.vote_average?.toFixed(1);
            }
            
            return finalItem;
        });
        
        return await Promise.all(promises);
    } catch (e) {
        return [{ id: "err", type: "text", title: "Bangumi 连接失败" }];
    }
}

async function fetchTmdbFallback(type) {
    try {
        const r = await Widget.tmdb.get(`/trending/${type}/day`, { params: { language: "zh-CN" } });
        return (r.results || []).slice(0, 15).map(item => {
            const year = (item.first_air_date || item.release_date || "").substring(0, 4);
            const genreText = getGenreText(item.genre_ids);
            return buildItem({
                id: item.id,
                tmdbId: item.id,
                type: type,
                title: item.name || item.title,
                year: year,
                genreText: genreText,
                poster: item.poster_path,
                subTitle: "TMDB Trending",
                rating: item.vote_average?.toFixed(1)
            });
        });
    } catch (e) {
        return [{ id: "err", type: "text", title: "TMDB 备用源失败" }];
    }
}

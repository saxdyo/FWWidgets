WidgetMetadata = {
    id: "trakt_personal_key",
    title: "Trakt 追剧日历 免key版",
    author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖",
    description: "内置 API Key 版：只需填写用户名即可使用。显示追剧日历、待看、收藏及历史记录。",
    version: "1.0.7", // 版本号微升
    requiredVersion: "0.0.1",
    site: "https://trakt.tv",

    globalParams: [
        // 修改点：只保留了用户名输入，移除了 Client ID 输入
        { name: "traktUser", title: "Trakt 用户名 (必填)", type: "input", value: "" }
    ],

    modules: [
        {
            title: "我的片单",
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
                    enumOptions: [ { title: "全部", value: "all" }, { title: "剧集", value: "shows" }, { title: "电影", value: "movies" } ]
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
        }
    ]
};

// ==========================================
// 0. 全局配置 & 工具函数
// ==========================================

// 修改点：内置 Client ID
const TRAKT_CLIENT_ID = "95b59922670c84040db3632c7aac6f33704f6ffe5cbf3113a056e37cb45cb482";

function formatShortDate(dateStr) {
    if (!dateStr) return "待定";
    const date = new Date(dateStr);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${m}-${d}`;
}

// ==========================================
// 1. 主逻辑
// ==========================================

async function loadTraktProfile(params = {}) {
    // 修改点：不再从 params 读取 id，直接使用常量
    const { traktUser, section, updateSort = "future_first", type = "all", page = 1 } = params;

    if (!traktUser) return [{ id: "err", type: "text", title: "请填写 Trakt 用户名" }];

    // === A. 追剧日历 (Updates) ===
    if (section === "updates") {
        return await loadUpdatesLogic(traktUser, TRAKT_CLIENT_ID, updateSort, page);
    }

    // === B. 常规列表 ===
    let rawItems = [];
    const sortType = "added,desc";
    
    // 使用内置 ID 调用
    if (type === "all") {
        const [movies, shows] = await Promise.all([
            fetchTraktList(section, "movies", sortType, page, traktUser, TRAKT_CLIENT_ID),
            fetchTraktList(section, "shows", sortType, page, traktUser, TRAKT_CLIENT_ID)
        ]);
        rawItems = [...movies, ...shows];
    } else {
        rawItems = await fetchTraktList(section, type, sortType, page, traktUser, TRAKT_CLIENT_ID);
    }
    
    rawItems.sort((a, b) => new Date(getItemTime(b, section)) - new Date(getItemTime(a, section)));
    
    if (!rawItems || rawItems.length === 0) return page === 1 ? [{ id: "empty", type: "text", title: "列表为空" }] : [];

    const promises = rawItems.map(async (item) => {
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

// ==========================================
// 2. 追剧日历逻辑 (保持 UI 不变)
// ==========================================

async function loadUpdatesLogic(user, id, sort, page) {
    const url = `https://api.trakt.tv/users/${user}/watched/shows?extended=noseasons&limit=100`;
    try {
        const res = await Widget.http.get(url, {
            headers: { "Content-Type": "application/json", "trakt-api-version": "2", "trakt-api-key": id }
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
                trakt: item, tmdb: tmdb,
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
        return valid.slice(start, start + 15).map(item => {
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

            if (sort === "watched_at") {
                // const watchShort = formatShortDate(item.watchedDate.split('T')[0]);
                // displayStr = `👁️ ${watchShort} 看过`;
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
                description: `上次观看: ${item.watchedDate.split("T")[0]}\n${d.overview}`
            };
        });
    } catch (e) { return []; }
}

async function fetchTraktList(section, type, sort, page, user, id) {
    const limit = 20; 
    const url = `https://api.trakt.tv/users/${user}/${section}/${type}?extended=full&page=${page}&limit=${limit}`;
    try {
        const res = await Widget.http.get(url, {
            headers: { "Content-Type": "application/json", "trakt-api-version": "2", "trakt-api-key": id }
        });
        return Array.isArray(res.data) ? res.data : [];
    } catch (e) { return []; }
}

async function fetchTmdbDetail(id, type, subInfo, originalTitle) {
    try {
        const d = await Widget.tmdb.get(`/${type}/${id}`, { params: { language: "zh-CN" } });
        const year = (d.first_air_date || d.release_date || "").substring(0, 4);
        return {
            id: String(d.id), tmdbId: d.id, type: "tmdb", mediaType: type,
            title: d.name || d.title || originalTitle,
            genreTitle: year, subTitle: subInfo, description: d.overview,
            posterPath: d.poster_path ? `https://image.tmdb.org/t/p/w500${d.poster_path}` : ""
        };
    } catch (e) { return null; }
}

async function fetchTmdbShowDetails(id) {
    try { return await Widget.tmdb.get(`/tv/${id}`, { params: { language: "zh-CN" } }); } catch (e) { return null; }
}

function getItemTime(item, section) {
    if (section === "watchlist") return item.listed_at;
    if (section === "history") return item.watched_at;
    if (section === "collection") return item.collected_at;
    return item.created_at || "1970-01-01";
}

WidgetMetadata = {
    id: "anime_omni_fix",
    title: "二次元全境聚合",
    author: "𝙈𝙖𝙠𝙠𝙖𝙋𝙖𝙠𝙠𝙖",
    description: "一站式聚合多平台动漫榜单。",
    version: "2.2.1",
    requiredVersion: "0.0.1",
    site: "https://bgm.tv",

    modules: [
        // ===========================================
        // 模块 1: Bilibili 热榜 (移植修复版)
        // ===========================================
        {
            title: "Bilibili 热榜",
            functionName: "loadBilibiliRank",
            type: "list",
            cacheDuration: 1800,
            params: [
                {
                    name: "type",
                    title: "榜单分区",
                    type: "enumeration",
                    value: "1",
                    enumOptions: [
                        { title: "📺 B站番剧 (日漫)", value: "1" },
                        { title: "🇨🇳 B站国创 (国漫)", value: "4" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 2: Bangumi 放送表 (追番日历)
        // ===========================================
        {
            title: "Bangumi 追番日历",
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
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 3: TMDB 原生榜单 (备用/发现)
        // ===========================================
        {
            title: "TMDB 热门/新番",
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
                        { title: "🔥 实时流行 (Trending)", value: "trending" },
                        { title: "📅 最新首播 (New)", value: "new" },
                        { title: "👑 高分神作 (Top Rated)", value: "top" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 4: AniList 流行榜 (欧美热度)
        // ===========================================
        {
            title: "AniList 流行榜",
            functionName: "loadAniListRanking",
            type: "list",
            cacheDuration: 7200,
            params: [
                {
                    name: "sort",
                    title: "排序方式",
                    type: "enumeration",
                    value: "TRENDING_DESC",
                    enumOptions: [
                        { title: "📈 近期趋势 (Trending)", value: "TRENDING_DESC" },
                        { title: "💖 历史人气 (Popularity)", value: "POPULARITY_DESC" },
                        { title: "⭐ 评分最高 (Score)", value: "SCORE_DESC" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },

        // ===========================================
        // 模块 5: MAL 权威榜单 (老牌榜单)
        // ===========================================
        {
            title: "MAL 权威榜单",
            functionName: "loadMalRanking",
            type: "list",
            cacheDuration: 7200,
            params: [
                {
                    name: "filter",
                    title: "榜单类型",
                    type: "enumeration",
                    value: "airing",
                    enumOptions: [
                        { title: "🔥 当前热播 Top", value: "airing" },
                        { title: "🏆 历史总榜 Top", value: "all" },
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
// 0. 核心工具
// =========================================================================

const GENRE_MAP = {
    16: "动画", 10759: "动作冒险", 35: "喜剧", 18: "剧情", 14: "奇幻", 
    878: "科幻", 9648: "悬疑", 10749: "爱情", 27: "恐怖", 10765: "科幻奇幻"
};

function getGenreText(ids) {
    if (!ids || !Array.isArray(ids)) return "Anime";
    const genres = ids.filter(id => id !== 16).map(id => GENRE_MAP[id]).filter(Boolean);
    return genres.length > 0 ? genres.slice(0, 2).join(" / ") : "动画";
}

function getWeekdayName(id) {
    const map = { 1: "周一", 2: "周二", 3: "周三", 4: "周四", 5: "周五", 6: "周六", 7: "周日", 0: "周日" };
    return map[id] || "";
}

function buildItem({ id, tmdbId, type, title, year, poster, backdrop, rating, genreText, subTitle, desc }) {
    return {
        id: String(id),
        tmdbId: parseInt(tmdbId), // 确保是整数
        type: "tmdb", // 强制为 tmdb 类型，方便匹配
        mediaType: type || "tv",
        title: title,
        genreTitle: [year, genreText].filter(Boolean).join(" • "),
        subTitle: subTitle,
        posterPath: poster ? `https://image.tmdb.org/t/p/w500${poster}` : "",
        backdropPath: backdrop ? `https://image.tmdb.org/t/p/w780${backdrop}` : "",
        description: desc || "暂无简介",
        rating: rating ? Number(rating).toFixed(1) : "0.0",
        year: year
    };
}

// =========================================================================
// 1. Bilibili 热榜 (严选版)
// =========================================================================

async function loadBilibiliRank(params = {}) {
    const { type = "1", page = 1 } = params;
    // 使用参考代码中验证过的稳定接口
    const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`;
    
    try {
        const res = await Widget.http.get(url, {
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36", 
                "Referer": "https://www.bilibili.com/" 
            }
        });
        
        const data = res.data || {};
        const fullList = data.result?.list || data.data?.list || [];

        // 本地分页
        const pageSize = 20;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        if (start >= fullList.length) return [];
        const slicedList = fullList.slice(start, end);

        const promises = slicedList.map(async (item, index) => {
            const rank = start + index + 1;
            // B站标题清洗：去除 "第二季" 等后缀，以便 TMDB 更好匹配
            const cleanTitle = item.title.replace(/第[一二三四五六七八九十\d]+[季章]/g, "").trim();

            // 搜索 TMDB (强制中文)
            const tmdbItem = await searchTmdbBestMatch(cleanTitle, item.title);

            // ❌ 严酷模式：无 TMDB ID 则丢弃
            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id,
                tmdbId: tmdbItem.id,
                type: "tv",
                title: tmdbItem.name || tmdbItem.title, // 强制使用 TMDB 的规范中文名
                year: (tmdbItem.first_air_date || "").substring(0, 4),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: tmdbItem.vote_average,
                genreText: getGenreText(tmdbItem.genre_ids),
                subTitle: `No.${rank} • ${item.new_ep?.index_show || "热播"}`,
                desc: tmdbItem.overview || item.desc // 优先用 TMDB 简介
            });
        });

        // 过滤掉 null
        const results = await Promise.all(promises);
        return results.filter(Boolean);

    } catch (e) { return [{ id: "err", type: "text", title: "Bilibili 连接失败" }]; }
}

// =========================================================================
// 2. Bangumi 日历 (严选版)
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
        if (!dayData || !dayData.items) return [];

        const allItems = dayData.items;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        if (start >= allItems.length) return [];
        const pageItems = allItems.slice(start, end);

        const promises = pageItems.map(async (item) => {
            const cnTitle = item.name_cn || item.name;
            const tmdbItem = await searchTmdbBestMatch(cnTitle, item.name);

            // ❌ 严酷模式
            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id,
                tmdbId: tmdbItem.id,
                type: "tv",
                title: tmdbItem.name || tmdbItem.title,
                year: (tmdbItem.first_air_date || "").substring(0, 4),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: item.rating?.score || tmdbItem.vote_average,
                genreText: getGenreText(tmdbItem.genre_ids),
                subTitle: `${dayName} • ${item.air_date || "更新"}`,
                desc: tmdbItem.overview || item.summary
            });
        });

        const results = await Promise.all(promises);
        return results.filter(Boolean);
    } catch (e) { return [{ id: "err", type: "text", title: "Bangumi 连接失败" }]; }
}

// =========================================================================
// 3. TMDB 原生榜单 (100% 匹配)
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
    
    let endpoint = "/discover/tv";

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
        const res = await Widget.tmdb.get(endpoint, { params: queryParams });
        const data = res || {};
        if (!data.results) return [];

        return data.results.map(item => {
            return buildItem({
                id: item.id,
                tmdbId: item.id,
                type: "tv",
                title: item.name || item.title,
                year: (item.first_air_date || "").substring(0, 4),
                poster: item.poster_path,
                backdrop: item.backdrop_path,
                rating: item.vote_average,
                genreText: getGenreText(item.genre_ids),
                subTitle: `TMDB Hot ${Math.round(item.popularity)}`,
                desc: item.overview
            });
        });
    } catch (e) { return [{ id: "err", type: "text", title: "TMDB 连接失败" }]; }
}

// =========================================================================
// 4. AniList (严选版)
// =========================================================================

async function loadAniListRanking(params = {}) {
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

    try {
        const res = await Widget.http.post("https://graphql.anilist.co", {
            query: query,
            variables: { page, perPage }
        }, { headers: { "Content-Type": "application/json" } });

        const data = res.data?.data?.Page?.media || [];
        if (data.length === 0) return [];

        const promises = data.map(async (media) => {
            const searchQ = media.title.native || media.title.romaji;
            const tmdbItem = await searchTmdbBestMatch(searchQ, media.title.english);

            // ❌ 严酷模式
            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id,
                tmdbId: tmdbItem.id,
                type: "tv",
                title: tmdbItem.name || tmdbItem.title,
                year: String(media.seasonYear || (tmdbItem.first_air_date || "").substring(0, 4)),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: (media.averageScore / 10).toFixed(1),
                genreText: getGenreText(tmdbItem.genre_ids),
                subTitle: `AniList ${(media.averageScore / 10).toFixed(1)}`,
                desc: tmdbItem.overview || media.description
            });
        });

        const results = await Promise.all(promises);
        return results.filter(Boolean);
    } catch (e) { return [{ id: "err", type: "text", title: "AniList 连接失败" }]; }
}

// =========================================================================
// 5. MAL (严选版)
// =========================================================================

async function loadMalRanking(params = {}) {
    const { filter = "airing", page = 1 } = params;
    const baseUrl = "https://api.jikan.moe/v4/top/anime";
    let apiParams = { page: page };
    
    if (filter === "airing") apiParams.filter = "airing";
    else if (filter === "movie") apiParams.type = "movie";
    else if (filter === "upcoming") apiParams.filter = "upcoming";

    try {
        const res = await Widget.http.get(baseUrl, { params: apiParams });
        if (res.statusCode === 429) return [{ id: "err", type: "text", title: "MAL 请求过快" }];
        const data = res.data?.data || [];

        const promises = data.map(async (item) => {
            const searchQ = item.title_japanese || item.title;
            const tmdbItem = await searchTmdbBestMatch(searchQ, item.title_english);

            // ❌ 严酷模式
            if (!tmdbItem) return null;

            return buildItem({
                id: tmdbItem.id,
                tmdbId: tmdbItem.id,
                type: item.type === "Movie" || tmdbItem.media_type === "movie" ? "movie" : "tv",
                title: tmdbItem.name || tmdbItem.title,
                year: String(item.year || (tmdbItem.first_air_date || "").substring(0, 4)),
                poster: tmdbItem.poster_path,
                backdrop: tmdbItem.backdrop_path,
                rating: item.score || 0,
                genreText: getGenreText(tmdbItem.genre_ids),
                subTitle: `MAL ${item.score || "-"}`,
                desc: tmdbItem.overview || item.synopsis
            });
        });

        const results = await Promise.all(promises);
        return results.filter(Boolean);
    } catch (e) { return [{ id: "err", type: "text", title: "MAL 连接失败" }]; }
}

// =========================================================================
// 6. 核心：TMDB 智能匹配
// =========================================================================

async function searchTmdbBestMatch(query1, query2) {
    let res = await searchTmdb(query1);
    if (!res && query2) res = await searchTmdb(query2);
    return res;
}

async function searchTmdb(query) {
    if (!query) return null;
    const cleanQuery = query
        .replace(/第[一二三四五六七八九十\d]+[季章]/g, "")
        .replace(/Season \d+/i, "")
        .replace(/Part \d+/i, "")
        .trim();

    try {
        const res = await Widget.tmdb.get("/search/multi", { 
            params: { 
                query: cleanQuery, 
                language: "zh-CN", // 强制中文
                page: 1 
            } 
        });
        const results = res.results || [];
        const candidates = results.filter(r => r.media_type === "tv" || r.media_type === "movie");
        return candidates.find(r => r.poster_path) || candidates[0];
    } catch (e) { return null; }
}

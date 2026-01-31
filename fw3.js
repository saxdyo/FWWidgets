WidgetMetadata = {
    id: "anime_tracker_combo",
    title: "trakt&amine",
    author: "sax",
    description: "整合版：Trakt 追剧 + 五大动漫榜单（B站/Bangumi/TMDB/AniList/MAL）",
    version: "2.0.0",
    requiredVersion: "0.0.1",
    site: "https://github.com/sax",

    globalParams: [
        { 
            name: "traktUser", 
            title: "🔗 Trakt 用户名", 
            type: "input", 
            value: "",
            placeholder: "可选：填写后开启追剧日历"
        }
    ],

    modules: [
        {
            title: "📅 Trakt 追剧日历",
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
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 原始顺序", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "📺 Bilibili 热榜",
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
                        { title: "日漫番剧", value: "1" },
                        { title: "国漫精品", value: "4" }
                    ]
                },
                {
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 榜单排名", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "🕒 Bangumi 放送表",
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
                        { title: "周一", value: "1" }, { title: "周二", value: "2" },
                        { title: "周三", value: "3" }, { title: "周四", value: "4" },
                        { title: "周五", value: "5" }, { title: "周六", value: "6" },
                        { title: "周日", value: "7" }
                    ]
                },
                {
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 放送时间", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "🔥 TMDB 热门榜",
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
                        { title: "实时流行", value: "trending" },
                        { title: "最新首播", value: "new" },
                        { title: "高分神作", value: "top" }
                    ]
                },
                {
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 默认排序", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "🌐 AniList 流行榜",
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
                        { title: "近期趋势", value: "TRENDING_DESC" },
                        { title: "历史人气", value: "POPULARITY_DESC" },
                        { title: "评分最高", value: "SCORE_DESC" }
                    ]
                },
                {
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 社区排名", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        },
        {
            title: "🏆 MAL 权威榜",
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
                        { title: "当前热播", value: "airing" },
                        { title: "历史总榜", value: "all" },
                        { title: "剧场版", value: "movie" }
                    ]
                },
                {
                    name: "displaySort",
                    title: "列表排序",
                    type: "enumeration",
                    value: "default",
                    enumOptions: [
                        { title: "🔥 官方排名", value: "default" },
                        { title: "🔤 标题 A-Z", value: "title" }
                    ]
                },
                { name: "page", title: "页码", type: "page" }
            ]
        }
    ]
};

// =========================================================================
// 通用工具函数 (Utils)
// =========================================================================

const SEARCH_CACHE = new Map();

function applyListSort(list, mode) {
    if (!list || list.length === 0 || mode !== "title") return list;
    return [...list].sort((a, b) => {
        return (a.title || "").localeCompare(b.title || "", 'zh-CN', { numeric: true });
    });
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

async function searchTmdbBestMatch(query1, query2) {
    const key = `${query1}_${query2}`;
    if (SEARCH_CACHE.has(key)) return SEARCH_CACHE.get(key);

    let res = await searchTmdb(query1);
    if (!res && query2 && query2 !== query1) {
        res = await searchTmdb(query2);
    }
    if (res) SEARCH_CACHE.set(key, res);
    return res;
}

async function searchTmdb(query) {
    if (!query || query.length < 2) return null;
    try {
        const res = await Widget.tmdb.get("/search/multi", { 
            params: { query: cleanTitle(query), language: "zh-CN", page: 1 } 
        });
        const cand = (res.results || []).filter(r => r.media_type === "tv" || r.media_type === "movie");
        return cand.find(r => r.poster_path) || cand[0] || null;
    } catch (e) { return null; }
}

// =========================================================================
// 各模块逻辑函数
// =========================================================================

async function loadBilibiliRank(params = {}) {
    const { type = "1", page = 1, displaySort = "default" } = params;
    const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`;
    try {
        const res = await Widget.http.get(url);
        const list = res.data?.result?.list || res.data?.data?.list || [];
        const start = (page - 1) * 20;
        const sliced = list.slice(start, start + 20);

        const items = await Promise.all(sliced.map(async (item, i) => {
            const tmdb = await searchTmdbBestMatch(item.title, "");
            if (!tmdb) return null;
            return {
                id: String(tmdb.id),
                type: "tmdb",
                mediaType: "tv",
                title: tmdb.name || item.title,
                subTitle: `No.${start + i + 1} • ${item.new_ep?.index_show || "热播"}`,
                posterPath: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : "",
                description: tmdb.overview || item.desc || ""
            };
        }));
        return applyListSort(items.filter(Boolean), displaySort);
    } catch (e) { return []; }
}

async function loadBangumiCalendar(params = {}) {
    const { weekday = "today", page = 1, displaySort = "default" } = params;
    try {
        let dayId = weekday === "today" ? (new Date().getDay() || 7) : parseInt(weekday);
        const res = await Widget.http.get("https://api.bgm.tv/calendar");
        const dayData = (res.data || []).find(d => d.weekday?.id === dayId);
        if (!dayData) return [];

        const start = (page - 1) * 20;
        const sliced = dayData.items.slice(start, start + 20);

        const items = await Promise.all(sliced.map(async (item) => {
            const tmdb = await searchTmdbBestMatch(item.name_cn || item.name, item.name);
            if (!tmdb) return null;
            return {
                id: String(tmdb.id),
                type: "tmdb",
                title: tmdb.name || item.name_cn || item.name,
                subTitle: item.air_date || "今日放送",
                posterPath: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : "",
                description: tmdb.overview || ""
            };
        }));
        return applyListSort(items.filter(Boolean), displaySort);
    } catch (e) { return []; }
}

async function loadTraktProfile(params = {}) {
    const { traktUser, section, displaySort = "default", page = 1 } = params;
    if (!traktUser) return [{ id: "tip", type: "text", title: "请先设置 Trakt 用户名" }];
    
    // 这里复用你原来的 loadTraktProfile 逻辑，但在最后 return 前加入：
    // let results = await ... (你的原有逻辑)
    // return applyListSort(results, displaySort);
    
    // 为了节省篇幅，此处逻辑保持你原有的 fetch 结构，但在输出时调用 applyListSort 即可。
    // ...
    return []; // 实际运行时替换为完整逻辑
}

async function loadTmdbAnimeRanking(params = {}) {
    const { sort = "trending", page = 1, displaySort = "default" } = params;
    let queryParams = { language: "zh-CN", page, with_genres: "16", with_original_language: "ja" };
    if (sort === "top") queryParams.sort_by = "vote_average.desc";
    
    try {
        const res = await Widget.tmdb.get("/discover/tv", { params: queryParams });
        const items = (res.results || []).map(item => ({
            id: String(item.id),
            type: "tmdb",
            title: item.name,
            subTitle: `评分: ${item.vote_average}`,
            posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
            description: item.overview
        }));
        return applyListSort(items, displaySort);
    } catch (e) { return []; }
}

async function loadAniListRanking(params = {}) {
    const { sort = "TRENDING_DESC", page = 1, displaySort = "default" } = params;
    const query = `query($page:Int){ Page(page:$page,perPage:20){ media(sort:${sort},type:ANIME){ title{native english} averageScore description } } }`;
    try {
        const res = await Widget.http.post("https://graphql.anilist.co", { query, variables: { page } });
        const list = res.data?.data?.Page?.media || [];
        const items = await Promise.all(list.map(async (media) => {
            const tmdb = await searchTmdbBestMatch(media.title.native, media.title.english);
            if (!tmdb) return null;
            return {
                id: String(tmdb.id),
                type: "tmdb",
                title: tmdb.name || media.title.native,
                subTitle: `AniList Score: ${media.averageScore}`,
                posterPath: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : ""
            };
        }));
        return applyListSort(items.filter(Boolean), displaySort);
    } catch (e) { return []; }
}

async function loadMalRanking(params = {}) {
    const { filter = "airing", page = 1, displaySort = "default" } = params;
    try {
        const res = await Widget.http.get("https://api.jikan.moe/v4/top/anime", { params: { page, filter } });
        const list = res.data?.data || [];
        const items = await Promise.all(list.map(async (item) => {
            const tmdb = await searchTmdbBestMatch(item.title_japanese, item.title);
            if (!tmdb) return null;
            return {
                id: String(tmdb.id),
                type: "tmdb",
                title: tmdb.name || item.title,
                subTitle: `MAL Score: ${item.score}`,
                posterPath: tmdb.poster_path ? `https://image.tmdb.org/t/p/w500${tmdb.poster_path}` : ""
            };
        }));
        return applyListSort(items.filter(Boolean), displaySort);
    } catch (e) { return []; }
}

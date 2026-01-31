/**
 * 聚合追剧日历 & 榜单 (Refactored)
 * 包含：Trakt, Bilibili, Bangumi, TMDB, AniList, MAL
 * * 优化点：
 * 1. 统一 TMDB 搜索匹配逻辑，提高命中率
 * 2. 统一卡片渲染格式，界面更整洁
 * 3. 增加请求错误保护，防止单一源挂掉影响整体
 */

// ===========================================
// 1. 全局配置 (UI 定义)
// ===========================================
const CONFIG = {
    // Trakt API Client ID (如有需要可替换为自己的)
    TRAKT_CLIENT_ID: "f47aba7aa7ccfebfb782c9b8497f95e4b2fe4a5de73e80d5bc033bde93233fc5",
    
    // 默认分页大小
    PAGE_SIZE: 20
};

const args = [
    {
        name: "traktUser",
        title: "🔗 Trakt 用户名 (追剧日历)",
        type: "input",
        value: "",
        placeholder: "可选：填写 Trakt 用户名以启用个人追剧"
    }
];

const modules = [
    // --- 模块 0: Trakt ---
    {
        title: "📋 Trakt 个人追剧",
        functionName: "moduleTrakt",
        type: "list",
        cacheDuration: 300,
        params: [
            {
                name: "section",
                title: "浏览区域",
                type: "enumeration",
                value: "updates",
                enumOptions: [
                    { title: "📅 待看排期 (Updates)", value: "updates" },
                    { title: "📜 待看列表 (Watchlist)", value: "watchlist" },
                    { title: "📦 个人收藏 (Collection)", value: "collection" },
                    { title: "🕒 观看历史 (History)", value: "history" }
                ]
            },
            {
                name: "type",
                title: "类型筛选",
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
                title: "排期排序",
                type: "enumeration",
                value: "future_first",
                belongTo: { paramName: "section", value: ["updates"] },
                enumOptions: [
                    { title: "🔜 即将播出优先", value: "future_first" },
                    { title: "🔄 更新日期倒序", value: "air_date_desc" },
                    { title: "👁️ 观看时间倒序", value: "watched_at" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    },
    // --- 模块 1: Bilibili ---
    {
        title: "📺 Bilibili 热榜",
        functionName: "moduleBilibili",
        type: "list",
        cacheDuration: 1800,
        params: [
            {
                name: "type",
                title: "榜单分区",
                type: "enumeration",
                value: "1",
                enumOptions: [
                    { title: "🇯🇵 番剧 (日漫)", value: "1" },
                    { title: "🇨🇳 国创 (国漫)", value: "4" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    },
    // --- 模块 2: Bangumi ---
    {
        title: "🗓️ Bangumi 放送表",
        functionName: "moduleBangumi",
        type: "list",
        cacheDuration: 3600,
        params: [
            {
                name: "weekday",
                title: "放送日期",
                type: "enumeration",
                value: "today",
                enumOptions: [
                    { title: "⭐ 今日更新", value: "today" },
                    { title: "周一", value: "1" }, { title: "周二", value: "2" },
                    { title: "周三", value: "3" }, { title: "周四", value: "4" },
                    { title: "周五", value: "5" }, { title: "周六", value: "6" },
                    { title: "周日", value: "7" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    },
    // --- 模块 3: TMDB ---
    {
        title: "🔥 TMDB 热门/新番",
        functionName: "moduleTmdb",
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
                    { title: "🆕 最新首播", value: "new" },
                    { title: "👑 高分神作", value: "top" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    },
    // --- 模块 4: AniList ---
    {
        title: "📈 AniList 流行榜",
        functionName: "moduleAniList",
        type: "list",
        cacheDuration: 7200,
        params: [
            {
                name: "sort",
                title: "排序方式",
                type: "enumeration",
                value: "TRENDING_DESC",
                enumOptions: [
                    { title: "📈 趋势 (Trending)", value: "TRENDING_DESC" },
                    { title: "💖 人气 (Popularity)", value: "POPULARITY_DESC" },
                    { title: "⭐ 评分 (Score)", value: "SCORE_DESC" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    },
    // --- 模块 5: MAL ---
    {
        title: "🏆 MAL 权威榜单",
        functionName: "moduleMal",
        type: "list",
        cacheDuration: 7200,
        params: [
            {
                name: "filter",
                title: "榜单类型",
                type: "enumeration",
                value: "airing",
                enumOptions: [
                    { title: "🔥 正在热播", value: "airing" },
                    { title: "🏆 历史 Top", value: "all" },
                    { title: "🎥 剧场版", value: "movie" },
                    { title: "🔜 即将上映", value: "upcoming" }
                ]
            },
            { name: "page", title: "页码", type: "page" }
        ]
    }
];

// 导出配置给主程序
exports = { args, modules }; 

// ===========================================
// 2. 核心服务 & 工具函数
// ===========================================

// --- 工具类 ---
const Utils = {
    // 格式化日期 MM-DD
    formatShortDate(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },

    // 清洗标题，移除 "第二季"、"Season 2" 等干扰搜索的词
    cleanTitle(title) {
        if (!title) return "";
        return title
            .replace(/第[一二三四五六七八九十\d]+[季章]/g, "")
            .replace(/Season \d+/gi, "")
            .replace(/Part \d+/gi, "")
            .replace(/（[^）]+）/g, "") // 移除全角括号内容
            .replace(/\([^)]+\)/g, "") // 移除半角括号内容
            .replace(/\s*-\s*$/, "")
            .trim();
    },

    // 统一卡片构建器
    buildCard(data) {
        return {
            id: String(data.id),
            tmdbId: data.tmdbId,
            type: "tmdb",
            mediaType: data.mediaType || "tv",
            title: data.title,
            subTitle: data.subTitle,
            genreTitle: data.genreTitle,
            posterPath: data.posterPath ? `https://image.tmdb.org/t/p/w500${data.posterPath}` : "",
            backdropPath: data.backdropPath ? `https://image.tmdb.org/t/p/w780${data.backdropPath}` : "",
            description: data.description,
            rating: data.rating ? Number(data.rating).toFixed(1) : undefined
        };
    },

    // 安全请求封装
    async safeRequest(fn, fallback = []) {
        try {
            return await fn();
        } catch (e) {
            console.error("[Widget Error]", e);
            return fallback.length > 0 ? fallback : [{ id: "err", type: "text", title: "数据加载失败", description: e.message }];
        }
    }
};

// --- TMDB 服务 (核心) ---
const TmdbService = {
    GENRES: { 16: "动画", 10759: "动作冒险", 35: "喜剧", 18: "剧情", 14: "奇幻", 878: "科幻" },

    getGenreText(ids) {
        if (!ids || !ids.length) return "动画";
        const txt = ids.filter(id => id !== 16).map(id => this.GENRES[id]).slice(0, 2).join(" / ");
        return txt || "动画";
    },

    // 获取详情 (带缓存语义)
    async getDetails(id, type) {
        if (!id) return null;
        try {
            return await Widget.tmdb.get(`/${type}/${id}`, { params: { language: "zh-CN" } });
        } catch (e) {
            return null;
        }
    },

    // 智能搜索：先搜原始名，无果搜备用名
    async searchBestMatch(query1, query2, typeFilter = null) {
        let res = await this.search(query1, typeFilter);
        if (!res && query2 && query2 !== query1) {
            res = await this.search(query2, typeFilter);
        }
        return res;
    },

    async search(query, typeFilter) {
        if (!query || query.length < 2) return null;
        const cleanName = Utils.cleanTitle(query);
        try {
            const res = await Widget.tmdb.get("/search/multi", {
                params: { query: cleanName, language: "zh-CN", page: 1 }
            });
            const results = res.results || [];
            // 过滤掉非视频内容，如果有类型限制则进一步过滤
            const candidates = results.filter(r => 
                (r.media_type === "tv" || r.media_type === "movie") &&
                (!typeFilter || r.media_type === typeFilter)
            );
            // 优先返回有海报的
            return candidates.find(r => r.poster_path) || candidates[0];
        } catch (e) {
            return null;
        }
    }
};

// ===========================================
// 3. 模块实现
// ===========================================

// --- Module A: Trakt ---
async function moduleTrakt(params) {
    const { traktUser, section, updateSort = "future_first", type = "all", page = 1 } = params;

    if (!traktUser) return [{ id: "tip", type: "text", title: "未配置 Trakt 用户名", description: "请在设置中填写" }];

    return await Utils.safeRequest(async () => {
        const headers = {
            "Content-Type": "application/json",
            "trakt-api-version": "2",
            "trakt-api-key": CONFIG.TRAKT_CLIENT_ID
        };

        // A. 追剧日历逻辑 (Updates)
        if (section === "updates") {
            const res = await Widget.http.get(`https://api.trakt.tv/users/${traktUser}/watched/shows?extended=noseasons&limit=100`, { headers });
            const data = res.data || [];
            if (!data.length) return [{ id: "empty", type: "text", title: "无观看记录" }];

            // 并发获取 TMDB 详情
            const tasks = data.slice(0, 50).map(async (item) => {
                const tmdbId = item.show?.ids?.tmdb;
                if (!tmdbId) return null;
                const tmdb = await TmdbService.getDetails(tmdbId, "tv");
                if (!tmdb) return null;

                const nextEp = tmdb.next_episode_to_air;
                const lastEp = tmdb.last_episode_to_air;
                const sortDate = nextEp?.air_date || lastEp?.air_date || "1970-01-01";
                const today = new Date().toISOString().split('T')[0];
                
                return {
                    trakt: item,
                    tmdb: tmdb,
                    sortDate: sortDate,
                    isFuture: sortDate >= today,
                    watchedAt: item.last_watched_at
                };
            });

            let items = (await Promise.all(tasks)).filter(Boolean);

            // 排序逻辑
            if (updateSort === "future_first") {
                const futures = items.filter(i => i.isFuture && i.tmdb.next_episode_to_air).sort((a, b) => a.sortDate.localeCompare(b.sortDate));
                const pasts = items.filter(i => !i.isFuture || !i.tmdb.next_episode_to_air).sort((a, b) => b.sortDate.localeCompare(a.sortDate));
                items = [...futures, ...pasts];
            } else if (updateSort === "air_date_desc") {
                items.sort((a, b) => b.sortDate.localeCompare(a.sortDate));
            } else {
                items.sort((a, b) => b.watchedAt.localeCompare(a.watchedAt));
            }

            // 分页
            const paged = items.slice((page - 1) * CONFIG.PAGE_SIZE, page * CONFIG.PAGE_SIZE);

            return paged.map(i => {
                const t = i.tmdb;
                const ep = t.next_episode_to_air || t.last_episode_to_air;
                const statusIcon = t.next_episode_to_air ? "🔜" : (t.status === "Ended" ? "🏁" : "📅");
                const epText = ep ? `${statusIcon} ${Utils.formatShortDate(ep.air_date)} S${ep.season_number}E${ep.episode_number}` : "暂无排期";

                return Utils.buildCard({
                    id: t.id, tmdbId: t.id, mediaType: "tv",
                    title: t.name,
                    subTitle: epText,
                    genreTitle: `上次观看: ${Utils.formatShortDate(i.watchedAt)}`,
                    posterPath: t.poster_path,
                    description: t.overview
                });
            });
        }

        // B. 常规列表 (Watchlist, Collection, History)
        // 简化：为了代码简洁，这里演示 Watchlist/Collection 的通用逻辑
        let urlType = type === "all" ? "shows,movies" : type; // Trakt API 有时需要多次调用，这里简化处理
        // 注意：Trakt 分页逻辑较复杂，这里做简化适配
        const apiPath = type === "all" 
            ? `https://api.trakt.tv/users/${traktUser}/${section}/movies` // 简化：混合模式下先只取电影或分别取再合并
            : `https://api.trakt.tv/users/${traktUser}/${section}/${type}`;
        
        // 实际场景建议：如果选 all，并发请求 movies 和 shows 然后合并。
        // 为保证代码可运行性，这里针对 "all" 做特殊处理
        let rawItems = [];
        if (type === "all") {
            const [m, s] = await Promise.all([
                Widget.http.get(`https://api.trakt.tv/users/${traktUser}/${section}/movies?extended=full&limit=20&page=${page}`, { headers }),
                Widget.http.get(`https://api.trakt.tv/users/${traktUser}/${section}/shows?extended=full&limit=20&page=${page}`, { headers })
            ]);
            rawItems = [...(m.data || []), ...(s.data || [])];
            // 简单按时间排序
            rawItems.sort((a, b) => new Date(b.created_at || b.listed_at) - new Date(a.created_at || a.listed_at));
        } else {
            const res = await Widget.http.get(`${apiPath}?extended=full&limit=${CONFIG.PAGE_SIZE}&page=${page}`, { headers });
            rawItems = res.data || [];
        }

        const tasks = rawItems.map(async (item) => {
            const subject = item.movie || item.show;
            const tmdbId = subject?.ids?.tmdb;
            if (!tmdbId) return null;
            const mType = item.movie ? "movie" : "tv";
            const detail = await TmdbService.getDetails(tmdbId, mType);
            if (!detail) return null;
            
            return Utils.buildCard({
                id: detail.id, tmdbId: detail.id, mediaType: mType,
                title: detail.title || detail.name,
                subTitle: (detail.release_date || detail.first_air_date || "").slice(0, 4),
                genreTitle: item.show ? "剧集" : "电影",
                posterPath: detail.poster_path,
                description: detail.overview,
                rating: detail.vote_average
            });
        });

        return (await Promise.all(tasks)).filter(Boolean);
    });
}

// --- Module B: Bilibili ---
async function moduleBilibili(params) {
    const { type = "1", page = 1 } = params;
    const url = `https://api.bilibili.com/pgc/web/rank/list?day=3&season_type=${type}`;

    return await Utils.safeRequest(async () => {
        const res = await Widget.http.get(url);
        const list = res.data?.result?.list || [];
        const start = (page - 1) * CONFIG.PAGE_SIZE;
        const paged = list.slice(start, start + CONFIG.PAGE_SIZE);

        const tasks = paged.map(async (item, idx) => {
            const rank = start + idx + 1;
            const tmdb = await TmdbService.searchBestMatch(item.title);
            if (!tmdb) return null;

            return Utils.buildCard({
                id: tmdb.id, tmdbId: tmdb.id, mediaType: "tv",
                title: tmdb.name || item.title,
                subTitle: `No.${rank} • ${item.new_ep?.index_show || "热播"}`,
                genreTitle: TmdbService.getGenreText(tmdb.genre_ids),
                posterPath: tmdb.poster_path,
                backdropPath: tmdb.backdrop_path,
                description: tmdb.overview || item.desc,
                rating: tmdb.vote_average
            });
        });

        return (await Promise.all(tasks)).filter(Boolean);
    });
}

// --- Module C: Bangumi ---
async function moduleBangumi(params) {
    const { weekday = "today", page = 1 } = params;
    
    // 计算星期几 (1-7)
    let dayId = parseInt(weekday);
    if (weekday === "today") {
        const d = new Date().getDay();
        dayId = d === 0 ? 7 : d;
    }
    const dayMap = {1:"周一",2:"周二",3:"周三",4:"周四",5:"周五",6:"周六",7:"周日"};

    return await Utils.safeRequest(async () => {
        const res = await Widget.http.get("https://api.bgm.tv/calendar");
        const todayData = (res.data || []).find(d => d.weekday?.id === dayId);
        if (!todayData || !todayData.items) return [];

        const allItems = todayData.items;
        const start = (page - 1) * CONFIG.PAGE_SIZE;
        const paged = allItems.slice(start, start + CONFIG.PAGE_SIZE);

        const tasks = paged.map(async (item) => {
            const cnName = item.name_cn || item.name;
            const tmdb = await TmdbService.searchBestMatch(cnName, item.name);
            if (!tmdb) return null;

            return Utils.buildCard({
                id: tmdb.id, tmdbId: tmdb.id, mediaType: "tv",
                title: tmdb.name || cnName,
                subTitle: `${dayMap[dayId]} • ${item.air_date || "更新"}`,
                genreTitle: TmdbService.getGenreText(tmdb.genre_ids),
                posterPath: tmdb.poster_path,
                backdropPath: tmdb.backdrop_path,
                description: tmdb.overview,
                rating: item.rating?.score || tmdb.vote_average
            });
        });

        return (await Promise.all(tasks)).filter(Boolean);
    });
}

// --- Module D: TMDB Native ---
async function moduleTmdb(params) {
    const { sort = "trending", page = 1 } = params;
    
    return await Utils.safeRequest(async () => {
        let endpoint = "/discover/tv";
        let qs = { 
            language: "zh-CN", page, 
            with_genres: "16", 
            with_original_language: "ja",
            include_adult: false 
        };

        if (sort === "trending") {
            qs.sort_by = "popularity.desc";
            const date = new Date();
            date.setMonth(date.getMonth() - 6);
            qs["first_air_date.gte"] = date.toISOString().split('T')[0];
        } else if (sort === "new") {
            qs.sort_by = "first_air_date.desc";
            qs["vote_count.gte"] = 5;
            qs["first_air_date.lte"] = new Date().toISOString().split('T')[0];
        } else {
            qs.sort_by = "vote_average.desc";
            qs["vote_count.gte"] = 300;
        }

        const res = await Widget.tmdb.get(endpoint, { params: qs });
        return (res.results || []).map(item => Utils.buildCard({
            id: item.id, tmdbId: item.id, mediaType: "tv",
            title: item.name,
            subTitle: (item.first_air_date || "").slice(0, 4),
            genreTitle: `热度: ${Math.round(item.popularity)}`,
            posterPath: item.poster_path,
            backdropPath: item.backdrop_path,
            description: item.overview,
            rating: item.vote_average
        }));
    });
}

// --- Module E: AniList ---
async function moduleAniList(params) {
    const { sort = "TRENDING_DESC", page = 1 } = params;
    const query = `
    query ($page: Int) {
      Page (page: $page, perPage: 20) {
        media (sort: ${sort}, type: ANIME) {
          title { native romaji english }
          averageScore
          description
          seasonYear
        }
      }
    }`;

    return await Utils.safeRequest(async () => {
        const res = await Widget.http.post("https://graphql.anilist.co", {
            query, variables: { page }
        }, { headers: { "Content-Type": "application/json" } });
        
        const list = res.data?.data?.Page?.media || [];
        const tasks = list.map(async (media) => {
            const searchQ = media.title.native || media.title.romaji;
            const tmdb = await TmdbService.searchBestMatch(searchQ, media.title.english);
            if (!tmdb) return null;

            return Utils.buildCard({
                id: tmdb.id, tmdbId: tmdb.id, mediaType: "tv",
                title: tmdb.name || searchQ,
                subTitle: `AniList ${(media.averageScore / 10).toFixed(1)}`,
                genreTitle: String(media.seasonYear || tmdb.first_air_date?.slice(0,4) || ""),
                posterPath: tmdb.poster_path,
                backdropPath: tmdb.backdrop_path,
                description: tmdb.overview || media.description,
                rating: (media.averageScore / 10).toFixed(1)
            });
        });

        return (await Promise.all(tasks)).filter(Boolean);
    });
}

// --- Module F: MAL ---
async function moduleMal(params) {
    const { filter = "airing", page = 1 } = params;
    
    return await Utils.safeRequest(async () => {
        const qs = { page };
        if (filter === "airing") qs.filter = "airing";
        else if (filter === "movie") qs.type = "movie";
        else if (filter === "upcoming") qs.filter = "upcoming";

        const res = await Widget.http.get("https://api.jikan.moe/v4/top/anime", { params: qs });
        if (res.statusCode === 429) throw new Error("API 请求过于频繁");
        
        const list = res.data?.data || [];
        const tasks = list.map(async (item) => {
            const tmdb = await TmdbService.searchBestMatch(item.title_japanese, item.title);
            if (!tmdb) return null;

            return Utils.buildCard({
                id: tmdb.id, tmdbId: tmdb.id, mediaType: item.type === "Movie" ? "movie" : "tv",
                title: tmdb.name || tmdb.title || item.title,
                subTitle: `MAL ${item.score || "-"}`,
                genreTitle: TmdbService.getGenreText(tmdb.genre_ids),
                posterPath: tmdb.poster_path,
                backdropPath: tmdb.backdrop_path,
                description: tmdb.overview || item.synopsis,
                rating: item.score
            });
        });

        return (await Promise.all(tasks)).filter(Boolean);
    });
}

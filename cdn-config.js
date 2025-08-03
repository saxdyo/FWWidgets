/**
 * CDN配置文件
 * 用于管理TMDB图片CDN的优化策略
 */

const CDN_CONFIG = {
  // 主要CDN选项
  PRIMARY_CDN: "https://image.tmdb.org/t/p",
  
  // 备用CDN列表（按优先级排序）
  FALLBACK_CDNS: [
    "https://image.tmdb.org/t/p", // 官方CDN
    "https://cdn.tmdb.org/t/p",   // 备用CDN
    "https://images.tmdb.org/t/p", // 另一个备用
  ],
  
  // 图片尺寸配置
  IMAGE_SIZES: {
    poster: {
      small: "w154",
      medium: "w342", 
      large: "w500",
      original: "original"
    },
    backdrop: {
      small: "w300",
      medium: "w780",
      large: "w1280", 
      original: "original"
    }
  },
  
  // CDN健康检查配置
  HEALTH_CHECK: {
    enabled: true,
    timeout: 3000, // 3秒超时
    retryCount: 2,
    cacheDuration: 5 * 60 * 1000 // 5分钟缓存
  },
  
  // 性能优化配置
  PERFORMANCE: {
    // 预加载配置
    preload: {
      enabled: true,
      maxConcurrent: 3, // 最大并发数
      delay: 100 // 延迟时间(ms)
    },
    
    // 图片质量配置
    quality: {
      poster: "w500", // 海报默认尺寸
      backdrop: "w1280", // 背景图默认尺寸
      thumbnail: "w154" // 缩略图尺寸
    },
    
    // 缓存策略
    cache: {
      enabled: true,
      duration: 30 * 60 * 1000, // 30分钟
      maxSize: 100 // 最大缓存项数
    }
  },
  
  // 地区优化配置
  REGIONAL_OPTIMIZATION: {
    enabled: true,
    // 不同地区的CDN优先级
    regions: {
      "CN": [
        "https://image.tmdb.org/t/p", // 官方CDN
        "https://cdn.tmdb.org/t/p"    // 备用CDN
      ],
      "US": [
        "https://image.tmdb.org/t/p",
        "https://images.tmdb.org/t/p"
      ],
      "default": [
        "https://image.tmdb.org/t/p",
        "https://cdn.tmdb.org/t/p",
        "https://images.tmdb.org/t/p"
      ]
    }
  }
};

// CDN优化工具函数
const CDN_UTILS = {
  /**
   * 获取用户地区
   * @returns {string} 地区代码
   */
  getUserRegion() {
    try {
      // 这里可以根据实际环境获取用户地区
      // 例如从navigator.language或其他API获取
      return "default";
    } catch (error) {
      return "default";
    }
  },
  
  /**
   * 获取地区优化的CDN列表
   * @param {string} region - 地区代码
   * @returns {Array} CDN列表
   */
  getRegionalCDNs(region = null) {
    const userRegion = region || this.getUserRegion();
    return CDN_CONFIG.REGIONAL_OPTIMIZATION.regions[userRegion] || 
           CDN_CONFIG.REGIONAL_OPTIMIZATION.regions.default;
  },
  
  /**
   * 构建优化的图片URL
   * @param {string} imagePath - 图片路径
   * @param {string} size - 图片尺寸
   * @param {string} type - 图片类型
   * @param {string} cdnUrl - CDN URL
   * @returns {string} 优化的图片URL
   */
  buildImageUrl(imagePath, size = "large", type = "poster", cdnUrl = null) {
    if (!imagePath) return "";
    
    const baseCdn = cdnUrl || CDN_CONFIG.PRIMARY_CDN;
    const sizeConfig = CDN_CONFIG.IMAGE_SIZES[type];
    const imageSize = sizeConfig[size] || sizeConfig.large;
    
    // 确保路径以/开头
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    return `${baseCdn}/${imageSize}${normalizedPath}`;
  },
  
  /**
   * 批量构建图片URL
   * @param {Array} items - 数据项数组
   * @param {string} cdnUrl - CDN URL
   * @returns {Array} 包含优化URL的数组
   */
  buildBatchImageUrls(items, cdnUrl = null) {
    return items.map(item => {
      const urls = {};
      
      if (item.poster_path) {
        urls.posterPath = this.buildImageUrl(item.poster_path, "large", "poster", cdnUrl);
        urls.coverUrl = urls.posterPath;
      }
      
      if (item.backdrop_path) {
        urls.backdropPath = this.buildImageUrl(item.backdrop_path, "large", "backdrop", cdnUrl);
        
        // 构建多种尺寸的背景图URL
        urls.backdropUrls = {
          w300: this.buildImageUrl(item.backdrop_path, "small", "backdrop", cdnUrl),
          w780: this.buildImageUrl(item.backdrop_path, "medium", "backdrop", cdnUrl),
          w1280: this.buildImageUrl(item.backdrop_path, "large", "backdrop", cdnUrl),
          original: this.buildImageUrl(item.backdrop_path, "original", "backdrop", cdnUrl)
        };
      }
      
      return { ...item, ...urls };
    });
  }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CDN_CONFIG, CDN_UTILS };
} else if (typeof window !== 'undefined') {
  window.CDN_CONFIG = CDN_CONFIG;
  window.CDN_UTILS = CDN_UTILS;
}
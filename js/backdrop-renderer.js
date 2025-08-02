/**
 * TMDB带标题背景图渲染器
 * 使用CSS叠加方案显示带标题的背景图
 */

class BackdropRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      layout: 'grid', // 'grid' | 'list'
      showRating: true,
      showYear: true,
      showType: true,
      animation: true,
      ...options
    };
    
    this.init();
  }

  init() {
    // 添加CSS类
    this.container.classList.add('backdrop-container');
    this.container.classList.add(`backdrop-${this.options.layout}`);
    
    // 绑定事件
    this.bindEvents();
  }

  /**
   * 渲染背景图列表
   * @param {Array} items - 背景图数据项
   */
  render(items) {
    if (!items || !Array.isArray(items)) {
      console.error('BackdropRenderer: 无效的数据项');
      return;
    }

    // 清空容器
    this.container.innerHTML = '';

    // 渲染每个背景图
    items.forEach((item, index) => {
      const backdropElement = this.createBackdropElement(item, index);
      this.container.appendChild(backdropElement);
    });

    // 添加动画效果
    if (this.options.animation) {
      this.addAnimationEffects();
    }
  }

  /**
   * 创建单个背景图元素
   * @param {Object} item - 背景图数据
   * @param {number} index - 索引
   * @returns {HTMLElement}
   */
  createBackdropElement(item, index) {
    const backdropCard = document.createElement('div');
    backdropCard.className = 'backdrop-card';
    backdropCard.dataset.index = index;
    backdropCard.dataset.id = item.id;
    backdropCard.dataset.type = item.type;

    // 设置背景图
    if (item.originalBackdrop) {
      backdropCard.style.backgroundImage = `url(${item.originalBackdrop})`;
    } else {
      backdropCard.classList.add('error');
      backdropCard.textContent = '图片加载失败';
      return backdropCard;
    }

    // 创建叠加层
    const overlay = this.createOverlay(item);
    backdropCard.appendChild(overlay);

    // 添加点击事件
    backdropCard.addEventListener('click', () => {
      this.handleItemClick(item, backdropCard);
    });

    return backdropCard;
  }

  /**
   * 创建叠加层
   * @param {Object} item - 背景图数据
   * @returns {HTMLElement}
   */
  createOverlay(item) {
    const overlay = document.createElement('div');
    overlay.className = 'backdrop-overlay';

    // 标题
    const title = document.createElement('div');
    title.className = 'backdrop-title';
    title.textContent = item.backdropTitle || item.title || '未知标题';
    overlay.appendChild(title);

    // 信息栏
    const info = document.createElement('div');
    info.className = 'backdrop-info';

    // 评分
    if (this.options.showRating && item.backdropRating) {
      const rating = document.createElement('span');
      rating.className = 'backdrop-rating';
      rating.innerHTML = `<span>⭐</span>${item.backdropRating}`;
      info.appendChild(rating);
    }

    // 年份
    if (this.options.showYear && item.backdropYear) {
      const year = document.createElement('span');
      year.className = 'backdrop-year';
      year.textContent = item.backdropYear;
      info.appendChild(year);
    }

    // 类型
    if (this.options.showType && item.backdropType) {
      const type = document.createElement('span');
      type.className = 'backdrop-type';
      type.textContent = this.getTypeText(item.backdropType);
      info.appendChild(type);
    }

    overlay.appendChild(info);
    return overlay;
  }

  /**
   * 获取类型文本
   * @param {string} type - 类型
   * @returns {string}
   */
  getTypeText(type) {
    const typeMap = {
      'movie': '电影',
      'tv': '剧集',
      'anime': '动画',
      'all': '全部'
    };
    return typeMap[type] || type;
  }

  /**
   * 添加动画效果
   */
  addAnimationEffects() {
    const cards = this.container.querySelectorAll('.backdrop-card');
    
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  /**
   * 处理项目点击
   * @param {Object} item - 背景图数据
   * @param {HTMLElement} element - 元素
   */
  handleItemClick(item, element) {
    // 触发自定义事件
    const event = new CustomEvent('backdropClick', {
      detail: {
        item: item,
        element: element
      }
    });
    this.container.dispatchEvent(event);

    // 默认行为：显示详情
    this.showItemDetails(item);
  }

  /**
   * 显示项目详情
   * @param {Object} item - 背景图数据
   */
  showItemDetails(item) {
    console.log('显示详情:', item);
    
    // 这里可以集成到您的详情页面
    // 例如：window.location.href = `/detail/${item.type}/${item.id}`;
    
    // 或者显示模态框
    this.showModal(item);
  }

  /**
   * 显示模态框
   * @param {Object} item - 背景图数据
   */
  showModal(item) {
    const modal = document.createElement('div');
    modal.className = 'backdrop-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>${item.backdropTitle || item.title}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <img src="${item.originalBackdrop}" alt="${item.backdropTitle}" class="modal-image">
            <div class="modal-info">
              <p><strong>类型:</strong> ${this.getTypeText(item.backdropType)}</p>
              <p><strong>评分:</strong> ${item.backdropRating || '暂无'}</p>
              <p><strong>年份:</strong> ${item.backdropYear || '未知'}</p>
              <p><strong>描述:</strong> ${item.description || '暂无描述'}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // 关闭事件
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 监听容器事件
    this.container.addEventListener('backdropClick', (e) => {
      console.log('背景图点击:', e.detail);
    });
  }

  /**
   * 更新布局
   * @param {string} layout - 布局类型
   */
  updateLayout(layout) {
    this.options.layout = layout;
    this.container.className = `backdrop-container backdrop-${layout}`;
  }

  /**
   * 更新选项
   * @param {Object} options - 新选项
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };
  }

  /**
   * 销毁渲染器
   */
  destroy() {
    this.container.innerHTML = '';
    this.container.className = '';
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackdropRenderer;
} else if (typeof window !== 'undefined') {
  window.BackdropRenderer = BackdropRenderer;
}
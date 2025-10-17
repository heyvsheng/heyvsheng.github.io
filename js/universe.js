// 宇宙星空背景效果
class Universe {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.count = 200;
    this.width = 0;
    this.height = 0;
  }

  init() {
    // 创建canvas元素
    const existingCanvas = document.getElementById('universe');
    if (existingCanvas) {
      document.body.removeChild(existingCanvas);
    }
    
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'universe';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // 设置canvas尺寸
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // 创建星星
    this.createStars();
    
    // 动画循环
    this.animate();
    
    // 监听主题切换
    this.listenThemeChange();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars() {
    this.stars = [];
    for (let i = 0; i < this.count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5,
        color: this.getStarColor(),
        speed: Math.random() * 0.5 + 0.1
      });
    }
  }

  getStarColor() {
    // 根据当前主题模式选择星星颜色
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
      // 暗色模式下使用明亮的星星色
      const colors = ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6'];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // 亮色模式下使用柔和的星星色
      const colors = ['#495057', '#6c757d', '#adb5bd', '#ced4da'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  drawStars() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.fill();
      
      // 星星移动
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = this.height;
        star.x = Math.random() * this.width;
      }
    });
  }

  animate() {
    this.drawStars();
    requestAnimationFrame(() => this.animate());
  }

  listenThemeChange() {
    // 监听主题变化事件
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          // 主题切换时更新星星颜色
          this.updateStarsColor();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true
    });
  }

  updateStarsColor() {
    this.stars.forEach(star => {
      star.color = this.getStarColor();
    });
  }
}

// 初始化宇宙背景
function initUniverse() {
  const universe = new Universe();
  universe.init();
}

// 在DOM加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUniverse);
} else {
  initUniverse();
}

// 导出供其他模块使用
export { Universe, initUniverse };
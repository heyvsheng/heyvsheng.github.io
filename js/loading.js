/**
 * 加载动画气泡特效
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 获取加载框元素
  const loadingBox = document.getElementById('loading-box');
  
  // 如果加载框存在，则创建气泡容器
  if (loadingBox) {
    // 检查是否已存在气泡容器
    let bubblesContainer = document.querySelector('.bubbles-container');
    
    // 如果气泡容器不存在，则创建一个
    if (!bubblesContainer) {
      bubblesContainer = document.createElement('div');
      bubblesContainer.classList.add('bubbles-container');
      loadingBox.appendChild(bubblesContainer);
    }
    
    // 初始化气泡生成
    initBubbles(bubblesContainer);
  }
});

/**
 * 初始化气泡生成
 * @param {HTMLElement} container 气泡容器元素
 */
function initBubbles(container) {
  // 气泡大小类型
  const bubbleSizes = ['small', 'medium', 'large'];
  // 要生成的气泡数量
  const bubbleCount = 20;
  
  // 生成初始气泡
  for (let i = 0; i < bubbleCount; i++) {
    createBubble(container, bubbleSizes);
  }
  
  // 每隔一段时间生成新的气泡
  setInterval(() => {
    createBubble(container, bubbleSizes);
  }, 500);
}

/**
 * 创建一个气泡
 * @param {HTMLElement} container 气泡容器元素
 * @param {Array} sizes 气泡大小类型数组
 */
function createBubble(container, sizes) {
  // 创建气泡元素
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  
  // 随机选择气泡大小
  const size = sizes[Math.floor(Math.random() * sizes.length)];
  bubble.classList.add(size);
  
  // 随机设置气泡的水平位置
  const leftPos = Math.random() * 100;
  bubble.style.left = `${leftPos}%`;
  
  // 随机设置气泡的透明度
  const opacity = 0.2 + Math.random() * 0.5;
  bubble.style.background = `rgba(255, 255, 255, ${opacity})`;
  
  // 随机设置气泡的动画持续时间（小气泡快，大气泡慢）
  let duration;
  switch (size) {
    case 'small':
      duration = 5 + Math.random() * 5;
      break;
    case 'medium':
      duration = 8 + Math.random() * 7;
      break;
    case 'large':
      duration = 12 + Math.random() * 10;
      break;
  }
  bubble.style.animationDuration = `${duration}s`;
  
  // 随机设置动画延迟
  const delay = Math.random() * 5;
  bubble.style.animationDelay = `${delay}s`;
  
  // 添加气泡到容器
  container.appendChild(bubble);
  
  // 当气泡动画结束后，移除气泡元素
  bubble.addEventListener('animationend', function() {
    if (container.contains(bubble)) {
      container.removeChild(bubble);
    }
  });
}
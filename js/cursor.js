var CURSOR;

// 定义自定义光标样式路径
const CURSOR_PATH = '/img/mouse/cursor.cur';
let cursorStyleElement = null;

// 初始化并立即应用全局自定义光标样式
function initGlobalCursorStyles() {
    // 移除任何已存在的光标样式表
    removeCursorStyleElement();

    // 创建一个新的样式元素，设置最高优先级
    cursorStyleElement = document.createElement('style');
    cursorStyleElement.id = 'global-cursor-style';
    cursorStyleElement.setAttribute('data-cursor-override', 'true');

    // 使用最强大的CSS选择器和最高优先级设置
    cursorStyleElement.innerHTML = `
        /* 全局覆盖 - 应用于所有元素和状态 */
        *,
        *:before,
        *:after,
        *:link,
        *:visited,
        *:hover,
        *:active,
        *:focus,
        *:focus-within,
        body,
        body *,
        html,
        html * {
            cursor: url('${CURSOR_PATH}'), auto !important;
            cursor: url('${CURSOR_PATH}'), pointer !important;
            
            /* Webkit内核浏览器兼容 */
            -webkit-cursor: url('${CURSOR_PATH}'), auto !important;
            -webkit-cursor: url('${CURSOR_PATH}'), pointer !important;
            
            /* 防止点击时显示默认光标 */
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        
        /* 特别强调 - 确保在所有状态下链接都使用自定义光标 */
        a,
        a:link,
        a:visited,
        a:hover,
        a:active,
        a:focus,
        a:focus-within {
            cursor: url('${CURSOR_PATH}'), pointer !important;
            cursor: url('${CURSOR_PATH}'), auto !important;
            -webkit-cursor: url('${CURSOR_PATH}'), pointer !important;
        }
        
        /* 确保表单元素也使用自定义光标 */
        input,
        input[type="text"],
        input[type="password"],
        input[type="email"],
        input[type="search"],
        input[type="number"],
        input[type="tel"],
        input[type="url"],
        input[type="button"],
        input[type="submit"],
        input[type="reset"],
        input[type="checkbox"],
        input[type="radio"],
        select,
        textarea,
        button,
        [role="button"],
        [onclick],
        [onmousedown],
        [onmouseup] {
            cursor: url('${CURSOR_PATH}'), pointer !important;
            cursor: url('${CURSOR_PATH}'), auto !important;
            -webkit-cursor: url('${CURSOR_PATH}'), pointer !important;
        }
        
        /* 确保在加载过程中也应用自定义鼠标样式 */
        body.loading,
        html.loading,
        #loading-box,
        #loading-box * {
            cursor: url('${CURSOR_PATH}'), auto !important;
            cursor: url('${CURSOR_PATH}'), pointer !important;
            -webkit-cursor: url('${CURSOR_PATH}'), auto !important;
        }
        
        /* 确保在选择文本时也应用自定义鼠标样式 */
        ::selection,
        ::-moz-selection,
        ::-webkit-selection {
            cursor: url('${CURSOR_PATH}'), auto !important;
        }
    `;

    // 将样式表添加到head的最前面，确保最高优先级
    if (document.head) {
        if (document.head.firstChild) {
            document.head.insertBefore(cursorStyleElement, document.head.firstChild);
        } else {
            document.head.appendChild(cursorStyleElement);
        }
    } else {
        // 处理极端情况，document.head不存在时
        document.addEventListener('DOMContentLoaded', function () {
            if (document.head.firstChild) {
                document.head.insertBefore(cursorStyleElement, document.head.firstChild);
            } else {
                document.head.appendChild(cursorStyleElement);
            }
        });
    }
}

// 移除光标样式元素
function removeCursorStyleElement() {
    if (cursorStyleElement) {
        cursorStyleElement.remove();
        cursorStyleElement = null;
    }

    // 同时移除任何可能存在的旧样式表
    const existingStyles = document.querySelectorAll('style[data-cursor-override="true"]');
    existingStyles.forEach(style => style.remove());
}

// 拦截所有链接点击，确保自定义光标在跳转过程中可见
function setupLinkClickInterceptor() {
    // 使用捕获模式监听所有点击事件
    document.addEventListener('mousedown', function (e) {
        // 强制重新应用样式
        forceApplyCursorStyles();

        // 特别处理链接点击
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            const linkElement = e.target.tagName === 'A' ? e.target : e.target.closest('a');
            const href = linkElement.getAttribute('href');

            // 仅拦截有效的页面跳转链接
            if (href && href !== '#' && !href.startsWith('javascript:') && !href.startsWith('#') && !linkElement.target) {
                // 阻止默认跳转行为
                e.preventDefault();

                // 创建一个临时的全屏覆盖层，确保在跳转期间鼠标样式保持
                createTransitionOverlay();

                // 稍微延迟后执行跳转，确保样式应用
                setTimeout(() => {
                    window.location.href = href;
                }, 50);
            }
        }
    }, true);
}

// 创建一个临时的全屏覆盖层，确保在跳转期间鼠标样式保持
function createTransitionOverlay() {
    // 移除任何已存在的覆盖层
    const existingOverlay = document.getElementById('cursor-transition-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // 创建新的覆盖层
    const overlay = document.createElement('div');
    overlay.id = 'cursor-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        pointer-events: none;
        opacity: 0;
    `;

    document.body.appendChild(overlay);
}

// 强制应用光标样式，用于关键事件和状态变化时
function forceApplyCursorStyles() {
    removeCursorStyleElement();
    initGlobalCursorStyles();

    // 确保body和html元素立即应用样式
    if (document.body) {
        document.body.style.cursor = `url('${CURSOR_PATH}'), auto !important`;
        document.body.style.cursor = `url('${CURSOR_PATH}'), pointer !important`;
    }

    if (document.documentElement) {
        document.documentElement.style.cursor = `url('${CURSOR_PATH}'), auto !important`;
        document.documentElement.style.cursor = `url('${CURSOR_PATH}'), pointer !important`;
    }
}

// 添加全局事件监听，在各种情况下都强制应用自定义样式
function setupGlobalEventListeners() {
    const events = [
        'mousedown', 'mouseup', 'mousemove', 'click',
        'mouseenter', 'mouseleave', 'focus', 'blur',
        'keydown', 'keyup', 'scroll', 'resize',
        'touchstart', 'touchend', 'touchmove'
    ];

    events.forEach(event => {
        document.addEventListener(event, forceApplyCursorStyles, true);
    });

    // 监听页面加载状态变化
    window.addEventListener('load', forceApplyCursorStyles);
    window.addEventListener('beforeunload', forceApplyCursorStyles);

    // 监听DOM内容变化，确保动态添加的元素也应用样式
    const observer = new MutationObserver(forceApplyCursorStyles);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
}

// 定期检查并强制应用样式（作为最后的保障）
function setupPeriodicStyleCheck() {
    setInterval(() => {
        forceApplyCursorStyles();
    }, 500); // 每500毫秒检查一次
}

// 主初始化函数
(function initCustomCursor() {
    // 优先应用CSS变量（如果需要）
    const styleVars = document.createElement('style');
    styleVars.innerHTML = `
        :root {
            --custom-cursor: url('${CURSOR_PATH}'), auto;
            --custom-cursor-pointer: url('${CURSOR_PATH}'), pointer;
        }
    `;
    document.head.appendChild(styleVars);

    // 立即应用全局样式
    initGlobalCursorStyles();

    // 拦截链接点击
    setupLinkClickInterceptor();

    // 设置全局事件监听
    setupGlobalEventListeners();

    // 设置定期检查
    setupPeriodicStyleCheck();

    // 确保在DOM加载完成后再次应用样式
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            forceApplyCursorStyles();
        });
    }
})();
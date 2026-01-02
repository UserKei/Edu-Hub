# 主题与语言切换功能实现方案

## 目标
在 `TopBar` 组件的头像左侧添加两个切换按钮：
1.  **主题切换**: 深色 (Dark) / 浅色 (Light)
2.  **语言切换**: 英文 (EN) / 简体中文 (ZH)

## 实施步骤

### 1. 状态管理 (Store)
修改 `src/stores/app.js`，添加主题和语言的状态管理。
- **State**: `theme` ('dark' | 'light'), `locale` ('en' | 'zh-CN')
- **Actions**: `toggleTheme()`, `setLocale(locale)`
- **Persistence**: 使用 `localStorage` 保存用户偏好。

### 2. 样式配置 (CSS)
修改 `src/assets/main.css` 以支持动态主题切换。
- 将硬编码的 `@import "@catppuccin/tailwindcss/mocha.css";` 替换为 `@plugin "@catppuccin/tailwindcss";`。
- 这样可以通过在 `<html>` 或 `<body>` 标签上添加类名（如 `latte` 或 `mocha`）来切换主题。
- **映射关系**:
    - Light -> `latte`
    - Dark -> `mocha`

### 3. 初始化逻辑
在 `src/App.vue` 或 `src/main.js` 中添加初始化逻辑。
- 应用启动时，从 Store/LocalStorage 读取主题并应用到 `document.documentElement`。
- 读取语言设置并应用到 `i18n.global.locale`。

### 4. UI 实现 (TopBar)
修改 `src/components/layout/TopBar.vue`。
- 在头像左侧添加两个按钮。
- **主题按钮**: 使用 `mdi:weather-night` (Dark) 和 `mdi:weather-sunny` (Light) 图标。
- **语言按钮**: 使用 `mdi:translate` 图标，点击轮换或弹出菜单（本方案采用点击轮换）。

## 代码变更计划

### `src/stores/app.js`
```javascript
// 添加 theme 和 locale 状态
// 添加 toggleTheme 和 toggleLocale action
```

### `src/assets/main.css`
```css
@import "tailwindcss";
@plugin "@catppuccin/tailwindcss"; /* 使用插件以支持动态主题 */
```

### `src/App.vue`
```javascript
// 监听 theme 变化并应用 class (latte/mocha)
// 初始化时应用设置
```

### `src/components/layout/TopBar.vue`
```vue
<!-- 添加按钮组 -->
<button @click="toggleTheme">...</button>
<button @click="toggleLocale">...</button>
```

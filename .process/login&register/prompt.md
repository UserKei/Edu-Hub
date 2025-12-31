# 登录与注册页面设计方案

基于 `.design/login&register/layout.md` 的原型解读，结合 Catppuccin 配色和 i18n 国际化标准，制定以下实施计划。

## 1. 组件化策略 (Componentization)

为了提高代码复用性和维护性，我们将提取通用 UI 组件。

### 新增/封装组件
*   **`src/components/ui/AppInput.vue`**
    *   **功能**: 封装输入框，包含 Label、Input 区域和可选的 Icon。
    *   **Props**: `label` (标签文本), `modelValue` (v-model), `type` (text/password), `placeholder`, `icon` (Iconify 图标名).
    *   **样式**: 使用 `ctp-surface0` 作为背景，`ctp-text` 作为文字颜色。
*   **`src/components/ui/AppButton.vue`**
    *   **功能**: 通用按钮组件。
    *   **Props**: `variant` (primary/secondary/text).
    *   **样式**: Primary 使用 `ctp-blue`，Hover 效果使用透明度或色阶。
*   **`src/layouts/AuthLayout.vue`** (或 `src/components/auth/AuthCard.vue`)
    *   **功能**: 统一的居中卡片布局容器，用于包裹 Login 和 Register 表单。
    *   **Slot**: `default` (表单内容), `footer` (底部链接).

### 页面视图
*   **`src/views/LoginView.vue`**: 引用上述组件组装。
*   **`src/views/RegisterView.vue`**: 引用上述组件组装。

## 2. 配色方案 (Catppuccin Latte)

严格遵循 `.colors/prompt.md` 规范。

| 原型元素 | 语义化颜色 (Tailwind Class) | 说明 |
| :--- | :--- | :--- |
| **页面背景** | `bg-ctp-base` | 整个页面的底色 |
| **卡片容器** | `bg-ctp-mantle` 或 `bg-white` | 承载表单的区域 (可选，若设计为纯白背景则用 base) |
| **标题文字** | `text-ctp-text` | "Sign in..." 等标题 |
| **输入框背景** | `bg-ctp-surface0` | 对应原型中的 `#D9D9D9` |
| **输入框文字** | `text-ctp-text` | 用户输入的内容 |
| **输入框占位符** | `placeholder-ctp-overlay1` | Placeholder 文本 |
| **主按钮背景** | `bg-ctp-blue` | 对应 "Sign In" 按钮 (原型为灰，改为品牌色) |
| **主按钮文字** | `text-ctp-base` | 按钮上的文字 |
| **链接文字** | `text-ctp-blue` | 底部跳转链接 |

## 3. 国际化 (i18n)

遵循 `.process/prompt.md`，在 `src/locales/` 下定义键值。

**Key 结构规划**:
```json
{
  "auth": {
    "login": {
      "title": "Sign in to EduHub",
      "submit": "Sign In",
      "no_account": "New to EduHub? Create an account"
    },
    "register": {
      "title": "Register to EduHub",
      "submit": "Register",
      "has_account": "Have account already? Login in to EduHub"
    },
    "field": {
      "username": "Username",
      "password": "Password",
      "confirm_password": "Password Confirm"
    }
  }
}
```

## 4. 图标 (Icons)

使用 `@iconify/vue` 组件。

*   **用户名**: `ph:user` 或 `mdi:account`
*   **密码**: `ph:lock` 或 `mdi:lock`

## 5. 实施步骤

<!-- 1.  **配置环境**: 确保 `vue-i18n` 和 `@catppuccin/tailwindcss` 已正确安装配置。 -->
<!-- 环境已安装 -->
<!-- 2.  **创建基础组件**: 实现 `AppInput.vue` 和 `AppButton.vue`。 -->
<!-- 3.  **定义语言包**: 更新 `en.json` 和 `zh-CN.json`。 -->
<!-- 4.  **开发视图**: 重构 `LoginView.vue` 和 `RegisterView.vue`。 -->
<!-- 以上步骤已完成 -->

## 6. API 集成与状态管理 (Pinia)

基于 `doc/api/login.md` 和 `doc/api/register.md`，实现前后端交互。

### 6.1 状态管理 (`src/stores/auth.js`)
使用 Pinia 管理用户认证状态。

*   **State**:
    *   `user`: 当前登录用户信息 (null 表示未登录)。
    *   `token`: JWT Token (持久化存储到 localStorage)。
    *   `isAuthenticated`: 计算属性，判断是否有 token。
*   **Actions**:
    *   `login(credentials)`: 调用 `/api/auth/login`，保存 token 和 user。
    *   `register(data)`: 调用 `/api/auth/register`，注册成功后自动登录或跳转。
    *   `logout()`: 清除 token 和 user，重定向到登录页。

### 6.2 API 封装 (`src/api/auth.js`)
封装 Axios 请求，处理拦截器。

*   **Base URL**: `http://127.0.0.1:3000` (后端已配置 CORS)。
*   **Endpoints**:
    *   `POST /auth/login`: 登录。
    *   `POST /auth/register`: 注册。
*   **拦截器**:
    *   Request: 自动附加 `Authorization: Bearer <token>`。
    *   Response: 统一处理 401/403 错误。

### 6.3 视图集成
*   更新 `LoginView.vue`: 调用 `authStore.login`，处理 loading 和 error 状态。
*   更新 `RegisterView.vue`: 调用 `authStore.register`，处理表单验证和错误提示。

### 6.4 实施步骤 (Phase 2)
1.  **安装 Axios**: `npm install axios`。
2.  **配置 Base URL**: 在 `src/utils/request.js` 中设置 `baseURL` 为 `http://127.0.0.1:3000`。
3.  **创建 API 模块**: 实现 `src/utils/request.js` (Axios 实例) 和 `src/api/auth.js`。
4.  **实现 Auth Store**: 创建 `src/stores/auth.js`。
5.  **对接视图**: 修改 Login 和 Register 页面逻辑。


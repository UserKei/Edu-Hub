# 仪表盘模块开发计划 (Dashboard Module Development Plan)

本文档基于提供的设计原型和 API 文档，概述了 **Dashboard (仪表盘)** 模块的实施计划。

## 1. 组件架构 (Component Architecture)

### 1.1 页面布局 (Page Layout)
仪表盘是登录用户的主要着陆页。它采用响应式网格布局，包含顶部栏、可折叠/覆盖式侧边栏和主要内容区域。

**目标文件**: `src/views/dashboard/DashboardView.vue`

### 1.2 新建组件 (New Components)

我们需要为仪表盘的小部件和区块创建特定的组件。

| 组件名称 | 路径 | 描述 |
| :--- | :--- | :--- |
| **DashboardLayout** | `src/views/dashboard/DashboardLayout.vue` | 处理 TopBar、Sidebar 和内容区域结构的主网格容器。 |
| **TopBar** | `src/components/layout/TopBar.vue` | 包含菜单触发器、面包屑导航和用户头像。 |
| **SidebarMenu** | `src/components/layout/SidebarMenu.vue` | 覆盖式/侧滑导航菜单 (Home, Course, Forum)。 |
| **CourseListSidebar** | `src/components/dashboard/CourseListSidebar.vue` | 仪表盘左侧常驻侧边栏，显示 "List of My Course"。 |
| **ContinueLearningList** | `src/components/dashboard/ContinueLearningList.vue` | "继续学习" 区块的容器。 |
| **ContinueLearningCard** | `src/components/dashboard/ContinueLearningCard.vue` | 显示课程信息和 "继续" 按钮的单个卡片。 |
| **CourseFeed** | `src/components/dashboard/CourseFeed.vue` | "课程动态" (Feed Course) 区域的 *占位符* (新闻流)。 |
| **CourseNewsWidget** | `src/components/dashboard/CourseNewsWidget.vue` | 右侧边栏 "我的课程新动态" (New of My Course) 小部件的 *占位符*。 |

### 1.3 复用组件 (Reusable Components)

假设已存在基础 UI 库：
- `BaseButton`: 用于 "继续" 操作和侧边栏切换。
- `BaseAvatar`: 用于 TopBar 中的用户头像。
- `BaseCard`: 小部件的包装器。

### 1.4 图标使用 (Iconify)

通过 Iconify 使用 **Material Design Icons (mdi)**:
- **菜单**: `mdi:menu` (汉堡图标)
- **关闭**: `mdi:close` (侧边栏关闭)
- **用户**: `mdi:account-circle` 或 `mdi:account`
- **导航**:
    - 首页: `mdi:home`
    - 课程: `mdi:book-open-variant`
    - 论坛: `mdi:forum`
- **操作**: `mdi:play-circle` (继续学习按钮)

## 2. 状态管理设计 (Pinia Store Design)

**Store 文件**: `src/stores/dashboard.js`

**工具引用**: 请使用已封装的 Axios 实例: `import request from '@/utils/request'`

### 2.1 State (状态)
```javascript
state: () => ({
  // 继续学习的课程列表
  continueLearningList: [],
  
  // 仪表盘数据的加载状态
  isLoading: false,
  
  // UI 状态: 侧边栏菜单的可见性
  isSidebarOpen: false,
  
  // 错误状态
  error: null
})
```

### 2.2 Actions (动作)

| Action 名称 | 描述 | API 映射 |
| :--- | :--- | :--- |
| `fetchContinueLearning()` | 获取最近访问的课程列表。设置 `isLoading` 和 `continueLearningList`。 | `GET /api/dashboard/continue-learning` |
| `toggleSidebar(value)` | 切换 `isSidebarOpen`。如果提供了 `value`，则直接设置它。 | N/A (UI 状态) |

### 2.3 规则
- **API 调用**: 必须使用 `@/utils/request` 进行请求，不要直接使用 `axios`。
- **无 Router 逻辑**: Store 仅管理数据。导航在组件中进行。
- **错误处理**: 捕获错误，设置 `this.error`，并在组件需要处理特定 UI 反馈（如 toast）时重新抛出。

## 3. 页面交互流程 (Interaction Flow)

### 3.1 初始化 (On Mount)
1.  **DashboardView** 挂载。
2.  调用 `dashboardStore.fetchContinueLearning()`。
3.  当 `isLoading` 为 true 时，显示骨架屏或加载转圈。

### 3.2 用户操作

#### A. 继续学习 (Continue Learning)
1.  用户点击 `ContinueLearningCard` 上的 **"Continue: [Chapter Title]"** 按钮。
2.  **组件逻辑**: 使用 `router.push` 导航到 `/course/:courseId/chapter/:lastChapterId`。
3.  **i18n**: 按钮文本应使用键 `dashboard.continue_learning`。

#### B. 侧边栏导航 (Sidebar Navigation)
1.  用户点击 `TopBar` 中的 **菜单图标**。
2.  **组件逻辑**: 调用 `dashboardStore.toggleSidebar(true)`。
3.  `SidebarMenu` 组件滑入 (过渡效果)。
4.  用户点击导航项 (例如 "Course")。
5.  **组件逻辑**:
    - 调用 `dashboardStore.toggleSidebar(false)` 关闭菜单。
    - 通过 `router.push` 导航。

### 3.3 国际化 (i18n)
确保所有静态文本都包裹在 `$t()` 中：
- `dashboard.title` ("仪表盘")
- `dashboard.my_courses` ("我的课程列表")
- `dashboard.continue_learning` ("继续学习")
- `dashboard.feed` ("课程动态")
- `dashboard.news` ("课程新动态")
- `nav.home`, `nav.course`, `nav.forum`

## 4. 样式与配色 (Styling & Theming)

遵循 **Catppuccin** 配色方案，使用 `@catppuccin/tailwindcss`。

### 4.1 颜色映射
- **背景**: `bg-ctp-base` (主页面背景)。
- **顶部栏**: `bg-ctp-mantle` 或 `bg-ctp-surface0`。
- **侧边栏 (覆盖层)**: `bg-ctp-mantle` 搭配 `text-ctp-text`。
- **卡片**: `bg-ctp-surface0` 或 `bg-ctp-surface1`。
- **主要操作**: `bg-ctp-blue` 文本 `text-ctp-base` (例如 继续按钮)。
- **文本**: `text-ctp-text` (主要), `text-ctp-subtext0` (次要/面包屑)。

### 4.2 布局实现
- 使用 **CSS Grid** 进行主仪表盘布局，以响应式地处理左侧边栏 (CourseListSidebar)、主要内容和右侧小部件区域。
- **左侧边栏**: 在大屏幕上常驻显示，展示 "List of My Course"。
- 使用 **Flexbox** 处理 TopBar 和卡片内部布局。
- **过渡**: 为侧边栏覆盖层添加平滑过渡 (`transition-transform duration-300`)。

### 4.3 参考
参考 `.colors/prompt.md` 获取具体的工具类 (例如 `bg-ctp-blue`, `text-ctp-mauve`)。

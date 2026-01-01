# Implementation Plan: Course Library & My Courses

## 1. Component Architecture (组件架构)

### 1.1 Layout Strategy
*   **Layout Container**: 使用 `MainLayout.vue`，但需要替换或嵌套特定于课程模块的侧边栏。
*   **Sidebar**: 需开发独立的 `CourseSidebar.vue` (对应 `layout.md` 中的 Rectangle 6, 21, 22)，不同于全局的 `SidebarMenu`。
*   **Main Content Area**: 对应 `layout.md` 中的 `Rectangle 23-30`。

### 1.2 Route Views
*   **Course Library Page**
    *   **Path**: `/courses`
    *   **File**: `src/views/course/CourseLibraryView.vue`
    *   **Responsibility**: 展示所有公开课程，提供搜索和创建入口。集成 `CourseSidebar`。
*   **My Courses Page**
    *   **Path**: `/my-courses`
    *   **File**: `src/views/course/MyCoursesView.vue`
    *   **Responsibility**: 展示当前用户已选修的课程。集成 `CourseSidebar`。

### 1.3 Business Components
我们将 `layout.md` 中的区域拆解为以下独立组件：

1.  **CourseSidebar.vue** (New)
    *   **对应区域**: `Rectangle 6` (Container), `Rectangle 21` (Library Nav), `Rectangle 22` (My Courses Nav)。
    *   **功能**: 课程模块专用侧边栏导航。
    *   **样式**: 深蓝色背景 (#324E88 -> `bg-ctp-blue` 或自定义)，包含导航链接。

2.  **CourseActionToolbar.vue**
    *   **对应区域**: `Rectangle 29` (Label), `Rectangle 30` (New Button), `Rectangle 23` (Search Input)。
    *   **功能**: 顶部操作栏，包含页面标题/标签、搜索框和操作按钮。
    *   **Props**:
        *   `title` (String): 页面标题 (e.g., "Course Library")。
        *   `showCreateButton` (Boolean): 是否显示新建按钮 (仅 Library 页且为教师时显示)。
    *   **Emits**:
        *   `search`: 当搜索输入变化时触发。
        *   `create`: 点击新建按钮时触发。

2.  **CourseList.vue**
    *   **对应区域**: `Rectangle 24` (Container)。
    *   **功能**: 课程卡片的网格/列表容器，处理空状态和加载状态。
    *   **Props**:
        *   `loading` (Boolean): 加载状态。
        *   `courses` (Array): 课程数据列表。
    *   **Slots**:
        *   `default`: 用于放置 `CourseCard`。

3.  **CourseCard.vue**
    *   **对应区域**: `Rectangle 25, 26, 27` (Cards)。
    *   **功能**: 单个课程信息的展示卡片。
    *   **Props**:
        *   `course` (Object): 课程数据对象。
    *   **Events**: 点击卡片跳转至课程详情。

## 2. Pinia Store Design (状态管理)

**File**: `src/stores/course.js`

### 2.1 State
```javascript
state: () => ({
  publicCourses: [],   // 课程库列表
  enrolledCourses: [], // 我的课程列表
  isLoading: false,    // 全局加载状态
  searchQuery: '',     // 搜索关键词
})
```

### 2.2 Getters
*   *None*: 由于采用服务端搜索，直接使用 State 中的列表数据。

### 2.3 Actions
*   `fetchPublicCourses(params = {})`: 调用 `GET /api/courses`，支持传入搜索参数 (e.g., `{ search: 'keyword' }`)。
    *   *Error Handling*: **Must Throw Error**. View 层捕获错误以处理 Loading 状态。全局错误提示由 Axios Interceptor 统一处理。
*   `fetchEnrolledCourses()`: 调用 `GET /api/courses/enrolled`。
    *   *Error Handling*: **Must Throw Error**.
*   `createCourse(courseData)`: 调用 `POST /api/courses`。
    *   *Success*: 刷新列表 -> 返回新课程 ID (供 UI 跳转)。
    *   *Error Handling*: **Must Throw Error**.

## 3. Interaction Flow (交互流程)

### 3.1 Initialization (Course Library)
1.  用户访问 `/courses`。
2.  `CourseLibraryView` `onMounted` 钩子触发。
3.  调用 `courseStore.fetchPublicCourses()`。
4.  `isLoading` 置为 `true`，界面展示 Skeleton 或 Loading Spinner。
5.  API 返回数据，更新 `publicCourses`，`isLoading` 置为 `false`。
6.  `CourseList` 渲染卡片。

### 3.2 Search / Filtering (Server-side)
1.  用户在 `CourseActionToolbar` 输入关键字。
2.  组件内部实现防抖 (Debounce, e.g., 500ms)。
3.  防抖结束后，emit `search` 事件或直接调用 Store Action。
4.  调用 `courseStore.fetchPublicCourses({ search: query })`。
5.  Store 更新列表数据。

### 3.3 i18n Keys Proposal
*   `course.library.title`: "Course Library"
*   `course.my_courses.title`: "My Courses"
*   `course.action.search_placeholder`: "Search courses..."
*   `course.action.create`: "New Course"
*   `course.list.empty`: "No courses found"

## 4. Styling & Layout (样式)

### 4.1 Layout Integration
由于 `layout.md` 定义了 Main Content Area 为白色背景 (`#FFFFFF`)，我们需要在 View 层级设置容器样式：

```html
<!-- View Template -->
<div class="flex-1 bg-ctp-base min-h-screen p-6">
  <!-- Action Toolbar -->
  <div class="mb-6">...</div>
  
  <!-- Course List Container (Rectangle 24) -->
  <div class="bg-ctp-surface0 rounded-xl p-6 min-h-[600px]">
     <!-- Cards -->
  </div>
</div>
```

### 4.2 Color Mapping (Catppuccin)
*   **Page Background**: `bg-ctp-base` (对应设计稿白色背景的语义化替代，或使用 `bg-white` 如果必须严格还原)。
*   **List Container**: `bg-ctp-mantle` (对应 `Rectangle 24` #757A85，使用 Mantle 确保与卡片形成层级对比)。
*   **Search Input**: `bg-ctp-surface1` text `ctp-text`。
*   **New Course Button**: `bg-ctp-green` text `ctp-base` (对应 `Rectangle 30` #53C74B)。
*   **Card Background**: `bg-ctp-surface1` hover `bg-ctp-surface2` (确保在 Mantle 背景上有清晰的轮廓)。

---
**这份开发计划是否准确？如果没问题，我将开始生成代码。**

# 实施计划 - 学生课程详情模块 (Student Course Detail Module)

## 1. 组件架构 (Component Architecture)

### 1.1 布局策略 (Layout Strategy)
设计要求采用特定的三栏布局（左侧侧边栏、主内容区、右侧侧边栏），这与标准的仪表盘布局不同。
*   **容器 (Container)**: 我们将创建一个专用的视图来管理其自身的布局结构，绕过通用的 `CourseLayout`，但可能会复用全局头部组件 (`TopBar`)。
*   **路由 (Route)**: `/learn/:courseId`

### 1.2 视图与组件 (View & Components)
**文件路径**: `frontend/src/views/student/StudentCourseDetailView.vue`
*   **角色**: 顶层容器。
*   **布局映射**:
    *   `Rectangle 1` (顶部导航) -> 复用 `<TopBar />` (全局组件)。
    *   `Rectangle 32` (左侧侧边栏) -> `<StudentCourseSidebar />`
    *   `Rectangle 31` (主内容区) -> `<StudentCourseContent />`
    *   `Rectangle 33` (右侧侧边栏) -> `<StudentCourseDiscussion />`
    *   `Rectangle 38/39` (模态框) -> `<StudentCommentModal />`

#### 1.2.1 StudentCourseSidebar (左侧)
*   **文件**: `frontend/src/components/student/StudentCourseSidebar.vue`
*   **职责**: 渲染章节树形结构。
*   **Props**:
    *   `chapters`: `Array` (来源: API `chapters` 字段)
    *   `currentChapterId`: `Number`
*   **Events**:
    *   `select-chapter`: 当点击章节时触发。
*   **渲染逻辑**: 必须使用 **递归组件 (Recursive Component)** 写法（例如创建 `SidebarItem.vue`），以支持多级章节树（一级章节/二级章节/三级章节）的正确渲染。

#### 1.2.2 StudentCourseContent (中间)
*   **文件**: `frontend/src/components/student/StudentCourseContent.vue`
*   **职责**: 渲染视频播放器或富文本内容。
*   **Props**:
    *   `chapter`: `Object` (当前激活的章节节点)
*   **数据绑定**:
    *   Title -> `chapter.title`
    *   Video -> `chapter.video_url`
    *   Content -> `chapter.content`
    *   Resources -> `chapter.resource_url`, `chapter.resource_name`

#### 1.2.3 StudentCourseDiscussion (右侧)
*   **文件**: `frontend/src/components/student/StudentCourseDiscussion.vue`
*   **职责**: 讨论面板的占位符 (API 待定)。
*   **Props**:
    *   `courseId`: `Number`
    *   `chapterId`: `Number`

## 2. Pinia Store 设计

**文件**: `frontend/src/stores/student-course.js`

### 2.1 State
```javascript
state: () => ({
  enrollment: null,      // 存储完整的选课对象
  chapters: [],          // 存储章节树形结构
  currentChapter: null,  // 当前选中的章节对象
  isLoading: false,
  error: null
})
```

### 2.2 Actions & API 映射

#### `fetchCourseContent(courseId)`
*   **API 端点**: `GET /api/courses/:id/content`
*   **方法**: `GET`
*   **参数**: `id` (映射自 `courseId`)
*   **逻辑**:
    1.  设置 `isLoading = true`。
    2.  调用 API。
    3.  将 `res.enrollment` 存储到 `state.enrollment`。
    4.  将 `res.chapters` 存储到 `state.chapters`。
    5.  **自动选择逻辑**:
        *   如果 `state.enrollment.last_chapter_id` 存在，查找并设置 `state.currentChapter`。
        *   否则，在 `state.chapters` 中查找第一个叶子节点 (type='FILE') 并设置它。
    6.  使用 `try...finally` 处理错误。

#### `updateLearningProgress(courseId, chapterId)`
*   **API 端点**: `POST /api/courses/:courseId/chapters/:chapterId/progress`
*   **方法**: `POST`
*   **参数**:
    *   `courseId` (URL 参数)
    *   `chapterId` (URL 参数)
*   **逻辑**:
    *   **防抖 (Debounce)**: 必须实现防抖机制（建议 500ms），防止用户快速切换章节时造成 API 请求拥堵。
    *   调用 API 记录进度。
    *   成功后在本地更新 `state.enrollment.last_chapter_id` 以反映最新状态。

## 3. 交互流程 (Interaction Flow)

### 3.1 初始化
1.  用户导航至 `/learn/1`。
2.  `StudentCourseDetailView` 挂载。
3.  调用 `store.fetchCourseContent(1)`。
4.  Store 获取数据。
5.  Store 确定 `currentChapter` (例如，从上一章节恢复)。
6.  视图使用激活的章节数据渲染 `<StudentCourseContent>`。

### 3.2 章节切换
1.  用户在 `<StudentCourseSidebar>` 中点击章节。
2.  组件触发 `select-chapter(chapterId)`。
3.  父视图调用 `store.setCurrentChapter(chapterId)`。
4.  Store 更新 `state.currentChapter`。
5.  **进度追踪**: Store 触发 `updateLearningProgress` (带防抖)。

### 3.3 i18n 键名
*   `student.course.sidebar.title`: "Course Outline"
*   `student.course.content.resources`: "Resources"
*   `student.course.discussion.title`: "Discussion"
*   `student.course.discussion.placeholder`: "Type your comment..."

## 4. 样式与布局 (Styling & Layout)

### 4.1 布局实现
使用 Tailwind CSS Grid 实现三栏布局：

```html
<!-- 主容器 -->
<div class="flex flex-col h-screen bg-ctp-base">
  <!-- 顶部栏 (固定高度) -->
  <div class="h-[137px] shrink-0">
    <TopBar />
  </div>

  <!-- 内容区域 (Flex Grow) -->
  <div class="flex flex-1 overflow-hidden">
    <!-- 左侧侧边栏 (固定宽度) -->
    <aside class="w-[281px] bg-ctp-surface0 overflow-y-auto border-r border-ctp-surface0">
      <StudentCourseSidebar />
    </aside>

    <!-- 主内容 (Flex Grow) -->
    <main class="flex-1 bg-ctp-base overflow-y-auto relative">
      <StudentCourseContent />
    </main>

    <!-- 右侧侧边栏 (固定宽度) -->
    <aside class="w-[294px] bg-ctp-crust border-l border-ctp-surface0 hidden xl:block">
      <StudentCourseDiscussion />
    </aside>
  </div>
</div>
```

### 4.2 颜色映射 (Catppuccin)
*   **Top Nav**: `bg-ctp-mauve` (匹配 #A1A4DB 视觉意图)
*   **Left Sidebar**: `bg-ctp-surface0` 或 `bg-ctp-mantle` (线框图中为粉色，但侧边栏建议使用语义化的 `mantle`)
*   **Main Content**: `bg-ctp-base` (线框图中为绿色，内容区建议使用 `base`)
*   **Right Sidebar**: `bg-ctp-crust` (线框图中为黑色，深色面板建议使用 `crust`)
*   **Text**: `text-ctp-text`

```
tiptap
```

# 课程创建模块开发实施计划 (Course Creation Module Implementation Plan)

> **注意**: 基于提供的视觉结构 (`layout.md`) 和目标文件路径 (`new-course/prompt.md`)，本计划专注于 **Course Creation (New Course)** 模块，即教师视角下的课程创建与编辑功能。

## 1. Component Architecture (组件架构)

### 1.1 Layout Integration (布局集成)
Course Creation 模块将使用全局 `Layout` (Sidebar + TopBar)，但需要为两步流程设计特定的内部布局。

*   **Global Layout**: `src/layouts/MainLayout.vue` (或包含 `SidebarMenu` 和 `TopBar` 的等效组件)。
*   **Page Container**: `views/course/NewCourseView.vue` 将作为两步流程的协调者。

### 1.2 View Structure (`views/course/NewCourseView.vue`)
*   **Route**: `/course/new` (创建) 和 `/course/:id/edit` (编辑)。
*   **Responsibilities**:
    *   管理当前步骤状态 (`step`: 1 | 2)。
    *   渲染 `CourseBaseInfo` (Step 1) 或 `CourseChapterEditor` (Step 2)。
    *   处理 "Next", "Save", "Publish" 等全局操作。

### 1.3 Business Components (业务组件)

#### Step 1: Base Information (基础信息)
**File**: `src/components/course/creation/CourseBaseInfo.vue`
*   **Rectangle ID (Layout)**: `Rectangle 40` (Main Content Container).
*   **Fields**:
    *   **Course Name**: `Rectangle 41` (`input-group-name`).
    *   **Description**: `Rectangle 42` (`textarea-description`).
    *   **Visibility**: `Rectangle 43` (`visibility-selector`).
    *   **Cover Image**: `Rectangle 44` (`image-upload`).
        *   **Tech Spec**: Implement a **Mock Upload Component**.
        *   **Behavior**: Simulate upload delay (1-2s) and return a dummy URL (e.g., `https://placehold.co/600x400`).
*   **Props**:
    *   `initialData`: Object (可选，用于编辑模式).
*   **Events**:
    *   `submit(data)`: 点击 "Next" 时触发。

#### Step 2: Chapter Editor (章节编辑器)
**File**: `src/components/course/creation/CourseChapterEditor.vue`
*   **Layout**: 分栏布局 (左侧: Tree, 右侧: Editor)。
*   **Sub-components**:

    1.  **Chapter Tree (Sidebar)**
        *   **File**: `src/components/course/creation/ChapterTree.vue`
        *   **Rectangle ID**: `Rectangle 45` (`sidebar-chapter-tree`).
        *   **Tech Spec**: Use **`vuedraggable` (@next)** for drag-and-drop sorting.
        *   **Features**:
            *   递归树形渲染 (`chapter-item-l1`, `l2`, `l3`).
            *   "Add lesson/assignment" 幽灵按钮 (`btn-ghost-add`).
            *   悬停操作 (Add child, Delete, Rename).
        *   **Props**:
            *   `chapters`: Array (树形结构).
        *   **Events**:
            *   `select(chapterId)`
            *   `add(parentId)`
            *   `delete(chapterId)`
            *   `move(dragId, dropId)` -> Triggers `reorderChapters`.

    2.  **Content Editor (Main)**
        *   **File**: `src/components/course/creation/ChapterContentEditor.vue`
        *   **Rectangle ID**: `Rectangle 51` (`editor-content-panel`).
        *   **Fields**:
            *   **Title**: `Rectangle 52` (`input-chapter-title`).
            *   **Rich Text**: `Rectangle 53` (`richtext-editor`).
                *   **Tech Spec**: Use **`@tiptap/vue-3`** with `@tiptap/starter-kit`.
                *   **Features**: Bold, Italic, Link, Heading, BulletList, OrderedList.
            *   **Resources**: `Rectangle 54` (`resource-upload-zone`).
        *   **Props**:
            *   `chapter`: Object (选中的章节数据).
        *   **Events**:
            *   `update(data)`: 字段变更时触发 (**Must be debounced**).

    3.  **Action Toolbar**
        *   **File**: `src/components/course/creation/EditorToolbar.vue`
        *   **Rectangle ID**: `Rectangle 46` (`toolbar-actions`).
        *   **Actions**: Save (`btn-save`), Preview (`btn-preview`), Publish (`btn-publish`).

## 2. Pinia Store Design (状态管理)

**File**: `src/stores/course-creation.js`

### 2.1 State
```javascript
state: () => ({
  currentStep: 1, // 1: Base Info, 2: Chapter Editor
  courseId: null, // 正在创建/编辑的课程 ID
  courseInfo: {
    title: '',
    description: '',
    cover_image: '', // Snake_case required
    type: 'PUBLIC', // 'PUBLIC' | 'PRIVATE'
    teacher_id: null // Snake_case required
  },
  chapters: [], // 章节树形结构
  currentChapterId: null, // 当前正在编辑的章节 ID
  isLoading: false
})
```

### 2.2 Actions & API Mapping

**Strict API Constraints**:
*   All payload fields sent to the backend **MUST** use **Snake_case** (e.g., `cover_image`, `teacher_id`, `parent_id`).
*   **Do NOT** automatically convert payloads to CamelCase.

| Action Name | API Endpoint | Method | Request Body / Params | Description |
| :--- | :--- | :--- | :--- | :--- |
| `createCourse` | `/api/courses` | `POST` | `data: { title, description, cover_image, type, teacher_id }` | 创建课程初始框架。 |
| `updateCourse` | `/api/courses/:id` | `PUT` | `data: { title, description, ... }` | 更新课程信息。 |
| `fetchCourse` | `/api/courses/:id` | `GET` | - | 加载课程详情用于编辑模式。 |
| `fetchChapters` | `/api/courses/:course_id/chapters` | `GET` | - | 加载章节树。 |
| `addChapter` | `/api/courses/:course_id/chapters` | `POST` | `data: { title, parent_id, order, ... }` | 添加新章节/课时。 |
| `updateChapter` | `/api/courses/:course_id/chapters/:chapter_id` | `PUT` | `data: { title, content, video_url, ... }` | 保存章节内容。 |
| `reorderChapters` | `/api/courses/:course_id/chapters/reorder` | `PUT` | `data: { chapters: [{id, order, parent_id}, ...] }` | 更新章节顺序 (Batch update). |
| `publishCourse` | `/api/courses/:id/publish` | `PATCH` | - | 发布课程。 |

### 2.3 Logic Enhancements
*   **Debounce Strategy**: Implement a **1000ms debounce** for `updateChapter` calls within the Store or Component to prevent API flooding during rich text editing.
*   **Error Handling**: Wrap all API calls in `try...finally` to manage `isLoading`. Throw errors to the View layer for UI feedback (toasts).

## 3. Interaction Flow (交互流程)

### 3.1 Initialization (`onMounted`)
1.  检查路由参数中的 `id`。
2.  如果 `id` 存在 (编辑模式):
    *   调用 `store.fetchCourse(id)`。
    *   调用 `store.fetchChapters(id)`。
    *   设置 `currentStep` 为 1 (或根据需求设为 2)。
3.  如果 `id` 缺失 (创建模式):
    *   重置 store 状态。
    *   设置 `currentStep` 为 1。
    *   从 `authStore.user.id` 预填充 `teacher_id`。

### 3.2 Step 1: Base Info -> Step 2
1.  用户填写表单并点击 "Next"。
2.  **Validation**: 检查 `title` (必填)。
3.  **Action**:
    *   如果 `courseId` 为 null: 调用 `store.createCourse()`。
    *   如果 `courseId` 存在: 调用 `store.updateCourse()`。
4.  **On Success**:
    *   保存 `courseId` 到 state。
    *   设置 `currentStep = 2`。
    *   (可选) 更新 URL 为 `/course/:id/edit` 而不刷新页面。

### 3.3 Step 2: Chapter Management
1.  **Add Chapter**:
    *   用户点击 "Add lesson" (Ghost Button)。
    *   调用 `store.addChapter({ title: 'New Chapter', parent_id: ... })`。
    *   刷新树结构或追加到本地 state。
2.  **Edit Content**:
    *   用户在 `ChapterTree` 中选择一个节点。
    *   `CourseChapterEditor` 使用节点数据填充。
    *   用户在 RichText/Inputs 中输入。
    *   **Auto-save/Manual Save**: 调用 `store.updateChapter()` (带 **1000ms 防抖**)。
3.  **Reorder**:
    *   用户拖拽章节节点。
    *   `vuedraggable` 触发 `change` 事件。
    *   调用 `store.reorderChapters()` 更新后端顺序。

## 4. Styling & Layout (样式与布局)

### 4.1 Layout Integration
使用现有的 `MainLayout` 插槽。`NewCourseView` 应填满可用空间。

```html
<!-- views/course/NewCourseView.vue -->
<template>
  <div class="min-h-screen bg-ctp-base p-6">
    <!-- Step 1 Container -->
    <div v-if="store.currentStep === 1" class="max-w-4xl mx-auto bg-ctp-mantle rounded-xl shadow-lg p-8">
      <!-- Content -->
    </div>

    <!-- Step 2 Container (Full Width) -->
    <div v-else class="flex h-[calc(100vh-120px)] gap-6">
      <!-- Sidebar -->
      <aside class="w-80 bg-ctp-mantle rounded-xl overflow-y-auto border border-ctp-surface0">
        <ChapterTree />
      </aside>
      <!-- Main Editor -->
      <main class="flex-1 bg-ctp-mantle rounded-xl border border-ctp-surface0 flex flex-col">
        <EditorToolbar />
        <div class="flex-1 overflow-y-auto p-6">
          <CourseChapterEditor />
        </div>
      </main>
    </div>
  </div>
</template>
```

### 4.2 Color Palette (Catppuccin)
请参考 `.colors/prompt.md` 获取确切的类名。

*   **Backgrounds**: `bg-ctp-base` (页面), `bg-ctp-mantle` (面板/卡片)。
*   **Text**: `text-ctp-text` (主要), `text-ctp-subtext0` (标签)。
*   **Inputs**: `bg-ctp-surface0` (背景), `border-ctp-surface1` (边框), `focus:border-ctp-blue`。
*   **Buttons**:
    *   Primary (Next/Publish): `bg-ctp-blue text-ctp-base hover:bg-ctp-blue/80`.
    *   Secondary (Save): `bg-ctp-green text-ctp-base`.
    *   Ghost (Add Lesson): `bg-transparent border border-dashed border-ctp-overlay1 text-ctp-overlay1 hover:border-ctp-blue hover:text-ctp-blue`.
*   **Tree Items**:
    *   Active: `bg-ctp-surface1 text-ctp-blue`.
    *   Hover: `hover:bg-ctp-surface0`.

### 4.3 i18n Keys
*   `course.creation.title`: "Create a new course"
*   `course.creation.step1.name`: "Course name"
*   `course.creation.step1.desc`: "Description"
*   `course.creation.step1.visibility`: "Choose visibility"
*   `course.creation.actions.save`: "Save"
*   `course.creation.actions.publish`: "Publish"
*   `course.creation.chapter.add`: "Add lesson/assignment"

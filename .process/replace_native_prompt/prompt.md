# 替换原生 Prompt 弹窗实施计划

## 1. 问题分析

### 现状
在课程章节编辑器 (`CourseChapterEditor.vue`) 中，添加新章节 (`handleAdd`) 的逻辑目前依赖于浏览器原生的 `window.prompt()` 方法：

```javascript
const title = prompt('Enter chapter title:')
```

### 痛点
1.  **用户体验差**：原生弹窗样式简陋，无法适配项目的 **Catppuccin** 主题，且会阻塞页面主线程。
2.  **交互限制**：无法自定义输入框类型、验证逻辑（如非空检查、长度限制）或添加额外的说明信息。
3.  **风格不统一**：项目中其他部分已开始使用现代化的 UI 组件（如 `vue-sonner`），原生弹窗显得格格不入。

## 2. 解决方案

我们将移除 `window.prompt()`，替换为一个自定义的 **模态框 (Modal)** 组件。

### 2.1 新增组件：`BaseModal.vue` (可选) 或直接实现
为了保持代码简洁且考虑到当前项目可能尚未封装通用的 Modal 组件，我们将采用 **Headless UI** 思想或直接使用 Vue 的 `<Teleport>` 实现一个轻量级的输入弹窗。

鉴于需求简单（仅输入标题），我们将在 `CourseChapterEditor.vue` 内部集成一个模态框状态，或者封装一个简单的 `InputModal` 组件。

**推荐方案**：创建一个专用的 `ChapterCreationModal.vue` 组件，或者在 `CourseChapterEditor.vue` 中直接实现 Modal 逻辑（如果复用性不高）。考虑到后续可能还有“重命名”等需求，封装一个通用的 `InputModal` 是最佳实践。

### 2.2 技术栈
-   **Vue 3**: `Teleport`, `v-model`, `defineProps`, `defineEmits`
-   **Tailwind CSS**: 用于构建符合 Catppuccin 主题的遮罩层和弹窗样式。
-   **Icons**: 使用现有的图标库（如果有）或 SVG。

## 3. 实施步骤

### 步骤 1: 创建通用输入模态框组件
创建 `src/components/ui/InputModal.vue`：
-   **功能**：接收 `title`, `placeholder`, `modelValue` (v-model)，并提供 `confirm` 和 `cancel` 事件。
-   **样式**：
    -   遮罩层：`fixed inset-0 bg-black/50 backdrop-blur-sm`
    -   容器：`bg-ctp-mantle border border-ctp-surface1 rounded-xl shadow-xl`
    -   输入框：`bg-ctp-surface0 text-ctp-text`
-   **交互**：支持回车提交，ESC 关闭。

### 步骤 2: 重构 `CourseChapterEditor.vue`
1.  引入 `InputModal` 组件。
2.  新增响应式状态：
    -   `showAddModal` (Boolean)
    -   `newChapterTitle` (String)
    -   `pendingParentId` (String/Number) - 用于暂存当前要添加子章节的父节点 ID。
3.  修改 `handleAdd` 方法：
    -   不再调用 `prompt`。
    -   设置 `pendingParentId`。
    -   清空 `newChapterTitle`。
    -   打开模态框 (`showAddModal = true`)。
4.  实现 `confirmAddChapter` 方法：
    -   校验标题非空。
    -   调用 Store 的 `addChapter` 方法。
    -   关闭模态框并重置状态。

### 步骤 3: 清理与验证
-   删除原有的 `prompt` 代码。
-   测试添加根章节和子章节的功能。
-   验证 UI 样式是否符合 Catppuccin 主题。

## 4. 预期效果

点击 "+ Add Lesson" 按钮后，不再弹出原生输入框，而是平滑淡入一个深色主题的对话框，允许用户输入标题并确认。

## 5. 涉及文件

-   `frontend/src/components/ui/InputModal.vue` (New)
-   `frontend/src/components/course/creation/CourseChapterEditor.vue` (Modify)

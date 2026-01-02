# 课程进度条未更新问题分析

## 问题描述
在 `StudentCourseSidebar.vue` 组件中，课程总进度条（Progress Bar）和百分比显示没有随着章节学习进度的更新而变化。

## 原因分析

### 1. 数据源依赖
在 `StudentCourseSidebar.vue` 中，进度条的数据来源于 Store 的 `progressPercentage` 计算属性：
```javascript
// StudentCourseSidebar.vue
<div
  class="bg-ctp-green h-2 rounded-full transition-all duration-500"
  :style="{ width: store.progressPercentage + '%' }"
></div>
```

### 2. Store 中的计算逻辑
查看 `student-course.js`，`progressPercentage` 的定义如下：
```javascript
// student-course.js
const progressPercentage = computed(() => {
  if (!enrollment.value) return 0
  return enrollment.value.progress || 0
})
```
它直接依赖于 `enrollment.value.progress`。

### 3. 更新逻辑缺失
当用户观看视频更新进度时，调用的是 `updateLearningProgress` 方法：
```javascript
// student-course.js
const updateLearningProgress = (progress) => {
  if (!currentChapter.value || !course.value) return

  // 1. 更新当前章节的进度 (Local State)
  currentChapter.value.progress = progress
  if (progress >= 100) {
    currentChapter.value.is_completed = true
  }

  // 2. 调用 API 更新后端
  debouncedUpdateProgress(course.value.id, currentChapter.value.id, progress)
}
```
**关键问题在于**：这个方法只更新了 `currentChapter`（当前章节）的进度，**并没有重新计算或更新 `enrollment.value.progress`（课程总进度）**。

虽然 API `_updateLearningProgress` 被调用了，但它只更新了后端的数据库。前端的 `enrollment` 对象自初始化加载后就没有变过，因此 `progressPercentage` 保持不变。

## 解决方案

需要在前端实时计算课程总进度，而不是依赖 `enrollment` 中的静态值。

### 方案 A：前端实时计算 (推荐)
基于 `chapters` 数组中所有章节的 `is_completed` 或 `progress` 状态来动态计算总进度。

**修改 `student-course.js` 中的 `progressPercentage`：**

```javascript
const progressPercentage = computed(() => {
  if (!chapters.value.length) return 0
  
  // 获取所有内容章节（叶子节点）
  const allFiles = flatChapters.value.filter(c => c.type === 'FILE')
  if (allFiles.length === 0) return 0

  // 计算已完成的章节数
  // 或者根据每个章节的 progress 加权平均
  // 这里假设简单逻辑：已完成章节数 / 总章节数
  const completedCount = allFiles.filter(c => c.is_completed).length
  
  return Math.round((completedCount / allFiles.length) * 100)
})
```

### 方案 C：双管齐下 (最佳实践)

为了保证前端体验的流畅性（即时反馈）和后端数据的一致性（持久化存储），我们将同时实施前端和后端的修复。

1.  **前端 (`student-course.js`)**:
    *   修改 `progressPercentage` 为动态计算属性，基于本地 `chapters` 数据实时计算。
    *   计算公式：`(已完成章节数 / 总内容章节数) * 100`。

2.  **后端 (`chapterController.js`)**:
    *   在 `updateProgress` 接口中，增加计算课程总进度的逻辑。
    *   统计该用户在该课程下所有 `is_completed=true` 的章节数。
    *   统计该课程的总章节数（排除目录）。
    *   更新 `Enrollment` 表的 `progress` 字段。
    *   这样可以确保用户在刷新页面或在课程列表页查看时，进度也是准确的。

## 下一步行动

1.  **前端修复**: 修改 `frontend/src/stores/student-course.js` 中的 `progressPercentage` 计算逻辑。
2.  **后端修复**: 修改 `backend/controllers/chapterController.js` 中的 `updateProgress` 方法，添加总进度计算和更新逻辑。

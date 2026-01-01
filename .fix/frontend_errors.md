# 前端报错分析与修复计划

## 1. 问题汇总

根据控制台日志，当前存在以下三类主要问题：

### 1.1 i18n 翻译缺失
大量 `[intlify] Not found ... key in 'en' locale messages` 警告，表明 `en.json` (可能还有 `zh-CN.json`) 中缺少以下键值：
- `student.course.content.prev`
- `student.course.content.next`
- `student.course.sidebar.completed`
- `student.course.discussion.no_comments`
- (推测可能还缺少 `student.course.discussion.title`, `student.course.discussion.placeholder`, `student.course.content.select_chapter` 等)

### 1.2 Vue 渲染警告
`[Vue warn]: Property "showDiscussion" was accessed during render but is not defined on instance.`
**原因**：在 `StudentCourseDetailView.vue` 中，我刚刚删除了 `showDiscussion` 的 `ref` 定义，但在模板中可能仍有残留的引用（例如在 `<Icon>` 或其他地方）。

### 1.3 路由缺失
`[Vue Router warn]: No match found for location with path "/forum"`
**原因**：侧边栏或某个组件尝试跳转到 `/forum`，但该路由尚未在 `router/index.js` 中定义。

## 2. 修复方案

### 2.1 修复 i18n 缺失
需要在 `frontend/src/locales/en.json` 和 `zh-CN.json` 中补充缺失的翻译键值。

**待添加结构 (en.json):**
```json
"student": {
  "course": {
    "sidebar": {
      "completed": "Completed"
    },
    "content": {
      "prev": "Previous",
      "next": "Next",
      "select_chapter": "Select a chapter to start learning"
    },
    "discussion": {
      "title": "Discussion",
      "no_comments": "No comments yet",
      "placeholder": "Write a comment..."
    }
  }
}
```

### 2.2 修复 `showDiscussion` 引用
检查 `StudentCourseDetailView.vue`，移除所有对 `showDiscussion` 的残留引用。

### 2.3 修复 `/forum` 路由
虽然论坛功能尚未完全开发，但为了消除警告，可以先添加一个占位路由，或者检查哪里引用了 `/forum` 并暂时隐藏该链接。
(通常是在侧边栏导航中)。

## 3. 执行步骤

1.  **更新 Locale 文件**：编辑 `en.json` 和 `zh-CN.json`。
2.  **清理 Vue 模板**：再次检查 `StudentCourseDetailView.vue`，确保没有遗漏的 `showDiscussion`。
3.  **检查路由/导航**：查找 `/forum` 的引用源头并处理。

---
这份分析是否准确？如果没问题，我将开始执行修复。

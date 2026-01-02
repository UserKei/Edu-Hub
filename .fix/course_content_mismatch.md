# 课程内容显示不匹配问题分析与修复

## 问题描述
用户反馈：在发布新课程并跳转到学习页面后，显示的内容（子章节）与当前课程不匹配，而是显示了上一次观看课程的子章节。

## 原因分析
经过代码审查，问题出在 `frontend/src/stores/student-course.js` 中的 `fetchCourseContent` 方法。

### 现状逻辑
```javascript
const fetchCourseContent = async (courseId) => {
  isLoading.value = true
  error.value = null
  try {
    const res = await request.get(`/api/courses/${courseId}/content`)
    // 更新课程数据
    course.value = res.course
    enrollment.value = res.enrollment
    chapters.value = res.chapters

    // 自动选择逻辑
    if (enrollment.value.last_chapter_id) {
      // ... 尝试查找上次观看的章节 ...
    }

    // 问题点：这里检查 currentChapter 是否为空
    // 如果 Store 中还保留着上一个课程的 currentChapter，这里就不会执行默认选择逻辑
    if (!currentChapter.value) {
      currentChapter.value = findFirstLeaf(chapters.value)
    }
  } 
  // ...
}
```

### 根本原因
Pinia Store 是全局单例的。当用户从课程 A 切换到课程 B 时，`currentChapter` 状态仍然保留着课程 A 的章节数据。
在 `fetchCourseContent` 执行时，虽然 `course` 和 `chapters` 被更新为课程 B 的数据，但代码没有显式清空 `currentChapter`。
导致后续的 `if (!currentChapter.value)` 判断失效，从而保留了旧的章节数据，导致显示错乱。

## 修复方案

在 `fetchCourseContent` 开始获取数据之前，或者在获取到新数据但 ID 不匹配时，显式重置 `currentChapter`。

### 修改代码 (`frontend/src/stores/student-course.js`)

```javascript
  const fetchCourseContent = async (courseId) => {
    isLoading.value = true
    error.value = null
    
    // 修复：在获取新数据前，先清空当前章节，防止状态污染
    currentChapter.value = null 
    
    try {
      const res = await request.get(`/api/courses/${courseId}/content`)
      // ... 后续逻辑保持不变 ...
```

这样可以确保每次进入新课程时，都会重新触发自动选择逻辑（选择上次观看的章节，或者默认第一个章节）。

# 仪表盘管理测试用例

这里提供了用于测试仪表盘相关功能的 JSON 请求体示例。

## 1. Get Continue Learning List

- **URL**: `GET /api/dashboard/continue-learning`
- **Content-Type**: `application/json`
- **Auth**: Required (Bearer Token)

### 请求体示例

*(无请求体)*

### 成功响应 (200 OK)

```json
{
  "message": "获取成功",
  "data": [
    {
      "course_id": 1,
      "course_title": "2025年全栈开发实战",
      "course_cover": "https://example.com/cover.jpg",
      "last_chapter_id": 5,
      "last_chapter_title": "第一章：环境搭建",
      "last_accessed_at": "2025-12-22T10:30:00.000Z"
    },
    {
      "course_id": 3,
      "course_title": "Vue 3 深度解析",
      "course_cover": "https://example.com/vue3.jpg",
      "last_chapter_id": 12,
      "last_chapter_title": "Composition API 实战",
      "last_accessed_at": "2025-12-21T09:15:00.000Z"
    }
  ]
}
```

### 错误响应 (500 Internal Server Error)

```json
{
  "message": "服务器内部错误"
}
```

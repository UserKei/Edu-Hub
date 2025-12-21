# 课程与章节管理测试用例

这里提供了用于测试课程创建、章节添加和课程发布的 JSON 请求体示例。

## 1. 创建课程 (Create Course)

- **URL**: `POST /api/courses`
- **Content-Type**: `application/json`

### 请求体示例

```json
{
  "title": "2025年全栈开发实战",
  "description": "从零开始学习 Node.js, Vue 3 和 MySQL，构建一个完整的在线教育平台。",
  "cover_image": "https://example.com/cover.jpg",
  "type": "PUBLIC",
  "teacher_id": 1
}
```

### 成功响应 (201 Created)
```json
{
  "message": "课程创建成功",
  "course": {
    "id": 1,
    "title": "2025年全栈开发实战",
    "status": "DRAFT",
    "teacher_id": 1,
    "updated_at": "2025-12-21T...",
    "created_at": "2025-12-21T..."
  }
}
```

---

## 2. 更新课程信息 (Update Course)

- **URL**: `PUT /api/courses/:id`
- **Content-Type**: `application/json`

### 请求体示例
*(所有字段均为可选)*

```json
{
  "title": "2025年全栈开发实战 (修订版)",
  "description": "新增了 Tiptap 编辑器使用教程...",
  "cover_image": "http://localhost:3000/uploads/images/new-cover.jpg",
  "type": "PRIVATE",
  "access_code": "VIP888"
}
```

### 成功响应
```json
{
  "message": "课程更新成功",
  "course": { ... }
}
```

---

## 3. 获取课程详情 (Get Course Detail)

- **URL**: `GET /api/courses/:id`

### 成功响应
```json
{
  "id": 1,
  "title": "2025年全栈开发实战",
  "description": "...",
  "status": "DRAFT",
  ...
}
```

---

## 4. 添加章节 (Add Chapter)

- **URL**: `POST /api/courses/:course_id/chapters`
- **Content-Type**: `application/json`

### 场景 A: 添加一级目录 (Folder)
*注意：目录节点不包含 content, video_url 等内容字段。*

```json
{
  "title": "第一章：环境搭建",
  "order": 1
}
```

### 场景 B: 添加子章节 (File - 内容节点)
*注意：需要提供 `parent_id`，且父节点必须是目录（无内容）。*

```json
{
  "title": "1.1 安装 Node.js",
  "content": "本节课我们将学习如何在 Mac 和 Windows 上安装 Node.js...",
  "video_url": "https://example.com/videos/install-node.mp4",
  "resource_url": "https://example.com/files/node-v20.pkg",
  "resource_name": "Node.js 安装包",
  "parent_id": 1,
  "order": 1
}
```

### 场景 C: 添加一级内容节点 (File - 无子章节)
*注意：直接在根目录下添加内容。*

```json
{
  "title": "课程前言",
  "content": "欢迎大家来到这门课程...",
  "video_url": "https://example.com/videos/intro.mp4",
  "order": 0
}
```

---

## 5. 更新章节 (Update Chapter)

- **URL**: `PUT /api/courses/:course_id/chapters/:chapter_id`
- **Content-Type**: `application/json`

### 请求体示例
*(所有字段均为可选)*

```json
{
  "title": "1.1 安装 Node.js (Updated)",
  "content": "<p>Updated HTML content...</p>",
  "video_url": "http://localhost:3000/uploads/videos/new.mp4"
}
```

### 成功响应
```json
{
  "message": "章节更新成功",
  "chapter": { ... }
}
```

---

## 6. 获取章节列表 (Get Chapters)

- **URL**: `GET /api/courses/:course_id/chapters`

### 响应示例 (树形结构)
```json
[
  {
    "id": 2,
    "title": "课程前言",
    "type": "FILE",
    "children": []
  },
  {
    "id": 1,
    "title": "第一章：环境搭建",
    "type": "FOLDER",
    "children": [
      {
        "id": 3,
        "title": "1.1 安装 Node.js",
        "type": "FILE",
        "children": []
      }
    ]
  }
]
```

---

## 7. 发布课程 (Publish Course)

- **URL**: `PATCH /api/courses/:id/publish`

### 请求体
*(无请求体)*

### 成功响应
```json
{
  "message": "课程发布成功",
  "course": {
    "id": 1,
    "title": "2025年全栈开发实战",
    "status": "PUBLISHED",
    ...
  }
}
```

### 失败响应 (如果课程无章节)
```json
{
  "message": "无法发布：课程至少需要包含一个章节"
}
```

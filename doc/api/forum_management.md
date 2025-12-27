# 论坛系统接口文档

本文档描述了论坛系统（帖子与评论）的 API 接口。

## 1. Get Post List

- **URL**: `/api/posts`
- **Method**: `GET`
- **描述**: 分页获取帖子列表，支持按课程 ID 筛选。

### 请求参数 (Query Params)

| 参数名 | 类型 | 必填 | 描述 | 默认值 |
| :--- | :--- | :--- | :--- | :--- |
| `page` | number | 否 | 页码 | 1 |
| `limit` | number | 否 | 每页数量 | 10 |
| `course_id` | number | 否 | 课程 ID (用于筛选特定课程的讨论) | - |

### 响应结果 (200 OK)

```json
{
  "total": 100,
  "totalPages": 10,
  "currentPage": 1,
  "posts": [
    {
      "id": 1,
      "title": "如何使用 Vue 3 Composition API?",
      "content": "这里是帖子内容的摘要...",
      "published": true,
      "author_id": 2,
      "course_id": null,
      "chapter_id": null,
      "created_at": "2025-12-25T10:00:00.000Z",
      "updated_at": "2025-12-25T10:00:00.000Z",
      "author": {
        "id": 2,
        "nickname": "张三",
        "avatar": "http://example.com/avatar.jpg",
        "role": "STUDENT"
      }
    }
  ]
}
```

## 2. Get Post Detail

- **URL**: `/api/posts/:id`
- **Method**: `GET`
- **描述**: 获取单条帖子的详细内容及其评论列表。

### 路径参数 (Path Params)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 帖子 ID |

### 响应结果 (200 OK)

```json
{
  "id": 1,
  "title": "如何使用 Vue 3 Composition API?",
  "content": "<p>这里是帖子的详细 HTML 内容...</p>",
  "published": true,
  "author_id": 2,
  "course_id": null,
  "chapter_id": null,
  "created_at": "2025-12-25T10:00:00.000Z",
  "updated_at": "2025-12-25T10:00:00.000Z",
  "author": {
    "id": 2,
    "nickname": "张三",
    "avatar": "http://example.com/avatar.jpg",
    "role": "STUDENT"
  },
  "comments": [
    {
      "id": 101,
      "content": "非常有用的教程！",
      "author_id": 3,
      "post_id": 1,
      "created_at": "2025-12-25T10:30:00.000Z",
      "author": {
        "id": 3,
        "nickname": "李四",
        "avatar": null,
        "role": "TEACHER"
      }
    }
  ]
}
```

### 错误响应 (404 Not Found)

```json
{
  "message": "帖子不存在"
}
```

## 3. Create Post

- **URL**: `/api/posts`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Header**: `Authorization: Bearer <token>`
- **描述**: 发布一个新的讨论帖。

### 请求参数 (Request Body)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `title` | string | 是 | 帖子标题 |
| `content` | string | 是 | 帖子内容 (支持 HTML) |
| `course_id` | number | 否 | 关联的课程 ID |
| `chapter_id` | number | 否 | 关联的章节 ID |

### 请求示例

```json
{
  "title": "关于课程第一章的疑问",
  "content": "<p>我在学习第一章的时候遇到了这个问题...</p>",
  "course_id": 10,
  "chapter_id": 5
}
```

### 响应结果 (201 Created)

```json
{
  "id": 2,
  "title": "关于课程第一章的疑问",
  "content": "<p>我在学习第一章的时候遇到了这个问题...</p>",
  "published": true,
  "author_id": 2,
  "course_id": 10,
  "chapter_id": 5,
  "updated_at": "2025-12-26T09:00:00.000Z",
  "created_at": "2025-12-26T09:00:00.000Z"
}
```

## 4. Delete Post

- **URL**: `/api/posts/:id`
- **Method**: `DELETE`
- **Header**: `Authorization: Bearer <token>`
- **描述**: 删除指定的帖子。只有作者本人或管理员可以执行此操作。

### 路径参数 (Path Params)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 帖子 ID |

### 响应结果 (200 OK)

```json
{
  "message": "帖子已删除"
}
```

### 错误响应 (403 Forbidden)

```json
{
  "message": "无权删除此帖子"
}
```

## 5. Create Comment

- **URL**: `/api/posts/:id/comments`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Header**: `Authorization: Bearer <token>`
- **描述**: 在指定帖子下发表评论。

### 路径参数 (Path Params)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 帖子 ID |

### 请求参数 (Request Body)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `content` | string | 是 | 评论内容 |

### 请求示例

```json
{
  "content": "我也遇到了同样的问题，期待解答。"
}
```

### 响应结果 (201 Created)

```json
{
  "id": 102,
  "content": "我也遇到了同样的问题，期待解答。",
  "post_id": 1,
  "author_id": 4,
  "created_at": "2025-12-26T09:15:00.000Z",
  "author": {
    "id": 4,
    "nickname": "王五",
    "avatar": null,
    "role": "STUDENT"
  }
}
```

## 6. Delete Comment

- **URL**: `/api/comments/:id`
- **Method**: `DELETE`
- **Header**: `Authorization: Bearer <token>`
- **描述**: 删除指定的评论。只有作者本人或管理员可以执行此操作。

### 路径参数 (Path Params)

| 参数名 | 类型 | 必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `id` | number | 是 | 评论 ID |

### 响应结果 (200 OK)

```json
{
  "message": "评论已删除"
}
```

### 错误响应 (403 Forbidden)

```json
{
  "message": "无权删除此评论"
}
```

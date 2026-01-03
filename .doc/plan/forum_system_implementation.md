# 论坛系统开发方案 (Forum System Implementation Plan)

本文档详细描述了论坛系统（帖子与评论）的开发计划、API 设计及交互流程。

## 1. 核心功能需求

论坛系统旨在为学生和教师提供一个交流平台。
- **发帖 (Post)**: 用户可以发布讨论，帖子可以关联特定的课程或章节，也可以是通用讨论。
- **评论 (Comment)**: 用户可以对帖子进行回复。
- **查看**: 支持按课程筛选帖子，查看帖子详情及所有评论。
- **管理**: 作者可以删除自己的帖子/评论，管理员可以删除任何内容。

## 2. 数据库模型 (已存在)

基于 `database/schema.sql`，我们已经有了以下表结构：

- **Post**: `id`, `title`, `content`, `author_id`, `course_id` (可选), `chapter_id` (可选), `published`, `created_at`
- **Comment**: `id`, `content`, `author_id`, `post_id`, `created_at`

## 3. 交互流程设计 (Mermaid Diagrams)

### 3.1 用户发帖流程 (Activity Diagram)

```mermaid
flowchart TD
    Start([开始]) --> CheckLogin{用户是否登录?}
    CheckLogin -- 否 --> RedirectLogin[跳转登录页]
    CheckLogin -- 是 --> ClickNewPost[点击发布帖子]
    
    ClickNewPost --> FillForm[填写标题和内容]
    
    FillForm --> SelectContext{是否关联课程?}
    SelectContext -- 是 --> ChooseCourse[选择课程/章节]
    SelectContext -- 否 --> GeneralPost[设为通用讨论]
    
    ChooseCourse --> Submit[提交表单]
    GeneralPost --> Submit
    
    Submit --> Validate{前端验证通过?}
    Validate -- 否 --> ShowError[显示错误提示] --> FillForm
    Validate -- 是 --> CallAPI[调用创建接口]
    
    CallAPI --> ServerResult{服务器响应}
    ServerResult -- 成功 --> ShowSuccess[提示成功] --> GoToDetail[跳转帖子详情页]
    ServerResult -- 失败 --> ShowServerError[显示服务器错误] --> FillForm
    
    GoToDetail --> End([结束])
```

### 3.2 帖子与评论交互时序 (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as 用户
    participant FE as 前端 (Vue)
    participant API as 后端 (Express)
    participant DB as 数据库 (MySQL)

    Note over User, DB: 场景：用户发布帖子并进行评论

    %% 发布帖子
    User->>FE: 点击"发布帖子"并提交表单
    FE->>API: POST /api/posts (Header: Token)
    activate API
    API->>API: 验证 Token & 权限
    API->>DB: INSERT INTO Post ...
    activate DB
    DB-->>API: 返回新帖子 ID
    deactivate DB
    API-->>FE: 201 Created (Post Data)
    deactivate API
    FE->>User: 跳转到帖子详情页

    %% 加载详情
    FE->>API: GET /api/posts/:id
    activate API
    API->>DB: SELECT Post + Author Info
    API->>DB: SELECT Comments + Author Info
    DB-->>API: 返回数据
    API-->>FE: 200 OK (Post + Comments)
    deactivate API
    FE-->>User: 展示帖子内容和评论列表

    %% 发表评论
    User->>FE: 输入评论内容并点击"回复"
    FE->>API: POST /api/posts/:id/comments
    activate API
    API->>API: 验证 Token
    API->>DB: INSERT INTO Comment ...
    activate DB
    DB-->>API: 返回新评论 ID
    deactivate DB
    API-->>FE: 201 Created (Comment Data)
    deactivate API
    
    FE->>FE: 将新评论追加到列表顶部
    FE-->>User: 显示"评论成功"
```

## 4. API 接口设计

### 4.1 帖子管理 (Posts)

| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | 获取帖子列表 (支持分页, `course_id` 筛选) | 公开/登录 |
| `GET` | `/api/posts/:id` | 获取单条帖子详情 (包含评论) | 公开/登录 |
| `POST` | `/api/posts` | 发布新帖子 | 登录用户 |
| `DELETE` | `/api/posts/:id` | 删除帖子 | 作者/管理员 |

### 4.2 评论管理 (Comments)

| 方法 | 路径 | 描述 | 权限 |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/posts/:id/comments` | 在指定帖子下发表评论 | 登录用户 |
| `DELETE` | `/api/comments/:id` | 删除评论 | 作者/管理员 |

## 5. 前端开发任务

1.  **组件开发**:
    -   `PostList.vue`: 展示帖子列表卡片，支持搜索和筛选。
    -   `PostDetail.vue`: 帖子正文展示 + 评论区组件。
    -   `CommentEditor.vue`: 简单的富文本或纯文本输入框，用于发表评论。
2.  **页面集成**:
    -   在 `CourseEditor` 或 `CourseDetail` 中集成“课程讨论区”。
    -   创建独立的 `/forum` 路由作为全站讨论区。

## 6. 后端开发任务

1.  **Controller**: 创建 `postController.js` 和 `commentController.js` (或合并为 `forumController.js`)。
2.  **Routes**: 创建 `forumRoutes.js`。
3.  **Middleware**: 复用 `authMiddleware` 确保只有登录用户能发帖/回帖。


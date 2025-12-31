# 数据库变更计划：继续学习功能 (Continue Learning)

为了实现“继续学习”功能，让学生能够快速回到上次观看的课程章节，我们需要在数据库中记录用户的最后访问位置。

## 1. 现状分析

目前的 `Enrollment` 表结构如下：
```sql
CREATE TABLE IF NOT EXISTS Enrollment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade FLOAT COMMENT '考试成绩',
    progress INT DEFAULT 0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- ... 外键约束
)
```
现有的 `progress` 字段通常用于存储进度百分比或已完成章节数，不足以定位到具体的“上次观看章节”。

## 2. 变更方案

我们需要在 `Enrollment` 表中增加两个字段：
1.  `last_chapter_id`: 记录最后访问的章节 ID。
2.  `last_accessed_at`: 记录最后访问时间，用于在 Dashboard 上按时间排序显示“最近学习”。

### SQL 变更脚本

```sql
ALTER TABLE Enrollment
ADD COLUMN last_chapter_id INT COMMENT '最后访问的章节ID',
ADD COLUMN last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后访问时间',
ADD CONSTRAINT fk_enrollment_last_chapter FOREIGN KEY (last_chapter_id) REFERENCES Chapter(id) ON DELETE SET NULL;
```

## 3. 影响范围与实施计划

### 3.1 数据库 (Database)
*   执行上述 `ALTER TABLE` 语句。
*   更新 `database/schema.sql` 以反映最新结构。

### 3.2 后端 (Backend)
*   **API 更新**:
    *   `GET /api/dashboard/continue-learning`: 获取学生最近学习的课程列表（按 `last_accessed_at` 倒序）。返回数据应包含 `course_info` 和 `last_chapter_info`。
    *   `POST /api/courses/:courseId/chapters/:chapterId/progress`: (或复用获取章节详情的接口) 当用户访问章节详情时，触发更新 `last_chapter_id` 和 `last_accessed_at`。

<!-- ### 3.3 前端 (Frontend)
*   **Dashboard**:
    *   新增 "Continue Learning" 板块。
    *   显示课程卡片，并带有 "Continue: [Chapter Title]" 按钮，点击直接跳转到对应章节页。 -->

## 4. 任务清单
- [x] 修改 `database/schema.sql` 并应用迁移。
- [x] 修改 `database/main.dbml` 以反映 Enrollment 表变更。
- [x] 合并 `database/test_data.sql` 到 `database/seed.sql` 并清理。
- [x] 后端 Model (`Enrollment.js`) 更新关联关系。
- [x] 后端 Controller 实现记录更新逻辑。
- [x] 后端 Controller 实现“继续学习”列表查询接口。
- [x] 添加接口后，更新接口文档。

## 5. 接口文档规范 (Documentation Standards)

# Constraints & Rules (必须严格遵守)
1. **禁止猜测**：所有的 Request Body 字段和 Response Body 字段必须基于代码中的真实定义（Prisma Schema 或 Zod 验证）。不要编造不存在的字段。
2. **完整覆盖响应**：
   - **成功响应**：区分 `200 OK` 和 `201 Created`。JSON 示例必须包含完整的数据结构。
   - **错误响应**：这是最关键的。请仔细阅读 Controller 中的 `if (...) return res.status(xxx)` 逻辑。
   - 如果同一个状态码（如 400）有多种错误原因，请务必使用 **“情况 1”、“情况 2”** 的格式分别列出。
3. **格式规范**：输出必须是标准的 Markdown 格式，不要使用表格来展示参数，而是使用 JSON 代码块。

# Output Template (请完全复刻此格式)

## {序号}. {接口名称 (英文)}

- **URL**: `{METHOD} {PATH}`
- **Content-Type**: `application/json`
- **Headers**: `Authorization: Bearer <token>` (如果代码中有 auth 中间件)

### 请求体示例

*(如果有多种输入场景，请分 "场景 A", "场景 B" 展示，否则直接展示 JSON)*

```json
{
  "field1": "value",
  "field2": 123
}
```

### 成功响应 ({状态码})

```json
{
  "message": "...",
  "data": { ... }
}
```

### 错误响应 (400 Bad Request)

**情况 1: 缺少关键参数**

```json
{
  "message": "标题不能为空"
}
```

**情况 2: 逻辑校验失败**

```json
{
  "message": "该父章节包含内容，无法添加子章节"
}
```

### 错误响应 (401/403/404)

*(根据代码逻辑列出所有可能的错误)*

```json
{
  "message": "..."
}
```

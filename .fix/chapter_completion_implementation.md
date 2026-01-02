```markdown
# 章节完成状态功能开发计划

## 1. 需求分析
**目标**：在学生端课程侧边栏中，为已完成（视频观看完毕）的章节显示“完成”图标（如打钩）。

**现状**：
- 前端 `StudentCourseContent.vue` 已在视频播放时通过 `updateLearningProgress` 上报进度。
- 前端 Store 会在进度达到 100% 时发送 `status: 'COMPLETED'`。
- **缺失**：后端目前仅更新 `Enrollment` 表的 `last_chapter_id`，未存储每个章节的具体完成状态。因此刷新页面后，完成状态丢失。

## 2. 数据库变更 (Database)

需要新建一张表来记录用户在每个章节的学习进度。

### 新增表: `ChapterProgress`

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | INT (PK) | 主键 |
| `user_id` | INT (FK) | 关联 User |
| `chapter_id` | INT (FK) | 关联 Chapter |
| `course_id` | INT (FK) | 关联 Course (冗余字段，优化查询) |
| `is_completed` | BOOLEAN | 是否已完成 |
| `progress` | INT | 进度百分比 (0-100) |
| `updated_at` | DATETIME | 最后更新时间 |

> **注意**：需添加唯一索引 `(user_id, chapter_id)` 防止重复记录。

## 3. 后端开发 (Backend)

### 3.1 模型层 (Models)
- 创建 `backend/models/ChapterProgress.js` 模型文件。
- 在 `backend/models/index.js` (或相关关联配置处) 建立关联：
    - `User` hasMany `ChapterProgress`
    - `Chapter` hasMany `ChapterProgress`

### 3.2 控制器层 (Controllers)

#### A. 修改 `updateProgress` (`backend/controllers/chapterController.js`)
- **当前逻辑**：仅更新 `Enrollment` 表的 `last_chapter_id`。
- **修改后逻辑**：
    1. 保持更新 `Enrollment` 的逻辑不变。
    2. **新增**：使用 `ChapterProgress.upsert` (或 `findOne` + `update/create`) 更新当前章节的进度。
    3. 接收前端传递的 `status` 字段，如果为 `COMPLETED` 或 `progress >= 100`，将 `is_completed` 设为 `true`。

#### B. 修改 `getCourseContent` (`backend/controllers/courseController.js`)
- **当前逻辑**：查询 `Chapter` 表并构建树。
- **修改后逻辑**：
    1. 查询 `Chapter` 的同时，关联查询当前用户的 `ChapterProgress`。
    2. 将 `is_completed` 状态合并到返回的章节数据中。
    3. 返回的数据结构示例：
       ```json
       {
         "id": 1,
         "title": "第一章",
         "is_completed": true,
         "children": [...]
       }
       ```

## 4. 前端开发 (Frontend)

### 4.1 组件修改 (`SidebarItem.vue`)
- **目标**：在章节标题旁显示完成图标。
- **修改**：
    1. 接收的 `item` prop 中将包含 `is_completed` 字段。
    2. 在 `template` 中添加条件渲染：
       ```vue
       <Icon 
         v-if="item.is_completed && !isFolder" 
         icon="mdi:check-circle" 
         class="text-green-500 ml-auto" 
       />
       ```
    3. 调整样式，确保图标位置美观（建议放在最右侧或标题后）。

### 4.2 Store 状态更新 (`student-course.js`)
- 确保 `updateLearningProgress` 成功调用 API 后，能够即时更新本地 `chapters` 数据中的 `is_completed` 状态，这样用户无需刷新页面即可看到图标变化。

## 5. 开发步骤

1.  **DB**: 创建 `ChapterProgress` 表 (SQL/Migration)。 **[已完成]**
    - 已更新 `database/schema.sql`
    - 已更新 `database/main.dbml`
    - 已更新 `database/drop.sql`
2.  **Backend**: 实现 Model 和 Controller 逻辑。
3.  **Frontend**: 修改 `SidebarItem.vue` UI。
4.  **Frontend**: 调试 Store 状态更新逻辑。

```
这份开发计划是否准确？如果没问题，我将开始生成代码。

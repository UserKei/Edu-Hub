# 课程章节设计方案

## 1. 需求背景
为了提升用户体验，课程目录将以**侧边栏**形式展示。为了保持结构清晰，系统将严格区分**目录节点**和**内容节点**：
- **非叶子节点（目录节点）**：仅作为层级结构的容器，只包含标题（Title），**不包含**任何教学内容（视频、图文、课件）。
- **叶子节点（内容节点）**：实际承载教学内容的节点，包含标题以及视频、图文、附件等。

## 2. 数据库设计

### 2.1 表结构回顾
沿用现有的 `Chapter` 表结构，利用 `parent_id` 实现无限层级（建议限制为 3 级以保证体验）。

```sql
CREATE TABLE Chapter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    
    -- 内容字段 (仅叶子节点有效)
    content TEXT,
    video_url VARCHAR(255),
    resource_url VARCHAR(255),
    resource_name VARCHAR(255),
    
    `order` INT DEFAULT 0,
    course_id INT NOT NULL,
    parent_id INT NULL, -- 指向父章节 ID
    
    FOREIGN KEY (course_id) REFERENCES Course(id),
    FOREIGN KEY (parent_id) REFERENCES Chapter(id)
);
```

### 2.2 业务约束逻辑
虽然数据库层面允许所有字段有值，但在业务逻辑层（Backend Service）需执行以下约束：

1.  **目录节点约束**：
    *   定义：任何被其他记录的 `parent_id` 引用的记录。
    *   规则：其 `content`, `video_url`, `resource_url` 字段必须为空或被忽略。
    
2.  **内容节点约束**：
    *   定义：没有被任何记录的 `parent_id` 引用的记录。
    *   规则：允许设置内容字段。

3.  **状态转换约束**：
    *   **内容节点 -> 目录节点**：当用户尝试给一个已存在内容的章节添加子章节时，系统应：
        *   **方案 A (严格)**：报错，提示“该章节包含内容，无法添加子章节。请先清空内容或新建章节”。
        *   **方案 B (自动迁移)**：提示用户“该章节将转为目录，原有内容将丢失或需手动迁移”。
    *   **目录节点 -> 内容节点**：当删除一个目录节点的所有子章节后，它自然成为叶子节点，此时允许为其添加内容。

## 3. 接口设计 (API)

### 3.1 获取课程章节列表 (GET /api/courses/:id/chapters)
后端应直接返回处理好的**树形结构**，方便前端侧边栏渲染。

**响应示例：**
```json
[
  {
    "id": 1,
    "title": "第一章：基础入门",
    "type": "FOLDER", // 目录节点
    "children": [
      {
        "id": 2,
        "title": "1.1 环境搭建",
        "type": "FILE", // 内容节点
        "video_url": "http://...",
        "children": []
      },
      {
        "id": 3,
        "title": "1.2 Hello World",
        "type": "FILE",
        "video_url": "http://...",
        "children": []
      }
    ]
  },
  {
    "id": 4,
    "title": "第二章：进阶",
    "type": "FOLDER",
    "children": [] 
  }
]
```

### 3.2 添加/更新章节
在 `create` 或 `update` 接口中，后端需校验：
- 如果 `parent_id` 指向了一个已有内容的章节，应拒绝操作或触发特定逻辑。
- 确保层级深度不超过 3 层（可选）。

## 4. 前端展示逻辑

### 4.1 侧边栏组件 (Sidebar)
- 使用递归组件渲染树形结构。
- **目录节点**：
    - 图标：文件夹 (Folder)
    - 点击行为：展开/折叠子菜单。
    - 样式：加粗，无选中高亮（或仅作为分组标题）。
- **内容节点**：
    - 图标：文件/视频/文档 (File/Video)
    - 点击行为：在右侧主区域加载并播放视频/显示图文。
    - 样式：点击后高亮显示，表示当前正在学习的小节。

### 4.2 课程编辑页面
- 明确区分“添加子章节”和“编辑内容”的操作入口。
- 如果当前节点有子节点，隐藏“上传视频/内容”的表单区域，仅允许修改标题。

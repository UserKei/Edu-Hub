# 课程创建功能完善方案 (Course Creation Enhancement Plan)

## 1. 目标
完善课程创建流程，从目前的纯文本/URL输入升级为支持多媒体文件上传（视频、封面图、课件）以及富文本编辑，使其接近真实产品的体验。

## 2. 核心功能模块

### 2.1 视频上传 (Video Upload)
目前方案是手动输入 `video_url`。
**改进方案**:
- **前端**: 使用 `<input type="file">` 选择视频文件，通过 `FormData` 和 `axios` 上传。显示上传进度条。
- **后端**: 使用 `multer` 中间件处理文件上传。
- **存储**:
    - *MVP阶段*: 存储在后端服务器的本地磁盘 (`/uploads/videos/`)，并配置静态资源服务。
    - *生产阶段*: 建议对接对象存储 (AWS S3, Aliyun OSS)，后端仅负责签名或转发。
- **流程**:
    1. 用户在章节编辑页点击 "上传视频"。
    2. 选择文件 -> 调用 `/api/upload/video`。
    3. 后端保存文件 -> 返回访问 URL (e.g., `http://localhost:3000/uploads/videos/abc.mp4`)。
    4. 前端自动填入 `video_url` 字段。

### 2.2 课程封面与课件上传 (Cover & Resources)
- **封面图**: 类似视频上传，限制文件类型为图片 (jpg, png)，存储在 `/uploads/images/`。
- **课件**: 支持 PDF/PPT/Zip 等格式，存储在 `/uploads/files/`。

### 2.3 富文本编辑 (Rich Text Editor)
目前方案是 `textarea` 纯文本。
**改进方案**:
- 使用 **Tiptap** (Vue 3 强大的 Headless 编辑器) 替换纯文本框。
- 允许教师对章节的图文内容进行排版（加粗、列表、插入图片）。

## 3. 技术实现细节

### 3.1 后端 (Node.js + Express)
需要安装依赖: `npm install multer cors`

**目录结构**:
```
backend/
  uploads/
    images/
    videos/
    files/
```

**API 设计**:
- `POST /api/upload/image` -> 返回 `{ url: "..." }`
- `POST /api/upload/video` -> 返回 `{ url: "..." }`
- `POST /api/upload/file`  -> 返回 `{ url: "...", originalName: "..." }`

**静态资源服务**:
在 `app.js` 中配置:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### 3.2 前端 (Vue 3)
需要安装依赖: `npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image`

- **组件封装**: 创建一个通用的 `FileUpload.vue` 组件。
    - Props: `accept` (文件类型), `maxSize` (大小限制)。
    - Events: `upload-success` (返回URL), `upload-error`。
- **集成**:
    - `CourseEditor.vue` (基本信息Tab): 集成图片上传用于封面。
    - `ChapterEditor.vue`: 集成视频上传和课件上传。

## 4. 实施步骤

1.  **后端基础建设**:
    - 配置 `multer`。
    - 开放 `uploads` 目录访问权限。
    - 编写上传接口路由。

2.  **前端组件开发**:
    - 开发 `FileUpload` 组件 (含进度条)。
    - 引入富文本编辑器 (可选，MVP可暂缓，先做上传)。

3.  **业务集成**:
    - 替换 `CourseEditor` 中的封面 URL 输入框。
    - 替换 `ChapterEditor` 中的视频 URL 输入框。

4.  **测试**:
    - 上传大文件测试。
    - 验证静态资源访问。

## 5. 待办事项 (Todo)
- [ ] 后端安装 `multer` 并配置。
- [ ] 后端实现 `/api/upload` 路由。
- [ ] 前端实现文件上传组件。
- [ ] 前端集成 **Tiptap** 编辑器。
- [ ] 联调并替换现有 URL 输入框。

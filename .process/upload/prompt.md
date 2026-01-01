# 视频上传功能开发实施计划 (Video Upload Implementation Plan)

> **注意**: 本计划专注于在课程章节编辑器 (`ChapterContentEditor.vue`) 中实现视频上传功能。后端 API (`uploadController.js`) 已经就绪。

## 1. 功能概述 (Overview)
在课程章节编辑页面，允许教师上传视频文件作为章节的学习资源。
*   **限制**: 仅支持视频文件 (Video only)。
*   **后端**: 使用现有的 `/api/upload` 接口。
*   **前端**: 替换现有的 Mock 占位符，实现真实的上传交互。

## 2. 组件架构 (Component Architecture)

### 2.1 目标组件
**File**: `src/components/course/creation/ChapterContentEditor.vue`

### 2.2 UI 设计
*   **上传区域**:
    *   默认状态: 显示 "Click to upload video" 或拖拽提示。
    *   上传中: 显示进度条或 Loading 动画。
    *   上传完成: 显示视频预览 (Video Player) 和 "Replace Video" 按钮。
*   **文件限制提示**: "Max size: 500MB. Formats: MP4, WebM, Ogg."

## 3. 技术实现 (Technical Implementation)

### 3.1 API 集成
使用 `src/utils/request.js` 发送 `multipart/form-data` 请求。

**Endpoint**: `POST /api/upload`
**Payload**: `FormData { file: FileObject }`
**Response**:
```json
{
  "message": "上传成功",
  "url": "http://localhost:3000/uploads/videos/...",
  "filename": "...",
  "mimetype": "video/mp4",
  "size": 123456
}
```

### 3.2 前端逻辑 (`ChapterContentEditor.vue`)

#### State
```javascript
const isUploading = ref(false)
const uploadProgress = ref(0) // 可选，如果 axios 配置了 onUploadProgress
const videoUrl = ref('') // 绑定到 localChapter.video_url
```

#### Methods
*   `handleFileUpload(event)`:
    1.  获取文件对象 `event.target.files[0]`。
    2.  **Validation**:
        *   Type: `file.type.startsWith('video/')`
        *   Size: `< 500MB`
    3.  **Upload**:
        *   设置 `isUploading = true`。
        *   调用 API。
    4.  **Success**:
        *   更新 `localChapter.video_url = res.url`。
        *   触发 `emitUpdate` 保存章节数据。
    5.  **Error**:
        *   提示错误信息。
    6.  **Finally**:
        *   `isUploading = false`。

### 3.3 模板结构 (Template)

```html
<!-- Video Upload Section -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-ctp-subtext0">Video Lesson</label>
  
  <!-- Upload Area -->
  <div 
    class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-ctp-surface1 bg-ctp-surface0 p-6 transition-colors hover:border-ctp-blue"
    :class="{ 'border-ctp-blue bg-ctp-surface1': isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <!-- Loading State -->
    <div v-if="isUploading" class="text-ctp-blue animate-pulse">
      Uploading video...
    </div>

    <!-- Preview State (Has Video) -->
    <div v-else-if="localChapter.video_url" class="w-full">
      <video controls :src="localChapter.video_url" class="w-full rounded-lg max-h-[300px] bg-black"></video>
      <div class="mt-2 flex justify-end">
        <button @click="triggerFileInput" class="text-sm text-ctp-blue hover:underline">Replace Video</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center cursor-pointer" @click="triggerFileInput">
      <div class="text-ctp-overlay1">
        <p class="font-medium">Click to upload video</p>
        <p class="text-xs mt-1">MP4, WebM (Max 500MB)</p>
      </div>
    </div>

    <!-- Hidden Input -->
    <input 
      ref="fileInput"
      type="file" 
      accept="video/*" 
      class="hidden" 
      @change="handleFileSelect"
    />
  </div>
</div>
```

## 4. 数据流 (Data Flow)
1.  用户选择视频文件。
2.  前端上传至 `/api/upload`。
3.  后端返回视频 URL。
4.  前端更新 `localChapter.video_url`。
5.  `emitUpdate` 触发，父组件/Store 调用 `updateChapter` API。
6.  后端更新 `chapters` 表中的 `video_url` 字段。

## 5. 任务清单 (Checklist)
- [ ] 修改 `ChapterContentEditor.vue` 模板，添加视频上传 UI。
- [ ] 实现文件选择和拖拽处理逻辑。
- [ ] 实现文件类型和大小校验 (Video only, <500MB)。
- [ ] 集成 `/api/upload` 接口。
- [ ] 绑定 `video_url` 到章节数据并实现自动保存。

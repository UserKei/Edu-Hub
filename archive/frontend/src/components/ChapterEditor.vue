<template>
  <div class="chapter-editor">
    <div class="form-group">
      <label>章节标题</label>
      <input v-model="form.title" type="text" />
    </div>

    <div v-if="chapter.type === 'FILE'">
      <div class="form-group">
        <label>视频上传</label>
        <FileUpload
          v-model="form.video_url"
          accept="video/*"
          label="上传视频"
          :initialUrl="form.video_url"
        />
      </div>

      <div class="form-group">
        <label>图文内容</label>
        <div class="editor-container">
          <editor-content :editor="editor" />
        </div>
      </div>

      <div class="form-group">
        <label>课件上传</label>
        <FileUpload
          v-model="form.resource_url"
          accept=".pdf,.ppt,.pptx,.zip,.rar"
          label="上传课件"
          :initialUrl="form.resource_url"
        />
      </div>
    </div>

    <div v-else class="folder-notice">
      <p>ℹ️ 此节点包含子章节，仅作为目录使用，无法添加内容。</p>
    </div>

    <div class="actions">
      <button @click="save" :disabled="saving">保存修改</button>
      <span v-if="message">{{ message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';
import FileUpload from './FileUpload.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const props = defineProps({
  chapter: {
    type: Object,
    required: true
  },
  courseId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update']);

const form = ref({
  title: '',
  content: '',
  video_url: '',
  resource_url: ''
});

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image,
  ],
  onUpdate: ({ editor }) => {
    form.value.content = editor.getHTML();
  },
});

const saving = ref(false);
const message = ref('');

// 当选中的章节变化时，重置表单
watch(() => props.chapter, (newVal) => {
  form.value = {
    title: newVal.title || '',
    content: newVal.content || '',
    video_url: newVal.video_url || '',
    resource_url: newVal.resource_url || ''
  };

  if (editor.value) {
    editor.value.commands.setContent(newVal.content || '');
  }

  message.value = '';
}, { immediate: true });

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

const save = async () => {
  saving.value = true;
  message.value = '';
  try {
    await axios.put(`http://localhost:3000/api/courses/${props.courseId}/chapters/${props.chapter.id}`, {
      ...form.value
    });
    message.value = '保存成功!';
    emit('update'); // 通知父组件刷新列表
  } catch (error) {
    message.value = '保存失败: ' + (error.response?.data?.message || error.message);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.chapter-editor {
  max-width: 600px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.folder-notice {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 10px;
  margin-bottom: 15px;
}
.actions {
  margin-top: 20px;
}
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  min-height: 200px;
}
/* Tiptap Basic Styles */
:deep(.ProseMirror) {
  outline: none;
  min-height: 150px;
}
:deep(.ProseMirror p) {
  margin: 0.5em 0;
}
</style>

<template>
  <div class="post-editor-container">
    <h2>发布新帖子</h2>

    <div class="form-group">
      <label>标题</label>
      <input v-model="title" type="text" placeholder="请输入标题" class="title-input" />
    </div>

    <div class="form-group">
      <label>内容</label>
      <div class="editor-container">
        <div class="editor-toolbar" v-if="editor">
          <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">Bold</button>
          <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">Italic</button>
          <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">H2</button>
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">List</button>
        </div>
        <editor-content :editor="editor" class="editor-content" />
      </div>
    </div>

    <div class="actions">
      <button @click="$router.back()" class="btn-cancel">取消</button>
      <button @click="submitPost" class="btn-submit" :disabled="submitting">
        {{ submitting ? '发布中...' : '发布' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

const router = useRouter();
const title = ref('');
const submitting = ref(false);

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { Authorization: `Bearer ${token}` }
});

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
});

const submitPost = async () => {
  if (!title.value.trim()) {
    alert('请输入标题');
    return;
  }
  if (editor.value.isEmpty) {
    alert('请输入内容');
    return;
  }

  submitting.value = true;
  try {
    const content = editor.value.getHTML();
    await api.post('/posts', {
      title: title.value,
      content
    });
    router.push('/forum');
  } catch (error) {
    alert('发布失败: ' + (error.response?.data?.message || error.message));
  } finally {
    submitting.value = false;
  }
};

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.post-editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.title-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.editor-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}
.editor-toolbar {
  padding: 10px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
  display: flex;
  gap: 5px;
}
.editor-toolbar button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 3px;
}
.editor-toolbar button.is-active {
  background: #333;
  color: white;
}
.editor-content {
  flex: 1;
  padding: 20px;
  outline: none;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-cancel {
  padding: 10px 20px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:disabled {
  background: #a5d6a7;
}
/* Tiptap basic styles */
:deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}
:deep(.ProseMirror p) {
  margin-bottom: 1em;
}
:deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.5em;
}
:deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.5em;
}
</style>

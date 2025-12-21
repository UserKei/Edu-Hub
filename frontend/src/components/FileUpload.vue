<template>
  <div class="file-upload">
    <div v-if="!uploading && !fileUrl" class="upload-area">
      <input
        type="file"
        ref="fileInput"
        :accept="accept"
        @change="handleFileChange"
        style="display: none"
      />
      <button @click="triggerSelect" class="btn-select">
        {{ label || '选择文件' }}
      </button>
      <span class="hint" v-if="hint">{{ hint }}</span>
    </div>

    <div v-if="uploading" class="progress-area">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <span class="progress-text">{{ progress }}%</span>
    </div>

    <div v-if="fileUrl" class="preview-area">
      <div v-if="isImage" class="image-preview">
        <img :src="fileUrl" alt="Preview" />
      </div>
      <div v-else class="file-info">
        <span>📄 {{ fileName || '文件已上传' }}</span>
      </div>
      <div class="actions">
        <a :href="fileUrl" target="_blank" class="btn-link">查看</a>
        <button @click="clearFile" class="btn-danger">删除/重传</button>
      </div>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  accept: {
    type: String,
    default: '*/*'
  },
  label: String,
  hint: String,
  initialUrl: String,
  maxSize: {
    type: Number,
    default: 500 * 1024 * 1024 // 500MB
  }
});

const emit = defineEmits(['upload-success', 'upload-error', 'update:modelValue']);

const fileInput = ref(null);
const uploading = ref(false);
const progress = ref(0);
const fileUrl = ref(props.initialUrl || '');
const fileName = ref('');
const error = ref('');

const isImage = computed(() => {
  if (!fileUrl.value) return false;
  const ext = fileUrl.value.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
});

const triggerSelect = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > props.maxSize) {
    error.value = `文件大小不能超过 ${props.maxSize / 1024 / 1024}MB`;
    return;
  }

  error.value = '';
  uploading.value = true;
  progress.value = 0;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post('http://localhost:3000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      }
    });

    fileUrl.value = res.data.url;
    fileName.value = res.data.filename;
    emit('upload-success', res.data.url);
    emit('update:modelValue', res.data.url); // 支持 v-model
  } catch (err) {
    error.value = '上传失败: ' + (err.response?.data?.message || err.message);
    emit('upload-error', err);
  } finally {
    uploading.value = false;
    // 清空 input，允许重复上传同名文件
    if (fileInput.value) fileInput.value.value = '';
  }
};

const clearFile = () => {
  fileUrl.value = '';
  fileName.value = '';
  emit('update:modelValue', '');
};
</script>

<style scoped>
.file-upload {
  border: 1px dashed #ccc;
  padding: 15px;
  border-radius: 4px;
  background: #fafafa;
}
.btn-select {
  padding: 5px 15px;
  cursor: pointer;
}
.hint {
  margin-left: 10px;
  color: #888;
  font-size: 12px;
}
.progress-bar {
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}
.progress-fill {
  height: 100%;
  background: #42b983;
  transition: width 0.3s;
}
.preview-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #ddd;
}
.actions {
  display: flex;
  gap: 10px;
}
.btn-link {
  color: #42b983;
  text-decoration: none;
}
.btn-danger {
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  background: none;
  padding: 2px 8px;
  cursor: pointer;
}
.error-msg {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>

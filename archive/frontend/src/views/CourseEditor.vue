<template>
  <div class="course-editor">
    <div class="header">
      <h1>课程编辑器 (MVP)</h1>
      <div class="nav-links">
        <router-link to="/forum" class="nav-link">讨论区</router-link>
        <router-link to="/login" class="nav-link">登录/注册</router-link>
      </div>
      <div v-if="courseId" class="header-actions">
        <span class="status-badge">{{ course?.status }}</span>
        <button @click="publishCourse" :disabled="course?.status === 'PUBLISHED'">发布课程</button>
      </div>
    </div>

    <div v-if="!courseId" class="start-screen">
      <button @click="createCourse">开始创建新课程</button>
    </div>

    <div v-else class="editor-container">
      <!-- 顶部标签页切换 -->
      <div class="tabs">
        <button :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">基本信息</button>
        <button :class="{ active: activeTab === 'chapters' }" @click="activeTab = 'chapters'">章节内容</button>
      </div>

      <!-- Tab 1: 基本信息编辑 -->
      <div v-if="activeTab === 'info'" class="tab-content info-editor">
        <div class="form-group">
          <label>课程标题</label>
          <input v-model="courseForm.title" type="text" />
        </div>
        <div class="form-group">
          <label>课程简介</label>
          <textarea v-model="courseForm.description" rows="5"></textarea>
        </div>
        <div class="form-group">
          <label>封面图片</label>
          <FileUpload
            v-model="courseForm.cover_image"
            accept="image/*"
            label="上传封面"
            :initialUrl="courseForm.cover_image"
          />
        </div>
        <div class="form-group">
          <label>课程类型</label>
          <select v-model="courseForm.type">
            <option value="PUBLIC">公开</option>
            <option value="PRIVATE">私有 (需要邀请码)</option>
          </select>
        </div>
        <div v-if="courseForm.type === 'PRIVATE'" class="form-group">
          <label>邀请码</label>
          <input v-model="courseForm.access_code" type="text" />
        </div>
        <button @click="saveCourseInfo">保存基本信息</button>
      </div>

      <!-- Tab 2: 章节编辑 (原有的布局) -->
      <div v-else class="tab-content editor-layout">
        <!-- 左侧侧边栏 -->
        <div class="sidebar">
          <h3>章节目录</h3>
          <button @click="addRootChapter">+ 添加一级章节</button>
          <hr>
          <!-- 递归组件入口 -->
          <ChapterTree
            :chapters="chapters"
            :courseId="courseId"
            @select="selectChapter"
            @refresh="fetchChapters"
          />
        </div>

        <!-- 右侧编辑区 -->
        <div class="main-content">
          <div v-if="selectedChapter">
            <h2>编辑: {{ selectedChapter.title }}</h2>
            <ChapterEditor
              :chapter="selectedChapter"
              :courseId="courseId"
              @update="fetchChapters"
            />
          </div>
          <div v-else>
            <p>请选择左侧章节进行编辑</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import ChapterTree from '../components/ChapterTree.vue';
import ChapterEditor from '../components/ChapterEditor.vue';
import FileUpload from '../components/FileUpload.vue';

const courseId = ref(null);
const course = ref(null);
const chapters = ref([]);
const selectedChapter = ref(null);
const activeTab = ref('info'); // 'info' or 'chapters'

const courseForm = reactive({
  title: '',
  description: '',
  cover_image: '',
  type: 'PUBLIC',
  access_code: ''
});

// 硬编码的教师ID，用于测试
const TEACHER_ID = 1;

const createCourse = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/courses', {
      title: '未命名课程 ' + new Date().toLocaleString(),
      teacher_id: TEACHER_ID
    });
    courseId.value = res.data.course.id;
    course.value = res.data.course;
    syncFormWithCourse();
    await fetchChapters();
  } catch (error) {
    alert('创建课程失败: ' + error.message);
  }
};

const syncFormWithCourse = () => {
  if (!course.value) return;
  courseForm.title = course.value.title;
  courseForm.description = course.value.description || '';
  courseForm.cover_image = course.value.cover_image || '';
  courseForm.type = course.value.type || 'PUBLIC';
  courseForm.access_code = course.value.access_code || '';
};

const saveCourseInfo = async () => {
  try {
    const res = await axios.put(`http://localhost:3000/api/courses/${courseId.value}`, courseForm);
    course.value = res.data.course;
    alert('保存成功');
  } catch (error) {
    alert('保存失败: ' + error.message);
  }
};

const publishCourse = async () => {
  if (!confirm('确定要发布该课程吗？发布后学生可见。')) return;
  try {
    const res = await axios.patch(`http://localhost:3000/api/courses/${courseId.value}/publish`);
    course.value = res.data.course;
    alert('发布成功!');
  } catch (error) {
    alert('发布失败: ' + (error.response?.data?.message || error.message));
  }
};

const fetchChapters = async () => {
  if (!courseId.value) return;
  try {
    const res = await axios.get(`http://localhost:3000/api/courses/${courseId.value}/chapters`);
    chapters.value = res.data;
  } catch (error) {
    console.error('获取章节失败', error);
  }
};

const addRootChapter = async () => {
  const title = prompt("请输入一级章节标题");
  if (!title) return;

  try {
    await axios.post(`http://localhost:3000/api/courses/${courseId.value}/chapters`, {
      title,
      order: chapters.value.length + 1
    });
    await fetchChapters();
  } catch (error) {
    alert(error.response?.data?.message || '添加失败');
  }
};

const selectChapter = (chapter) => {
  selectedChapter.value = chapter;
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.nav-links {
  display: flex;
  gap: 15px;
  margin-right: auto;
  margin-left: 20px;
}
.nav-link {
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.status-badge {
  padding: 4px 8px;
  background: #eee;
  border-radius: 4px;
  font-size: 12px;
}
.tabs {
  margin-bottom: 15px;
  border-bottom: 1px solid #ccc;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}
.tabs button.active {
  border-bottom: 2px solid #42b983;
  font-weight: bold;
}
.info-editor {
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
.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.editor-layout {
  display: flex;
  height: 80vh;
  border: 1px solid #ccc;
}
.sidebar {
  width: 300px;
  border-right: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
}
.main-content {
  flex: 1;
  padding: 20px;
}
</style>

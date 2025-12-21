<template>
  <div class="forum-container">
    <div class="header">
      <h2>讨论区</h2>
      <button @click="$router.push('/forum/new')" class="btn-primary">发布新帖</button>
    </div>

    <div class="filters">
      <input v-model="searchQuery" @keyup.enter="fetchPosts" placeholder="搜索帖子..." class="search-input" />
      <!-- 后续可以添加课程筛选 -->
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="posts.length === 0" class="empty">
      暂无帖子，快来发布第一条讨论吧！
    </div>

    <div v-else class="post-list">
      <div v-for="post in posts" :key="post.id" class="post-card" @click="goToDetail(post.id)">
        <div class="post-main">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-preview">{{ getPreview(post.content) }}</p>
          <div class="post-meta">
            <span class="author">
              <span class="avatar-placeholder">{{ post.author?.nickname?.[0] || post.author?.username?.[0] || 'U' }}</span>
              {{ post.author?.nickname || post.author?.username }}
            </span>
            <span class="time">{{ new Date(post.created_at).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="currentPage === 1" @click="changePage(-1)">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="changePage(1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const posts = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');

const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/api/posts', {
      params: {
        page: currentPage.value,
        limit: 10,
        // search: searchQuery.value // 后端暂时没写搜索，先预留
      }
    });
    posts.value = res.data.posts;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  } finally {
    loading.value = false;
  }
};

const changePage = (delta) => {
  currentPage.value += delta;
  fetchPosts();
};

const goToDetail = (id) => {
  router.push(`/forum/${id}`);
};

const getPreview = (content) => {
  // 简单去除HTML标签获取纯文本预览
  const text = content.replace(/<[^>]+>/g, '');
  return text.length > 100 ? text.slice(0, 100) + '...' : text;
};

onMounted(fetchPosts);
</script>

<style scoped>
.forum-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-primary {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
}
.post-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.post-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.post-title {
  margin: 0 0 10px 0;
  color: #2c3e50;
}
.post-preview {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}
.post-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}
.author {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.avatar-placeholder {
  width: 24px;
  height: 24px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: #666;
  font-weight: bold;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>

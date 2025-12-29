<template>
  <div class="post-detail-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!post" class="error">帖子不存在或已被删除</div>

    <div v-else class="content-wrapper">
      <button @click="$router.push('/forum')" class="back-btn">← 返回列表</button>

      <article class="post-article">
        <header class="post-header">
          <h1 class="title">{{ post.title }}</h1>
          <div class="meta">
            <div class="author-info">
              <span class="avatar">{{ post.author?.nickname?.[0] || 'U' }}</span>
              <span class="name">{{ post.author?.nickname || post.author?.username }}</span>
            </div>
            <span class="time">{{ new Date(post.created_at).toLocaleString() }}</span>
            <button v-if="canDelete(post)" @click="deletePost" class="delete-btn">删除帖子</button>
          </div>
        </header>

        <div class="post-body" v-html="post.content"></div>
      </article>

      <section class="comments-section">
        <h3>评论 ({{ post.comments?.length || 0 }})</h3>

        <div class="comment-form" v-if="isLoggedIn">
          <textarea
            v-model="newComment"
            placeholder="写下你的评论..."
            rows="3"
          ></textarea>
          <button @click="submitComment" :disabled="submitting || !newComment.trim()">
            {{ submitting ? '提交中...' : '发表评论' }}
          </button>
        </div>
        <div v-else class="login-tip">
          <router-link to="/login">登录</router-link> 后参与讨论
        </div>

        <div class="comment-list">
          <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
            <div class="comment-avatar">{{ comment.author?.nickname?.[0] || 'U' }}</div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author?.nickname || comment.author?.username }}</span>
                <span class="comment-time">{{ new Date(comment.created_at).toLocaleString() }}</span>
                <button v-if="canDelete(comment)" @click="deleteComment(comment.id)" class="delete-link">删除</button>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const post = ref(null);
const loading = ref(true);
const newComment = ref('');
const submitting = ref(false);

const token = localStorage.getItem('token');
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const isLoggedIn = !!token;

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: token ? { Authorization: `Bearer ${token}` } : {}
});

const fetchPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`);
    post.value = res.data;
  } catch (error) {
    console.error('Fetch post error:', error);
  } finally {
    loading.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  submitting.value = true;
  try {
    const res = await api.post(`/posts/${post.value.id}/comments`, {
      content: newComment.value
    });
    // Add new comment to list
    post.value.comments.push(res.data);
    newComment.value = '';
  } catch (error) {
    alert('评论失败: ' + (error.response?.data?.message || error.message));
  } finally {
    submitting.value = false;
  }
};

const deletePost = async () => {
  if (!confirm('确定要删除这篇帖子吗？')) return;
  try {
    await api.delete(`/posts/${post.value.id}`);
    router.push('/forum');
  } catch (error) {
    alert('删除失败');
  }
};

const deleteComment = async (commentId) => {
  if (!confirm('确定要删除这条评论吗？')) return;
  try {
    await api.delete(`/comments/${commentId}`);
    post.value.comments = post.value.comments.filter(c => c.id !== commentId);
  } catch (error) {
    alert('删除失败');
  }
};

const canDelete = (item) => {
  if (!isLoggedIn) return false;
  if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') return true;
  return item.author_id === currentUser.id;
};

onMounted(fetchPost);
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0;
}
.post-article {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}
.title {
  margin: 0 0 20px 0;
  font-size: 24px;
}
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.author-info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 32px;
  height: 32px;
  background: #42b983;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}
.time {
  color: #999;
  font-size: 14px;
}
.delete-btn {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}
.post-body {
  line-height: 1.8;
  color: #333;
}
.comments-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.comment-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  resize: vertical;
}
.comment-form button {
  background: #42b983;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.comment-list {
  margin-top: 30px;
}
.comment-item {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 20px;
}
.comment-avatar {
  width: 40px;
  height: 40px;
  background: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}
.comment-content {
  flex: 1;
}
.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;
}
.comment-author {
  font-weight: bold;
  margin-right: 10px;
}
.comment-time {
  color: #999;
  font-size: 12px;
}
.delete-link {
  margin-left: auto;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}
.delete-link:hover {
  color: red;
}
</style>

<template>
  <div class="invite-code-management">
    <div class="header">
      <h2>邀请码管理</h2>
      <div class="actions">
        <button @click="generateCode" class="btn-primary">生成新邀请码</button>
      </div>
    </div>

    <div v-if="newCode" class="new-code-alert">
      <h3>🎉 生成成功!</h3>
      <p class="code-display">{{ newCode }}</p>
      <p class="hint">请复制此代码发送给教师，用于注册账号。</p>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>邀请码</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>过期时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in codes" :key="item.id">
          <td>{{ item.id }}</td>
          <td class="code-font">{{ item.code }}</td>
          <td>
            <span v-if="item.is_used" class="status used">已使用</span>
            <span v-else class="status unused">未使用</span>
          </td>
          <td>{{ new Date(item.created_at).toLocaleString() }}</td>
          <td>{{ item.expires_at ? new Date(item.expires_at).toLocaleDateString() : '永久有效' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const codes = ref([]);
const newCode = ref('');

const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { Authorization: `Bearer ${token}` }
});

const fetchCodes = async () => {
  try {
    const res = await api.get('/admin/invite-codes');
    codes.value = res.data;
  } catch (error) {
    console.error('获取邀请码失败', error);
  }
};

const generateCode = async () => {
  try {
    const res = await api.post('/admin/invite-codes', {});
    newCode.value = res.data.code.code;
    await fetchCodes();
  } catch (error) {
    alert('生成失败: ' + error.response?.data?.message);
  }
};

onMounted(fetchCodes);
</script>

<style scoped>
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
  font-size: 16px;
}
.new-code-alert {
  background: #e8f5e9;
  border: 1px solid #c8e6c9;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  text-align: center;
}
.code-display {
  font-size: 32px;
  font-weight: bold;
  color: #2e7d32;
  margin: 10px 0;
  font-family: monospace;
  letter-spacing: 2px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.code-font {
  font-family: monospace;
  font-weight: bold;
}
.status.used { color: #999; text-decoration: line-through; }
.status.unused { color: #42b983; font-weight: bold; }
</style>

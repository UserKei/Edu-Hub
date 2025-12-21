<template>
  <div class="user-management">
    <div class="header">
      <h2>用户管理</h2>
      <div class="search-bar">
        <input v-model="searchQuery" @keyup.enter="fetchUsers" placeholder="搜索用户名/昵称..." />
        <select v-model="roleFilter" @change="fetchUsers">
          <option value="">所有角色</option>
          <option value="STUDENT">学生</option>
          <option value="TEACHER">教师</option>
          <option value="ADMIN">管理员</option>
        </select>
        <button @click="fetchUsers">查询</button>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>昵称</th>
          <th>角色</th>
          <th>状态</th>
          <th>注册时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.nickname || '-' }}</td>
          <td>
            <span :class="['badge', user.role.toLowerCase()]">{{ user.role }}</span>
          </td>
          <td>
            <span :class="['status-dot', user.status === 'ACTIVE' ? 'green' : 'red']"></span>
            {{ user.status }}
          </td>
          <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
          <td class="actions">
            <button
              v-if="user.status === 'ACTIVE'"
              @click="toggleStatus(user, 'BANNED')"
              class="btn-danger"
              :disabled="user.role === 'SUPER_ADMIN'"
            >
              封禁
            </button>
            <button
              v-else
              @click="toggleStatus(user, 'ACTIVE')"
              class="btn-success"
            >
              解封
            </button>
            <button @click="resetPassword(user)" class="btn-warning">重置密码</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(-1)">上一页</button>
      <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
      <button :disabled="currentPage === totalPages" @click="changePage(1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const searchQuery = ref('');
const roleFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);

// 假设 token 存储在 localStorage
const token = localStorage.getItem('token');
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { Authorization: `Bearer ${token}` }
});

const fetchUsers = async () => {
  try {
    const res = await api.get('/admin/users', {
      params: {
        page: currentPage.value,
        search: searchQuery.value,
        role: roleFilter.value
      }
    });
    users.value = res.data.users;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    alert('获取用户列表失败: ' + (error.response?.data?.message || error.message));
  }
};

const changePage = (delta) => {
  currentPage.value += delta;
  fetchUsers();
};

const toggleStatus = async (user, newStatus) => {
  if (!confirm(`确定要将用户 ${user.username} 标记为 ${newStatus} 吗？`)) return;

  try {
    await api.patch(`/admin/users/${user.id}/status`, { status: newStatus });
    user.status = newStatus;
  } catch (error) {
    alert('操作失败: ' + error.response?.data?.message);
  }
};

const resetPassword = async (user) => {
  if (!confirm(`确定要重置用户 ${user.username} 的密码吗？`)) return;

  try {
    const res = await api.post(`/admin/users/${user.id}/reset-password`);
    alert(`重置成功！临时密码为: ${res.data.tempPassword}`);
  } catch (error) {
    alert('操作失败: ' + error.response?.data?.message);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  gap: 10px;
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
.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}
.badge.student { background: #e3f2fd; color: #1976d2; }
.badge.teacher { background: #e8f5e9; color: #2e7d32; }
.badge.admin { background: #fff3e0; color: #f57c00; }
.badge.super_admin { background: #f3e5f5; color: #7b1fa2; }

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.status-dot.green { background: #4caf50; }
.status-dot.red { background: #f44336; }

.actions button {
  margin-right: 5px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}
.btn-danger { background: #ff5252; }
.btn-success { background: #4caf50; }
.btn-warning { background: #ff9800; }
.btn-danger:disabled { background: #ccc; cursor: not-allowed; }

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}
</style>

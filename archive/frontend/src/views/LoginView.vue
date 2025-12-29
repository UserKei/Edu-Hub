<template>
  <div class="login-container">
    <div class="login-box">
      <h2>系统登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" type="text" required placeholder="请输入用户名" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" required placeholder="请输入密码" />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>

        <div class="links">
          <router-link to="/register">没有账号？去注册</router-link>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      username: username.value,
      password: password.value
    });

    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (err) {
    error.value = err.response?.data?.message || '登录失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
button {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
button:disabled {
  background: #a5d6a7;
}
.links {
  text-align: center;
  margin-top: 15px;
}
.links a {
  color: #42b983;
  text-decoration: none;
}
.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>

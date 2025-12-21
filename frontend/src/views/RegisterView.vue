<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="form.username" type="text" required placeholder="3-20位字母、数字、下划线" />
        </div>

        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" required placeholder="6-32位" />
        </div>

        <div class="form-group">
          <label>昵称</label>
          <input v-model="form.nickname" type="text" placeholder="显示名称" />
        </div>

        <div class="form-group">
          <label>角色</label>
          <div class="role-selector">
            <label>
              <input type="radio" v-model="form.role" value="STUDENT" /> 学生
            </label>
            <label>
              <input type="radio" v-model="form.role" value="TEACHER" /> 教师
            </label>
          </div>
        </div>

        <div v-if="form.role === 'TEACHER'" class="form-group">
          <label>教师邀请码 <span class="required">*</span></label>
          <input v-model="form.inviteCode" type="text" required placeholder="请输入管理员提供的邀请码" />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="links">
          <router-link to="/login">已有账号？去登录</router-link>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const form = reactive({
  username: '',
  password: '',
  nickname: '',
  role: 'STUDENT',
  inviteCode: ''
});

const handleRegister = async () => {
  loading.value = true;
  error.value = '';

  try {
    await axios.post('http://localhost:3000/api/auth/register', form);
    alert('注册成功！请登录');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || '注册失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.auth-box {
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
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.role-selector {
  display: flex;
  gap: 20px;
}
.role-selector label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
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
  margin-top: 10px;
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
.required {
  color: red;
}
</style>

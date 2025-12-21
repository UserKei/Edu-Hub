<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2>管理后台</h2>
      <nav>
        <router-link to="/admin/users" active-class="active">用户管理</router-link>
        <router-link to="/admin/invite-codes" active-class="active">邀请码管理</router-link>
        <router-link to="/" class="back-home">返回首页</router-link>
      </nav>
    </aside>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}
.sidebar h2 {
  margin-bottom: 30px;
  color: #42b983;
}
.sidebar nav a {
  display: block;
  color: #ddd;
  text-decoration: none;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
.sidebar nav a:hover, .sidebar nav a.active {
  background: #3e5569;
  color: white;
}
.sidebar nav a.back-home {
  margin-top: 50px;
  border-top: 1px solid #555;
}
.content {
  flex: 1;
  padding: 20px;
  background: #f5f7fa;
}
</style>

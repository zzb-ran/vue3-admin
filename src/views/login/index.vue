<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: ''
})

const rememberMe = ref(false)

const loading = ref(false)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 如果有记住的账号密码，自动填充
const savedCredentials = localStorage.getItem('credentials')
if (savedCredentials) {
  const { username, password } = JSON.parse(savedCredentials)
  loginForm.username = username
  loginForm.password = password
  rememberMe.value = true
}

const formRef = ref(null)

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 这里模拟登录请求
    setTimeout(() => {
      // 保存token
      localStorage.setItem('token', 'mock-token')
      
      // 如果选择记住密码，保存账号密码
      if (rememberMe.value) {
        localStorage.setItem('credentials', JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        }))
      } else {
        localStorage.removeItem('credentials')
      }
      
      loading.value = false
      ElMessage.success('登录成功')
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-left">
      <img src="https://images.unsplash.com/photo-1738249034650-6a789a081a04?q=80&w=4335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="登录页背景图" />
    </div>
    <div class="login-right">
      <el-card class="login-card">
        <h2 class="title">系统登录</h2>
        <el-form ref="formRef" :model="loginForm" :rules="rules" class="login-form">
          <el-form-item>
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login-button"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: var(--el-bg-color);
}

.login-left {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.login-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.login-right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  background-color: var(--el-bg-color);
  padding: 20px;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--el-text-color-primary);
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}
</style>
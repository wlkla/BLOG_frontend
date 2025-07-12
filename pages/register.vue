<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          创建新账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          或者
          <NuxtLink to="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            登录现有账户
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              用户名
            </label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              autocomplete="username"
              required
              class="mt-1 input"
              placeholder="请输入用户名"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              邮箱地址
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 input"
              placeholder="请输入邮箱地址"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 input"
              placeholder="请输入密码（至少6位）"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认密码
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 input"
              placeholder="请再次输入密码"
            >
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            我同意
            <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500">服务条款</a>
            和
            <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500">隐私政策</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            :class="[
              'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              (loading || !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <div class="spinner w-4 h-4 mr-2"></div>
              注册中...
            </span>
            <span v-else>注册</span>
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="text-sm text-red-700 dark:text-red-400">
            {{ error }}
          </div>
        </div>

        <!-- 成功信息 -->
        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div class="text-sm text-green-700 dark:text-green-400">
            {{ success }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// SEO设置
useHead({
  title: '用户注册',
  meta: [
    { name: 'description', content: '注册新账户以享受更多功能' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 表单验证
const isFormValid = computed(() => {
  return form.username.length >= 3 &&
         form.email.includes('@') &&
         form.password.length >= 6 &&
         form.password === form.confirmPassword &&
         form.agreeTerms
})

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    // 验证密码匹配
    if (form.password !== form.confirmPassword) {
      error.value = '两次输入的密码不一致'
      return
    }

    const result = await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    })

    if (result.success) {
      success.value = '注册成功！正在跳转...'
      // 注册成功，等待2秒后重定向到首页
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 如果已经登录，重定向到首页
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

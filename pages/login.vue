<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          登录您的账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          或者
          <NuxtLink to="/register" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            注册新账户
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
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
              :disabled="!authStore.canAttemptLogin"
              class="mt-1 input"
              :class="{ 'opacity-50 cursor-not-allowed': !authStore.canAttemptLogin }"
              placeholder="请输入邮箱地址"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="!authStore.canAttemptLogin"
                class="mt-1 input pr-10"
                :class="{ 'opacity-50 cursor-not-allowed': !authStore.canAttemptLogin }"
                placeholder="请输入密码"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink to="/forgot-password" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
              忘记密码？
            </NuxtLink>
          </div>
        </div>

        <!-- 登录锁定提示 -->
        <div v-if="!authStore.canAttemptLogin" class="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                账户暂时锁定
              </h3>
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  由于多次登录失败，账户已被暂时锁定。
                  请 {{ Math.ceil(authStore.lockoutTimeRemaining / 60) }} 分钟后重试。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !authStore.canAttemptLogin"
            :class="[
              'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              (loading || !authStore.canAttemptLogin) ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <div class="spinner w-4 h-4 mr-2"></div>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                登录失败
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ error }}</p>
                <div v-if="needVerification && verificationEmail" class="mt-3">
                  <button
                    @click="handleResendVerification"
                    :disabled="resendLoading"
                    class="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
                  >
                    {{ resendLoading ? '发送中...' : '重新发送验证邮件' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 成功信息 -->
        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div class="flex">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <p class="text-sm text-green-700 dark:text-green-300">
                {{ success }}
              </p>
            </div>
          </div>
        </div>
      </form>

      <!-- 社交登录（可选） -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              或者使用
            </span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Sign in with GitHub</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
            </svg>
            <span class="ml-2">GitHub</span>
          </button>

          <button
            type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span class="sr-only">Sign in with Google</span>
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

// SEO设置
useHead({
  title: '用户登录',
  meta: [
    { name: 'description', content: '登录您的账户以访问更多功能' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const resendLoading = ref(false)
const showPassword = ref(false)
const error = ref('')
const success = ref('')
const needVerification = ref(false)
const verificationEmail = ref('')

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    needVerification.value = false
    verificationEmail.value = ''

    const result = await authStore.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    })

    if (result.success) {
      success.value = '登录成功！正在跳转...'
      
      // 获取重定向URL或默认跳转到首页
      const redirect = String(route.query.redirect || '/')
      
      setTimeout(() => {
        router.push(redirect)
      }, 1000)
    } else {
      error.value = result.message
      
      // 检查是否需要邮箱验证
      if (result.needVerification && result.email) {
        needVerification.value = true
        verificationEmail.value = result.email
      }
    }
  } catch (err) {
    error.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重新发送验证邮件
const handleResendVerification = async () => {
  try {
    resendLoading.value = true
    
    const result = await authStore.resendVerification(verificationEmail.value)
    
    if (result.success) {
      success.value = '验证邮件已重新发送，请查看邮箱'
      error.value = ''
      needVerification.value = false
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '发送邮件失败，请稍后重试'
  } finally {
    resendLoading.value = false
  }
}

// 如果已经登录，重定向
onMounted(() => {
  authStore.initAuth()
  
  if (authStore.isLoggedIn) {
    const redirect = String(route.query.redirect || '/')
    router.push(redirect)
  }
  
  // 如果URL中有成功消息
  if (route.query.message) {
    success.value = String(route.query.message)
  }
})
</script>

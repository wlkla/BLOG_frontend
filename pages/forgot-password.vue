<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          忘记密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          输入您的邮箱地址，我们将发送重置密码链接给您
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            邮箱地址
          </label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 input"
            placeholder="请输入您的邮箱地址"
          >
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !email.trim()"
            :class="[
              'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors',
              email.trim() && !loading
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <div class="spinner w-4 h-4 mr-2"></div>
              发送中...
            </span>
            <span v-else>发送重置链接</span>
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                发送失败
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 成功信息 -->
        <div v-if="success" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
          <div class="flex">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-300">
                邮件已发送
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{{ success }}</p>
                <p class="mt-2">
                  请检查您的邮箱（包括垃圾邮件文件夹），并点击邮件中的链接重置密码。
                </p>
                <p class="mt-2 text-xs">
                  没有收到邮件？请等待几分钟后再试，或者检查邮箱地址是否正确。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 重新发送 -->
        <div v-if="success && !loading" class="text-center">
          <button
            @click="handleForgotPassword"
            :disabled="resendCooldown > 0"
            class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ resendCooldown > 0 ? `${resendCooldown}秒后可重新发送` : '重新发送邮件' }}
          </button>
        </div>

        <!-- 返回登录 -->
        <div class="text-center">
          <NuxtLink 
            to="/login" 
            class="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← 返回登录页面
          </NuxtLink>
        </div>
      </form>

      <!-- 帮助信息 -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
              需要帮助？
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul class="list-disc list-inside space-y-1">
                <li>确保邮箱地址输入正确</li>
                <li>检查垃圾邮件文件夹</li>
                <li>重置链接有效期为1小时</li>
                <li>如仍有问题，请联系管理员</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  XCircleIcon, 
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

// SEO设置
useHead({
  title: '忘记密码',
  meta: [
    { name: 'description', content: '重置您的密码，找回账户访问权限' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const resendCooldown = ref(0)

let cooldownTimer: NodeJS.Timeout | null = null

const handleForgotPassword = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    const result = await authStore.forgotPassword(email.value.trim())

    if (result.success) {
      success.value = result.message
      startResendCooldown()
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '发送邮件失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 开始重新发送倒计时
const startResendCooldown = () => {
  resendCooldown.value = 60 // 60秒冷却时间
  
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownTimer!)
      cooldownTimer = null
    }
  }, 1000)
}

// 如果已经登录，重定向到首页
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})

// 清理定时器
onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
  }
})
</script>

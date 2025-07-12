<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          邮箱验证
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          正在验证您的邮箱地址...
        </p>
      </div>
      
      <!-- 验证中 -->
      <div v-if="verifying" class="text-center py-8">
        <div class="spinner w-12 h-12 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">
          正在验证您的邮箱，请稍候...
        </p>
      </div>

      <!-- 验证成功 -->
      <div v-else-if="verified" class="text-center">
        <div class="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-6">
          <div class="flex">
            <CheckCircleIcon class="h-8 w-8 text-green-400 mx-auto" />
          </div>
          <div class="mt-3">
            <h3 class="text-lg font-medium text-green-800 dark:text-green-300">
              邮箱验证成功！
            </h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>您的邮箱已成功验证，现在可以正常使用所有功能了。</p>
              <p class="mt-2">{{ verifyMessage }}</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <button 
            @click="redirectToDashboard"
            class="btn btn-primary w-full"
          >
            进入控制台
          </button>
          
          <NuxtLink 
            to="/" 
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            返回首页
          </NuxtLink>
        </div>
      </div>

      <!-- 验证失败 -->
      <div v-else-if="error" class="text-center">
        <div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
          <div class="flex">
            <XCircleIcon class="h-8 w-8 text-red-400 mx-auto" />
          </div>
          <div class="mt-3">
            <h3 class="text-lg font-medium text-red-800 dark:text-red-300">
              验证失败
            </h3>
            <div class="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{{ error }}</p>
              <p class="mt-2">请检查验证链接是否正确，或重新申请验证邮件。</p>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <!-- 重新发送验证邮件表单 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
              重新发送验证邮件
            </h4>
            <form @submit.prevent="handleResendVerification" class="space-y-3">
              <input
                v-model="email"
                type="email"
                placeholder="请输入您的邮箱地址"
                class="input text-sm"
                required
              >
              <button
                type="submit"
                :disabled="resendLoading || !email.trim()"
                :class="[
                  'w-full text-sm py-2 px-3 rounded-md transition-colors',
                  email.trim() && !resendLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                {{ resendLoading ? '发送中...' : '重新发送' }}
              </button>
            </form>
            
            <!-- 重发成功消息 -->
            <div v-if="resendSuccess" class="mt-3 text-sm text-green-600 dark:text-green-400">
              {{ resendSuccess }}
            </div>
            
            <!-- 重发错误消息 -->
            <div v-if="resendError" class="mt-3 text-sm text-red-600 dark:text-red-400">
              {{ resendError }}
            </div>
          </div>
          
          <NuxtLink 
            to="/register" 
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            重新注册账户
          </NuxtLink>
          
          <NuxtLink 
            to="/login" 
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            返回登录页面
          </NuxtLink>
        </div>
      </div>

      <!-- 帮助信息 -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
              验证说明
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul class="list-disc list-inside space-y-1">
                <li>验证链接有效期为24小时</li>
                <li>每个验证链接只能使用一次</li>
                <li>如未收到邮件，请检查垃圾邮件文件夹</li>
                <li>验证后即可正常使用所有功能</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

// SEO设置
useHead({
  title: '邮箱验证',
  meta: [
    { name: 'description', content: '验证您的邮箱地址以完成注册' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const verifying = ref(true)
const verified = ref(false)
const error = ref('')
const verifyMessage = ref('')
const email = ref('')
const resendLoading = ref(false)
const resendSuccess = ref('')
const resendError = ref('')

// 从URL获取验证令牌
const verifyToken = computed(() => String(route.query.token || ''))

// 自动执行邮箱验证
const verifyEmail = async () => {
  try {
    verifying.value = true
    error.value = ''
    
    if (!verifyToken.value) {
      error.value = '验证链接无效，缺少验证令牌'
      return
    }

    const result = await authStore.verifyEmail(verifyToken.value)

    if (result.success) {
      verified.value = true
      verifyMessage.value = result.message || '邮箱验证成功！'
    } else {
      error.value = result.message || '验证失败'
    }
  } catch (err) {
    error.value = '验证过程中发生错误，请稍后重试'
  } finally {
    verifying.value = false
  }
}

// 重新发送验证邮件
const handleResendVerification = async () => {
  try {
    resendLoading.value = true
    resendSuccess.value = ''
    resendError.value = ''
    
    const result = await authStore.resendVerification(email.value.trim())
    
    if (result.success) {
      resendSuccess.value = result.message
      email.value = '' // 清空邮箱输入
    } else {
      resendError.value = result.message
    }
  } catch (err) {
    resendError.value = '发送邮件失败，请稍后重试'
  } finally {
    resendLoading.value = false
  }
}

// 跳转到控制台
const redirectToDashboard = () => {
  // 如果用户已登录（验证成功后会自动登录），跳转到控制台
  if (authStore.isLoggedIn) {
    router.push('/admin/dashboard')
  } else {
    router.push('/login?message=邮箱验证成功，请登录')
  }
}

onMounted(() => {
  // 如果已经登录且已验证，直接跳转
  if (authStore.isLoggedIn && authStore.user?.isEmailVerified) {
    router.push('/admin/dashboard')
    return
  }
  
  // 执行邮箱验证
  verifyEmail()
})
</script>

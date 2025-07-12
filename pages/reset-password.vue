<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          重置密码
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          请输入您的新密码
        </p>
      </div>
      
      <form v-if="!expired && !completed" class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              新密码
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="mt-1 input pr-10"
                :class="{ 
                  'border-red-300 focus:ring-red-500 focus:border-red-500': passwordError,
                  'border-green-300 focus:ring-green-500 focus:border-green-500': passwordValid
                }"
                placeholder="请输入新密码（至少6位，包含字母和数字）"
                @input="validatePassword"
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
            <div class="mt-2">
              <div class="text-xs text-gray-600 dark:text-gray-400">
                密码强度：
                <span :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
              </div>
              <div class="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  class="h-1 rounded-full transition-all duration-300"
                  :class="passwordStrengthColor"
                  :style="{ width: passwordStrengthWidth }"
                ></div>
              </div>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ passwordError }}
            </p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              确认新密码
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="mt-1 input pr-10"
                :class="{ 
                  'border-red-300 focus:ring-red-500 focus:border-red-500': confirmPasswordError,
                  'border-green-300 focus:ring-green-500 focus:border-green-500': confirmPasswordValid
                }"
                placeholder="请再次输入新密码"
                @blur="validateConfirmPassword"
              >
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="showConfirmPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ confirmPasswordError }}
            </p>
            <p v-else-if="confirmPasswordValid" class="mt-1 text-sm text-green-600 dark:text-green-400">
              密码匹配
            </p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            :class="[
              'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors',
              isFormValid && !loading
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <div class="spinner w-4 h-4 mr-2"></div>
              重置中...
            </span>
            <span v-else>重置密码</span>
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                重置失败
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- 链接过期 -->
      <div v-else-if="expired" class="text-center">
        <div class="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-6">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                重置链接已过期
              </h3>
              <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>此重置密码链接已过期或无效，请重新申请密码重置。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <NuxtLink 
            to="/forgot-password" 
            class="btn btn-primary w-full"
          >
            重新申请密码重置
          </NuxtLink>
          
          <NuxtLink 
            to="/login" 
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            返回登录页面
          </NuxtLink>
        </div>
      </div>

      <!-- 重置成功 -->
      <div v-else-if="completed" class="text-center">
        <div class="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-6">
          <div class="flex">
            <CheckCircleIcon class="h-5 w-5 text-green-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-300">
                密码重置成功！
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>您的密码已成功重置，现在可以使用新密码登录了。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <NuxtLink 
            to="/login" 
            class="btn btn-primary w-full"
          >
            立即登录
          </NuxtLink>
          
          <NuxtLink 
            to="/" 
            class="block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            返回首页
          </NuxtLink>
        </div>
      </div>

      <!-- 安全提示 -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">
              安全提示
            </h3>
            <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul class="list-disc list-inside space-y-1">
                <li>密码长度至少6位字符</li>
                <li>包含字母和数字组合</li>
                <li>建议使用特殊字符增强安全性</li>
                <li>不要使用容易猜测的密码</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

// SEO设置
useHead({
  title: '重置密码',
  meta: [
    { name: 'description', content: '重置您的密码，确保账户安全' }
  ]
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const expired = ref(false)
const completed = ref(false)

const form = reactive({
  password: '',
  confirmPassword: ''
})

// 验证状态
const passwordError = ref('')
const passwordValid = ref(false)
const confirmPasswordError = ref('')
const confirmPasswordValid = ref(false)

// 从URL获取重置令牌
const resetToken = computed(() => String(route.query.token || ''))

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.password
  let strength = 0
  
  if (password.length >= 6) strength += 1
  if (password.length >= 8) strength += 1
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/\d/.test(password)) strength += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1
  
  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return '弱'
  if (strength <= 4) return '中等'
  return '强'
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'bg-red-500 text-red-600'
  if (strength <= 4) return 'bg-yellow-500 text-yellow-600'
  return 'bg-green-500 text-green-600'
})

const passwordStrengthWidth = computed(() => {
  const strength = passwordStrength.value
  return `${(strength / 6) * 100}%`
})

// 密码验证
const validatePassword = () => {
  const password = form.password
  
  if (!password) {
    passwordError.value = '密码不能为空'
    passwordValid.value = false
    return false
  }
  
  if (password.length < 6) {
    passwordError.value = '密码至少6个字符'
    passwordValid.value = false
    return false
  }
  
  if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    passwordError.value = '密码必须包含至少一个字母和一个数字'
    passwordValid.value = false
    return false
  }
  
  passwordError.value = ''
  passwordValid.value = true
  
  // 重新验证确认密码
  if (form.confirmPassword) {
    validateConfirmPassword()
  }
  
  return true
}

// 确认密码验证
const validateConfirmPassword = () => {
  const confirmPassword = form.confirmPassword
  
  if (!confirmPassword) {
    confirmPasswordError.value = '请确认密码'
    confirmPasswordValid.value = false
    return false
  }
  
  if (confirmPassword !== form.password) {
    confirmPasswordError.value = '两次输入的密码不一致'
    confirmPasswordValid.value = false
    return false
  }
  
  confirmPasswordError.value = ''
  confirmPasswordValid.value = true
  return true
}

// 表单验证
const isFormValid = computed(() => {
  return passwordValid.value && confirmPasswordValid.value
})

// 监听表单变化进行实时验证
watch(() => form.password, validatePassword)
watch(() => form.confirmPassword, validateConfirmPassword)

const handleResetPassword = async () => {
  try {
    loading.value = true
    error.value = ''

    // 最终验证
    if (!validatePassword() || !validateConfirmPassword()) {
      return
    }

    const result = await authStore.resetPassword(resetToken.value, form.password)

    if (result.success) {
      completed.value = true
    } else {
      error.value = result.message
      
      // 检查是否是令牌过期错误
      if (result.message.includes('过期') || result.message.includes('无效')) {
        expired.value = true
      }
    }
  } catch (err) {
    error.value = '重置密码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 页面加载时检查
onMounted(() => {
  // 如果没有重置令牌，重定向到忘记密码页面
  if (!resetToken.value) {
    router.push('/forgot-password')
    return
  }
  
  // 如果已经登录，重定向到首页
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

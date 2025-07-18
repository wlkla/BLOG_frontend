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
              :class="{ 
                'border-red-300 focus:ring-red-500 focus:border-red-500': usernameError,
                'border-green-300 focus:ring-green-500 focus:border-green-500': usernameValid
              }"
              placeholder="请输入用户名（3-20个字符）"
              @blur="validateUsername"
            >
            <p v-if="usernameError" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ usernameError }}
            </p>
            <p v-else-if="usernameValid" class="mt-1 text-sm text-green-600 dark:text-green-400">
              用户名可用
            </p>
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
              :class="{ 
                'border-red-300 focus:ring-red-500 focus:border-red-500': emailError,
                'border-green-300 focus:ring-green-500 focus:border-green-500': emailValid
              }"
              placeholder="请输入邮箱地址"
              @blur="validateEmail"
            >
            <p v-if="emailError" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ emailError }}
            </p>
            <p v-else-if="emailValid" class="mt-1 text-sm text-green-600 dark:text-green-400">
              邮箱格式正确
            </p>
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
                autocomplete="new-password"
                required
                class="mt-1 input pr-10"
                :class="{ 
                  'border-red-300 focus:ring-red-500 focus:border-red-500': passwordError,
                  'border-green-300 focus:ring-green-500 focus:border-green-500': passwordValid
                }"
                placeholder="请输入密码（至少6位，包含字母和数字）"
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
              确认密码
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
                placeholder="请再次输入密码"
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

        <!-- 服务条款 -->
        <div class="flex items-start">
          <input
            id="agree-terms"
            v-model="form.agreeTerms"
            name="agree-terms"
            type="checkbox"
            required
            class="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label for="agree-terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            我已阅读并同意
            <a href="/terms" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 underline">
              服务条款
            </a>
            和
            <a href="/privacy" target="_blank" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 underline">
              隐私政策
            </a>
          </label>
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
              注册中...
            </span>
            <span v-else>注册</span>
          </button>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <div class="flex">
            <XCircleIcon class="h-5 w-5 text-red-400 flex-shrink-0" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
                注册失败
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
            <CheckCircleIcon class="h-5 w-5 text-green-400 flex-shrink-0" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-300">
                注册成功！
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>{{ success }}</p>
                <p class="mt-2">
                  我们已向您的邮箱发送了验证邮件，请查看邮件并点击验证链接完成注册。
                </p>
                <div class="mt-3">
                  <button
                    @click="handleResendVerification"
                    :disabled="resendLoading"
                    class="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500"
                  >
                    {{ resendLoading ? '发送中...' : '重新发送验证邮件' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <!-- 已有账户提示 -->
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          已有账户？
          <NuxtLink to="/login" class="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
            立即登录
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  XCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'
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
const resendLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 验证状态
const usernameError = ref('')
const usernameValid = ref(false)
const emailError = ref('')
const emailValid = ref(false)
const passwordError = ref('')
const passwordValid = ref(false)
const confirmPasswordError = ref('')
const confirmPasswordValid = ref(false)

// 用户名验证
const validateUsername = () => {
  const username = form.username.trim()
  
  if (!username) {
    usernameError.value = '用户名不能为空'
    usernameValid.value = false
    return false
  }
  
  if (username.length < 3 || username.length > 20) {
    usernameError.value = '用户名必须为3-20个字符'
    usernameValid.value = false
    return false
  }
  
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    usernameError.value = '用户名只能包含字母、数字、下划线或中文'
    usernameValid.value = false
    return false
  }
  
  usernameError.value = ''
  usernameValid.value = true
  return true
}

// 邮箱验证
const validateEmail = () => {
  const email = form.email.trim()
  
  if (!email) {
    emailError.value = '邮箱不能为空'
    emailValid.value = false
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = '请输入有效的邮箱地址'
    emailValid.value = false
    return false
  }
  
  emailError.value = ''
  emailValid.value = true
  return true
}

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
  return usernameValid.value &&
         emailValid.value &&
         passwordValid.value &&
         confirmPasswordValid.value &&
         form.agreeTerms
})

// 监听表单变化进行实时验证
watch(() => form.username, validateUsername)
watch(() => form.email, validateEmail)
watch(() => form.password, validatePassword)
watch(() => form.confirmPassword, validateConfirmPassword)

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    // 最终验证
    if (!validateUsername() || !validateEmail() || !validatePassword() || !validateConfirmPassword()) {
      return
    }

    const result = await authStore.register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password
    })

    if (result.success) {
      success.value = result.message
      
      // 清空表单
      Object.assign(form, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      })
      
      // 重置验证状态
      usernameValid.value = false
      emailValid.value = false
      passwordValid.value = false
      confirmPasswordValid.value = false
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重新发送验证邮件
const handleResendVerification = async () => {
  try {
    resendLoading.value = true
    
    const result = await authStore.resendVerification(form.email)
    
    if (result.success) {
      success.value = result.message
      error.value = ''
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = '发送邮件失败，请稍后重试'
  } finally {
    resendLoading.value = false
  }
}

// 如果已经登录，重定向到首页
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

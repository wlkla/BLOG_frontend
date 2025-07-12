import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
  avatar: string
  bio: string
  isAdmin: boolean
  isEmailVerified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  loginAttempts: number
  lastLoginAttempt: number
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
  needVerification?: boolean
  email?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    loginAttempts: 0,
    lastLoginAttempt: 0
  }),

  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    needsEmailVerification: (state) => state.user && !state.user.isEmailVerified,
    canAttemptLogin: (state) => {
      const now = Date.now()
      const timeSinceLastAttempt = now - state.lastLoginAttempt
      const maxAttempts = 5
      const lockoutTime = 15 * 60 * 1000 // 15分钟
      
      if (state.loginAttempts >= maxAttempts && timeSinceLastAttempt < lockoutTime) {
        return false
      }
      return true
    },
    lockoutTimeRemaining: (state) => {
      const now = Date.now()
      const timeSinceLastAttempt = now - state.lastLoginAttempt
      const lockoutTime = 15 * 60 * 1000 // 15分钟
      
      if (state.loginAttempts >= 5 && timeSinceLastAttempt < lockoutTime) {
        return Math.ceil((lockoutTime - timeSinceLastAttempt) / 1000)
      }
      return 0
    }
  },

  actions: {
    // 初始化认证状态
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const loginAttempts = parseInt(localStorage.getItem('login_attempts') || '0')
        const lastLoginAttempt = parseInt(localStorage.getItem('last_login_attempt') || '0')
        
        this.loginAttempts = loginAttempts
        this.lastLoginAttempt = lastLoginAttempt
        
        if (token) {
          this.token = token
          this.fetchUser()
        }
      }
    },

    // 重置登录尝试
    resetLoginAttempts() {
      this.loginAttempts = 0
      this.lastLoginAttempt = 0
      if (process.client) {
        localStorage.removeItem('login_attempts')
        localStorage.removeItem('last_login_attempt')
      }
    },

    // 记录登录失败
    recordLoginFailure() {
      this.loginAttempts++
      this.lastLoginAttempt = Date.now()
      
      if (process.client) {
        localStorage.setItem('login_attempts', this.loginAttempts.toString())
        localStorage.setItem('last_login_attempt', this.lastLoginAttempt.toString())
      }
    },

    // 登录
    async login(credentials: LoginCredentials): Promise<ApiResponse> {
      try {
        // 检查是否可以尝试登录
        if (!this.canAttemptLogin) {
          const remainingTime = Math.ceil(this.lockoutTimeRemaining / 60)
          return {
            success: false,
            message: `登录尝试次数过多，请 ${remainingTime} 分钟后重试`
          }
        }

        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: credentials
        })

        if (response.success && response.data) {
          const { token, user } = response.data

          this.token = token
          this.user = user
          this.isAuthenticated = true
          
          // 登录成功，重置失败计数
          this.resetLoginAttempts()

          // 存储到本地存储
          if (process.client) {
            localStorage.setItem('auth_token', token)
            if (credentials.rememberMe) {
              localStorage.setItem('remember_me', 'true')
            }
          }

          return { success: true, message: '登录成功' }
        } else {
          // 登录失败，记录尝试
          this.recordLoginFailure()
          return response
        }
      } catch (error: any) {
        console.error('登录错误:', error)
        this.recordLoginFailure()
        
        // 处理特定错误
        if (error.status === 429) {
          return {
            success: false,
            message: '登录尝试过于频繁，请稍后重试'
          }
        }
        
        return { 
          success: false, 
          message: error.data?.message || '登录失败，请稍后重试' 
        }
      } finally {
        this.loading = false
      }
    },

    // 注册
    async register(userData: RegisterData): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: userData
        })

        return response
      } catch (error: any) {
        console.error('注册错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '注册失败，请稍后重试' 
        }
      } finally {
        this.loading = false
      }
    },

    // 邮箱验证
    async verifyEmail(token: string): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/verify-email`, {
          method: 'POST',
          body: { token }
        })

        if (response.success && response.data) {
          const { token: authToken, user } = response.data
          
          this.token = authToken
          this.user = user
          this.isAuthenticated = true

          // 存储到本地存储
          if (process.client) {
            localStorage.setItem('auth_token', authToken)
          }
        }

        return response
      } catch (error: any) {
        console.error('邮箱验证错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '验证失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 重新发送验证邮件
    async resendVerification(email: string): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/resend-verification`, {
          method: 'POST',
          body: { email }
        })

        return response
      } catch (error: any) {
        console.error('重发验证邮件错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '发送失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 忘记密码
    async forgotPassword(email: string): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/forgot-password`, {
          method: 'POST',
          body: { email }
        })

        return response
      } catch (error: any) {
        console.error('忘记密码错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '发送失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 重置密码
    async resetPassword(token: string, password: string): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/reset-password`, {
          method: 'POST',
          body: { token, password }
        })

        return response
      } catch (error: any) {
        console.error('重置密码错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '重置失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 修改密码
    async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        if (!this.token) {
          return { success: false, message: '请先登录' }
        }
        
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/change-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: { currentPassword, newPassword }
        })

        return response
      } catch (error: any) {
        console.error('修改密码错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '修改失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 获取用户信息
    async fetchUser() {
      try {
        if (!this.token) return

        const config = useRuntimeConfig()
        const response = await $fetch<ApiResponse>(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        if (response.success && response.data) {
          this.user = response.data.user
          this.isAuthenticated = true
        } else {
          this.logout()
        }
      } catch (error) {
        console.error('获取用户信息错误:', error)
        this.logout()
      }
    },

    // 登出
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // 清除本地存储
      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('remember_me')
      }

      // 重定向到首页
      navigateTo('/')
    },

    // 更新用户信息
    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
      }
    }
  }
})

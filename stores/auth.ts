import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
  avatar: string
  bio: string
  isAdmin: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    isLoggedIn: (state) => state.isAuthenticated && !!state.user
  },

  actions: {
    // 初始化认证状态
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.token = token
          this.fetchUser()
        }
      }
    },

    // 登录
    async login(credentials: { email: string; password: string }) {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const { data } = await $fetch(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: credentials
        })

        const { token, user } = data

        this.token = token
        this.user = user
        this.isAuthenticated = true

        // 存储到本地存储
        if (process.client) {
          localStorage.setItem('auth_token', token)
        }

        return { success: true, message: '登录成功' }
      } catch (error: any) {
        console.error('登录错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '登录失败' 
        }
      } finally {
        this.loading = false
      }
    },

    // 注册
    async register(userData: { 
      username: string
      email: string 
      password: string 
    }) {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        const { data } = await $fetch(`${config.public.apiBase}/auth/register`, {
          method: 'POST',
          body: userData
        })

        const { token, user } = data

        this.token = token
        this.user = user
        this.isAuthenticated = true

        // 存储到本地存储
        if (process.client) {
          localStorage.setItem('auth_token', token)
        }

        return { success: true, message: '注册成功' }
      } catch (error: any) {
        console.error('注册错误:', error)
        return { 
          success: false, 
          message: error.data?.message || '注册失败' 
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
        const { data } = await $fetch(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        
        this.user = data.user
        this.isAuthenticated = true
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

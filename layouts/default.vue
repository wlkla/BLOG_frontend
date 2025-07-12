<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 导航栏 -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo 和主导航 -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ config.public.siteName }}
              </h1>
            </NuxtLink>
            
            <!-- 主导航菜单 -->
            <div class="hidden md:ml-8 md:flex md:space-x-8">
              <NuxtLink 
                to="/" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
              >
                首页
              </NuxtLink>
              <NuxtLink 
                to="/posts" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/posts') }"
              >
                文章
              </NuxtLink>
              <NuxtLink 
                to="/categories" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/categories') }"
              >
                分类
              </NuxtLink>
              <NuxtLink 
                to="/about" 
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/about' }"
              >
                关于
              </NuxtLink>
            </div>
          </div>

          <!-- 右侧菜单 -->
          <div class="flex items-center space-x-4">
            <!-- 主题切换 -->
            <button 
              @click="toggleColorMode" 
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              :title="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
            >
              <SunIcon v-if="colorMode.value === 'dark'" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>

            <!-- 搜索按钮 -->
            <button 
              @click="openSearchModal"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="搜索"
            >
              <MagnifyingGlassIcon class="h-5 w-5" />
            </button>

            <!-- 用户菜单 -->
            <div v-if="authStore.isLoggedIn" class="relative">
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton class="flex items-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <img 
                    v-if="authStore.user?.avatar" 
                    :src="authStore.user.avatar" 
                    :alt="authStore.user.username"
                    class="h-8 w-8 rounded-full"
                  >
                  <UserIcon v-else class="h-5 w-5" />
                </MenuButton>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <NuxtLink 
                          to="/admin/dashboard"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                          ]"
                        >
                          控制台
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-if="authStore.isAdmin" v-slot="{ active }">
                        <NuxtLink 
                          to="/admin/posts"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                          ]"
                        >
                          文章管理
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="handleLogout"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                          ]"
                        >
                          退出登录
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>

            <!-- 登录按钮 -->
            <div v-else class="flex space-x-2">
              <NuxtLink to="/login" class="btn btn-secondary text-sm">
                登录
              </NuxtLink>
              <NuxtLink to="/register" class="btn btn-primary text-sm">
                注册
              </NuxtLink>
            </div>

            <!-- 移动端菜单按钮 -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
              <XMarkIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </div>

        <!-- 移动端菜单 -->
        <div v-show="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            <NuxtLink 
              to="/" 
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              首页
            </NuxtLink>
            <NuxtLink 
              to="/posts" 
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              文章
            </NuxtLink>
            <NuxtLink 
              to="/categories" 
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              分类
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              关于
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 博客信息 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ config.public.siteName }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ config.public.siteDescription }}
            </p>
          </div>

          <!-- 快速链接 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速链接
            </h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink to="/posts" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  所有文章
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/categories" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  文章分类
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  关于我
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 联系信息 -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              联系方式
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>邮箱: onebuaaer@gmail.com</p>
              <p>GitHub: @wlkla</p>
            </div>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} {{ config.public.siteName }}. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>

    <!-- 搜索模态框 -->
    <SearchModal v-model:open="searchModalOpen" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  SunIcon, 
  MoonIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const colorMode = useColorMode()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)
const searchModalOpen = ref(false)

// 切换主题
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// 打开搜索模态框
const openSearchModal = () => {
  searchModalOpen.value = true
}

// 处理登出
const handleLogout = () => {
  authStore.logout()
}

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})
</script>

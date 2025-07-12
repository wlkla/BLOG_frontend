<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页头 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        所有文章
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        共 {{ data?.pagination?.total || 0 }} 篇文章
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- 侧边栏 -->
      <div class="lg:col-span-1">
        <div class="space-y-6">
          <!-- 搜索框 -->
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
              搜索文章
            </h3>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="输入关键词搜索..."
                class="input pr-10"
                @keyup.enter="handleSearch"
              >
              <button
                @click="handleSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MagnifyingGlassIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- 分类筛选 -->
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
              文章分类
            </h3>
            <div class="space-y-2">
              <button
                @click="handleCategoryFilter(null)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-colors',
                  !selectedCategory 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                全部分类
              </button>
              <button
                v-for="category in categoriesData"
                :key="category._id"
                @click="handleCategoryFilter(category._id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2',
                  selectedCategory === category._id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                ></span>
                <span>{{ category.name }}</span>
              </button>
            </div>
          </div>

          <!-- 排序选项 -->
          <div class="card p-6">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
              排序方式
            </h3>
            <select
              v-model="sortBy"
              @change="handleSort"
              class="input"
            >
              <option value="createdAt">发布时间</option>
              <option value="viewCount">浏览量</option>
              <option value="likeCount">点赞数</option>
              <option value="commentCount">评论数</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="lg:col-span-3">
        <!-- 加载状态 -->
        <div v-if="pending" class="space-y-6">
          <div v-for="i in 5" :key="i" class="card p-6 loading">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div v-else-if="data?.posts?.length" class="space-y-6">
          <article
            v-for="post in data.posts"
            :key="post._id"
            class="card p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div class="flex flex-col md:flex-row md:space-x-6">
              <!-- 文章封面 -->
              <div class="md:w-1/3 mb-4 md:mb-0">
                <NuxtLink :to="`/posts/${post._id}`">
                  <img
                    v-if="post.coverImage"
                    :src="post.coverImage"
                    :alt="post.title"
                    class="w-full h-48 md:h-32 object-cover rounded-lg"
                  >
                  <div v-else class="w-full h-48 md:h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span class="text-white text-2xl font-bold">{{ post.title.charAt(0) }}</span>
                  </div>
                </NuxtLink>
              </div>

              <!-- 文章内容 -->
              <div class="md:w-2/3 flex-1">
                <!-- 分类和标签 -->
                <div class="flex items-center space-x-2 mb-3">
                  <span
                    class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    :style="{
                      backgroundColor: post.category.color + '20',
                      color: post.category.color
                    }"
                  >
                    {{ post.category.name }}
                  </span>
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <!-- 标题 -->
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  <NuxtLink
                    :to="`/posts/${post._id}`"
                    class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {{ post.title }}
                  </NuxtLink>
                </h2>

                <!-- 摘要 -->
                <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {{ post.summary || post.content.substring(0, 200) + '...' }}
                </p>

                <!-- 文章信息 -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center space-x-2">
                      <img
                        v-if="post.author.avatar"
                        :src="post.author.avatar"
                        :alt="post.author.username"
                        class="w-6 h-6 rounded-full"
                      >
                      <UserIcon v-else class="w-6 h-6" />
                      <span>{{ post.author.username }}</span>
                    </div>
                    <time :datetime="post.createdAt">
                      {{ formatDate(post.createdAt) }}
                    </time>
                  </div>

                  <!-- 统计信息 -->
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center space-x-1">
                      <EyeIcon class="w-4 h-4" />
                      <span>{{ post.viewCount }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <HeartIcon class="w-4 h-4" />
                      <span>{{ post.likeCount }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <ChatBubbleLeftIcon class="w-4 h-4" />
                      <span>{{ post.commentCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            没有找到文章
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            尝试调整搜索条件或浏览其他分类。
          </p>
        </div>

        <!-- 分页 -->
        <div v-if="data?.pagination && data.pagination.pages > 1" class="mt-8">
          <nav class="flex justify-center">
            <div class="flex space-x-2">
              <!-- 上一页 -->
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage <= 1"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage <= 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                ]"
              >
                上一页
              </button>

              <!-- 页码 -->
              <button
                v-for="page in getPageNumbers()"
                :key="page"
                @click="handlePageChange(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                ]"
              >
                {{ page }}
              </button>

              <!-- 下一页 -->
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage >= data.pagination.pages"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage >= data.pagination.pages
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                ]"
              >
                下一页
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {
  MagnifyingGlassIcon,
  UserIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

// SEO设置
useHead({
  title: '所有文章',
  meta: [
    { name: 'description', content: '浏览博客中的所有文章，找到您感兴趣的内容' }
  ]
})

// 响应式状态
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const currentPage = ref(parseInt(route.query.page) || 1)
const searchQuery = ref(route.query.search || '')
const selectedCategory = ref(route.query.category || null)
const sortBy = ref(route.query.sort || 'createdAt')

// 构建查询参数
const buildQuery = () => {
  const query = {
    page: currentPage.value,
    limit: 10
  }
  
  if (searchQuery.value) {
    query.search = searchQuery.value
  }
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  
  if (sortBy.value !== 'createdAt') {
    query.sort = sortBy.value
  }
  
  return query
}

// 获取文章数据
const { data, pending, refresh } = await useFetch(`${config.public.apiBase}/posts`, {
  query: buildQuery(),
  key: 'posts'
})

// 获取分类数据
const { data: categoriesData } = await useFetch(`${config.public.apiBase}/categories`)

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  updateUrl()
  refresh()
}

// 处理分类筛选
const handleCategoryFilter = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  updateUrl()
  refresh()
}

// 处理排序
const handleSort = () => {
  currentPage.value = 1
  updateUrl()
  refresh()
}

// 处理分页
const handlePageChange = (page) => {
  if (page < 1 || page > data.value.pagination.pages) return
  currentPage.value = page
  updateUrl()
  refresh()
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 更新URL
const updateUrl = () => {
  const query = {}
  
  if (currentPage.value > 1) {
    query.page = currentPage.value
  }
  
  if (searchQuery.value) {
    query.search = searchQuery.value
  }
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  
  if (sortBy.value !== 'createdAt') {
    query.sort = sortBy.value
  }
  
  router.push({ query })
}

// 获取分页页码
const getPageNumbers = () => {
  const totalPages = data.value?.pagination?.pages || 1
  const current = currentPage.value
  const pages = []
  
  // 显示当前页前后两页
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

// 监听路由变化
watch(() => route.query, (newQuery) => {
  currentPage.value = parseInt(newQuery.page) || 1
  searchQuery.value = newQuery.search || ''
  selectedCategory.value = newQuery.category || null
  sortBy.value = newQuery.sort || 'createdAt'
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

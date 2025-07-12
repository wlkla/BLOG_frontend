<template>
  <div>
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            欢迎来到我的博客
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            分享技术、生活和思考的个人空间
          </p>
          <div class="flex justify-center space-x-4">
            <NuxtLink to="/posts" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              开始阅读
            </NuxtLink>
            <NuxtLink to="/about" class="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              了解更多
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            最新文章
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            探索最新的技术见解和生活感悟
          </p>
        </div>

        <!-- 加载状态 -->
        <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="card p-6 loading">
            <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div v-else-if="data?.posts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="post in data.posts"
            :key="post._id"
            class="card overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <!-- 文章封面 -->
            <div class="aspect-w-16 aspect-h-9">
              <img
                v-if="post.coverImage"
                :src="post.coverImage"
                :alt="post.title"
                class="w-full h-48 object-cover"
              >
              <div v-else class="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span class="text-white text-lg font-medium">{{ post.title.charAt(0) }}</span>
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="p-6">
              <!-- 分类标签 -->
              <div class="mb-3">
                <span 
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full"
                  :style="{ 
                    backgroundColor: post.category.color + '20', 
                    color: post.category.color 
                  }"
                >
                  {{ post.category.name }}
                </span>
              </div>

              <!-- 标题 -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                <NuxtLink 
                  :to="`/posts/${post._id}`" 
                  class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {{ post.title }}
                </NuxtLink>
              </h3>

              <!-- 摘要 -->
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {{ post.summary || post.content.substring(0, 150) + '...' }}
              </p>

              <!-- 文章信息 -->
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center space-x-2">
                  <img
                    v-if="post.author.avatar"
                    :src="post.author.avatar"
                    :alt="post.author.username"
                    class="w-6 h-6 rounded-full"
                  >
                  <UserIcon v-else class="w-6 h-6 text-gray-400" />
                  <span>{{ post.author.username }}</span>
                </div>
                <time :datetime="post.createdAt">
                  {{ formatDate(post.createdAt) }}
                </time>
              </div>

              <!-- 统计信息 -->
              <div class="flex items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
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
          </article>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无文章
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            还没有发布任何文章，请稍后再来查看。
          </p>
        </div>

        <!-- 查看更多按钮 -->
        <div v-if="data?.posts?.length" class="text-center mt-12">
          <NuxtLink to="/posts" class="btn btn-primary">
            查看更多文章
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 热门分类 -->
    <section class="py-16 bg-gray-100 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            文章分类
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            探索不同主题的内容
          </p>
        </div>

        <!-- 分类列表 -->
        <div v-if="categoriesData?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categoriesData"
            :key="category._id"
            :to="`/posts?category=${category._id}`"
            class="card p-6 text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div 
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform"
              :style="{ backgroundColor: category.color }"
            >
              {{ category.name.charAt(0) }}
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ category.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 关于区域 -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          关于博主
        </h2>
        <div class="card p-8">
          <div class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
            博
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            博主昵称
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            一个热爱技术、喜欢分享的程序员。在这里记录学习心得、技术笔记和生活感悟。
            希望通过文字分享，能够帮助到更多的朋友，也欢迎大家一起交流学习。
          </p>
          <NuxtLink to="/about" class="btn btn-primary">
            了解更多
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {
  UserIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

// SEO设置
useHead({
  title: '首页',
  meta: [
    { name: 'description', content: '欢迎来到我的个人博客，分享技术、生活和思考的个人空间' }
  ]
})

// 获取最新文章
const config = useRuntimeConfig()
const { data, pending } = await useFetch(`${config.public.apiBase}/posts`, {
  query: { limit: 6 }
})

// 获取分类
const { data: categoriesData } = await useFetch(`${config.public.apiBase}/categories`)

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

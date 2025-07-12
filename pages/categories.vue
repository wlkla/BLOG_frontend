<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页头 -->
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        文章分类
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        浏览所有文章分类，找到您感兴趣的内容
      </p>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card p-6 loading">
        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div v-else-if="data?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="category in data"
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
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ category.name }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ category.description || '暂无描述' }}
        </p>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ category.postCount || 0 }} 篇文章
        </div>
      </NuxtLink>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <FolderIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        暂无分类
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        还没有创建任何分类，请稍后再来查看。
      </p>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon } from '@heroicons/vue/24/outline'

// SEO设置
useHead({
  title: '文章分类',
  meta: [
    { name: 'description', content: '浏览博客中的所有文章分类，找到您感兴趣的内容' }
  ]
})

// 获取分类数据
const config = useRuntimeConfig()
const { data, pending } = await useFetch(`${config.public.apiBase}/categories`)
</script>

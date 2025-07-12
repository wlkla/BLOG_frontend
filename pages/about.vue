<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 个人介绍 -->
    <div class="text-center mb-12">
      <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
        博
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        关于我
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        一个热爱技术、喜欢分享的程序员
      </p>
    </div>

    <!-- 详细介绍 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 主要内容 -->
      <div class="lg:col-span-2">
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            个人简介
          </h2>
          
          <div class="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p>
              你好！欢迎来到我的个人博客。我是一名passionate的软件开发者，专注于Web开发和技术分享。
            </p>
            
            <p>
              在这个博客中，我会分享我在技术学习和工作中的心得体会，包括但不限于：
            </p>
            
            <ul>
              <li>前端开发技术 (Vue.js, React, TypeScript)</li>
              <li>后端开发 (Node.js, Python, Java)</li>
              <li>数据库设计与优化</li>
              <li>开发工具和最佳实践</li>
              <li>技术思考和生活感悟</li>
            </ul>
            
            <p>
              我相信技术的力量可以改变世界，也希望通过分享能够帮助到更多的开发者朋友。
              如果你有任何问题或想法，欢迎通过邮件或社交媒体与我联系。
            </p>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-6">
        <!-- 技能标签 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            技术栈
          </h3>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              JavaScript
            </span>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              Vue.js
            </span>
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              React
            </span>
            <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              TypeScript
            </span>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              Node.js
            </span>
            <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
              Python
            </span>
            <span class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">
              MongoDB
            </span>
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              PostgreSQL
            </span>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            联系方式
          </h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <EnvelopeIcon class="w-5 h-5 text-gray-400" />
              <span class="text-gray-600 dark:text-gray-400">your-email@example.com</span>
            </div>
            <div class="flex items-center space-x-3">
              <GlobeAltIcon class="w-5 h-5 text-gray-400" />
              <span class="text-gray-600 dark:text-gray-400">GitHub: @yourusername</span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            博客统计
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">文章总数</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ stats.posts }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">分类数量</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ stats.categories }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">总浏览量</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ stats.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EnvelopeIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'

// SEO设置
useHead({
  title: '关于我',
  meta: [
    { name: 'description', content: '了解博主的个人简介、技术栈和联系方式' }
  ]
})

// 模拟统计数据
const stats = {
  posts: 42,
  categories: 8,
  views: '10.2k'
}
</script>

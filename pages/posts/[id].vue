<template>
  <div v-if="data" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 文章头部 -->
    <header class="mb-8">
      <!-- 分类标签 -->
      <div class="mb-4">
        <NuxtLink
          :to="`/posts?category=${data.category._id}`"
          class="inline-block px-3 py-1 text-sm font-medium rounded-full transition-colors hover:opacity-80"
          :style="{
            backgroundColor: data.category.color + '20',
            color: data.category.color
          }"
        >
          {{ data.category.name }}
        </NuxtLink>
      </div>

      <!-- 文章标题 -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {{ data.title }}
      </h1>

      <!-- 文章信息 -->
      <div class="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <!-- 作者信息 -->
        <div class="flex items-center space-x-3">
          <img
            v-if="data.author.avatar"
            :src="data.author.avatar"
            :alt="data.author.username"
            class="w-10 h-10 rounded-full"
          >
          <div v-else class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {{ data.author.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ data.author.username }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(data.publishedAt || data.createdAt) }}
            </p>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-1">
            <EyeIcon class="w-4 h-4" />
            <span>{{ data.viewCount }} 次阅读</span>
          </div>
          <div class="flex items-center space-x-1">
            <HeartIcon class="w-4 h-4" />
            <span>{{ data.likeCount }} 个赞</span>
          </div>
          <div class="flex items-center space-x-1">
            <ChatBubbleLeftIcon class="w-4 h-4" />
            <span>{{ data.commentCount }} 条评论</span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="data.tags?.length" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in data.tags"
            :key="tag"
            class="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </header>

    <!-- 文章封面 -->
    <div v-if="data.coverImage" class="mb-8">
      <img
        :src="data.coverImage"
        :alt="data.title"
        class="w-full rounded-lg shadow-sm"
      >
    </div>

    <!-- 文章内容 -->
    <article class="prose prose-lg max-w-none mb-12">
      <div v-html="renderMarkdown(data.content)"></div>
    </article>

    <!-- 文章操作 -->
    <div class="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
      <!-- 点赞按钮 -->
      <button
        @click="toggleLike"
        :class="[
          'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
          isLiked
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        ]"
      >
        <HeartIcon :class="['w-5 h-5', isLiked ? 'fill-current' : '']" />
        <span>{{ data.likeCount }} 个赞</span>
      </button>

      <!-- 分享按钮 -->
      <div class="flex items-center space-x-2">
        <button
          @click="shareArticle"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ShareIcon class="w-5 h-5" />
          <span>分享</span>
        </button>
      </div>
    </div>

    <!-- 作者信息卡片 -->
    <div class="card p-6 mb-8">
      <div class="flex items-start space-x-4">
        <img
          v-if="data.author.avatar"
          :src="data.author.avatar"
          :alt="data.author.username"
          class="w-16 h-16 rounded-full"
        >
        <div v-else class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
          {{ data.author.username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ data.author.username }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            {{ data.author.bio || '这个作者还没有填写个人简介。' }}
          </p>
          <NuxtLink 
            to="/about" 
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            查看更多信息 →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 评论区域 -->
    <section class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        评论 ({{ commentsData?.pagination?.total || 0 }})
      </h2>

      <!-- 评论表单 -->
      <CommentForm 
        :post-id="data._id" 
        @comment-submitted="handleCommentSubmitted"
        class="mb-8"
      />

      <!-- 评论列表 -->
      <CommentList 
        :comments="commentsData?.comments || []"
        :loading="commentsPending"
        @load-more="loadMoreComments"
        @reply="handleReply"
      />
    </section>

    <!-- 相关文章 -->
    <section v-if="relatedPosts?.length">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        相关文章
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="post in relatedPosts"
          :key="post._id"
          class="card overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            v-if="post.coverImage"
            :src="post.coverImage"
            :alt="post.title"
            class="w-full h-32 object-cover"
          >
          <div v-else class="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <span class="text-white text-lg font-medium">{{ post.title.charAt(0) }}</span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              <NuxtLink 
                :to="`/posts/${post._id}`"
                class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {{ post.title }}
              </NuxtLink>
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>

  <!-- 加载状态 -->
  <div v-else-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="loading space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>

  <!-- 404状态 -->
  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <DocumentTextIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      文章不存在
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      抱歉，您访问的文章不存在或已被删除。
    </p>
    <NuxtLink to="/posts" class="btn btn-primary">
      返回文章列表
    </NuxtLink>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import {
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const config = useRuntimeConfig()

// Markdown渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 获取文章数据
const { data, pending, error } = await useFetch(`${config.public.apiBase}/posts/${route.params.id}`)

// 如果文章不存在，显示404
if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

// 设置SEO
useHead({
  title: data.value?.title || '文章详情',
  meta: [
    { name: 'description', content: data.value?.summary || data.value?.content?.substring(0, 160) || '文章详情页面' },
    { property: 'og:title', content: data.value?.title },
    { property: 'og:description', content: data.value?.summary || data.value?.content?.substring(0, 160) },
    { property: 'og:image', content: data.value?.coverImage }
  ]
})

// 点赞状态
const isLiked = ref(false)

// 获取评论数据
const { data: commentsData, pending: commentsPending, refresh: refreshComments } = await useFetch(
  `${config.public.apiBase}/comments/post/${route.params.id}`
)

// 获取相关文章
const { data: relatedPosts } = await useFetch(`${config.public.apiBase}/posts`, {
  query: {
    category: data.value?.category._id,
    limit: 4
  }
}).then(result => ({
  data: result.data.value?.posts?.filter(post => post._id !== route.params.id) || []
}))

// 渲染Markdown
const renderMarkdown = (content) => {
  return md.render(content)
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

// 切换点赞
const toggleLike = () => {
  // TODO: 实现点赞功能
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    data.value.likeCount++
  } else {
    data.value.likeCount--
  }
}

// 分享文章
const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: data.value.title,
      text: data.value.summary,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href).then(() => {
      // TODO: 显示成功提示
      alert('链接已复制到剪贴板')
    })
  }
}

// 处理评论提交
const handleCommentSubmitted = () => {
  refreshComments()
  data.value.commentCount++
}

// 处理回复
const handleReply = (comment) => {
  // TODO: 实现回复功能
  console.log('回复评论:', comment)
}

// 加载更多评论
const loadMoreComments = () => {
  // TODO: 实现分页加载
  console.log('加载更多评论')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 文章内容样式 */
:deep(.prose) {
  @apply text-gray-700 dark:text-gray-300;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  @apply text-gray-900 dark:text-white;
}

:deep(.prose a) {
  @apply text-blue-600 dark:text-blue-400;
}

:deep(.prose code) {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200;
}

:deep(.prose pre) {
  @apply bg-gray-900 dark:bg-gray-800;
}

:deep(.prose blockquote) {
  @apply border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400;
}
</style>

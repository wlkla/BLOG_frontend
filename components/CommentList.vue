<template>
  <div class="space-y-6">
    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="card p-6 loading">
        <div class="flex space-x-4">
          <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-else-if="comments.length" class="space-y-6">
      <CommentItem
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
        @reply="$emit('reply', $event)"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-8">
      <ChatBubbleLeftIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">
        还没有评论，快来发表第一条评论吧！
      </p>
    </div>
  </div>
</template>

<script setup>
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'

defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['load-more', 'reply'])
</script>

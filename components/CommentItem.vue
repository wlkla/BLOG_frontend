<template>
  <div class="comment-item">
    <div class="flex space-x-4">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
          {{ comment.author.name.charAt(0).toUpperCase() }}
        </div>
      </div>

      <!-- 评论内容 -->
      <div class="flex-1">
        <!-- 评论头部 -->
        <div class="flex items-center space-x-2 mb-2">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ comment.author.name }}
          </h4>
          <time class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(comment.createdAt) }}
          </time>
        </div>

        <!-- 评论正文 -->
        <div class="prose prose-sm max-w-none mb-3">
          <p class="text-gray-700 dark:text-gray-300">
            {{ comment.content }}
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-4 text-sm">
          <button
            @click="$emit('reply', comment)"
            class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            回复
          </button>
        </div>

        <!-- 子评论 -->
        <div v-if="comment.replies && comment.replies.length" class="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply._id"
            :comment="reply"
            @reply="$emit('reply', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

defineProps({
  comment: {
    type: Object,
    required: true
  }
})

defineEmits(['reply'])

const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日 HH:mm')
}
</script>

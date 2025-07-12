<template>
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ parentComment ? '回复评论' : '发表评论' }}
    </h3>

    <form @submit.prevent="submitComment" class="space-y-4">
      <!-- 评论内容 -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          评论内容 *
        </label>
        <textarea
          id="content"
          v-model="form.content"
          rows="4"
          placeholder="写下您的评论..."
          class="input resize-none"
          required
        ></textarea>
      </div>

      <!-- 用户信息 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            姓名 *
          </label>
          <input
            id="name"
            v-model="form.author.name"
            type="text"
            placeholder="您的姓名"
            class="input"
            required
          >
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            邮箱 *
          </label>
          <input
            id="email"
            v-model="form.author.email"
            type="email"
            placeholder="your@email.com"
            class="input"
            required
          >
        </div>
        
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            网站 (可选)
          </label>
          <input
            id="website"
            v-model="form.author.website"
            type="url"
            placeholder="https://yourwebsite.com"
            class="input"
          >
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          评论将在审核后显示
        </div>
        
        <div class="flex space-x-3">
          <button
            v-if="parentComment"
            @click="$emit('cancel')"
            type="button"
            class="btn btn-secondary"
          >
            取消
          </button>
          
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'btn btn-primary',
              loading ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <div class="spinner w-4 h-4 mr-2"></div>
              提交中...
            </span>
            <span v-else>
              {{ parentComment ? '回复' : '发表评论' }}
            </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  parentComment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['comment-submitted', 'cancel'])

const config = useRuntimeConfig()
const loading = ref(false)

// 表单数据
const form = reactive({
  content: '',
  author: {
    name: '',
    email: '',
    website: ''
  }
})

// 从本地存储加载用户信息
onMounted(() => {
  if (process.client) {
    form.author.name = localStorage.getItem('comment_author_name') || ''
    form.author.email = localStorage.getItem('comment_author_email') || ''
    form.author.website = localStorage.getItem('comment_author_website') || ''
  }
})

// 保存用户信息到本地存储
const saveUserInfo = () => {
  if (process.client) {
    localStorage.setItem('comment_author_name', form.author.name)
    localStorage.setItem('comment_author_email', form.author.email)
    localStorage.setItem('comment_author_website', form.author.website)
  }
}

// 提交评论
const submitComment = async () => {
  try {
    loading.value = true
    
    const commentData = {
      content: form.content.trim(),
      author: {
        name: form.author.name.trim(),
        email: form.author.email.trim(),
        website: form.author.website.trim()
      },
      post: props.postId
    }
    
    if (props.parentComment) {
      commentData.parentComment = props.parentComment._id
    }
    
    const response = await $fetch(`${config.public.apiBase}/comments`, {
      method: 'POST',
      body: commentData
    })
    
    // 保存用户信息
    saveUserInfo()
    
    // 重置表单
    form.content = ''
    
    // 发送成功事件
    emit('comment-submitted', response.comment)
    
    // 显示成功消息
    showSuccessMessage('评论已提交，等待审核')
    
  } catch (error) {
    console.error('提交评论失败:', error)
    showErrorMessage(error.data?.message || '提交评论失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 显示成功消息
const showSuccessMessage = (message) => {
  // TODO: 集成Toast组件
  alert(message)
}

// 显示错误消息
const showErrorMessage = (message) => {
  // TODO: 集成Toast组件
  alert(message)
}

// 监听父评论变化，重置表单
watch(() => props.parentComment, () => {
  form.content = ''
})
</script>

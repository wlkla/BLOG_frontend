export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // CSS框架
  css: ['~/assets/css/main.css'],
  
  // 模块
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api',
      siteName: '我的个人博客',
      siteDescription: '分享技术、生活和思考的个人博客'
    }
  },
  
  // 应用配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '我的个人博客',
      meta: [
        { name: 'description', content: '分享技术、生活和思考的个人博客' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // 颜色模式配置
  colorMode: {
    classSuffix: ''
  },
  
  // Tailwind CSS配置
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },
  
  // 构建配置
  build: {
    transpile: ['@headlessui/vue']
  },
  
  // SSR配置
  ssr: true,
  
  // 页面过渡效果
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

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

  // 运行时配置 - 修改后端端口为 3002
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3002/api', // 改为后端的新端口
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

  // Vite 配置 - 修复 FormData 错误
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['axios'],
      exclude: ['form-data']
    },
    resolve: {
      alias: {
        'form-data': 'form-data/lib/browser'
      }
    }
  },

  // 构建配置
  build: {
    transpile: ['@headlessui/vue', 'axios']
  },

  // Nitro 配置 - 处理服务端兼容性
  nitro: {
    experimental: {
      wasm: true
    },
    rollupConfig: {
      external: ['form-data']
    }
  },

  // SSR配置
  ssr: true,

  // 页面过渡效果
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },

  // 兼容性日期
  compatibilityDate: '2024-04-03'
})

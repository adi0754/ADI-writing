<template>
  <div class="relative min-h-screen overflow-hidden px-6 py-16 md:px-12 lg:px-20">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-[140px]"></div>
      <div class="absolute -bottom-20 -right-24 h-80 w-80 rounded-full bg-accent/25 blur-[140px]"></div>
    </div>

    <header class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4 rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-soft backdrop-blur">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white shadow-inner">
          <span class="h-3.5 w-3.5 rounded-full bg-gradient-to-b from-brand to-brandDark"></span>
        </div>
        <div>
          <p class="text-[0.9rem] font-semibold uppercase tracking-[0.25em] text-dark">ADI WRITER</p>
          <p class="text-sm font-medium text-[var(--text-light)]">Story Studio</p>
        </div>
      </div>
      <p class="text-xs uppercase tracking-[0.4em] text-[var(--text-light)]">Designed for focus</p>
    </header>

    <div class="relative z-10 mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section class="space-y-10 rounded-[36px] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur" id="why-adi">
        <div class="space-y-4">
          <p class="text-sm uppercase tracking-[0.35em] text-[var(--text-light)]">宁静写作栖息地</p>
          <h2 class="text-[2.25rem] leading-tight text-dark md:text-[2.9rem] md:leading-[1.1]">
            一个简单、纯净的专注写作空间
          </h2>
          <p class="max-w-2xl text-lg leading-relaxed text-[var(--text-light)] max-sm:leading-[1.8]">
            你是否曾有过天马行空的想法，却苦于无法用语言表达？使用 ADI WRITER，帮助你完成剧本、小说、诗歌、传记，书写你的故事。
          </p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <article class="flex min-h-[190px] flex-col justify-between rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--text-light)]">配置耗时</p>
            <strong class="block text-2xl font-semibold text-dark">60 秒</strong>
            <p class="text-[var(--text-light)]">全部配置一次完成，立即开始创作。</p>
          </article>
          <article class="flex min-h-[190px] flex-col justify-between rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--text-light)]">模型数</p>
            <strong class="block text-2xl font-semibold text-dark">3+ 模型</strong>
            <p class="text-[var(--text-light)]">OpenAI、Gemini、DeepSeek 与自定义随心切换。</p>
          </article>
          <article class="flex min-h-[190px] flex-col justify-between rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-[var(--text-light)]">安全性</p>
            <strong class="block text-2xl font-semibold text-dark">100% 本地</strong>
            <p class="text-[var(--text-light)]">API 密钥仅存在你的浏览器中。</p>
          </article>
        </div>

        <article class="rounded-[30px] border border-black/5 bg-white/90 p-8 shadow-inner backdrop-blur">
          <p class="text-xs uppercase tracking-[0.3em] text-[var(--text-light)]">创作保障</p>
          <h3 class="mt-2 text-2xl font-semibold text-dark">关键步骤一目了然</h3>
          <p class="mt-3 text-[var(--text-light)] leading-relaxed">
            密钥与配置仅保留在本地，可随时清除。多家模型与自定义端点同一入口切换，流程不足 3 步，首访也能快速上手。
          </p>
        </article>

        <div class="grid gap-5 sm:grid-cols-2">
          <div class="flex gap-3 rounded-2xl border border-black/5 bg-white/85 px-6 py-5 shadow-inner">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">✦</div>
            <div>
              <h4 class="font-semibold text-dark">长篇扩写</h4>
              <p class="text-sm text-[var(--text-light)]">章节、剧作、传记逻辑流畅。</p>
            </div>
          </div>
          <div class="flex gap-3 rounded-2xl border border-black/5 bg-white/85 px-6 py-5 shadow-inner">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">✎</div>
            <div>
              <h4 class="font-semibold text-dark">精准润色</h4>
              <p class="text-sm text-[var(--text-light)]">瞬时优化语气、节奏与逻辑。</p>
            </div>
          </div>
          <div class="flex gap-3 rounded-2xl border border-black/5 bg-white/85 px-6 py-5 shadow-inner">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">▣</div>
            <div>
              <h4 class="font-semibold text-dark">文稿管理</h4>
              <p class="text-sm text-[var(--text-light)]">版本对比与灵感井然有序。</p>
            </div>
          </div>
          <div class="flex gap-3 rounded-2xl border border-black/5 bg-white/85 px-6 py-5 shadow-inner">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">⌘</div>
            <div>
              <h4 class="font-semibold text-dark">多语言</h4>
              <p class="text-sm text-[var(--text-light)]">跨语种协作与发布保持一致。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-[32px] border border-white/70 bg-white/95 p-10 shadow-soft backdrop-blur" id="quick-start">
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.35em] text-[var(--text-light)]">配置指引</p>
          <h3 class="text-2xl font-semibold text-dark">连接你信任的模型</h3>
          <p class="text-[var(--text-light)]">填入 API 凭据，仅保存在本地浏览器。</p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-10 space-y-8">
          <div class="space-y-2">
            <label for="provider" class="block text-sm font-semibold text-dark tracking-wide">选择提供商</label>
            <div class="relative">
              <select
                v-model="selectedProvider"
                id="provider"
                class="w-full appearance-none rounded-[22px] border border-black/10 bg-white/90 px-5 py-3 text-base text-dark shadow-inner transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
              >
                <option value="openai">OpenAI (GPT-4o Mini)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
                <option value="deepseek">DeepSeek</option>
                <option value="thirdparty">自定义服务</option>
              </select>
              <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[var(--text-light)]">⌄</span>
            </div>
          </div>

          <div class="rounded-[24px] border border-black/5 bg-gradient-to-br from-[#f7f9ff] to-[#eef4ff] p-6 shadow-inner">
            <p class="text-xs uppercase tracking-[0.4em] text-[var(--text-light)]">{{ activeProvider.label }}</p>
            <h4 class="mt-2 text-lg font-semibold text-dark">{{ activeProvider.title }}</h4>
            <p class="text-sm text-[var(--text-light)]">{{ activeProvider.description }}</p>
            <a
              v-if="activeProvider.link"
              :href="activeProvider.link"
              target="_blank"
              rel="noreferrer"
              class="mt-2 inline-flex text-sm font-semibold text-brand"
            >
              {{ activeProvider.linkLabel }}
            </a>
          </div>

          <div class="space-y-2">
            <label for="apikey" class="block text-sm font-semibold text-dark tracking-wide">API 密钥</label>
            <input
              v-model="apiKey"
              id="apikey"
              type="password"
              class="w-full rounded-[22px] border border-black/10 bg-white/90 px-5 py-3 text-base text-dark shadow-inner transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
              placeholder="请输入您的 API 密钥"
              required
            />
            <p class="text-sm text-[var(--text-light)]">密钥仅保存在浏览器本地，任何时候都可以更换。</p>
          </div>

          <div
            v-if="selectedProvider === 'thirdparty'"
            class="space-y-2"
          >
            <label for="endpoint" class="block text-sm font-semibold text-dark">API 端点</label>
            <input
              v-model="customEndpoint"
              id="endpoint"
              type="url"
              class="w-full rounded-[22px] border border-black/10 bg-white/90 px-5 py-3 text-base text-dark shadow-inner transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
              placeholder="https://api.example.com/v1/chat/completions"
              required
            />
          </div>

          <div
            v-if="selectedProvider === 'thirdparty'"
            class="space-y-2"
          >
            <label for="model" class="block text-sm font-semibold text-dark">模型名称</label>
            <input
              v-model="customModel"
              id="model"
              type="text"
              class="w-full rounded-[22px] border border-black/10 bg-white/90 px-5 py-3 text-base text-dark shadow-inner transition focus:border-brand/40 focus:ring-4 focus:ring-brand/10"
              placeholder="例如：gpt-4o-mini"
              required
            />
          </div>

          <div class="flex items-start gap-3 rounded-[20px] border border-black/5 bg-black/5/30 px-5 py-3 text-sm leading-relaxed text-[var(--text-light)] sm:px-4">
            <input
              v-model="agreeTerms"
              id="agree"
              type="checkbox"
              required
              class="mt-1 h-5 w-5 rounded-md border border-black/20 text-brand focus:ring-brand"
            />
            <label for="agree">
              我同意将 API 密钥安全地保存在本地，并阅读
              <a href="#" @click.prevent class="font-semibold text-brand">隐私政策</a>
            </label>
          </div>

          <div class="space-y-4">
            <button
              type="submit"
              class="w-full rounded-[18px] bg-gradient-to-r from-brand to-[#2b6aff] py-4 text-lg font-semibold text-white shadow-card transition hover:-translate-y-0.5 disabled:translate-y-0"
              :disabled="!agreeTerms || !apiKey || (selectedProvider === 'thirdparty' && (!customEndpoint || !customModel))"
            >
              开始使用
            </button>
            <p class="text-center text-xs uppercase tracking-[0.35em] text-[var(--text-light)]">配置仅在本地保存</p>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const selectedProvider = ref<'openai' | 'gemini' | 'deepseek' | 'thirdparty'>('openai')
const apiKey = ref('')
const customEndpoint = ref('')
const customModel = ref('')
const agreeTerms = ref(false)

const providerDetails: Record<
  'openai' | 'gemini' | 'deepseek' | 'thirdparty',
  { label: string; title: string; description: string; link?: string; linkLabel?: string }
> = {
  openai: {
    label: 'OpenAI',
    title: 'GPT-4o Mini',
    description: '高质量、响应迅速的文本创作体验，适用于长篇内容扩写与润色。',
    link: 'https://platform.openai.com/api-keys',
    linkLabel: '前往 OpenAI 控制台',
  },
  gemini: {
    label: 'Google Gemini',
    title: 'Gemini 1.5 Flash',
    description: '适合多模态和多语言的创作场景，速度快、上下文长。',
    link: 'https://aistudio.google.com/app/apikey',
    linkLabel: '获取 Gemini API Key',
  },
  deepseek: {
    label: 'DeepSeek',
    title: '中文场景优化',
    description: '面向中文写作的高性价比方案，提供灵活计费模式。',
    link: 'https://platform.deepseek.com/api',
    linkLabel: '访问 DeepSeek 平台',
  },
  thirdparty: {
    label: '自定义服务',
    title: '接入你的内部模型',
    description: '配置任意兼容 OpenAI 格式的第三方端点与模型，掌控所有细节。',
  },
}

const activeProvider = computed(() => providerDetails[selectedProvider.value])

const handleSubmit = () => {
  if (!apiKey.value.trim() || !agreeTerms.value) return

  const config: any = {
    provider: selectedProvider.value,
    apiKey: apiKey.value.trim(),
  }

  if (selectedProvider.value === 'thirdparty') {
    if (!customEndpoint.value.trim() || !customModel.value.trim()) return
    config.customEndpoint = customEndpoint.value.trim()
    config.customModel = customModel.value.trim()
  }

  appStore.saveConfig(config)
}
</script>

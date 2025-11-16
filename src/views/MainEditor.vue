<template>
  <div class="editor-shell flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,113,227,0.07),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(43,182,115,0.07),transparent_55%),#f5f5f7] text-dark lg:flex-row flex-col">
    <aside class="w-full border-b border-white/70 bg-white/70 px-6 py-8 backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[11px] uppercase tracking-[0.35em] text-[var(--text-light)]">ADI WRITER</p>
          <h1 class="text-xl font-semibold">Story Studio</h1>
        </div>
        <button class="rounded-full border border-black/10 bg-black/5 px-2.5 py-1.5 text-lg text-[var(--text-light)] hover:text-brand" @click="showSettings = true" title="设置">
          ⚙️
        </button>
      </div>
      <button class="mt-6 w-full rounded-[16px] border border-brand/30 bg-white/60 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/10" @click="createNewDocument">
        + 新建文档
      </button>
      <div class="mt-6 space-y-3 overflow-y-auto pr-1 lg:max-h-[70vh]">
        <article
          v-for="doc in editorStore.documents"
          :key="doc.id"
          class="rounded-[18px] border border-white/60 bg-white/70 px-4 py-3 shadow-inner transition hover:-translate-y-0.5 hover:shadow-card"
          :class="{ 'border-brand/40 bg-white shadow-card': editorStore.currentDocumentId === doc.id }"
          @click="selectDocument(doc.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold">{{ doc.title }}</p>
              <p class="text-xs text-[var(--text-light)]">更新于 {{ formatDate(doc.updatedAt) }}</p>
            </div>
            <button class="text-sm text-danger hover:text-dark" @click.stop="deleteDocument(doc.id)">✕</button>
          </div>
        </article>
      </div>
    </aside>

    <section class="flex-1 px-5 py-8 lg:px-10">
      <div v-if="currentDocument" class="mx-auto flex h-full max-w-5xl flex-col gap-8">
        <header class="rounded-[28px] border border-white/70 bg-white/90 px-6 py-5 shadow-soft">
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div class="flex-1">
              <p class="text-xs uppercase tracking-[0.35em] text-[var(--text-light)]">当前文档</p>
              <input
                v-model="currentDocument.title"
                @change="updateCurrentDocument"
                class="mt-2 w-full rounded-2xl border border-black/5 bg-black/5 px-4 py-3 text-2xl font-semibold text-dark transition focus:border-brand/40 focus:bg-white focus:shadow-focus"
                placeholder="输入文档标题"
              />
            </div>
            <div class="flex flex-col items-start gap-2 text-sm text-[var(--text-light)] md:items-end">
              <span>更新于 {{ formatDate(currentDocument.updatedAt) }}</span>
              <span class="rounded-full px-4 py-1.5 text-sm font-semibold" :class="isProcessing ? 'bg-brand/15 text-brand' : 'bg-black/5 text-[var(--text-light)]'">
                {{ isProcessing ? '正在与模型对话…' : '准备就绪' }}
              </span>
            </div>
          </div>
        </header>

        <div class="grid flex-1 gap-6 lg:grid-cols-2">
          <article class="flex flex-col rounded-[28px] border border-black/5 bg-white/95 p-6 shadow-inner">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-[var(--text-light)]">原文内容</p>
                <h3 class="text-lg font-semibold">写下你想要扩写的文字</h3>
              </div>
              <span class="text-xs text-[var(--text-light)]">⌘ + Enter 发送</span>
            </div>
            <textarea
              v-model="currentDocument.content"
              @change="updateCurrentDocument"
              class="mt-4 flex-1 rounded-[22px] border border-black/5 bg-[#f7f9ff] p-4 text-base leading-relaxed text-dark shadow-inner focus:border-brand/30 focus:bg-white focus:shadow-focus"
              placeholder="在这里输入或粘贴您要扩写或润色的文本..."
            />
          </article>
          <article class="flex flex-col rounded-[28px] border border-black/5 bg-white/95 p-6 shadow-inner">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.4em] text-[var(--text-light)]">AI 输出</p>
                <h3 class="text-lg font-semibold">处理结果</h3>
              </div>
              <button
                class="flex items-center gap-2 rounded-full border border-brand/30 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10 disabled:border-black/10 disabled:text-[var(--text-light)]"
                @click="copyResult"
                :disabled="!resultContent"
              >
                <span aria-hidden="true">📋</span>复制
              </button>
            </div>
            <div class="mt-4 flex-1 rounded-[22px] border border-dashed border-black/10 bg-[#f6f8fb] p-4 text-base leading-relaxed" :class="{ 'text-[var(--text-light)]': !resultContent }">
              <p v-if="!resultContent">选择“扩写”或“润色”，结果会展示在这里。</p>
              <p v-else class="whitespace-pre-wrap">{{ resultContent }}</p>
            </div>
          </article>
        </div>

        <div class="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-soft md:flex-row">
          <button
            class="flex-1 rounded-[18px] bg-gradient-to-r from-brand to-[#2b6aff] py-3 text-lg font-semibold text-white shadow-card transition hover:-translate-y-0.5 disabled:translate-y-0"
            @click="processContent('expand')"
            :disabled="isProcessing || !currentDocument.content.trim()"
          >
            {{ isProcessing && currentMode === 'expand' ? '处理中...' : '✨ 扩写' }}
          </button>
          <button
            class="flex-1 rounded-[18px] bg-gradient-to-r from-accent to-[#1f995c] py-3 text-lg font-semibold text-white shadow-card transition hover:-translate-y-0.5 disabled:translate-y-0"
            @click="processContent('polish')"
            :disabled="isProcessing || !currentDocument.content.trim()"
          >
            {{ isProcessing && currentMode === 'polish' ? '处理中...' : '🔧 润色' }}
          </button>
        </div>
      </div>

      <div v-else class="mx-auto flex h-full max-w-lg flex-col items-center justify-center rounded-[32px] border border-white/70 bg-white/90 p-10 text-center shadow-soft">
        <div class="text-4xl">📝</div>
        <h2 class="mt-4 text-2xl font-semibold">欢迎来到 ADI Writer</h2>
        <p class="mt-2 text-[var(--text-light)]">在左侧创建第一个文档，体验纯净的创作空间。</p>
        <button class="mt-6 rounded-[16px] border border-black/10 px-6 py-3 font-semibold text-dark transition hover:border-brand hover:text-brand" @click="createNewDocument">
          新建文档
        </button>
      </div>
    </section>

    <div
      v-if="showSettings"
      class="fixed inset-0 z-30 grid place-items-center bg-black/40 px-4"
      @click.self="showSettings = false"
    >
      <div class="w-full max-w-md rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-glow backdrop-blur">
        <div class="flex items-center justify-between border-b border-black/5 pb-4">
          <h2 class="text-xl font-semibold">设置</h2>
          <button class="text-2xl text-[var(--text-light)]" @click="showSettings = false">✕</button>
        </div>
        <div class="mt-6 space-y-5">
          <div class="space-y-2">
            <label class="text-sm font-semibold">当前 AI 提供商</label>
            <div class="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
              <span v-if="appStore.apiConfig">{{ getProviderName(appStore.apiConfig.provider) }}</span>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold">API 密钥</label>
            <input
              type="password"
              class="w-full rounded-2xl border border-black/10 bg-black/5 px-4 py-3"
              :value="appStore.apiConfig?.apiKey"
              readonly
              placeholder="••••••••"
            />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              class="flex-1 rounded-[16px] border border-black/10 px-4 py-3 font-semibold text-dark transition hover:border-brand hover:text-brand"
              @click="changeApiKey"
            >
              更改 API 密钥
            </button>
            <button
              class="flex-1 rounded-[16px] bg-gradient-to-r from-danger to-[#d91a12] px-4 py-3 font-semibold text-white shadow-card"
              @click="logout"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-danger to-[#d91a12] px-5 py-3 text-white shadow-lg"
    >
      <span>{{ errorMessage }}</span>
      <button class="text-xl" @click="errorMessage = ''">✕</button>
    </div>

    <div
      v-if="successMessage"
      class="fixed bottom-24 right-6 z-30 flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-accent to-[#1f995c] px-5 py-3 text-white shadow-lg"
    >
      <span>{{ successMessage }}</span>
      <button class="text-xl" @click="successMessage = ''">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useEditorStore } from '../stores/editor'
import type { Document } from '../stores/editor'
import { aiApiService } from '../services/ai-api'

const appStore = useAppStore()
const editorStore = useEditorStore()

const showSettings = ref(false)
const isProcessing = ref(false)
const currentMode = ref<'expand' | 'polish' | null>(null)
const resultContent = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const currentDocument = computed(() => editorStore.getCurrentDocument())

onMounted(() => {
  appStore.loadConfig()
})

const createNewDocument = () => {
  const id = Date.now().toString()
  const doc: Document = {
    id,
    title: `文档 ${editorStore.documents.length + 1}`,
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  editorStore.addDocument(doc)
  editorStore.currentDocumentId = id
}

const selectDocument = (id: string) => {
  editorStore.currentDocumentId = id
}

const updateCurrentDocument = () => {
  if (currentDocument.value) {
    editorStore.updateDocument(currentDocument.value.id, {
      title: currentDocument.value.title,
      content: currentDocument.value.content,
    })
  }
}

const deleteDocument = (id: string) => {
  if (confirm('确定要删除这个文档吗？')) {
    editorStore.deleteDocument(id)
  }
}

const processContent = async (mode: 'expand' | 'polish') => {
  if (!currentDocument.value || !appStore.apiConfig) return

  isProcessing.value = true
  currentMode.value = mode
  resultContent.value = ''
  errorMessage.value = ''

  try {
    const response = await aiApiService.processContent({
      provider: appStore.apiConfig.provider,
      apiKey: appStore.apiConfig.apiKey,
      content: currentDocument.value.content,
      mode,
      customEndpoint: appStore.apiConfig.customEndpoint,
      customModel: appStore.apiConfig.customModel,
    })

    resultContent.value = response.result
    successMessage.value = mode === 'expand' ? '扩写完成！' : '润色完成！'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '处理失败，请重试'
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isProcessing.value = false
    currentMode.value = null
  }
}

const copyResult = () => {
  if (!resultContent.value) return

  navigator.clipboard.writeText(resultContent.value).then(() => {
    successMessage.value = '已复制到剪贴板'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  })
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

const getProviderName = (provider: string) => {
  const names: Record<string, string> = {
    openai: 'OpenAI',
    gemini: 'Gemini',
    deepseek: 'DeepSeek',
    thirdparty: 'Custom Service',
  }
  return names[provider] || provider
}

const changeApiKey = () => {
  const newKey = prompt('请输入新的 API 密钥：')
  if (newKey) {
    appStore.updateApiKey(newKey)
    successMessage.value = 'API 密钥已更新'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  }
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    appStore.clearConfig()
  }
}
</script>

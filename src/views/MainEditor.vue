<template>
  <div class="editor-container">
    <div class="sidebar">
      <div class="sidebar-header">
         <h1>ADI Writer</h1>
         <button class="icon-btn" @click="showSettings = true" title="设置">⚙️</button>
       </div>

      <div class="documents-section">
        <button class="new-doc-btn" @click="createNewDocument">
          + 新建文档
        </button>

        <div class="documents-list">
          <div
            v-for="doc in editorStore.documents"
            :key="doc.id"
            class="document-item"
            :class="{ active: editorStore.currentDocumentId === doc.id }"
            @click="selectDocument(doc.id)"
          >
            <div class="doc-title">{{ doc.title }}</div>
            <div class="doc-meta">{{ formatDate(doc.updatedAt) }}</div>
            <button class="delete-btn" @click.stop="deleteDocument(doc.id)" title="删除">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div v-if="currentDocument" class="editor">
        <div class="editor-header">
          <input
            v-model="currentDocument.title"
            @change="updateCurrentDocument"
            class="title-input"
            placeholder="输入文档标题"
          />
        </div>

        <div class="editor-body">
          <div class="text-area-wrapper">
            <label>原文内容</label>
            <textarea
              v-model="currentDocument.content"
              @change="updateCurrentDocument"
              class="editor-textarea"
              placeholder="在这里输入或粘贴您要扩写或润色的文本..."
            />
          </div>

          <div class="controls">
            <button
              class="action-btn expand-btn"
              @click="processContent('expand')"
              :disabled="isProcessing || !currentDocument.content.trim()"
            >
              {{ isProcessing && currentMode === 'expand' ? '处理中...' : '✨ 扩写' }}
            </button>
            <button
              class="action-btn polish-btn"
              @click="processContent('polish')"
              :disabled="isProcessing || !currentDocument.content.trim()"
            >
              {{ isProcessing && currentMode === 'polish' ? '处理中...' : '🔧 润色' }}
            </button>
          </div>

          <div v-if="resultContent" class="result-section">
            <div class="result-header">
              <h3>处理结果</h3>
              <button class="copy-btn" @click="copyResult" title="复制">📋</button>
            </div>
            <div class="result-content">{{ resultContent }}</div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h2>暂无文档</h2>
        <p>点击左侧"新建文档"开始创建</p>
      </div>
    </div>

    <div v-if="showSettings" class="modal" @click.self="showSettings = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>设置</h2>
          <button class="close-btn" @click="showSettings = false">✕</button>
        </div>

        <div class="modal-body">
          <div class="setting-item">
            <label>当前 AI 提供商</label>
            <div class="provider-badge">
              <span v-if="appStore.apiConfig">{{ getProviderName(appStore.apiConfig.provider) }}</span>
            </div>
          </div>

          <div class="setting-item">
            <label>API 密钥</label>
            <input
              type="password"
              class="input"
              :value="appStore.apiConfig?.apiKey"
              readonly
              placeholder="••••••••"
            />
          </div>

          <div class="setting-actions">
            <button class="btn btn-secondary" @click="changeApiKey">更改 API 密钥</button>
            <button class="btn btn-danger" @click="logout">退出登录</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="toast error">
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="close">✕</button>
    </div>

    <div v-if="successMessage" class="toast success">
      {{ successMessage }}
      <button @click="successMessage = ''" class="close">✕</button>
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

<style scoped>
.editor-container {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-color) 0%, #f9f9fb 100%);
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, var(--bg-white) 0%, #f9f9fb 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.02);
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%);
}

.sidebar-header h1 {
  font-size: 1.35rem;
  margin: 0;
  color: var(--primary-color);
  font-weight: 800;
  letter-spacing: -0.3px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 6px 10px;
  transition: all 0.2s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(1.08);
}

.icon-btn:active {
  background: rgba(0, 122, 255, 0.15);
}

.documents-section {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.new-doc-btn {
  width: 100%;
  padding: 13px 16px;
  background: linear-gradient(135deg, #007aff 0%, #0051cc 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 16px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.25);
  letter-spacing: 0.3px;
}

.new-doc-btn:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.35);
}

.new-doc-btn:active {
  transform: translateY(-0.5px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.document-item {
  padding: 12px 14px;
  background: linear-gradient(135deg, #f5f5f7 0%, #f0f0f3 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  group: 'item';
}

.document-item:hover {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0.05) 100%);
  border-color: rgba(0, 122, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.1);
}

.document-item.active {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.1) 100%);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.18);
}

.doc-title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
  word-break: break-word;
}

.doc-meta {
  font-size: 0.8rem;
  color: var(--text-light);
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.document-item:hover .delete-btn {
  opacity: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 15px;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-input {
  flex: 1;
  padding: 13px 16px;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  border: 1.5px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: transparent;
  color: var(--text-color);
}

.title-input:hover {
  border-color: rgba(0, 122, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.5);
}

.title-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12), inset 0 0 0 0.5px var(--primary-color);
}

.editor-body {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-height: 0;
}

.text-area-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.text-area-wrapper label {
  font-weight: 600;
  color: var(--text-color);
}

.editor-textarea {
  flex: 1;
  padding: 16px 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  resize: none;
  transition: all 0.3s ease;
  background-color: linear-gradient(135deg, #f9f9fb 0%, #f5f5f7 100%);
  line-height: 1.6;
  color: var(--text-color);
}

.editor-textarea:hover {
  border-color: rgba(0, 122, 255, 0.25);
  background: linear-gradient(135deg, #ffffff 0%, #f8f8fa 100%);
}

.editor-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12), inset 0 0 0 0.5px var(--primary-color);
}

.controls {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 13px 20px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 12px;
  color: white;
  border: none;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  letter-spacing: 0.3px;
}

.expand-btn {
  background: linear-gradient(135deg, #007aff 0%, #0051cc 100%);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.25);
}

.expand-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.35);
}

.expand-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
}

.polish-btn {
  background: linear-gradient(135deg, #34c759 0%, #30b050 100%);
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.25);
}

.polish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 199, 89, 0.35);
}

.polish-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 199, 89, 0.2);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.result-section {
  background: linear-gradient(135deg, var(--bg-white) 0%, #f9f9fb 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(2px);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
}

.copy-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.copy-btn:hover {
  transform: scale(1.2);
}

.result-content {
  overflow-y: auto;
  padding: 12px 14px;
  background: linear-gradient(135deg, #f9f9fb 0%, #f5f5f7 100%);
  border-radius: 10px;
  line-height: 1.7;
  color: var(--text-color);
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 250px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-light);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(6px);
  }
}

.modal-content {
  background: var(--bg-white);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 26px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
  font-weight: 800;
  letter-spacing: -0.2px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-color);
  background: rgba(0, 0, 0, 0.05);
}

.modal-body {
  padding: 20px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-item label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-color);
}

.provider-badge {
  display: inline-block;
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-color);
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid rgba(0, 122, 255, 0.2);
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: #f5f5f7;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.08);
}

.setting-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-secondary {
  background: linear-gradient(135deg, #f5f5f7 0%, #f0f0f3 100%);
  color: var(--text-color);
  border: 1.5px solid rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0.05) 100%);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
}

.btn-danger {
  background: linear-gradient(135deg, #ff3b30 0%, #ff1a1a 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.25);
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 59, 48, 0.35);
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 20px;
  border-radius: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  animation: slideInToast 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  max-width: 320px;
  font-weight: 600;
}

.toast.error {
  background: linear-gradient(135deg, #ff3b30 0%, #ff1a1a 100%);
  box-shadow: 0 12px 32px rgba(255, 59, 48, 0.35);
}

.toast.success {
  background: linear-gradient(135deg, #34c759 0%, #30b050 100%);
  box-shadow: 0 12px 32px rgba(52, 199, 89, 0.35);
}

.toast .close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.85;
  padding: 4px 8px;
  margin-left: 8px;
  transition: opacity 0.2s ease;
}

.toast .close:hover {
  opacity: 1;
}

@keyframes slideInToast {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .editor {
    padding: 15px;
  }

  .controls {
    flex-direction: column;
  }

  .modal-content {
    margin: 20px;
  }
}
</style>

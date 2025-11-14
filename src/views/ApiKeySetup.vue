<template>
  <div class="setup-container">
    <div class="setup-card">
      <div class="header">
         <h1>ADI Writer</h1>
         <p>书写你的故事</p>
       </div>

       <div class="content">
         <div class="info-box">
           <h2>欢迎使用 ADI Writer</h2>
           <p>你是否曾有过天马行空的想法，却苦于无法用语言表达？使用 ADI Writer，帮助你完成剧本、小说、诗歌、传记，书写你的故事。</p>
           <p>首次使用需要配置您的 API 密钥。</p>
         </div>

        <form @submit.prevent="handleSubmit" class="form">
           <div class="form-group">
             <label for="provider">选择 AI 模型提供商</label>
             <select v-model="selectedProvider" id="provider" class="input">
               <option value="openai">OpenAI (GPT-4o Mini)</option>
               <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
               <option value="deepseek">DeepSeek</option>
               <option value="thirdparty">Custom Service (Third-party)</option>
             </select>
           </div>

           <div class="provider-info">
             <div v-if="selectedProvider === 'openai'" class="info">
               <h4>OpenAI</h4>
               <p>获取 API 密钥：<a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a></p>
             </div>
             <div v-else-if="selectedProvider === 'gemini'" class="info">
               <h4>Google Gemini</h4>
               <p>获取 API 密钥：<a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>
             </div>
             <div v-else-if="selectedProvider === 'deepseek'" class="info">
               <h4>DeepSeek</h4>
               <p>获取 API 密钥：<a href="https://platform.deepseek.com/api" target="_blank">platform.deepseek.com</a></p>
             </div>
             <div v-else-if="selectedProvider === 'thirdparty'" class="info">
               <h4>Custom Service</h4>
               <p>使用您自己的 API 服务或第三方提供商</p>
             </div>
           </div>

           <div class="form-group">
             <label for="apikey">API 密钥</label>
             <input
               v-model="apiKey"
               id="apikey"
               type="password"
               class="input"
               placeholder="请输入您的 API 密钥"
               required
             />
             <small>您的 API 密钥仅保存在本地浏览器中</small>
           </div>

           <div v-if="selectedProvider === 'thirdparty'" class="form-group">
             <label for="endpoint">API 端点</label>
             <input
               v-model="customEndpoint"
               id="endpoint"
               type="url"
               class="input"
               placeholder="例如: https://api.example.com/v1/chat/completions"
               required
             />
             <small>您的自定义 API 端点地址</small>
           </div>

           <div v-if="selectedProvider === 'thirdparty'" class="form-group">
             <label for="model">模型名称</label>
             <input
               v-model="customModel"
               id="model"
               type="text"
               class="input"
               placeholder="例如: gpt-4o-mini"
               required
             />
             <small>您要使用的模型名称</small>
           </div>

          <div class="checkbox-group">
            <input
              v-model="agreeTerms"
              id="agree"
              type="checkbox"
              required
            />
            <label for="agree">
              我同意将 API 密钥存储在本地浏览器中并同意
              <a href="#" @click.prevent>隐私政策</a>
            </label>
          </div>

          <button type="submit" class="submit-btn" :disabled="!agreeTerms || !apiKey || (selectedProvider === 'thirdparty' && (!customEndpoint || !customModel))">
            开始使用
          </button>
        </form>

        <div class="features">
          <h3>功能特性</h3>
          <ul>
            <li>✨ 小说内容扩写</li>
            <li>🔧 文本润色优化</li>
            <li>🔐 API 密钥本地存储</li>
            <li>🎨 简洁易用的界面</li>
            <li>🌐 开源免费</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
const selectedProvider = ref<'openai' | 'gemini' | 'deepseek' | 'thirdparty'>('openai')
const apiKey = ref('')
const customEndpoint = ref('')
const customModel = ref('')
const agreeTerms = ref(false)

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

<style scoped>
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 50%, #f5f5f7 100%);
  position: relative;
  overflow: hidden;
}

.setup-container::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  z-index: 0;
}

.setup-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(52, 199, 89, 0.03) 0%, transparent 70%);
  bottom: -50px;
  right: -50px;
  z-index: 0;
}

.setup-card {
  background: var(--bg-white);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 10;
}

.header {
  background: linear-gradient(135deg, #007aff 0%, #0051cc 100%);
  color: white;
  padding: 50px 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
  top: 0;
  left: 0;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, 20px); }
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 12px;
  font-weight: 800;
  letter-spacing: -0.5px;
  position: relative;
  z-index: 1;
}

.header p {
  font-size: 1.1rem;
  opacity: 0.95;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.content {
  padding: 40px 30px;
}

.info-box {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 122, 255, 0.05) 100%);
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 122, 255, 0.2);
  backdrop-filter: blur(4px);
}

.info-box h2 {
  font-size: 1.15rem;
  margin-bottom: 12px;
  color: var(--text-color);
  font-weight: 700;
}

.info-box p {
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  color: var(--text-color);
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.input {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: #f9f9fb;
}

.input:hover {
  border-color: rgba(0, 122, 255, 0.3);
  background-color: var(--bg-white);
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--bg-white);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12), inset 0 0 0 0.5px var(--primary-color);
}

.form-group small {
  display: block;
  margin-top: 4px;
  color: var(--text-light);
  font-size: 0.85rem;
}

.provider-info {
  background: linear-gradient(135deg, #f9f9fb 0%, #f5f5f7 100%);
  padding: 16px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid var(--border-light);
  backdrop-filter: blur(2px);
}

.provider-info .info h4 {
  margin-bottom: 8px;
  color: var(--text-color);
  font-weight: 700;
  font-size: 0.95rem;
}

.provider-info .info p {
  color: var(--text-light);
  font-size: 0.9rem;
  line-height: 1.5;
}

.provider-info a {
  color: var(--primary-color);
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.provider-info a:hover {
  opacity: 0.8;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.checkbox-group input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  font-weight: normal;
  color: var(--text-light);
}

.checkbox-group a {
  color: var(--primary-color);
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #007aff 0%, #0051cc 100%);
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 14px;
  border: none;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.35);
  letter-spacing: 0.4px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 122, 255, 0.45);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.features {
  border-top: 1px solid var(--border-light);
  padding-top: 30px;
  margin-top: 30px;
}

.features h3 {
  font-size: 1rem;
  margin-bottom: 16px;
  color: var(--text-color);
  font-weight: 700;
  letter-spacing: 0.3px;
}

.features ul {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.features li {
  padding: 10px 12px;
  color: var(--text-light);
  font-size: 0.9rem;
  background: rgba(0, 122, 255, 0.04);
  border-radius: 8px;
  border: 1px solid rgba(0, 122, 255, 0.1);
  transition: all 0.2s ease;
}

.features li:hover {
  background: rgba(0, 122, 255, 0.08);
  border-color: rgba(0, 122, 255, 0.2);
}
</style>

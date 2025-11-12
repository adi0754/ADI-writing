# API 文档

本文档说明如何使用 H5 AI Writer 的 API。

## 概览

H5 AI Writer 通过以下服务与 AI 模型进行交互：

- OpenAI ChatGPT API
- Google Generative AI (Gemini)
- DeepSeek API

## 支持的 AI 提供商

### OpenAI (GPT-3.5 Turbo)

**端点:** `https://api.openai.com/v1/chat/completions`

**认证:** Bearer Token

**配置:**
```typescript
{
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  max_tokens: 2000
}
```

**获取 API 密钥:** https://platform.openai.com/api-keys

### Google Gemini

**端点:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

**认证:** API Key (query parameter)

**配置:**
```typescript
{
  model: 'gemini-pro',
  temperature: 0.7,
  maxOutputTokens: 2000
}
```

**获取 API 密钥:** https://aistudio.google.com/app/apikey

### DeepSeek

**端点:** `https://api.deepseek.com/chat/completions`

**认证:** Bearer Token

**配置:**
```typescript
{
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 2000
}
```

**获取 API 密钥:** https://platform.deepseek.com/api

## 请求格式

### 扩写请求

```typescript
interface ExpandRequest {
  provider: 'openai' | 'gemini' | 'deepseek'
  apiKey: string
  content: string
  mode: 'expand'
}
```

**示例:**
```javascript
{
  provider: 'openai',
  apiKey: 'sk-xxx',
  content: '她走进房间，看到了一封信。',
  mode: 'expand'
}
```

**预期输出:**
扩写后的内容，增加了细节、对话和场景描写，字数增加50%以上。

### 润色请求

```typescript
interface PolishRequest {
  provider: 'openai' | 'gemini' | 'deepseek'
  apiKey: string
  content: string
  mode: 'polish'
}
```

**示例:**
```javascript
{
  provider: 'gemini',
  apiKey: 'xxx',
  content: '他很开心，因为他赢了比赛。',
  mode: 'polish'
}
```

**预期输出:**
改进的表达方式，提高可读性，修正语法错误。

## 响应格式

### 成功响应

```typescript
interface AIResponse {
  result: string
  provider?: 'openai' | 'gemini' | 'deepseek'
  timestamp?: number
}
```

**示例:**
```json
{
  "result": "她缓缓推开房间的门。阳光透过窗户洒在木地板上，形成了斑驳的光影。她的呼吸略显急促，眼睛立即捕捉到了桌上那封信——信封已经泛黄，字迹却依然清晰。"
}
```

### 错误响应

```typescript
interface ErrorResponse {
  message: string
  code?: string
  provider?: 'openai' | 'gemini' | 'deepseek'
}
```

**示例:**
```json
{
  "message": "OpenAI API 错误: Invalid API key provided",
  "code": "invalid_api_key",
  "provider": "openai"
}
```

## 系统提示词

### 基础系统提示词

```
你和用户一起结对写作来解决他们的问题。你是一位世界一流的专业AI作家助手。
你的任务是根据用户输入的消息，回答用户的问题。

范围限制：
1. 拒绝所有非文学相关问题
2. 避免任何政治内容和极端露骨的情色描写
3. 必须虚构所有国家、地名、机构名称等

输出要求：
1. 禁止一切与推动剧情无关的描述
2. 每一句的长度不宜过长
3. 禁止使用过度修饰的词汇
4. 绝不编造信息
5. 正文输出的结尾不要有展望总结式语句，留下悬念即可
```

### 扩写模式提示词

```
请对以下内容进行扩写。要求：
1. 增加细节描写和心理活动
2. 丰富对话和人物互动
3. 补充场景描写
4. 字数增加50%以上
5. 保持原意不变
```

### 润色模式提示词

```
请对以下内容进行润色。要求：
1. 改进表达方式
2. 增强可读性
3. 修正语法错误
4. 优化措辞
5. 保持字数基本不变
```

## 服务类使用示例

### 调用 AI API

```typescript
import { aiApiService } from '@/services/ai-api'

const response = await aiApiService.processContent({
  provider: 'openai',
  apiKey: 'your-api-key',
  content: '这是要处理的文本',
  mode: 'expand'
})

console.log(response.result)
```

### 错误处理

```typescript
try {
  const response = await aiApiService.processContent(request)
  console.log('处理成功:', response.result)
} catch (error) {
  console.error('API 错误:', error.message)
  // 错误处理逻辑
}
```

## 费用估算

### OpenAI
- 输入: $0.0005 / 1K tokens
- 输出: $0.0015 / 1K tokens

### Google Gemini
- 免费配额: 60 请求/分钟
- 付费: 按需计费

### DeepSeek
- 变量定价，具体见官网

## 限制和配额

### 请求限制
- 每个请求的最大内容长度: 由各提供商决定
- 最大输出 tokens: 2000

### 速率限制
- OpenAI: 取决于 API 密钥级别
- Gemini: 60 请求/分钟（免费）
- DeepSeek: 取决于账户等级

## 故障排除

### 常见错误

#### 1. Invalid API Key
```
消息: "Invalid API key provided"
原因: API 密钥无效或过期
解决: 检查密钥是否正确，重新生成新密钥
```

#### 2. Rate Limit Exceeded
```
消息: "Too many requests"
原因: 请求过于频繁
解决: 等待或升级账户
```

#### 3. Timeout
```
消息: "Request timeout"
原因: 网络或服务问题
解决: 检查网络连接，重试请求
```

## 最佳实践

1. **API 密钥管理**
   - 定期轮换 API 密钥
   - 不要在代码中硬编码密钥
   - 使用环境变量

2. **错误处理**
   - 实现重试逻辑
   - 提供用户友好的错误消息
   - 记录错误日志

3. **性能优化**
   - 缓存结果（如适用）
   - 使用适当的 temperature 值
   - 根据内容长度调整 max_tokens

4. **安全性**
   - 验证用户输入
   - 实现速率限制
   - 定期审计 API 使用情况

## 环境变量

在 `.env.local` 中配置（如需服务器集成）：

```env
VITE_OPENAI_API_KEY=your_key
VITE_GEMINI_API_KEY=your_key
VITE_DEEPSEEK_API_KEY=your_key
```

**注意:** 当前版本在客户端存储 API 密钥，不建议在 .env 中存储。

## 集成示例

### React/Vue 集成

```typescript
// stores/app.ts (Pinia)
import { defineStore } from 'pinia'
import { aiApiService } from '@/services/ai-api'

export const useContentProcessor = defineStore('processor', {
  state: () => ({
    isProcessing: false,
    result: null,
    error: null
  }),
  
  actions: {
    async processContent(request) {
      this.isProcessing = true
      try {
        this.result = await aiApiService.processContent(request)
        this.error = null
      } catch (err) {
        this.error = err.message
        this.result = null
      } finally {
        this.isProcessing = false
      }
    }
  }
})
```

## 版本历史

- **v1.0.0** (2024-11-12)
  - 初始版本
  - 支持 OpenAI, Gemini, DeepSeek
  - 扩写和润色功能

## 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Google Gemini API 文档](https://ai.google.dev)
- [DeepSeek API 文档](https://platform.deepseek.com)

---

最后更新: 2024-11-12

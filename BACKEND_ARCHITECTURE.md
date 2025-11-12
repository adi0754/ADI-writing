# 后端架构说明

本文档详细说明 H5 AI Writer 后端服务的架构设计和实现方式。

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                             │
│              H5 AI Writer 前端应用                       │
│                  (Vue 3 + TypeScript)                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Request
                       │
         ┌─────────────▼──────────────┐
         │    Vercel Edge Network      │
         │      (CDN + Routing)        │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────────────┐
         │  Vercel Serverless Functions       │
         ├────────────────────────────────────┤
         │ /api/process (AI 处理)             │
         │ /api/providers (提供商列表)       │
         │ /api/health (健康检查)             │
         └─────────────┬────────────────────┘
                       │
         ┌─────────────▼──────────────────────┐
         │     第三方 AI API 服务              │
         ├────────────────────────────────────┤
         │ • OpenAI API                       │
         │ • Google Gemini API                │
         │ • DeepSeek API                     │
         └────────────────────────────────────┘
```

## 为什么选择后端架构

### 问题分析

**原始方案（客户端直接调用）的问题：**

1. **安全性**
   - API 密钥暴露在客户端代码中
   - 浏览器开发者工具可以看到完整的 API 调用
   - 易被恶意利用，导致 API 配额被滥用

2. **CORS 问题**
   - 某些 API 服务有严格的 CORS 限制
   - 跨域请求容易被阻止

3. **请求限制**
   - 无法实施统一的速率限制
   - 无法控制并发请求
   - 易被 DDoS 攻击

4. **监控困难**
   - 无法有效监控使用情况
   - 难以追踪问题根源

### 解决方案

**后端 Serverless 架构的优势：**

1. **安全性**
   - ✅ API 密钥存储在服务器环境变量
   - ✅ 客户端永远不会看到真实的 API 密钥
   - ✅ 请求来自可信服务器而非客户端

2. **可靠性**
   - ✅ 统一的错误处理
   - ✅ 自动重试机制可在服务器实现
   - ✅ 统一的超时和连接管理

3. **可扩展性**
   - ✅ Vercel 自动处理 scaling
   - ✅ 并发请求自动负载均衡
   - ✅ 无需管理服务器

4. **可观测性**
   - ✅ 完整的请求日志
   - ✅ 性能监控数据
   - ✅ 错误追踪和告警

5. **成本效益**
   - ✅ 按使用量付费（免费额度充足）
   - ✅ 无需维护和运维成本
   - ✅ 自动 HTTPS 和 CDN

## 技术栈

### 前端
- **框架**: Vue 3
- **语言**: TypeScript
- **构建**: Vite
- **状态管理**: Pinia
- **HTTP 客户端**: Axios

### 后端
- **运行时**: Node.js (Vercel)
- **语言**: TypeScript
- **框架**: 原生 (Vercel Functions)
- **部署**: Vercel
- **HTTP 客户端**: Axios

### 基础设施
- **托管**: Vercel
- **CDN**: Vercel Edge Network
- **监控**: Vercel Analytics
- **域名**: Vercel 自定义域名

## API 设计

### 1. 处理内容端点

**端点**: `POST /api/process`

**目的**: 处理用户输入的文本内容（扩写或润色）

**请求格式**:
```typescript
interface ProcessRequest {
  provider: 'openai' | 'gemini' | 'deepseek'
  content: string           // 要处理的文本
  mode: 'expand' | 'polish' // 处理模式
  apiKey: string           // 用户提供的 API 密钥
}
```

**响应格式**:
```typescript
interface ProcessResponse {
  result: string      // 处理后的文本
  provider: string    // 使用的提供商
  timestamp: number   // 时间戳
}
```

**错误处理**:
```typescript
interface ErrorResponse {
  error: string      // 错误代码
  message: string    // 错误信息
  code?: string      // 详细错误码
}
```

**流程**:
```
1. 接收请求
   ↓
2. 验证参数
   ├─ 检查 provider、content、mode、apiKey 是否存在
   ├─ 检查 provider 是否被支持
   ├─ 检查 mode 是否有效
   └─ 检查 content 是否为空
   ↓
3. 调用相应的 AI 提供商 API
   ├─ 根据 provider 选择端点
   ├─ 组织 system prompt + mode prompt + content
   └─ 发送请求到 AI API
   ↓
4. 处理响应
   ├─ 提取生成的文本
   ├─ 验证响应内容
   └─ 返回给客户端
   ↓
5. 错误处理（如有）
   ├─ 认证错误 (401/403)
   ├─ 速率限制错误 (429)
   ├─ 超时错误 (504)
   └─ 返回适当的 HTTP 状态码
```

### 2. 提供商信息端点

**端点**: `GET /api/providers`

**目的**: 获取支持的 AI 提供商列表和信息

**响应格式**:
```typescript
interface ProvidersResponse {
  providers: Array<{
    id: string           // 提供商 ID
    name: string         // 提供商名称
    description: string  // 描述
    url: string         // 获取 API 密钥的 URL
    icon: string        // 图标（emoji）
    status: string      // 状态（active/inactive）
  }>
  timestamp: string     // ISO 8601 时间戳
}
```

**用途**:
- 前端在启动时获取可用提供商
- 显示提供商列表供用户选择
- 提供 API 密钥获取链接

### 3. 健康检查端点

**端点**: `GET /api/health`

**目的**: 检查服务是否正常运行

**响应格式**:
```typescript
interface HealthResponse {
  status: string           // 状态 (ok/error)
  timestamp: string        // ISO 8601 时间戳
  service: string         // 服务名称
  version: string         // 版本号
}
```

**用途**:
- 监控和告警系统健康检查
- 前端定期检查后端可用性
- 作为简单的 "ping" 测试

## 数据流

### 用户流程

```
1. 用户打开应用
   ↓
2. 前端检查本地 storage 中的 API 配置
   ├─ 如果存在 → 跳到步骤 5
   └─ 如果不存在 → 显示配置页面 (步骤 3)
   ↓
3. 用户输入 API 密钥和选择提供商
   ├─ 前端从 /api/providers 获取提供商列表
   ├─ 显示在配置界面
   └─ 用户选择并输入密钥
   ↓
4. 前端保存配置到本地 storage
   ↓
5. 用户打开主编辑器
   ├─ 创建或选择文档
   └─ 输入要处理的文本
   ↓
6. 用户点击"扩写"或"润色"
   ↓
7. 前端发送请求到 /api/process
   ├─ 发送：provider、content、mode、apiKey
   └─ 等待响应
   ↓
8. 后端服务器处理请求
   ├─ 验证参数
   ├─ 调用相应的 AI API
   └─ 返回结果
   ↓
9. 前端接收响应
   ├─ 显示处理结果
   ├─ 用户可复制结果
   └─ 或继续编辑
```

## 安全实现

### API 密钥管理

**前端:**
```typescript
// 密钥存储在本地 storage
localStorage.setItem('h5_ai_writer_config', JSON.stringify({
  provider: 'openai',
  apiKey: '***hidden***'  // 用户输入时显示，使用时发送到后端
}))
```

**后端:**
```typescript
// 接收客户端发送的密钥
const { apiKey } = req.body

// 直接使用或通过环境变量覆盖
const effectiveApiKey = process.env.OPENAI_API_KEY || apiKey

// 转发到 AI API，不存储
```

### 请求验证

```typescript
// 1. 参数验证
if (!provider || !content || !mode) {
  return 400 // Bad Request
}

// 2. 类型检查
if (!['openai', 'gemini', 'deepseek'].includes(provider)) {
  return 400 // Bad Request
}

// 3. 内容检查
if (content.trim().length === 0) {
  return 400 // Bad Request
}

// 4. API 密钥检查
if (!apiKey || apiKey.trim().length === 0) {
  return 401 // Unauthorized
}
```

### 错误处理

```typescript
try {
  // 调用 AI API
} catch (error) {
  if (error.response?.status === 401) {
    // 认证失败 - API 密钥无效
    return 401
  } else if (error.response?.status === 429) {
    // 速率限制
    return 429
  } else if (error.code === 'ECONNABORTED') {
    // 超时
    return 504
  } else {
    // 其他错误
    return 500
  }
}
```

## 性能考虑

### 函数优化

1. **冷启动优化**
   - 函数保持温暖（Vercel Pro）
   - 或接受 1-2 秒首次启动延迟

2. **超时配置**
   - 客户端超时：60 秒
   - 服务器超时：30 秒
   - AI API 超时：25 秒

3. **内存使用**
   - 标准配置：1024MB
   - 无大对象缓存（stateless）

### 可扩展性

- Vercel 自动水平扩展
- 每个函数独立执行
- 内置负载均衡

## 监控和日志

### 日志级别

```typescript
console.log()     // 信息性日志
console.error()   // 错误日志
console.warn()    // 警告日志
```

### 监控指标

- 函数执行时间
- 函数调用次数
- 错误率
- 冷启动时间

### 告警规则

- 错误率 > 5%
- 响应时间 > 10s
- 可用性 < 99%

## 扩展可能性

### 短期扩展

1. **缓存层**
   ```typescript
   // 缓存热门请求结果
   const cache = new Map()
   ```

2. **速率限制**
   ```typescript
   // 按 IP 限制请求频率
   const rateLimiter = new RateLimiter()
   ```

3. **认证系统**
   ```typescript
   // 添加用户认证
   const token = req.headers.authorization?.split(' ')[1]
   ```

### 中期扩展

1. **数据库集成**
   ```typescript
   // 存储请求历史
   const database = new Database()
   ```

2. **更多 AI 提供商**
   ```typescript
   // 支持 Claude、LLaMA 等
   ```

3. **高级功能**
   - 批量处理
   - 自定义提示词
   - 版本控制

### 长期扩展

1. **用户系统**
   - 用户认证和授权
   - 配额管理
   - 使用统计

2. **付费功能**
   - 订阅模式
   - 额度购买
   - 优先级队列

3. **高级 AI 功能**
   - 流式响应
   - 多轮对话
   - 上下文记忆

## 部署流程

### 代码流程

```
本地开发
   ↓
提交到 GitHub
   ↓
Vercel 自动检测
   ↓
安装依赖 (npm install)
   ↓
构建前端 (vite build)
   ↓
打包 API 函数
   ↓
部署到 Vercel
   ↓
生成部署 URL
   ↓
配置 CDN 和缓存
   ↓
完成！
```

## 成本分析

### Vercel 免费计划

- 无限项目
- 无限部署
- 50GB 带宽/月
- 100GB Serverless Functions 调用/月
- 足以支持中小规模应用

### AI API 成本

**OpenAI:**
- 输入: $0.0005 / 1K tokens
- 输出: $0.0015 / 1K tokens
- 大约 $1 可处理 2000 个请求（平均 100 tokens）

**Gemini:**
- 免费配额: 60 请求/分钟
- 付费: 按需计费

**DeepSeek:**
- 按需计费
- 通常比 OpenAI 便宜

## 故障转移

### 单点故障

1. **API 密钥过期**
   - → 用户收到 401 错误
   - → 提示重新输入

2. **AI API 宕机**
   - → 返回 503 Service Unavailable
   - → 提示用户稍后重试

3. **网络问题**
   - → 返回 504 Gateway Timeout
   - → 前端重试机制

## 最佳实践

1. **环境变量分离**
   - 开发环境使用本地密钥
   - 生产环境使用 Vercel 环境变量

2. **请求签名**
   - 对敏感操作添加签名
   - 防止请求被篡改

3. **日志记录**
   - 记录所有 API 调用
   - 便于审计和调试

4. **错误监控**
   - 使用 Sentry 等监控工具
   - 自动告警异常

5. **版本控制**
   - 使用 API 版本号
   - 便于升级和兼容性

---

**结论**：Vercel Serverless 架构为 H5 AI Writer 提供了安全、可靠、可扩展的后端支持，无需管理复杂的服务器基础设施，同时提供企业级的性能和可靠性。

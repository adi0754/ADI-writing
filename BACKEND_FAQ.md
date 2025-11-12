# 后端服务常见问题 (FAQ)

## 通用问题

### Q: 为什么需要后端服务？

A: 后端服务提供了以下关键优势：

1. **安全性** - API 密钥存储在服务器，而不是暴露在客户端
2. **可靠性** - 统一的错误处理和重试机制
3. **可控性** - 可实施速率限制和访问控制
4. **监控** - 完整的请求日志和性能监控
5. **成本** - 可实现缓存和优化降低 API 调用成本

### Q: Vercel Serverless Functions 如何工作？

A: Vercel 会自动：
1. 监听 `/api/*` 路由的请求
2. 启动对应的 Function
3. 执行 TypeScript/Node.js 代码
4. 返回响应
5. 函数自动关闭（按需付费）

### Q: 成本如何？

A: **完全免费**（在合理使用范围内）：
- Vercel 免费计划：100GB Serverless Functions 调用/月
- 足以支持每月数千次请求
- 仅需支付 AI API 调用费用

### Q: 部署需要多长时间？

A: 通常 2-5 分钟：
1. 连接 GitHub（第一次）：1 分钟
2. 添加环境变量：1 分钟
3. 自动构建部署：2-3 分钟

## 部署相关

### Q: 如何在 Vercel 上部署？

A: 最简单的方式：

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 粘贴项目 URL
4. 点击 "Import"
5. 在 Environment Variables 添加 API 密钥
6. 点击 "Deploy"

### Q: 可以使用 Vercel 免费计划吗？

A: **可以，完全可以**。免费计划包括：
- 无限项目
- 无限部署
- 50GB 带宽/月
- 100GB Serverless 调用/月
- HTTPS 和 CDN
- 自动扩展

### Q: 环境变量应该如何配置？

A: 在 Vercel 仪表板中：

1. 项目 → Settings
2. Environment Variables
3. 添加：
   ```
   OPENAI_API_KEY = your_key
   GEMINI_API_KEY = your_key
   DEEPSEEK_API_KEY = your_key
   ```
4. 重新部署以应用变量

### Q: 如何检查部署是否成功？

A: 

1. **检查 Vercel 仪表板**
   - 项目 → Deployments
   - 查看最新部署状态

2. **测试 API 端点**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

3. **查看日志**
   - 点击部署 → Logs
   - 查看构建和函数执行日志

### Q: 部署失败了怎么办？

A: 常见问题和解决方案：

**错误：构建失败**
- 检查 Node.js 版本兼容性
- 运行 `npm install` 确保依赖完整
- 查看详细日志

**错误：环境变量未定义**
- 在 Vercel 仪表板中添加变量
- 重新部署

**错误：API 请求超时**
- 检查 API 密钥有效性
- 检查网络连接
- 在 Vercel 日志中查看详情

## 功能相关

### Q: API 密钥存储在哪里？

A: 取决于部署方式：

**Vercel 部署：**
- 存储在 Vercel 环境变量（服务器端）
- 更安全，推荐

**本地开发：**
- 存储在 `.env.local` 文件
- 仅用于本地测试
- 不要提交到 Git

**浏览器（客户端模式）：**
- 可选：存储在本地 storage
- 用户可自行配置

### Q: 哪个 API 端点在生产中使用？

A: 在 Vercel 上自动使用后端 API：

```typescript
// 自动识别并使用
const apiUrl = window.location.origin  // → https://your-domain.vercel.app

// 发送请求到
POST /api/process
```

### Q: 可以定制提示词吗？

A: **可以**，编辑 `api/process.ts`：

```typescript
const SYSTEM_PROMPT = `你自定义的系统提示词...`
const EXPAND_MODE_PROMPT = `扩写模式自定义提示词...`
const POLISH_MODE_PROMPT = `润色模式自定义提示词...`
```

然后：
1. 提交到 GitHub
2. Vercel 自动重新部署
3. 新的提示词生效

### Q: 如何添加新的 AI 提供商？

A: 在 `api/process.ts` 中：

```typescript
async function callNewProvider(
  apiKey: string,
  content: string,
  mode: 'expand' | 'polish'
): Promise<string> {
  // 实现您的提供商调用逻辑
}

// 在 processContent 函数中添加
case 'new-provider':
  return await callNewProvider(...)
```

## 性能和可靠性

### Q: 函数会冷启动吗？

A: **是的**，第一次请求可能有延迟：
- 冷启动：1-2 秒
- 后续请求：< 100ms
- Pro 计划可保持温暖

### Q: 可以缓存结果吗？

A: 目前不缓存（无状态设计），但可以添加：

```typescript
// 简单的内存缓存
const cache = new Map()

// 生产环境可集成 Redis 等
```

### Q: 如何处理高并发？

A: Vercel 自动处理：
- 自动启动多个实例
- 负载均衡
- 按需扩展
- 无需手动配置

### Q: API 有速率限制吗？

A: 目前没有，但建议添加：

```typescript
// 使用 rate-limiter-flexible 等库
const rateLimiter = new RateLimiterMemory({
  points: 100,  // 100 请求
  duration: 60, // 每 60 秒
})
```

## 监控和调试

### Q: 如何查看 API 日志？

A: 在 Vercel 仪表板：

1. 项目 → Deployments
2. 选择最新部署
3. 点击 "Logs"
4. 查看实时日志

或使用 CLI：
```bash
vercel logs --tail
```

### Q: 如何调试 API 问题？

A: 使用 `console.log` 和错误消息：

```typescript
// 在函数中添加日志
console.log('Received request:', req.body)
console.error('API Error:', error)

// 日志自动出现在 Vercel Logs 中
```

### Q: 如何监控性能？

A: Vercel 内置监控：
- 项目 → Analytics
- 查看请求量、响应时间
- 查看错误率

### Q: 如何设置告警？

A: 在 Vercel 仪表板：
1. Settings → Alerts
2. 配置告警规则
3. 设置通知方式

## 安全相关

### Q: API 密钥会被泄露吗？

A: **不会**（使用 Vercel 后端）：
- 密钥存储在服务器环境变量
- 客户端永远不会接触
- 请求来自可信服务器
- HTTPS 加密传输

### Q: 如何防止 API 滥用？

A: 实施多层保护：

1. **速率限制** - 限制请求频率
2. **认证** - 添加用户认证
3. **配额** - 按用户限制调用次数
4. **IP 限制** - 限制可信 IP

### Q: 用户数据会被存储吗？

A: **不会**：
- 后端不存储用户数据
- 请求处理后立即释放
- 仅转发到 AI API
- 用户文档存储在本地浏览器

### Q: 可以启用 HTTPS 吗？

A: **自动启用**：
- Vercel 自动配置 SSL/TLS
- 所有流量自动重定向到 HTTPS
- 无需额外配置

## 故障排除

### 问题：部署后 API 返回 404

**原因：** 路由配置错误

**解决：**
1. 检查 `vercel.json` 路由配置
2. 确保 API 函数在 `api/` 目录
3. 重新部署

### 问题：环境变量未在函数中生效

**原因：** 环境变量未应用

**解决：**
1. 在 Vercel 中确认变量已保存
2. 重新触发部署（点击 "Redeploy")
3. 不是简单的重新启动

### 问题：API 请求超时

**原因：**
1. AI API 服务缓慢
2. 网络问题
3. 请求内容过大

**解决：**
1. 检查 API 密钥有效性
2. 减少请求内容
3. 增加超时时间

### 问题：CORS 错误

**原因：** 跨域请求被阻止

**解决：** 
- 后端已配置 CORS 头
- 如仍有问题，检查 `api/process.ts` 中的 CORS 配置

## 升级和维护

### Q: 如何更新应用？

A: 简单的 Git 工作流：

```bash
# 1. 在本地修改代码
git commit -m "your changes"

# 2. 推送到 GitHub
git push

# 3. Vercel 自动检测并部署
# 完成！
```

### Q: 如何回滚部署？

A: 在 Vercel 仪表板：

1. 项目 → Deployments
2. 找到之前的部署
3. 点击"三个点" → "Promote to Production"

### Q: 如何禁用某次部署？

A: 在 Vercel 仪表板：

1. Deployments 列表
2. 点击部署"三个点"
3. 选择相应操作

## 与客户端的关系

### Q: 客户端如何知道使用哪个 API？

A: 自动检测：

```typescript
const apiBaseUrl = window.location.origin  // 自动使用当前域名
const endpoint = `${apiBaseUrl}/api/process`
```

### Q: 客户端可以直接调用 AI API 吗？

A: **可以**（如需要），但**不推荐**：
- 暴露 API 密钥
- CORS 问题多
- 无法控制

### Q: 如何切换到直接调用模式？

A: 修改 `src/services/ai-api.ts`：

```typescript
// 改为直接调用
const response = await axios.post(API_ENDPOINTS.OPENAI, ...)
```

但**强烈不推荐**。

## 联系和支持

### Q: 遇到问题如何获得帮助？

A: 

1. **查看文档**
   - VERCEL_DEPLOYMENT.md
   - BACKEND_ARCHITECTURE.md
   - 本文档

2. **检查日志**
   - Vercel 仪表板 Logs
   - 浏览器开发者工具 Console

3. **提交 Issue**
   - GitHub Issues
   - 提供详细错误信息和日志

### Q: 可以自定义后端吗？

A: **可以**，这是开源项目：

1. Fork 项目
2. 修改 `api/` 下的函数
3. 自己部署到 Vercel
4. 或提交 PR 贡献改进

### Q: 支持商业使用吗？

A: **是的**：
- MIT License - 完全自由
- 可用于商业项目
- 修改并重新分发
- 无需署名（但欢迎）

---

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Functions 指南](https://vercel.com/docs/serverless-functions/introduction)
- [项目部署指南](VERCEL_DEPLOYMENT.md)
- [后端架构说明](BACKEND_ARCHITECTURE.md)
- [API 文档](API.md)

---

更新时间：2024年11月12日

有任何问题欢迎提交 Issue 或讨论！

# Vercel 部署清单

## 预部署检查清单

### 代码准备 ✅

- [x] 所有代码已提交到 Git
- [x] 没有未跟踪的关键文件
- [x] TypeScript 类型检查通过
- [x] ESLint 检查通过
- [x] 没有 console.error 或 debugger 语句（生产）

### 配置准备 ✅

- [x] vercel.json 已配置
- [x] package.json 依赖完整
- [x] tsconfig.json 设置正确
- [x] vite.config.ts 构建配置完善
- [x] .env.production 已创建
- [x] .vercelignore 已配置

### 环境准备 ✅

- [x] GitHub 账户已创建
- [x] 代码已推送到 GitHub
- [x] 项目仓库为公开（或您有访问权限）
- [x] 获取了所有 API 密钥

### 文档准备 ✅

- [x] README.md 已更新
- [x] QUICKSTART.md 已创建
- [x] VERCEL_DEPLOYMENT.md 已创建
- [x] API.md 已完成
- [x] BACKEND_ARCHITECTURE.md 已完成
- [x] BACKEND_FAQ.md 已完成

## Vercel 部署步骤

### 步骤 1: 登录/注册 Vercel

```
网址: https://vercel.com
操作:
1. 点击 "Sign Up" 或 "Log In"
2. 使用 GitHub 账户登录（推荐）
3. 授予 Vercel 访问权限
```

**预计时间:** 2 分钟

### 步骤 2: 导入项目

```
操作:
1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 输入项目 URL：
   https://github.com/YOUR_USERNAME/h5-ai-writer
4. 点击 "Import"
```

**预计时间:** 1 分钟

### 步骤 3: 配置项目

```
界面显示构建配置：

框架: Vite (自动检测)
根目录: ./ (默认)
构建命令: npm run build (自动检测)
输出目录: dist (自动检测)
```

**检查项:**
- [x] 框架正确识别为 Vite
- [x] 构建命令正确
- [x] 输出目录正确

**预计时间:** 1 分钟

### 步骤 4: 添加环境变量

```
操作:
1. 滚动到 "Environment Variables" 部分
2. 添加以下变量（可选）：

   OPENAI_API_KEY
   值: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   GEMINI_API_KEY
   值: AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   
   DEEPSEEK_API_KEY
   值: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

3. 如果没有所有密钥，只添加已有的
4. 可以稍后在项目设置中添加更多
```

**注意:**
- ✅ 密钥将被加密存储
- ✅ 构建时会自动注入
- ✅ 日志中不会显示密钥值

**预计时间:** 2 分钟

### 步骤 5: 部署

```
操作:
1. 点击 "Deploy" 按钮
2. 等待部署完成（进度条）

可能显示的阶段:
- Preparing build (10秒)
- Cloning repository (5秒)
- Installing dependencies (10-30秒)
- Building application (10-20秒)
- Deploying serverless functions (10秒)
- Creating images (5秒)
- Publishing build (5秒)
```

**预计总时间:** 2-5 分钟

**成功标志:**
```
✅ All checks passed
🎉 Congratulations! 
Your project is deployed at: https://h5-ai-writer-xxx.vercel.app
```

## 部署后验证

### 功能测试

#### 1. 前端加载 ✅

```bash
# 访问应用
https://h5-ai-writer-xxx.vercel.app

# 应该看到:
✅ H5 AI Writer 首页
✅ API 密钥配置界面
✅ 所有样式正确加载
✅ 没有控制台错误
```

#### 2. API 端点测试 ✅

```bash
# 健康检查
curl https://h5-ai-writer-xxx.vercel.app/api/health

# 预期响应:
{
  "status": "ok",
  "timestamp": "2024-11-12T12:00:00Z",
  "service": "H5 AI Writer API",
  "version": "1.0.0"
}
```

```bash
# 获取提供商列表
curl https://h5-ai-writer-xxx.vercel.app/api/providers

# 预期响应:
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "description": "GPT-3.5 Turbo",
      "url": "https://platform.openai.com/api-keys",
      "status": "active"
    },
    ...
  ]
}
```

#### 3. 功能测试 ✅

```
步骤:
1. 打开应用
2. 输入一个 AI API 密钥（测试用）
3. 选择 AI 提供商
4. 点击"开始使用"
5. 创建新文档
6. 输入测试文本
7. 点击"扩写"或"润色"
8. 检查是否返回结果

预期:
✅ 配置保存成功
✅ 文档创建成功
✅ API 请求成功
✅ 结果正确返回
✅ 没有错误消息
```

### 监控检查

#### 1. Vercel 仪表板

```
访问: https://vercel.com/dashboard
检查项:
- [x] 部署状态: Success ✅
- [x] 最后部署时间正确
- [x] 没有构建失败警告
```

#### 2. 日志检查

```
操作:
1. 点击最新部署
2. 查看 "Logs" 选项卡

检查:
- [x] 构建成功
- [x] 没有构建错误
- [x] 函数已部署
- [x] 没有运行时错误
```

#### 3. 分析检查

```
操作:
1. 项目 → Analytics

检查:
- [x] 请求被正确记录
- [x] 响应时间合理
- [x] 没有 5xx 错误
```

## 自定义域名（可选）

### 配置自定义域名

```
操作:
1. 项目 → Settings → Domains
2. 输入您的域名（例如：ai-writer.com）
3. 按照指示配置 DNS：
   - 类型: CNAME
   - 名称: ai-writer
   - 值: cname.vercel.app
4. 保存并等待 DNS 传播（5-48 小时）

完成后:
✅ https://ai-writer.com 正常工作
✅ 自动 SSL 证书
✅ 请求自动重定向
```

**预计时间:** 5 分钟配置 + 5-48 小时 DNS 传播

## 环境管理

### 添加/更新环境变量

```
如果需要添加或更新 API 密钥:

1. 项目 → Settings → Environment Variables
2. 点击"编辑" (如果已存在) 或添加新的
3. 更新值
4. 保存
5. 重新部署:
   - Deployments → 最新部署 → 三个点 → "Redeploy"
```

### 按环境区分变量

```
Vercel 支持不同环境的变量:

生产 (Production):
- OPENAI_API_KEY = 生产密钥

预览 (Preview):
- OPENAI_API_KEY = 测试密钥

开发 (Development):
- 不需要配置（使用 .env.local）
```

## 常见问题排查

### 部署失败

**症状:** 红色 ✗ 标记，部署失败

**解决步骤:**

1. 查看构建日志
   ```
   点击部署 → 查看日志 → 查找红色错误
   ```

2. 常见错误及解决:

   **错误:** `npm ERR! code ERESOLVE`
   - 原因: 依赖冲突
   - 解决: 本地运行 `npm install` 后重新推送

   **错误:** `Command "npm run build" exited with 1`
   - 原因: 构建错误
   - 解决: 本地运行 `npm run build` 调试

   **错误:** `No such file or directory`
   - 原因: 文件缺失
   - 解决: 检查文件是否已 git add

### 应用无法加载

**症状:** 白屏或 404

**排查:**

1. 检查部署是否成功
   ```
   仪表板 → Deployments → 查看状态
   ```

2. 检查浏览器控制台错误
   ```
   F12 → Console → 查找错误
   ```

3. 检查 API 端点
   ```
   访问: https://your-domain.vercel.app/api/health
   应该返回 JSON 响应
   ```

### API 请求失败

**症状:** 错误消息 "无法连接到 API 服务"

**排查:**

1. 检查 API 端点可访问性
   ```bash
   curl https://your-domain.vercel.app/api/health -v
   ```

2. 检查函数是否部署
   ```
   仪表板 → Functions → 查看 process 函数
   ```

3. 检查环境变量是否设置
   ```
   Settings → Environment Variables → 确认存在
   ```

4. 检查日志
   ```
   Deployments → Logs → 查找错误
   ```

### CORS 错误

**症状:** 控制台错误 "CORS policy"

**解决:**

- 后端已配置 CORS，应该不会出现
- 如出现，检查 `api/process.ts` 中的 CORS 头
- 或在 vercel.json 中添加 CORS 头

## 性能优化

### 检查性能指标

```
在 Vercel 仪表板:
1. Analytics → Core Web Vitals
2. 检查:
   - LCP (Largest Contentful Paint) < 2.5s ✅
   - FID (First Input Delay) < 100ms ✅
   - CLS (Cumulative Layout Shift) < 0.1 ✅
```

### 优化建议

```
如果性能低于预期:

1. 启用缓存
   - Settings → Caching → 启用

2. 使用 Vercel Pro（可选）
   - 保持 Serverless Functions 温暖
   - 更高的并发限制

3. 添加 CDN 缓存头
   - 在 vercel.json 中配置 headers
```

## 监控和告警

### 设置告警

```
Steps:
1. Settings → Alerts
2. 配置告警规则:
   - 部署失败
   - 错误率 > 5%
   - 响应时间 > 5s

3. 设置通知方式:
   - Email
   - Slack
   - GitHub
   - 其他集成
```

## 后续维护

### 定期检查清单

```
每周:
- [x] 检查部署状态
- [x] 查看错误日志
- [x] 检查性能指标

每月:
- [x] 更新依赖
- [x] 审查成本使用
- [x] 检查安全补丁

定期:
- [x] 运行功能测试
- [x] 备份配置
- [x] 更新文档
```

### 版本管理

```
新功能发布流程:

1. 在本地测试
   npm run build
   npm run dev

2. 提交到 GitHub
   git commit -m "feat: ..."
   git push

3. Vercel 自动部署
   自动构建、测试、部署

4. 验证生产环境
   测试所有功能
   检查性能指标
```

## 回滚流程

### 快速回滚

```
如果新部署出现问题:

1. 项目 → Deployments
2. 找到之前的稳定部署
3. 点击三个点
4. 选择 "Promote to Production"
5. 确认

应该在 < 1 分钟内回滚
```

## 成功标准

当以下所有项都打上 ✅ 时，部署成功：

### 技术层面
- [x] 前端加载无错误
- [x] API 端点返回正确响应
- [x] 环境变量正确配置
- [x] HTTPS 正常工作
- [x] CDN 缓存生效

### 功能层面
- [x] 配置 API 密钥成功
- [x] 文档创建/编辑成功
- [x] 内容扩写成功
- [x] 内容润色成功
- [x] 错误处理正常

### 性能层面
- [x] 首屏加载 < 2.5s
- [x] API 响应 < 1s（正常）
- [x] 没有 5xx 错误
- [x] 内存使用正常
- [x] 并发能力足够

### 监控层面
- [x] 日志记录正常
- [x] 告警已配置
- [x] 分析数据收集
- [x] 可以追踪错误
- [x] 性能指标可见

## 获取帮助

### 文档资源

- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - 详细部署指南
- [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) - 后端架构说明
- [BACKEND_FAQ.md](BACKEND_FAQ.md) - 常见问题解答
- [README.md](README.md) - 项目概述

### 外部资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Functions 指南](https://vercel.com/docs/serverless-functions/introduction)
- [TypeScript + Vercel](https://vercel.com/docs/serverless-functions/edge-middleware/frameworks/typescript)

### 寻求支持

- GitHub Issues: 提交问题
- Vercel Support: Vercel 仪表板中联系
- 社区: 开源社区讨论

---

**部署检查完成时间:** 5-15 分钟

**首次部署后验证时间:** 10-20 分钟

**总预计时间:** 20-40 分钟从注册到完全就绪

**祝贺！🎉** 完成所有步骤后，您的 H5 AI Writer 就已准备好投入生产！

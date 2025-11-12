# 部署指南

本文档说明如何部署 H5 AI Writer 应用。

## 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`

## 生产构建

### 1. 构建应用

```bash
npm run build
```

构建输出将生成在 `dist/` 目录中。

### 2. 部署选项

#### 选项 A: GitHub Pages

```bash
# 构建应用
npm run build

# 推送 dist 目录到 GitHub Pages
# 设置仓库的 Settings > Pages > Source 为 dist 分支
```

#### 选项 B: Vercel

1. 连接 GitHub 仓库到 Vercel
2. Vercel 将自动检测 Vite 项目
3. 点击部署

#### 选项 C: Netlify

1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令为 `npm run build`
3. 设置发布目录为 `dist`
4. 点击部署

#### 选项 D: 自托管

```bash
# 构建应用
npm run build

# 使用任何静态文件服务器
# 例如: Python http.server
cd dist
python -m http.server 8000

# 或使用 Node.js
npx http-server dist
```

#### 选项 E: Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
RUN npm install -g http-server

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["http-server", "dist", "-p", "8080"]
```

构建和运行:

```bash
docker build -t h5-ai-writer .
docker run -p 8080:8080 h5-ai-writer
```

## 环境配置

创建 `.env.production` 文件（如需要）:

```env
VITE_API_URL=https://your-api-domain.com
```

## 性能优化

- 应用已使用 Vite 进行优化
- CSS 和 JavaScript 已最小化
- 建议使用 CDN 分发静态资源

## HTTPS

对于生产环境，强烈建议使用 HTTPS:

- GitHub Pages: 自动支持
- Vercel: 自动支持
- Netlify: 自动支持
- 自托管: 使用 Let's Encrypt 配置

## 监控和日志

应用的所有数据都存储在本地浏览器中，服务器无法访问用户数据。

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 故障排除

### 样式加载失败

确保 `dist/` 目录中包含 CSS 文件。

### API 请求失败

- 检查 API 密钥是否有效
- 检查网络连接
- 检查浏览器控制台的 CORS 错误

### 应用无法加载

确保正确配置了基础路径（如果部署在子目录中）。

在 `vite.config.ts` 中设置:

```typescript
export default defineConfig({
  base: '/your-subdirectory/',
  // ...
})
```

## 备份和恢复

用户可以导出他们的数据:

```javascript
// 在浏览器控制台中
localStorage.getItem('h5_ai_writer_config')
localStorage.getItem('h5_ai_writer_documents')
```

## 更新部署

1. 提交代码更改到 GitHub
2. 自动部署将触发（对于 Vercel/Netlify）
3. 应用将在几分钟内更新

## CDN 集成

为了提高全球访问速度，可以配置 CDN:

1. 使用 CloudFlare 等 CDN 服务
2. 指向您的托管服务器
3. 启用缓存优化

## 备份策略

建议定期备份源代码仓库。用户数据存储在本地浏览器中，无需服务器备份。

---

有任何部署问题，请提交 Issue。

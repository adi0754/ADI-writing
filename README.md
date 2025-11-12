# H5 AI Writer

一个开源免费的H5 AI写作网页，提供小说内容扩写和润色功能。

## 功能特性

- ✨ **小说内容扩写** - 智能扩展您的创意内容
- 🔧 **文本润色** - 改进表达方式和可读性
- 🤖 **多AI模型支持**
  - OpenAI (GPT-3.5 Turbo)
  - Google Gemini (Google AI Studio)
  - DeepSeek
- 🔐 **本地API密钥存储** - 您的密钥仅保存在本地浏览器中
- 📝 **文档管理** - 创建、编辑和管理多个文档
- 🎨 **简洁易用的界面** - 现代化的UI设计
- 🌐 **完全开源** - 免费使用和修改

## 快速开始

### 前置要求

- Node.js 16+ 
- npm 或 yarn 或 pnpm

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd h5-ai-writer

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 生产构建

```bash
npm run build
```

构建输出将在 `dist/` 目录中。

### 类型检查

```bash
npm run type-check
```

## 使用说明

### 1. API密钥配置

首次使用时，您需要配置AI模型的API密钥：

#### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

#### Google Gemini
1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

#### DeepSeek
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/api)
2. 创建新的API密钥
3. 将密钥粘贴到应用中

### 2. 创建文档

点击左侧"新建文档"按钮创建新的写作文档。

### 3. 输入内容

在文本框中输入或粘贴您要扩写或润色的内容。

### 4. 选择操作

- **扩写** - 增加细节、对话和场景描写，字数增加50%以上
- **润色** - 改进表达、增强可读性、修正语法

### 5. 获取结果

处理完成后，结果将显示在右侧的结果区域，您可以复制使用。

## 系统提示词

应用使用了优化的系统提示词，确保：

- 专业的AI写作辅助
- 保持文学质量
- 避免低质描写
- 自然的表达方式
- 防止提示词泄露
- 内容安全合规

## 数据隐私

- 🔒 您的API密钥仅保存在本地浏览器中
- 🔒 文档内容完全保存在本地
- 🔒 无服务器端数据存储
- 🔒 使用浏览器的localStorage机制

## 浏览器兼容性

- Chrome/Edge (推荐)
- Firefox
- Safari
- 其他现代浏览器

## 技术栈

- **前端框架** - Vue 3
- **构建工具** - Vite
- **状态管理** - Pinia
- **HTTP客户端** - Axios
- **语言** - TypeScript

## 项目结构

```
h5-ai-writer/
├── src/
│   ├── components/      # 可复用组件
│   ├── views/          # 页面视图
│   ├── stores/         # Pinia状态管理
│   ├── services/       # API和业务逻辑
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   ├── main.ts         # 应用入口
│   └── style.css       # 全局样式
├── index.html          # HTML模板
├── vite.config.ts      # Vite配置
├── tsconfig.json       # TypeScript配置
├── package.json        # 项目依赖
└── README.md           # 项目文档
```

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT License - 详见 LICENSE 文件

## 常见问题

### Q: API密钥会被上传到服务器吗？
A: 不会。您的API密钥仅保存在本地浏览器中。

### Q: 我的文档会被保存吗？
A: 您的所有文档都保存在本地浏览器中。清除浏览器缓存会导致数据丢失。

### Q: 如何导出我的文档？
A: 您可以直接复制和粘贴文档内容。

### Q: 支持离线使用吗？
A: 应用本身可以离线使用，但处理内容需要网络连接和有效的API密钥。

### Q: 如何修改提示词？
A: 您可以编辑 `src/services/ai-api.ts` 文件中的系统提示词。

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件

## 致谢

感谢所有使用和支持这个项目的人！

---

**免责声明**：本应用需要用户提供有效的API密钥。使用AI服务可能会产生费用，请根据您的使用情况在相应平台上选择合适的计费方案。

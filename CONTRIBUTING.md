# 贡献指南

感谢对 H5 AI Writer 的兴趣！我们欢迎所有形式的贡献。

## 行为准则

在参与本项目时，我们要求所有贡献者遵守开源社区的基本原则：

- 使用包容性语言
- 尊重不同的观点和经验
- 接受建设性的批评
- 专注于对社区最有益的事情

## 贡献方式

### 报告 Bug

1. 使用描述性标题创建 Issue
2. 提供具体的例子来演示步骤
3. 描述观察到的行为和预期的行为
4. 包含屏幕截图（如果适用）
5. 提供您的操作系统和浏览器信息

### 提交功能请求

1. 使用描述性标题创建 Issue
2. 提供详细的功能描述
3. 列出一些使用场景
4. 附加代码示例（如适用）

### 提交代码更改

1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 代码风格

### TypeScript

- 使用严格模式
- 为所有函数添加类型注解
- 使用有意义的变量名

### Vue 3

- 使用 `<script setup>` 语法
- 保持组件小而专注
- 为所有 props 和 emits 添加类型

### CSS

- 使用 scoped styles
- 遵循 BEM 命名约定（用于可重用组件）
- 使用 CSS 变量处理颜色和尺寸

### 命名约定

- 文件名：使用 kebab-case (e.g., `api-service.ts`)
- 组件名：使用 PascalCase (e.g., `MainEditor.vue`)
- 变量/函数：使用 camelCase (e.g., `processContent()`)
- 常量：使用 UPPER_SNAKE_CASE (e.g., `MAX_TOKENS`)

## 开发工作流

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 运行类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

### 构建生产版本

```bash
npm run build
```

## 提交信息约定

遵循 Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 代码格式更改
- `refactor`: 代码重构
- `perf`: 性能改进
- `test`: 测试相关
- `chore`: 构建工具、依赖等

示例:

```
feat(editor): add auto-save functionality

Implement auto-save feature that saves documents every 30 seconds
to prevent data loss.

Fixes #123
```

## Pull Request 流程

1. 更新 README.md 和其他相关文档
2. 运行 `npm run build` 确保构建成功
3. 运行 `npm run type-check` 确保没有类型错误
4. 运行 `npm run lint` 确保代码风格一致
5. 请求代码审查
6. 等待批准后合并

## 代码审查标准

在审查代码时，我们关注:

- 代码是否易于理解
- 是否遵循项目的编码标准
- 是否有适当的错误处理
- 是否包含测试
- 是否有相关文档

## 项目结构

```
src/
├── components/     # 可重用 UI 组件
├── config/         # 配置和常量
├── router/         # 路由配置
├── services/       # API 和业务逻辑
├── stores/         # Pinia 状态管理
├── types/          # TypeScript 类型定义
├── utils/          # 工具函数
├── views/          # 页面组件
├── App.vue         # 根组件
├── main.ts         # 应用入口
└── style.css       # 全局样式
```

## 开发建议

### 添加新功能

1. 在 `src/types/index.ts` 中添加必要的类型
2. 在 `src/config/constants.ts` 中添加配置
3. 在 `src/services/` 中实现业务逻辑
4. 在 `src/stores/` 中管理状态
5. 在 `src/views/` 或 `src/components/` 中创建 UI

### 修复 Bug

1. 创建一个测试来重现 bug
2. 修复代码
3. 确保测试通过
4. 提交 PR

## 问题和讨论

- 使用 GitHub Issues 报告 bug
- 使用 GitHub Discussions 进行一般讨论
- 在 Pull Request 中进行代码相关讨论

## 许可证

通过贡献此项目，您同意您的贡献将在 MIT 许可证下发布。

## 致谢

感谢您对 H5 AI Writer 的贡献！

---

有任何问题，欢迎提交 Issue 或联系项目维护者。

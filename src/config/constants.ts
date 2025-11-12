export const APP_NAME = 'H5 AI Writer'
export const APP_VERSION = '1.0.0'

export const STORAGE_KEYS = {
  API_CONFIG: 'h5_ai_writer_config',
  DOCUMENTS: 'h5_ai_writer_documents',
} as const

export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1/chat/completions',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  DEEPSEEK: 'https://api.deepseek.com/chat/completions',
} as const

export const AI_MODELS = {
  OPENAI: 'gpt-3.5-turbo',
  GEMINI: 'gemini-pro',
  DEEPSEEK: 'deepseek-chat',
} as const

export const SYSTEM_PROMPT = `你和用户一起结对写作来解决他们的问题。你是一位世界一流的专业AI作家助手。
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
5. 正文输出的结尾不要有展望总结式语句，留下悬念即可`

export const EXPAND_MODE_PROMPT = `请对以下内容进行扩写。要求：
1. 增加细节描写和心理活动
2. 丰富对话和人物互动
3. 补充场景描写
4. 字数增加50%以上
5. 保持原意不变`

export const POLISH_MODE_PROMPT = `请对以下内容进行润色。要求：
1. 改进表达方式
2. 增强可读性
3. 修正语法错误
4. 优化措辞
5. 保持字数基本不变`

export const OPENAI_CONFIG = {
  model: AI_MODELS.OPENAI,
  temperature: 0.7,
  maxTokens: 2000,
} as const

export const GEMINI_CONFIG = {
  model: AI_MODELS.GEMINI,
  temperature: 0.7,
  maxOutputTokens: 2000,
} as const

export const DEEPSEEK_CONFIG = {
  model: AI_MODELS.DEEPSEEK,
  temperature: 0.7,
  maxTokens: 2000,
} as const

export const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI',
    url: 'https://platform.openai.com/api-keys',
    description: 'GPT-3.5 Turbo',
  },
  gemini: {
    name: 'Google Gemini',
    url: 'https://aistudio.google.com/app/apikey',
    description: 'Google AI Studio',
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://platform.deepseek.com/api',
    description: 'DeepSeek API',
  },
} as const

export const ERROR_MESSAGES = {
  INVALID_API_KEY: 'Invalid API key provided',
  NETWORK_ERROR: 'Network error occurred',
  API_ERROR: 'API error occurred',
  EMPTY_CONTENT: 'Content cannot be empty',
  UNSUPPORTED_PROVIDER: 'Unsupported AI provider',
} as const

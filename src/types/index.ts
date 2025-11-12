export type AIProvider = 'openai' | 'gemini' | 'deepseek'
export type ProcessMode = 'expand' | 'polish'

export interface ApiConfig {
  provider: AIProvider
  apiKey: string
}

export interface Document {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface AIRequest {
  provider: AIProvider
  apiKey: string
  content: string
  mode: ProcessMode
}

export interface AIResponse {
  result: string
  provider?: AIProvider
  timestamp?: number
}

export interface ErrorResponse {
  message: string
  code?: string
  provider?: AIProvider
}

import axios from 'axios'
import type { AIProvider, AIRequest, AIResponse } from '../types'
import {
  SYSTEM_PROMPT,
  EXPAND_MODE_PROMPT,
  POLISH_MODE_PROMPT,
  API_ENDPOINTS,
  OPENAI_CONFIG,
  GEMINI_CONFIG,
  DEEPSEEK_CONFIG,
} from '../config/constants'

class AIApiService {
  private openaiClient: any

  async callOpenAI(apiKey: string, content: string, mode: 'expand' | 'polish'): Promise<string> {
    try {
      const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

      const response = await axios.post(
        API_ENDPOINTS.OPENAI,
        {
          model: OPENAI_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: `${modePrompt}\n\n内容：\n${content}`,
            },
          ],
          temperature: OPENAI_CONFIG.temperature,
          max_tokens: OPENAI_CONFIG.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      throw new Error(`OpenAI API 错误: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async callGemini(apiKey: string, content: string, mode: 'expand' | 'polish'): Promise<string> {
    try {
      const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

      const response = await axios.post(
        `${API_ENDPOINTS.GEMINI}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\n${modePrompt}\n\n内容：\n${content}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const candidates = response.data.candidates
      if (candidates && candidates.length > 0) {
        const resultContent = candidates[0].content.parts[0].text
        return resultContent
      }
      throw new Error('No content in response')
    } catch (error) {
      throw new Error(`Gemini API 错误: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async callDeepSeek(apiKey: string, content: string, mode: 'expand' | 'polish'): Promise<string> {
    try {
      const modePrompt = mode === 'expand' ? EXPAND_MODE_PROMPT : POLISH_MODE_PROMPT

      const response = await axios.post(
        API_ENDPOINTS.DEEPSEEK,
        {
          model: DEEPSEEK_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: `${modePrompt}\n\n内容：\n${content}`,
            },
          ],
          temperature: DEEPSEEK_CONFIG.temperature,
          max_tokens: DEEPSEEK_CONFIG.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      throw new Error(`DeepSeek API 错误: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async processContent(request: AIRequest): Promise<AIResponse> {
    let result: string

    switch (request.provider) {
      case 'openai':
        result = await this.callOpenAI(request.apiKey, request.content, request.mode)
        break
      case 'gemini':
        result = await this.callGemini(request.apiKey, request.content, request.mode)
        break
      case 'deepseek':
        result = await this.callDeepSeek(request.apiKey, request.content, request.mode)
        break
      default:
        throw new Error('Unknown AI provider')
    }

    return { result }
  }
}

export const aiApiService = new AIApiService()

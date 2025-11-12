export const validateApiKey = (apiKey: string): boolean => {
  if (!apiKey || typeof apiKey !== 'string') return false
  return apiKey.trim().length > 0
}

export const validateContent = (content: string): boolean => {
  if (!content || typeof content !== 'string') return false
  return content.trim().length > 0
}

export const isValidMode = (mode: string): mode is 'expand' | 'polish' => {
  return mode === 'expand' || mode === 'polish'
}

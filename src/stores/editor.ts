import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Document {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export const useEditorStore = defineStore('editor', () => {
  const documents = ref<Document[]>([])
  const currentDocumentId = ref<string | null>(null)

  const addDocument = (doc: Document) => {
    documents.value.push(doc)
  }

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const doc = documents.value.find(d => d.id === id)
    if (doc) {
      Object.assign(doc, updates, { updatedAt: Date.now() })
    }
  }

  const deleteDocument = (id: string) => {
    documents.value = documents.value.filter(d => d.id !== id)
    if (currentDocumentId.value === id) {
      currentDocumentId.value = null
    }
  }

  const getCurrentDocument = () => {
    if (!currentDocumentId.value) return null
    return documents.value.find(d => d.id === currentDocumentId.value)
  }

  return {
    documents,
    currentDocumentId,
    addDocument,
    updateDocument,
    deleteDocument,
    getCurrentDocument,
  }
})

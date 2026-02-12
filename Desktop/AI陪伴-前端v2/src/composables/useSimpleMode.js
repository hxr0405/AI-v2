import { ref, watch } from 'vue'

const STORAGE_KEY = 'ai-companion-simple-mode'

function load() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const simpleMode = ref(load())

watch(simpleMode, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v ? '1' : '0')
  } catch {}
}, { immediate: false })

export function useSimpleMode() {
  return { simpleMode }
}

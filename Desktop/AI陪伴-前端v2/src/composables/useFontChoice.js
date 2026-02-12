import { ref, watch } from 'vue'

const STORAGE_KEY = 'ai-companion-font'

const FONT_OPTIONS = [
  { value: 'hand', label: '手绘体' },
  { value: 'simple', label: '简洁体' },
  { value: 'serif', label: '衬线体' },
]

function load() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && FONT_OPTIONS.some((o) => o.value === v)) return v
  } catch {}
  return 'hand'
}

const fontChoice = ref(load())

function applyFontToDocument(value) {
  const html = document.documentElement
  html.classList.remove('font-hand', 'font-simple', 'font-serif')
  html.classList.add('font-' + value)
}

watch(fontChoice, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {}
  applyFontToDocument(v)
}, { immediate: true })

export function useFontChoice() {
  return { fontChoice, FONT_OPTIONS }
}

<template>
  <div class="our-world-page dream-bg world-healing">
    <header class="page-header dream-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title dream-title">我们的世界</span>
      <div class="header-right">
        <button type="button" class="add-memory-header-btn" aria-label="记下一则回忆" @click.stop="openAddForm">
          <span class="add-memory-icon">＋</span>
          <span class="add-memory-label">记一笔</span>
        </button>
      </div>
    </header>

    <main class="main safe-bottom">
      <p class="intro">这些是 AI 从对话中提取的回忆瞬间，像真实发生过的故事。</p>
      <div class="cards">
        <article
          v-for="m in memoryList"
          :key="m.id"
          :class="['dream-card', 'dream-card--' + (m.mood || 'mint'), { 'dream-card--new': m.id === lastAddedMemoryId }]"
          @click="openCard(m)"
        >
          <time class="dream-date">{{ m.date }}</time>
          <h3 class="dream-card-title dream-title">{{ m.title }}</h3>
          <p class="dream-content">{{ m.content }}</p>
          <div v-if="m.source && m.source.length" class="dream-source-wrap">
            <span class="dream-source-label">来源对话</span>
            <div class="dream-source-preview">
              <template v-for="(msg, i) in m.source.slice(0, 2)" :key="i">
                <span :class="['dream-source-msg', msg.role]">{{ msg.text }}</span>
              </template>
            </div>
          </div>
        </article>
      </div>
      <div v-if="!memoryList.length" class="empty-dream">
        <p class="dream-title">还没有回忆</p>
        <p>点击右上角 ＋ 写下第一则，或多聊聊天让 AI 为你生成。</p>
      </div>
    </main>

    <!-- 添加回忆：挂到 body，避免被页面容器遮挡 -->
    <Teleport to="body">
      <div v-show="showAddForm" class="world-healing add-form-root" :aria-hidden="!showAddForm">
        <div class="add-form-backdrop" @click="closeAddForm" />
        <div class="add-form-sheet" @click.stop>
          <div class="add-form-handle" />
          <div class="add-form-inner">
            <h3 class="add-form-title">记下一则回忆</h3>
            <form class="add-form-fields" @submit.prevent="submitAddMemory">
              <div class="add-form-field">
                <label for="ourworld-add-date">日期</label>
                <input id="ourworld-add-date" v-model="addForm.date" type="date" class="add-form-input" required />
              </div>
              <div class="add-form-field">
                <label for="ourworld-add-title">标题</label>
                <input id="ourworld-add-title" v-model="addForm.title" type="text" class="add-form-input" placeholder="给这则回忆起个名字" maxlength="30" required />
              </div>
              <div class="add-form-field">
                <label for="ourworld-add-content">内容</label>
                <textarea id="ourworld-add-content" v-model="addForm.content" class="add-form-input add-form-textarea" placeholder="写下那一刻的故事…" rows="4" required />
              </div>
              <div class="add-form-actions">
                <button type="button" class="add-form-btn cancel" @click="closeAddForm">取消</button>
                <button type="submit" class="add-form-btn submit">保存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 圆角插画卡片弹层 -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="world-healing world-modal-backdrop"
        @click.self="closeModal"
      >
        <div class="world-modal-card">
          <div class="world-modal-illustration-wrap">
            <div
              ref="carouselEl"
              class="world-modal-carousel"
              @scroll="onCarouselScroll"
            >
              <div
                v-for="(slide, idx) in imageSlides"
                :key="slide?.id ?? idx"
                class="world-modal-carousel-slide"
              >
                <img
                  v-if="slide?.src"
                  :src="slide.src"
                  :alt="selectedMemory?.title"
                  class="world-modal-illustration"
                  @error="slide.type === 'illustration' ? onIllustrationError(slide) : null"
                >
                <div v-else class="world-modal-illustration world-modal-illustration-placeholder" />
              </div>
            </div>
            <div
              v-if="selectedMemory?.source && selectedMemory.source.length"
              class="world-modal-source-overlay"
            >
              <div class="world-modal-source-label">真实来源 · 聊天记录</div>
              <div class="world-modal-source-list">
                <div
                  v-for="(msg, i) in selectedMemory.source"
                  :key="i"
                  :class="['world-source-msg', msg.role]"
                >
                  <span class="world-source-role">{{ msg.role === 'ai' ? 'TA' : '我' }}</span>
                  <span class="world-source-text">{{ msg.text }}</span>
                </div>
              </div>
            </div>
            <div v-if="imageSlides.length > 1" class="world-modal-carousel-dots">
              <button
                v-for="(_, idx) in imageSlides"
                :key="idx"
                type="button"
                :class="['world-modal-dot', { active: currentSlideIndex === idx }]"
                :aria-label="'第' + (idx + 1) + '张'"
                @click="goToSlide(idx)"
              />
            </div>
            <div class="world-modal-image-actions">
              <input
                ref="uploadInputEl"
                type="file"
                accept="image/*"
                class="world-upload-input"
                @change="onUploadChange"
              >
              <button type="button" class="world-modal-action-link" @click="triggerUpload">上传</button>
              <span v-if="canDeleteCurrentSlide" class="world-modal-action-sep">·</span>
              <button
                v-if="canDeleteCurrentSlide"
                type="button"
                class="world-modal-action-link"
                @click="showDeleteConfirm = true"
              >
                删除
              </button>
            </div>
            <div v-if="showDeleteConfirm" class="world-delete-confirm-backdrop" @click.self="showDeleteConfirm = false">
              <div class="world-delete-confirm-card">
                <p class="world-delete-confirm-text">确定删除这张图片吗？</p>
                <div class="world-delete-confirm-actions">
                  <button type="button" class="world-delete-confirm-btn cancel" @click="showDeleteConfirm = false">取消</button>
                  <button type="button" class="world-delete-confirm-btn confirm" @click="confirmRemoveSlide">确定</button>
                </div>
              </div>
            </div>
          </div>
          <div class="world-modal-body">
            <div class="world-modal-body-content">
              <template v-if="selectedMemory">
                <time class="dream-date">{{ selectedMemory.date }}</time>
                <h3 class="dream-card-title dream-title">{{ selectedMemory.title }}</h3>
                <p class="dream-content">{{ selectedMemory.content }}</p>
              </template>
            </div>
            <div class="world-modal-comments">
              <div
                v-for="(c, i) in cardComments"
                :key="i"
                class="world-comment-item"
              >
                <div class="comment-user-row">
                  <span class="comment-user-label">我</span>
                  <span class="comment-user-text">{{ c.user }}</span>
                </div>
                <div v-if="c.soulTyping" class="soul-row soul-typing">
                  <span class="soul-label">小灵魂</span>
                  <span class="soul-dots"><span></span><span></span><span></span></span>
                </div>
                <div
                  v-else-if="c.soul"
                  class="soul-row soul-reply"
                >
                  <span class="soul-label">小灵魂</span>
                  <p class="soul-text">{{ c.soul }}</p>
                </div>
              </div>
            </div>
            <div class="world-modal-input-wrap">
              <input
                v-model="commentInput"
                class="sketch-input"
                type="text"
                placeholder="写一条评论…"
                @keydown.enter.prevent="submitComment"
              >
              <button class="sketch-btn" @click="submitComment">发送</button>
            </div>
          </div>
          <button class="world-modal-close" aria-label="关闭" @click="closeModal">×</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { memories } from '../data/mock'
import { characterProfiles } from '../data/mock'
import { pickRandomIllustration, illustrationSrc } from '../data/illustrations'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const charName = ref('')
const showModal = ref(false)
const showAddForm = ref(false)
const lastAddedMemoryId = ref(null)

// 用户自己添加的回忆（按角色 id 存储）
const userMemories = ref({})

const MOODS = ['mint', 'peach', 'lavender', 'sky']

const memoryList = computed(() => {
  const cid = id.value
  const base = memories[cid] || []
  const user = userMemories.value[cid] || []
  return [...user, ...base]
})

const addForm = ref({
  date: '',
  title: '',
  content: '',
})
const selectedMemory = ref(null)
const commentInput = ref('')
const cardComments = ref([])
const carouselEl = ref(null)
const uploadInputEl = ref(null)
const currentSlideIndex = ref(0)
const showDeleteConfirm = ref(false)

// 每条回忆固定一张插画（首次打开时随机，之后不变）
const memoryIllustrations = ref({})
// 每条回忆的用户上传图片（data URL）
const memoryUploads = ref({})

const imageSlides = computed(() => {
  if (!selectedMemory.value) return []
  const mid = selectedMemory.value.id
  const list = []
  const fixedFile = memoryIllustrations.value[mid]
  if (fixedFile) {
    list.push({ id: 'ill', src: illustrationSrc(fixedFile), type: 'illustration' })
  }
  const uploads = memoryUploads.value[mid] || []
  uploads.forEach((url, i) => {
    list.push({ id: `upload-${mid}-${i}`, src: url, type: 'upload' })
  })
  if (list.length === 0) list.push({ id: 'placeholder', src: null, type: 'placeholder' })
  return list
})

const canDeleteCurrentSlide = computed(() => {
  const slides = imageSlides.value
  const idx = currentSlideIndex.value
  if (idx < 0 || idx >= slides.length) return false
  const slide = slides[idx]
  return slide?.type === 'illustration' || slide?.type === 'upload'
})

const SOUL_REPLIES = [
  '嗯，我在这里呀。',
  '谢谢你记得这一刻。',
  '能被你想起，就很开心。',
  '这里永远有一份温柔留给你。',
  '小小的光，也会被看见。',
  '你写下的，我都收好了。',
  '今天也要好好过呀。',
]

onMounted(() => {
  const profile = characterProfiles[id.value]
  charName.value = profile?.name || 'TA'
  addForm.value.date = new Date().toISOString().slice(0, 10)
})

watch(showAddForm, (open) => {
  if (open) addForm.value.date = new Date().toISOString().slice(0, 10)
})

function goBack() {
  router.back()
}

function openAddForm() {
  showAddForm.value = true
}
function closeAddForm() {
  showAddForm.value = false
  addForm.value = { date: addForm.value.date, title: '', content: '' }
}

function submitAddMemory() {
  const { date, title, content } = addForm.value
  if (!title?.trim() || !content?.trim()) return
  const cid = id.value
  const newMemory = {
    id: 'user-' + Date.now(),
    date: date || new Date().toISOString().slice(0, 10),
    title: title.trim(),
    content: content.trim(),
    mood: MOODS[Math.floor(Math.random() * MOODS.length)],
    source: [],
  }
  const list = userMemories.value[cid] || []
  userMemories.value = { ...userMemories.value, [cid]: [newMemory, ...list] }
  lastAddedMemoryId.value = newMemory.id
  closeAddForm()
  setTimeout(() => { lastAddedMemoryId.value = null }, 2000)
}

function openCard(memory) {
  selectedMemory.value = memory
  cardComments.value = []
  commentInput.value = ''
  currentSlideIndex.value = 0
  const mid = memory.id
  if (!memoryIllustrations.value[mid]) {
    const file = pickRandomIllustration()
    if (file) memoryIllustrations.value = { ...memoryIllustrations.value, [mid]: file }
  }
  showModal.value = true
  nextTick(() => scrollToSlide(0))
}

function closeModal() {
  showModal.value = false
  selectedMemory.value = null
}

function onIllustrationError(slide) {
  if (slide?.type === 'illustration' && selectedMemory.value) {
    memoryIllustrations.value = { ...memoryIllustrations.value, [selectedMemory.value.id]: null }
  }
}

function onCarouselScroll() {
  const el = carouselEl.value
  if (!el || !imageSlides.value.length) return
  const w = el.offsetWidth
  if (w <= 0) return
  const i = Math.round(el.scrollLeft / w)
  currentSlideIndex.value = Math.min(i, imageSlides.value.length - 1)
}

function goToSlide(idx) {
  currentSlideIndex.value = idx
  scrollToSlide(idx)
}

function scrollToSlide(idx) {
  nextTick(() => {
    const el = carouselEl.value
    if (!el) return
    const w = el.offsetWidth
    el.scrollTo({ left: idx * w, behavior: 'smooth' })
  })
}

function triggerUpload() {
  uploadInputEl.value?.click()
}

function onUploadChange(e) {
  const file = e.target.files?.[0]
  if (!file || !selectedMemory.value) return
  const mid = selectedMemory.value.id
  const reader = new FileReader()
  reader.onload = () => {
    const url = reader.result
    const uploads = memoryUploads.value[mid] || []
    memoryUploads.value = { ...memoryUploads.value, [mid]: [...uploads, url] }
    currentSlideIndex.value = imageSlides.value.length
    nextTick(() => scrollToSlide(currentSlideIndex.value))
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function removeCurrentSlide() {
  if (!selectedMemory.value) return
  const mid = selectedMemory.value.id
  const slides = imageSlides.value
  const idx = currentSlideIndex.value
  if (idx < 0 || idx >= slides.length) return
  const slide = slides[idx]
  if (slide?.type === 'illustration') {
    memoryIllustrations.value = { ...memoryIllustrations.value, [mid]: null }
  } else if (slide?.type === 'upload') {
    const hasIll = slides[0]?.type === 'illustration'
    const uploadIdx = hasIll ? idx - 1 : idx
    const uploads = (memoryUploads.value[mid] || []).filter((_, i) => i !== uploadIdx)
    memoryUploads.value = { ...memoryUploads.value, [mid]: uploads }
  } else return
  const nextIdx = idx > 0 ? idx - 1 : 0
  currentSlideIndex.value = Math.max(0, Math.min(nextIdx, imageSlides.value.length - 1))
  nextTick(() => scrollToSlide(currentSlideIndex.value))
}

function confirmRemoveSlide() {
  showDeleteConfirm.value = false
  removeCurrentSlide()
}

function submitComment() {
  const text = commentInput.value.trim()
  if (!text) return
  cardComments.value.push({ user: text, soul: null, soulTyping: true })
  commentInput.value = ''
  const soul = SOUL_REPLIES[Math.floor(Math.random() * SOUL_REPLIES.length)]
  setTimeout(() => {
    const last = cardComments.value[cardComments.value.length - 1]
    if (last && last.soulTyping) {
      last.soul = soul
      last.soulTyping = false
    }
  }, 600)
}
</script>

<style scoped>
.our-world-page {
  min-height: 100vh;
}
.main {
  padding: 1.25rem;
}
.intro {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}
.header-right {
  flex-shrink: 0;
  min-width: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.add-memory-header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid var(--world-line);
  background: var(--world-2);
  border-radius: 999px;
  color: var(--world-text);
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.add-memory-header-btn:hover {
  background: #d4e8e0;
  border-color: var(--world-text-soft);
  color: var(--world-text);
}
.add-memory-icon {
  font-size: 1.1rem;
  font-weight: 300;
}
.add-memory-label {
  font-weight: 500;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.dream-card {
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.dream-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.dream-card--new {
  animation: card-new 2s ease-out;
}
@keyframes card-new {
  0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.08); }
  50% { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.02); }
  100% { box-shadow: none; }
}
.dream-date {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.dream-card-title {
  font-size: 1.25rem;
  margin-bottom: 0.6rem;
}
.dream-content {
  font-size: 0.95rem;
  line-height: 1.65;
}
.empty-dream {
  text-align: center;
  padding: 3rem 1.5rem;
}
.empty-dream .dream-title {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}

/* 列表卡片上的来源预览 */
.dream-source-wrap {
  margin-top: 0.75rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--world-line);
}
.dream-source-label {
  font-size: 0.75rem;
  color: var(--world-text-soft);
  display: block;
  margin-bottom: 0.35rem;
}
.dream-source-preview {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dream-source-msg {
  font-size: 0.8rem;
  color: var(--world-text-soft);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dream-source-msg.user {
  padding-left: 0.5rem;
  border-left: 2px solid var(--world-2);
}
.dream-source-msg.ai {
  padding-left: 0.5rem;
  border-left: 2px solid var(--world-3);
}

.world-modal-illustration-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--world-2) 0%, var(--world-3) 100%);
}
.world-modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: var(--world-text-soft);
  z-index: 1;
}
.world-modal-card {
  position: relative;
}
</style>

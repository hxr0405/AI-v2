<template>
  <div class="chat-detail-page">
    <header class="page-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title sketch-title">{{ charName }}</span>
      <router-link :to="{ name: 'CharacterProfile', params: { id } }" class="right profile-link" aria-label="角色档案">
        ⋮
      </router-link>
    </header>

    <main class="chat-main">
      <div class="messages">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['bubble', bubbleAlign(msg), { real: msg.source === 'real' }]"
        >
          <div class="bubble-inner sketch-border">
            <span v-if="bubbleLeftLabel(msg)" class="bubble-side-label left">{{ bubbleLeftLabel(msg) }}</span>
            {{ msg.text }}
            <span v-if="bubbleRightLabel(msg)" class="bubble-real-label">{{ bubbleRightLabel(msg) }}</span>
          </div>
        </div>
      </div>
      <p v-if="isRealPerson" class="real-person-hint">你已上线，克隆人暂不代回复；离开本页后对方发来的消息会由克隆人代回。</p>
      <div class="input-bar">
        <input
          v-model="inputText"
          class="sketch-input"
          type="text"
          :placeholder="isRealPerson ? '输入消息（将以真人彩色气泡发送）…' : '写点什么…'"
          @keydown.enter.prevent="send"
        />
        <button class="sketch-btn send-btn primary" @click="send">发送</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { characterProfiles } from '../data/mock'
import { useCloneToken } from '../composables/useCloneToken'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const charName = ref('')
const inputText = ref('')

const {
  realPersonCharacterId,
  getMessages: getMessagesFromStore,
  addMessage: addMessageToStore,
  setRealPersonOnline,
  clearRealPersonOnline,
  isRealPersonOnline,
} = useCloneToken()
const isRealPerson = computed(() => realPersonCharacterId.value === id.value)
const messages = computed(() => getMessagesFromStore(id.value) || [])

/** 视角统一：创建者小A 看时右侧=小A，左侧=小B（克隆+真人同侧）；真人小B 看时右侧=小B（我+我的克隆），左侧=小A */
function bubbleAlign(msg) {
  if (isRealPerson.value) {
    const isMe = msg.role === 'user' && msg.source === 'real'
    const isMyClone = msg.role === 'ai'
    return isMe || isMyClone ? 'user' : ''
  }
  // 创建者视角：只有自己（非真人）在右侧，克隆和真人小B 都在左侧
  const isCreator = msg.role === 'user' && msg.source !== 'real'
  return isCreator ? 'user' : ''
}

function bubbleLeftLabel(msg) {
  if (isRealPerson.value) {
    if (msg.role === 'user' && msg.source !== 'real') return '对方'
    return ''
  }
  // 创建者视角：左侧是对方（小B），区分「克隆」与「真人」
  if (msg.role === 'ai') return '克隆'
  if (msg.role === 'user' && msg.source === 'real') return '真人'
  return ''
}

/** 右侧气泡内小标签 */
function bubbleRightLabel(msg) {
  if (isRealPerson.value) {
    if (msg.role === 'user' && msg.source === 'real') return '我'
    if (msg.role === 'ai') return '我的克隆'
    return ''
  }
  if (msg.role === 'user' && msg.source !== 'real') return '我'
  return ''
}

function applyPrefill() {
  const prefill = route.query.prefill
  if (typeof prefill === 'string') {
    try {
      inputText.value = decodeURIComponent(prefill)
    } catch {
      inputText.value = prefill
    }
    // 去掉 query，避免刷新后再次预填
    router.replace({ name: 'ChatDetail', params: { id: id.value } })
  }
}

onMounted(() => {
  const profile = characterProfiles[id.value]
  charName.value = profile?.name || '角色'
  applyPrefill()
  if (isRealPerson.value) setRealPersonOnline(id.value)
})

onBeforeUnmount(() => {
  if (realPersonCharacterId.value === id.value) clearRealPersonOnline()
})

watch(id, (newId) => {
  if (isRealPerson.value) setRealPersonOnline(newId)
  else clearRealPersonOnline()
})

watch(() => route.query.prefill, () => {
  if (route.name === 'ChatDetail' && route.query.prefill) applyPrefill()
})

function goBack() {
  router.back()
}

function send() {
  const text = inputText.value.trim()
  if (!text) return
  const source = isRealPerson.value ? 'real' : undefined
  addMessageToStore(id.value, { role: 'user', text, source })
  inputText.value = ''
  // 真人上线时不再代回复；仅当真人不在线时由克隆人回复
  const shouldCloneReply = !isRealPersonOnline(id.value)
  if (shouldCloneReply) {
    setTimeout(() => {
      addMessageToStore(id.value, {
        role: 'ai',
        text: '（这里是 AI 的回复，接入后端后会替换为真实对话）',
      })
    }, 600)
  }
}
</script>

<style scoped>
.chat-detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.bubble {
  display: flex;
  width: 100%;
}
.bubble.user {
  justify-content: flex-end;
}
.bubble-inner {
  max-width: 80%;
  padding: 0.75rem 1rem;
  background: var(--sketch-white);
  border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
  font-size: 0.95rem;
}
.bubble.user .bubble-inner {
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  background: var(--sketch-soft);
}
/* 真人消息：彩色气泡，与 AI/创建者区分 */
.bubble.real .bubble-inner {
  background: linear-gradient(135deg, #e8a87c 0%, #c38d6a 100%);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}
.bubble-real-label {
  display: block;
  font-size: 0.7rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}
.bubble-side-label {
  display: block;
  font-size: 0.7rem;
  color: var(--sketch-gray);
  margin-bottom: 0.2rem;
}
.bubble-side-label.left {
  text-align: left;
}
.real-person-hint {
  font-size: 0.85rem;
  color: #c38d6a;
  padding: 0 1rem 0.35rem;
}
.input-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  background: var(--sketch-white);
  border-top: 2px solid var(--sketch-light);
}
.input-bar .sketch-input {
  flex: 1;
}
.send-btn {
  flex-shrink: 0;
}
.profile-link {
  color: var(--sketch-black);
  text-decoration: none;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

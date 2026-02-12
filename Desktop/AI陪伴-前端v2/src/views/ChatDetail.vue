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
          :class="['bubble', msg.role]"
        >
          <div class="bubble-inner sketch-border">{{ msg.text }}</div>
        </div>
      </div>
      <div class="input-bar">
        <input
          v-model="inputText"
          class="sketch-input"
          type="text"
          placeholder="写点什么…"
          @keydown.enter.prevent="send"
        />
        <button class="sketch-btn send-btn primary" @click="send">发送</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chatMessages } from '../data/mock'
import { characterProfiles } from '../data/mock'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const charName = ref('')
const messages = ref([])
const inputText = ref('')

onMounted(() => {
  const list = chatMessages[id.value]
  messages.value = list ? [...list] : []
  const profile = characterProfiles[id.value]
  charName.value = profile?.name || '角色'
})

function goBack() {
  router.back()
}

function send() {
  const text = inputText.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', text })
  inputText.value = ''
  // 模拟回复
  setTimeout(() => {
    messages.value.push({
      role: 'ai',
      text: '（这里是 AI 的回复，接入后端后会替换为真实对话）',
    })
  }, 600)
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

<template>
  <div class="chat-list-page">
    <header class="page-header">
      <span class="title-wrap">
        <Doodles type="star-outline" size="s" class="title-doodle" />
        <span class="title sketch-title">对话</span>
      </span>
      <router-link to="/add-character" class="add-btn sketch-border" aria-label="添加角色">
        <span class="add-icon">+</span>
      </router-link>
    </header>

    <main class="list-wrap safe-bottom">
      <div
        v-for="(char, i) in characterList"
        :key="char.id"
        :class="['chat-item', 'sketch-card', { 'card-soft': i % 2 === 1 }]"
        @click="goChat(char.id)"
      >
        <div class="avatar-wrap">
          <div class="avatar sketch-border">{{ char.name.slice(0, 1) }}</div>
          <span v-if="char.unread" class="badge">{{ char.unread }}</span>
        </div>
        <div class="content">
          <div class="row">
            <span class="name sketch-title">{{ char.name }}</span>
            <span class="time">{{ char.lastTime }}</span>
          </div>
          <p class="last-msg">{{ char.lastMessage }}</p>
        </div>
        <button
          class="profile-btn"
          aria-label="角色档案"
          @click.stop="goProfile(char.id)"
        >
          ⋮
        </button>
      </div>

      <router-link to="/clone-login" class="clone-login-entry sketch-card">
        <span class="clone-login-icon">🎫</span>
        <span class="clone-login-text">使用克隆令牌登录</span>
        <span class="clone-login-arrow">→</span>
      </router-link>

      <div v-if="!characterList.length" class="empty">
        <div class="empty-doodles">
          <Doodles type="star" size="s" />
          <Doodles type="cat" size="l" />
          <Doodles type="star-outline" size="s" />
        </div>
        <p class="sketch-title">还没有角色</p>
        <p class="hint">点击右上角 + 添加你的第一个克隆陪伴</p>
        <router-link to="/add-character" class="sketch-btn primary">去添加</router-link>
      </div>
    </main>

    <nav class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <span class="icon">💬</span>
        <span>对话</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <span class="icon">⚙</span>
        <span>设置</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { characters } from '../data/mock'
import Doodles from '../components/Doodles.vue'

const router = useRouter()
const characterList = ref([])

onMounted(() => {
  characterList.value = [...characters]
})

function goChat(id) {
  router.push({ name: 'ChatDetail', params: { id } })
}

function goProfile(id) {
  router.push({ name: 'CharacterProfile', params: { id } })
}
</script>

<style scoped>
.chat-list-page {
  min-height: 100vh;
  padding-bottom: 4rem;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--sketch-black);
  background: var(--sketch-white);
  font-size: 1.5rem;
  line-height: 1;
}
.empty-doodles {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.title-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.title-doodle {
  opacity: 0.8;
}
.add-icon {
  font-family: var(--font-ui);
}
.list-wrap {
  padding: 1rem;
}
.clone-login-entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  text-decoration: none;
  color: var(--sketch-black);
  transition: transform 0.15s ease;
}
.clone-login-entry:hover {
  transform: translateY(-2px);
}
.clone-login-icon {
  font-size: 1.5rem;
}
.clone-login-text {
  flex: 1;
  font-size: 0.95rem;
}
.clone-login-arrow {
  color: var(--sketch-gray);
}
.chat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.chat-item:hover {
  transform: translateY(-2px);
}
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-hand);
  font-weight: 700;
  font-size: 1.25rem;
  background: var(--sketch-light);
}
.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 4px;
  border-radius: 10px;
  background: var(--sketch-black);
  color: var(--sketch-white);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  flex: 1;
  min-width: 0;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
}
.name {
  font-size: 1.1rem;
}
.time {
  font-size: 0.85rem;
  color: var(--sketch-gray);
}
.last-msg {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-btn {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--sketch-gray);
}
.empty {
  text-align: center;
  padding: 3rem 1.5rem;
}
.empty .sketch-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.hint {
  color: var(--sketch-gray);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.empty .sketch-btn {
  text-decoration: none;
  display: inline-block;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--sketch-white);
  border-top: 2px solid var(--sketch-black);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 20;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-decoration: none;
  color: var(--sketch-gray);
  font-size: 0.8rem;
}
.nav-item .icon {
  font-size: 1.25rem;
}
.nav-item.active {
  color: var(--sketch-black);
  font-weight: 600;
}
</style>

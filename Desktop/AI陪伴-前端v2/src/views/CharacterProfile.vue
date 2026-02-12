<template>
  <div class="profile-page">
    <header class="page-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title sketch-title">角色档案</span>
      <span class="right"></span>
    </header>

    <main v-if="profile" class="main safe-bottom">
      <div class="hero sketch-card">
        <div class="avatar large sketch-border">{{ profile.name.slice(0, 1) }}</div>
        <h1 class="name sketch-title">{{ profile.name }}</h1>
        <p class="meta">创建于 {{ profile.createdAt }}</p>
      </div>

      <section class="block sketch-card">
        <h2 class="block-title sketch-title">档案</h2>
        <dl class="dl">
          <dt>性格</dt>
          <dd>{{ profile.personality }}</dd>
          <dt>爱好</dt>
          <dd>{{ profile.hobbies }}</dd>
          <dt>价值观</dt>
          <dd>{{ profile.values }}</dd>
        </dl>
      </section>

      <section class="block sketch-card">
        <h2 class="block-title sketch-title">我们的关系</h2>
        <p class="relation-summary">{{ profile.relationship.summary }}</p>
        <div class="tags">
          <span v-for="tag in profile.relationship.tags" :key="tag" class="tag sketch-border">{{ tag }}</span>
        </div>
        <p class="relation-desc">{{ profile.relationship.description }}</p>
      </section>

      <section class="block sketch-card entry-world" @click="goOurWorld">
        <h2 class="block-title sketch-title">
          <Doodles type="heart" size="s" /> 我们的世界
        </h2>
        <p class="world-hint">AI 根据聊天生成的回忆卡片，记录那些真实发生过的瞬间。</p>
        <div class="world-entry">
          <span class="dream-preview"><Doodles type="star" size="s" /> {{ profile.memoryCount }} 则回忆</span>
          <span class="arrow">→</span>
        </div>
      </section>

      <div class="actions">
        <router-link :to="{ name: 'ChatDetail', params: { id: profile.id } }" class="sketch-btn full primary">
          去和 {{ profile.name }} 聊天
        </router-link>
      </div>
    </main>

    <div v-else class="loading">加载中…</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { characterProfiles } from '../data/mock'
import Doodles from '../components/Doodles.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const profile = ref(null)

onMounted(() => {
  profile.value = characterProfiles[id.value] || null
})

function goBack() {
  router.back()
}

function goOurWorld() {
  router.push({ name: 'OurWorld', params: { id: id.value } })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}
.main {
  padding: 1.25rem;
}
.hero {
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
}
.avatar.large {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-hand);
  font-weight: 700;
  font-size: 2rem;
  background: var(--sketch-light);
  margin-bottom: 0.75rem;
}
.hero .name {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}
.meta {
  font-size: 0.9rem;
  color: var(--sketch-gray);
}
.block {
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}
.block-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--sketch-light);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.dl {
  display: grid;
  gap: 0.75rem;
}
.dl dt {
  font-size: 0.85rem;
  color: var(--sketch-gray);
}
.dl dd {
  margin: 0;
  font-size: 0.95rem;
}
.relation-summary {
  font-family: var(--font-hand);
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tag {
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  background: var(--sketch-white);
  border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
}
.relation-desc {
  font-size: 0.95rem;
  color: var(--sketch-gray);
  line-height: 1.6;
}
.entry-world {
  cursor: pointer;
  transition: transform 0.15s ease;
}
.entry-world:hover {
  transform: translateY(-2px);
}
.world-hint {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 1rem;
}
.world-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--sketch-soft);
  border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
  border: 1px solid var(--sketch-border);
}
.dream-preview {
  font-family: var(--font-hand);
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.arrow {
  color: var(--sketch-gray);
}
.actions {
  margin-top: 1.5rem;
}
.full {
  width: 100%;
  text-align: center;
  text-decoration: none;
  display: block;
}
.loading {
  padding: 3rem;
  text-align: center;
  color: var(--sketch-gray);
}
</style>

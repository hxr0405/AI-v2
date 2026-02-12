<template>
  <div class="settings-page">
    <header class="page-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title sketch-title">设置</span>
      <span class="right"></span>
    </header>

    <main class="main safe-bottom">
      <section class="block sketch-card">
        <h2 class="block-title sketch-title">关于</h2>
        <p class="about-text">
          这是一个虚拟的、由想象构筑的聊天世界。所有角色基于你提供的信息或聊天记录生成，用于陪伴与倾诉。
        </p>
        <p class="about-doodle">你值得被温柔以待 ♡</p>
      </section>

      <section class="block sketch-card">
        <h2 class="block-title sketch-title">偏好</h2>
        <div class="setting-row">
          <span>消息通知</span>
          <label class="toggle">
            <input v-model="notify" type="checkbox" />
            <span class="slider sketch-border"></span>
          </label>
        </div>
        <div class="setting-row">
          <span>简洁模式（温柔干净风格）</span>
          <label class="toggle">
            <input v-model="simpleMode" type="checkbox" />
            <span class="slider sketch-border"></span>
          </label>
        </div>
        <div class="setting-row setting-row--font">
          <span>字体</span>
          <select v-model="fontChoice" class="font-select sketch-input">
            <option v-for="opt in FONT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </section>

      <section class="block sketch-card">
        <h2 class="block-title sketch-title">数据</h2>
        <button class="text-btn">导出对话与回忆</button>
        <button class="text-btn">清除本地缓存</button>
      </section>

      <footer class="footer">
        <p>AI 克隆陪伴 · 手绘虚拟世界</p>
        <p class="version">v1.0.0</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleMode } from '../composables/useSimpleMode'
import { useFontChoice } from '../composables/useFontChoice'

const router = useRouter()
const { simpleMode } = useSimpleMode()
const { fontChoice, FONT_OPTIONS } = useFontChoice()
const notify = ref(true)

function goBack() {
  router.back()
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
}
.main {
  padding: 1.25rem;
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
}
.about-text {
  font-size: 0.95rem;
  color: var(--sketch-gray);
  line-height: 1.6;
}
.about-doodle {
  margin-top: 1rem;
  font-family: var(--font-hand);
  font-size: 1.1rem;
  color: var(--sketch-gray);
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--sketch-light);
}
.setting-row:last-child {
  border-bottom: none;
}
.setting-row--font {
  align-items: center;
  gap: 1rem;
}
.font-select {
  width: auto;
  min-width: 8rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
}
.toggle {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.25rem;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sketch-white);
  border-radius: 1.25rem;
  transition: 0.2s;
}
.slider::before {
  content: '';
  position: absolute;
  height: 1rem;
  width: 1rem;
  left: 2px;
  bottom: 2px;
  background: var(--sketch-black);
  border-radius: 50%;
  transition: 0.2s;
}
.toggle input:checked + .slider::before {
  transform: translateX(1.25rem);
}
.text-btn {
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background: none;
  font-family: var(--font-ui);
  font-size: 0.95rem;
  color: var(--sketch-gray);
  cursor: pointer;
  text-align: left;
}
.text-btn:hover {
  color: var(--sketch-black);
}
.footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--sketch-gray);
  font-size: 0.9rem;
}
.version {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}
</style>

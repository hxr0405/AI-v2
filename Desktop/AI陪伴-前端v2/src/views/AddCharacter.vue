<template>
  <div class="add-character-page">
    <header class="page-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title sketch-title">添加角色</span>
      <span class="right"></span>
    </header>

    <main class="main safe-bottom">
      <div class="tabs sketch-border">
        <button
          :class="['tab', { active: mode === 'upload' }]"
          @click="mode = 'upload'"
        >
          上传聊天记录
        </button>
        <button
          :class="['tab', { active: mode === 'manual' }]"
          @click="mode = 'manual'"
        >
          手动创建
        </button>
      </div>

      <!-- 上传模式 -->
      <section v-show="mode === 'upload'" class="section">
        <p class="hint">上传多张聊天记录截图或导出文件，AI 将自动分析并克隆该角色。</p>
        <div class="upload-zone sketch-card" @click="triggerUpload">
          <input
            ref="fileInput"
            type="file"
            accept="image/*,.txt,.json"
            multiple
            class="hidden"
            @change="onFileChange"
          />
          <span class="upload-icon">📎</span>
          <span>点击或拖拽文件到此处</span>
          <span class="upload-tip">支持图片、txt、json</span>
        </div>
        <div v-if="files.length" class="file-list">
          <div v-for="(f, i) in files" :key="i" class="file-tag sketch-border">
            {{ f.name }}
            <button type="button" class="remove" @click.stop="removeFile(i)">×</button>
          </div>
        </div>
      </section>

      <!-- 手动创建模式 -->
      <section v-show="mode === 'manual'" class="section">
        <div class="field">
          <label>角色名称</label>
          <input v-model="form.name" class="sketch-input" type="text" placeholder="例如：小橘" />
        </div>
        <div class="field">
          <label>性格简述</label>
          <textarea
            v-model="form.personality"
            class="sketch-input"
            rows="3"
            placeholder="温和、念旧、喜欢小确幸…"
          />
        </div>
        <div class="field">
          <label>爱好</label>
          <input v-model="form.hobbies" class="sketch-input" type="text" placeholder="看书、散步、拍照…" />
        </div>
        <div class="field">
          <label>价值观 / 信念（选填）</label>
          <textarea
            v-model="form.values"
            class="sketch-input"
            rows="2"
            placeholder="相信陪伴与时间…"
          />
        </div>
      </section>

      <div class="actions">
        <button class="sketch-btn full primary" @click="submit">
          {{ mode === 'upload' ? '开始克隆' : '创建角色' }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const mode = ref('upload')
const files = ref([])
const form = reactive({
  name: '',
  personality: '',
  hobbies: '',
  values: '',
})

function goBack() {
  router.back()
}

function triggerUpload() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const list = e.target.files
  if (!list?.length) return
  for (let i = 0; i < list.length; i++) {
    files.value.push(list[i])
  }
  e.target.value = ''
}

function removeFile(i) {
  files.value.splice(i, 1)
}

function submit() {
  if (mode.value === 'upload') {
    if (!files.value.length) {
      alert('请先上传至少一份聊天记录')
      return
    }
    // 模拟创建成功，跳转到聊天列表（实际应等后端返回新角色 id）
    alert('正在分析聊天记录并克隆角色…（演示中直接返回）')
    router.push('/')
    return
  }
  if (!form.name.trim()) {
    alert('请填写角色名称')
    return
  }
  alert('角色已创建（演示）')
  router.push('/')
}
</script>

<style scoped>
.add-character-page {
  min-height: 100vh;
}
.main {
  padding: 1.25rem;
}
.tabs {
  display: flex;
  background: var(--sketch-white);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  padding: 4px;
  margin-bottom: 1.5rem;
}
.tab {
  flex: 1;
  padding: 0.6em 1em;
  border: none;
  background: transparent;
  font-family: var(--font-ui);
  cursor: pointer;
  border-radius: inherit;
  transition: background 0.2s;
}
.tab.active {
  background: var(--sketch-black);
  color: var(--sketch-white);
}
.section {
  margin-bottom: 1.5rem;
}
.hint {
  color: var(--sketch-gray);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.upload-zone {
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  border-style: dashed;
}
.upload-zone:hover {
  background: var(--sketch-soft);
  border-color: var(--sketch-mid);
}
.upload-zone .upload-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.upload-tip {
  display: block;
  font-size: 0.85rem;
  color: var(--sketch-gray);
  margin-top: 0.5rem;
}
.hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
.file-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  background: var(--sketch-white);
  font-size: 0.85rem;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-tag .remove {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
}
.field {
  margin-bottom: 1.25rem;
}
.field label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  color: var(--sketch-gray);
}
.field .sketch-input {
  resize: vertical;
}
.actions {
  margin-top: 2rem;
}
.full {
  width: 100%;
}
</style>

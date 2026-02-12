<template>
  <div class="clone-login-page">
    <header class="page-header">
      <button class="back" aria-label="返回" @click="goBack">←</button>
      <span class="title sketch-title">克隆令牌登录</span>
      <span class="right"></span>
    </header>

    <main class="main safe-bottom">
      <p class="hint">被克隆的真人用户可凭创建者分享的令牌登录，查看对话与档案，并以彩色气泡/备注与 TA 互动。</p>
      <div class="block sketch-card">
        <label for="token-input" class="block-label">请输入克隆令牌</label>
        <input
          id="token-input"
          v-model="tokenInput"
          type="text"
          class="sketch-input token-input"
          placeholder="例如：8A7B9C6D"
          maxlength="12"
          @keydown.enter.prevent="verify"
        />
        <p v-if="tip" :class="['tip', tipSuccess ? 'tip-ok' : 'tip-err']">{{ tip }}</p>
        <button type="button" class="sketch-btn full primary verify-btn" @click="verify">
          验证并登录角色账号
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCloneToken } from '../composables/useCloneToken'

const router = useRouter()
const { verifyToken } = useCloneToken()
const tokenInput = ref('')
const tip = ref('')
const tipSuccess = ref(false)

function goBack() {
  router.back()
}

function verify() {
  const characterId = verifyToken(tokenInput.value)
  if (!characterId) {
    tip.value = '令牌无效或已过期，请重新获取'
    tipSuccess.value = false
    return
  }
  tip.value = '验证成功！正在进入…'
  tipSuccess.value = true
  setTimeout(() => {
    router.replace({ name: 'ChatDetail', params: { id: characterId } })
  }, 400)
}
</script>

<style scoped>
.clone-login-page {
  min-height: 100vh;
  background: var(--sketch-paper);
}
.main {
  padding: 1.25rem;
}
.hint {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.block {
  padding: 1.25rem;
}
.block-label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.token-input {
  width: 100%;
  margin-bottom: 0.75rem;
}
.tip {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.tip-ok {
  color: #2d6a2d;
}
.tip-err {
  color: #a52a2a;
}
.verify-btn {
  margin-top: 0.5rem;
}
</style>

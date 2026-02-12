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

      <!-- 真人身份提示 + 退出 -->
      <section v-if="isRealPerson" class="block real-person-banner sketch-card">
        <p class="real-person-label">你正在以真人身份查看此档案</p>
        <p class="real-person-desc">可补充/纠正 AI 提取的信息，你的备注会以彩色显示。</p>
        <button type="button" class="sketch-btn real-person-exit" @click="exitRealPerson">退出真人账号</button>
      </section>

      <!-- 创建者：分享克隆令牌 -->
      <section v-if="!isRealPerson && profile" class="block sketch-card clone-token-block">
        <h2 class="block-title sketch-title">分享给真人（克隆令牌）</h2>
        <p class="profile-row hint">生成令牌后分享给被克隆的真人，对方可凭令牌登录查看对话与档案，并以彩色气泡/备注互动。</p>
        <template v-if="cloneTokenData?.token">
          <div class="token-box sketch-border">
            <span class="token-value">{{ cloneTokenData.token }}</span>
          </div>
          <div class="token-actions">
            <button type="button" class="sketch-btn" @click="copyToken">复制令牌</button>
            <button type="button" class="sketch-btn" @click="revokeTokenConfirm">撤销令牌</button>
          </div>
          <p class="token-meta">有效期 7 天 · 分享方式：复制令牌或截图</p>
        </template>
        <template v-else>
          <button type="button" class="sketch-btn primary full" @click="generateToken">生成克隆令牌</button>
        </template>
      </section>

      <!-- 1. 表层人设卡 -->
      <section v-if="profile.persona" class="block sketch-card">
        <h2 class="block-title sketch-title">表层人设卡</h2>
        <p class="profile-row"><strong>人设外号：</strong>{{ profile.persona.nickname }}</p>
        <div class="tag-list">
          <span v-for="tag in profile.persona.tags" :key="tag" class="tag sketch-border">{{ tag }}</span>
        </div>
        <p class="profile-row"><strong>说话语气：</strong>{{ profile.persona.tone }}</p>
        <p class="profile-row"><strong>口头禅：</strong>「{{ profile.persona.catchphrase }}」</p>
        <div class="contrast-wrap">
          <div class="contrast-item sketch-border">
            <strong>在你面前：</strong><br>{{ profile.persona.contrastWithYou }}
          </div>
          <div class="contrast-item sketch-border">
            <strong>别人眼里：</strong><br>{{ profile.persona.contrastWithOthers }}
          </div>
        </div>
        <template v-if="isRealPerson">
          <div v-if="getProfileNote(id, 'persona')" class="real-note-block">{{ getProfileNote(id, 'persona') }}</div>
          <div class="real-note-edit">
            <textarea v-model="noteDraft.persona" class="sketch-input real-note-input" placeholder="补充或纠正上述 AI 提取的信息（真人备注）" rows="2" />
            <button type="button" class="sketch-btn" @click="saveNote('persona')">保存备注</button>
          </div>
        </template>
      </section>

      <!-- 2. 生活行为侧写 -->
      <section v-if="profile.behavior" class="block sketch-card">
        <h2 class="block-title sketch-title">生活行为侧写</h2>
        <dl class="profile-dl">
          <dt>作息怪癖</dt>
          <dd>{{ profile.behavior.schedule }}</dd>
          <dt>聊天习惯</dt>
          <dd>{{ profile.behavior.chatHabits }}</dd>
          <dt>喜好 & 雷点</dt>
          <dd>{{ profile.behavior.likesAndPetPeeves }}</dd>
          <dt>高频聊天场景</dt>
          <dd>{{ profile.behavior.frequentScenes }}</dd>
        </dl>
        <template v-if="isRealPerson">
          <div v-if="getProfileNote(id, 'behavior')" class="real-note-block">{{ getProfileNote(id, 'behavior') }}</div>
          <div class="real-note-edit">
            <textarea v-model="noteDraft.behavior" class="sketch-input real-note-input" placeholder="补充或纠正上述 AI 提取的信息（真人备注）" rows="2" />
            <button type="button" class="sketch-btn" @click="saveNote('behavior')">保存备注</button>
          </div>
        </template>
      </section>

      <!-- 3. 关系羁绊簿 -->
      <section v-if="profile.bond" class="block sketch-card">
        <h2 class="block-title sketch-title">关系羁绊簿</h2>
        <div class="bond-level">
          <strong>关系等级：</strong>{{ profile.bond.levelLabel }}（进度 {{ profile.bond.levelProgress }}%）
          <div class="progress-wrap sketch-border">
            <div class="progress-bar" :style="{ width: profile.bond.levelProgress + '%' }" />
          </div>
        </div>
        <p class="profile-row"><strong>默契值：</strong>{{ profile.bond.rapportScore }} 分（{{ (profile.bond.rapportStats || []).join(' | ') }}）</p>
        <div class="secret-code sketch-border">
          <strong>专属暗号：</strong>{{ profile.bond.secretCode }}
        </div>
        <p class="profile-row"><strong>官方定位：</strong>{{ profile.bond.roleLabel }}</p>
        <div v-if="profile.bond.aiInsight" class="bond-ai-insight">
          <strong class="bond-ai-insight-title">AI 洞察</strong>
          <p class="bond-ai-insight-text">{{ profile.bond.aiInsight }}</p>
        </div>
        <template v-if="isRealPerson">
          <div v-if="getProfileNote(id, 'bond')" class="real-note-block">{{ getProfileNote(id, 'bond') }}</div>
          <div class="real-note-edit">
            <textarea v-model="noteDraft.bond" class="sketch-input real-note-input" placeholder="补充或纠正上述 AI 提取的信息（真人备注）" rows="2" />
            <button type="button" class="sketch-btn" @click="saveNote('bond')">保存备注</button>
          </div>
        </template>
      </section>

      <!-- 4. 深层隐藏档案 -->
      <section v-if="profile.hidden?.items?.length" class="block sketch-card">
        <h2 class="block-title sketch-title">深层隐藏档案</h2>
        <button
          v-if="!hiddenUnlocked"
          type="button"
          class="sketch-btn unlock-btn"
          @click="hiddenUnlocked = true"
        >
          点击解锁隐藏档案
        </button>
        <div
          v-for="(item, idx) in profile.hidden.items"
          :key="idx"
          :class="['lock-item', 'sketch-border', { unlocked: hiddenUnlocked }]"
        >
          <strong>{{ item.title }}：</strong>{{ item.content }}
        </div>
      </section>

      <!-- 5. 人设小剧场 -->
      <section v-if="profile.theater" class="block sketch-card">
        <h2 class="block-title sketch-title">人设小剧场 · 1 格漫画</h2>
        <div class="theater-comic sketch-border">
          <p class="theater-scenario">{{ profile.theater.scenario }}</p>
          <p class="theater-desc">{{ profile.theater.illustrationDesc }}</p>
          <p class="theater-quote">「{{ profile.theater.quote }}」</p>
        </div>
        <template v-if="isRealPerson">
          <div v-if="getProfileNote(id, 'theater')" class="real-note-block">{{ getProfileNote(id, 'theater') }}</div>
          <div class="real-note-edit">
            <textarea v-model="noteDraft.theater" class="sketch-input real-note-input" placeholder="补充或纠正上述 AI 提取的信息（真人备注）" rows="2" />
            <button type="button" class="sketch-btn" @click="saveNote('theater')">保存备注</button>
          </div>
        </template>
      </section>

      <!-- 6. 成长时间轴 -->
      <section v-if="profile.timeline?.length" class="block sketch-card">
        <h2 class="block-title sketch-title">成长时间轴</h2>
        <div class="timeline">
          <div
            v-for="(item, idx) in profile.timeline"
            :key="idx"
            :class="['timeline-item', { done: item.done }]"
          >
            <strong>{{ item.date }}</strong> — {{ item.label }}
          </div>
        </div>
      </section>

      <!-- 7. 互动小功能 -->
      <section v-if="profile.interact" class="block sketch-card">
        <h2 class="block-title sketch-title">互动小功能</h2>
        <div class="interact-btns">
          <button type="button" class="sketch-btn interact-btn" @click="openFlipModal">
            档案翻牌（随机小秘密）
          </button>
          <button type="button" class="sketch-btn interact-btn" @click="openQuizModal">
            懂 TA 测试
          </button>
          <button type="button" class="sketch-btn interact-btn" @click="onShare">
            分享档案卡片
          </button>
        </div>
      </section>

      <!-- 原有：我们的关系（无 persona 时保留旧档案） -->
      <template v-if="!profile.persona && profile.relationship">
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
      </template>

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

    <!-- 翻牌弹窗：秘密 → 可分享 / 问 TA 承不承认 → TA 回应 → 去聊天追问 -->
    <Teleport to="body">
      <div v-show="showFlipModal" class="profile-modal-backdrop" @click.self="closeFlipModal">
        <div class="profile-modal sketch-card flip-modal">
          <button type="button" class="profile-modal-close" aria-label="关闭" @click="closeFlipModal">×</button>
          <h3 class="profile-modal-title">随机小秘密</h3>
          <p class="profile-modal-body flip-secret-text">{{ flipSecretText }}</p>
          <!-- 第一步：展示秘密后的操作 -->
          <template v-if="flipAskStep === 'secret'">
            <div class="flip-actions">
              <button type="button" class="sketch-btn flip-action-btn" @click="copySecretShare">
                分享
              </button>
              <button type="button" class="sketch-btn flip-action-btn primary" @click="askTaAdmit">
                问 TA 承不承认
              </button>
            </div>
          </template>
          <!-- 第二步：TA 的回应 + 去聊天追问 -->
          <template v-else-if="flipAskStep === 'reaction'">
            <div class="flip-ta-reply sketch-border">
              <span class="flip-ta-reply-label">TA 的回应</span>
              <p class="flip-ta-reply-text">「{{ flipTaReply }}」</p>
            </div>
            <p class="flip-ta-hint">去聊天里继续追问，看 TA 怎么圆～</p>
            <button type="button" class="sketch-btn full primary" @click="goChatToAsk">
              去聊天里追问
            </button>
          </template>
        </div>
      </div>
      <!-- 分享复制成功 toast -->
      <Transition name="toast">
        <div v-show="shareCopyToast" class="flip-toast">已复制，可粘贴分享</div>
      </Transition>
    </Teleport>

    <!-- 懂 TA 测试弹窗 -->
    <Teleport to="body">
      <div v-show="showQuizModal" class="profile-modal-backdrop" @click.self="showQuizModal = false">
        <div class="profile-modal sketch-card">
          <button type="button" class="profile-modal-close" aria-label="关闭" @click="closeQuizModal">×</button>
          <h3 class="profile-modal-title">懂 TA 测试（1/3）</h3>
          <template v-if="!quizSubmitted">
            <p class="profile-modal-body">{{ profile?.interact?.quiz?.question }}</p>
            <div class="quiz-options">
              <label
                v-for="(opt, i) in (profile?.interact?.quiz?.options || [])"
                :key="i"
                class="quiz-option"
              >
                <input v-model="quizSelectedIndex" type="radio" :value="i" />
                <span>{{ opt }}</span>
              </label>
            </div>
            <button type="button" class="sketch-btn full" @click="submitQuiz">提交</button>
          </template>
          <template v-else>
            <p class="profile-modal-body" :class="quizCorrect ? 'quiz-correct' : 'quiz-wrong'">
              {{ quizCorrect ? '答对了！' : '答错啦，再想想 TA 平时怎么说～' }}
            </p>
            <button type="button" class="sketch-btn full" @click="closeQuizModal">关闭</button>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { characterProfiles } from '../data/mock'
import { useCloneToken } from '../composables/useCloneToken'
import Doodles from '../components/Doodles.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const profile = ref(null)

const {
  realPersonCharacterId,
  getToken,
  generateToken: doGenerateToken,
  revokeToken: doRevokeToken,
  clearRealPerson,
  getProfileNote,
  setProfileNote,
} = useCloneToken()

const isRealPerson = computed(() => realPersonCharacterId.value === id.value)
const cloneTokenData = computed(() => getToken(id.value))
const noteDraft = ref({ persona: '', behavior: '', bond: '', theater: '' })

function generateToken() {
  doGenerateToken(id.value)
}
function copyToken() {
  const t = cloneTokenData.value?.token
  if (!t) return
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(t).then(() => alert('已复制到剪贴板'))
  } else {
    alert('令牌：' + t)
  }
}
function revokeTokenConfirm() {
  if (!confirm('撤销后真人用户将无法再凭此令牌登录，确定撤销？')) return
  doRevokeToken(id.value)
}
function exitRealPerson() {
  clearRealPerson()
}
function saveNote(sectionKey) {
  const text = noteDraft.value[sectionKey]
  setProfileNote(id.value, sectionKey, text || '')
  noteDraft.value = { ...noteDraft.value, [sectionKey]: '' }
}

const hiddenUnlocked = ref(false)
const showFlipModal = ref(false)
const flipSecretText = ref('')
const flipAskStep = ref('secret') // 'secret' | 'reaction'
const flipTaReply = ref('')
const shareCopyToast = ref(false)
const showQuizModal = ref(false)

// 问 TA 承不承认时，随机一条「TA 的回应」（后续可改为 AI 生成）
const FLIP_TA_REPLIES = [
  '才没有！你从哪看到的～',
  '被你发现了…嘘，别告诉别人。',
  '哼，不承认。',
  '这谁说的，我可不认。',
  '……你猜？',
]
const quizSelectedIndex = ref(null)
const quizSubmitted = ref(false)
const quizCorrect = ref(false)

onMounted(() => {
  profile.value = characterProfiles[id.value] || null
})

watch(id, (newId) => {
  profile.value = characterProfiles[newId] || null
  hiddenUnlocked.value = false
  showFlipModal.value = false
  flipAskStep.value = 'secret'
  showQuizModal.value = false
  quizSubmitted.value = false
  quizSelectedIndex.value = null
})

function goBack() {
  router.back()
}

function goOurWorld() {
  router.push({ name: 'OurWorld', params: { id: id.value } })
}

function openFlipModal() {
  const secrets = profile.value?.interact?.secrets
  if (!secrets?.length) return
  flipSecretText.value = secrets[Math.floor(Math.random() * secrets.length)]
  flipAskStep.value = 'secret'
  showFlipModal.value = true
}

function closeFlipModal() {
  showFlipModal.value = false
  flipAskStep.value = 'secret'
}

function copySecretShare() {
  const name = profile.value?.name || 'TA'
  const text = `【档案小秘密】${flipSecretText.value} —— 来自《${name}》的档案翻牌`
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      shareCopyToast.value = true
      setTimeout(() => { shareCopyToast.value = false }, 2000)
    }).catch(() => {
      alert('已复制：' + text.slice(0, 50) + '…')
    })
  } else {
    alert(text)
  }
}

function askTaAdmit() {
  flipTaReply.value = FLIP_TA_REPLIES[Math.floor(Math.random() * FLIP_TA_REPLIES.length)]
  flipAskStep.value = 'reaction'
}

function goChatToAsk() {
  const prefill = `刚才那条「${flipSecretText.value}」是真的吗？你承不承认？`
  closeFlipModal()
  router.push({
    name: 'ChatDetail',
    params: { id: id.value },
    query: { prefill: encodeURIComponent(prefill) },
  })
}

function openQuizModal() {
  quizSelectedIndex.value = null
  quizSubmitted.value = false
  showQuizModal.value = true
}

function closeQuizModal() {
  showQuizModal.value = false
  quizSubmitted.value = false
  quizSelectedIndex.value = null
}

function submitQuiz() {
  if (quizSelectedIndex.value === null) return
  const quiz = profile.value?.interact?.quiz
  quizCorrect.value = quiz && quizSelectedIndex.value === quiz.correctIndex
  quizSubmitted.value = true
}

function onShare() {
  // 占位：后续可接生成卡片图、保存相册等
  alert('档案卡片已生成！（可保存到相册分享至朋友圈）')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--sketch-paper);
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
  border-bottom: 2px dashed var(--sketch-border);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* 表层人设 */
.profile-row {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
}
.tag {
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  background: var(--sketch-white);
  border-radius: 15px 255px 15px 225px/225px 15px 255px 15px;
}
.contrast-wrap {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.contrast-item {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 3px solid var(--sketch-black);
}

/* 生活行为侧写 */
.profile-dl {
  display: grid;
  gap: 0.75rem;
}
.profile-dl dt {
  font-size: 0.85rem;
  color: var(--sketch-gray);
}
.profile-dl dd {
  margin: 0;
  font-size: 0.95rem;
}

/* 关系羁绊 */
.bond-level {
  margin-bottom: 0.75rem;
}
.bond-level strong {
  display: block;
  margin-bottom: 0.35rem;
}
.progress-wrap {
  height: 1.25rem;
  border-radius: 999px;
  overflow: hidden;
  background: var(--sketch-soft);
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--sketch-mid), var(--sketch-gray));
  border-radius: 999px;
  transition: width 0.3s ease;
}
.secret-code {
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  border-radius: 8px;
  background: var(--sketch-paper);
  font-size: 0.9rem;
}
.bond-ai-insight {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid var(--sketch-black);
  background: var(--sketch-soft);
}
.bond-ai-insight-title {
  display: block;
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 0.5rem;
}
.bond-ai-insight-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--sketch-black);
}

/* 深层隐藏档案 */
.unlock-btn {
  margin-bottom: 1rem;
}
.lock-item {
  margin: 0.75rem 0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  filter: blur(4px);
  background: var(--sketch-soft);
  transition: filter 0.3s ease, background 0.3s ease, border-color 0.3s ease;
}
.lock-item.unlocked {
  filter: none;
  background: var(--sketch-white);
  border-color: var(--sketch-mid);
}

/* 人设小剧场 */
.theater-comic {
  padding: 1.25rem;
  text-align: center;
  border-radius: 8px;
  background: var(--sketch-white);
}
.theater-scenario {
  font-size: 1rem;
  color: var(--sketch-gray);
  margin-bottom: 0.5rem;
}
.theater-desc {
  font-size: 0.9rem;
  color: var(--sketch-mid);
  margin-bottom: 0.75rem;
}
.theater-quote {
  font-style: italic;
  border-top: 1px dashed var(--sketch-border);
  padding-top: 0.75rem;
  margin: 0;
}

/* 成长时间轴 */
.timeline {
  position: relative;
  padding-left: 1.5rem;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 0.35rem;
  top: 0.25rem;
  bottom: 0.25rem;
  width: 2px;
  background: var(--sketch-border);
}
.timeline-item {
  position: relative;
  margin: 1rem 0;
  font-size: 0.95rem;
  padding-left: 0.5rem;
}
.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.35rem;
  top: 0.35rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--sketch-border);
  background: var(--sketch-white);
}
.timeline-item.done::before {
  background: var(--sketch-mid);
}

/* 互动小功能 */
.interact-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.interact-btn {
  flex: 1;
  min-width: 140px;
}

/* 原有样式保留 */
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

/* 弹窗 */
.profile-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.profile-modal {
  position: relative;
  width: 100%;
  max-width: 360px;
  padding: 1.5rem;
}
.profile-modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  border: none;
  background: var(--sketch-soft);
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: var(--sketch-gray);
}
.profile-modal-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-right: 2rem;
}
.profile-modal-body {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* 翻牌弹窗：秘密 + 操作 + TA 回应 */
.flip-secret-text {
  margin-bottom: 1.25rem;
}
.flip-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.flip-action-btn {
  flex: 1;
  min-width: 0;
}
.flip-ta-reply {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--sketch-paper);
  border-left: 4px solid var(--sketch-black);
}
.flip-ta-reply-label {
  display: block;
  font-size: 0.85rem;
  color: var(--sketch-gray);
  margin-bottom: 0.35rem;
}
.flip-ta-reply-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  font-style: italic;
}
.flip-ta-hint {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 1rem;
}
.flip-toast {
  position: fixed;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.6rem 1.25rem;
  background: var(--sketch-black);
  color: var(--sketch-white);
  border-radius: 999px;
  font-size: 0.9rem;
  z-index: 101;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(0.5rem);
}
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.quiz-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}
.quiz-option input {
  width: 1rem;
  height: 1rem;
}
.quiz-correct {
  color: #2d6a2d;
  font-weight: 600;
}
.quiz-wrong {
  color: var(--sketch-gray);
}

/* 真人身份横幅 */
.real-person-banner {
  background: linear-gradient(135deg, #fef9e7 0%, #fdebd0 100%);
  border-color: #e8c87a;
}
.real-person-label {
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.real-person-desc {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 1rem;
}
.real-person-exit {
  margin-top: 0.5rem;
}

/* 克隆令牌 */
.clone-token-block .hint {
  font-size: 0.9rem;
  color: var(--sketch-gray);
  margin-bottom: 1rem;
}
.token-box {
  padding: 1rem;
  text-align: center;
  font-family: monospace;
  font-size: 1.25rem;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
  background: var(--sketch-paper);
}
.token-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.token-meta {
  font-size: 0.85rem;
  color: var(--sketch-gray);
}

/* 真人备注（彩色，与 AI 内容区分） */
.real-note-block {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid #e8a87c;
  background: #fef9e7;
  color: #b85c38;
  font-size: 0.95rem;
  line-height: 1.5;
  border-radius: 0 8px 8px 0;
}
.real-note-edit {
  margin-top: 0.75rem;
}
.real-note-input {
  width: 100%;
  margin-bottom: 0.5rem;
  min-height: 4em;
}
</style>

import { ref, watch } from 'vue'
import { chatMessages } from '../data/mock'

const STORAGE_KEY = 'clone_token_app'

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStored(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {}
}

// 单例状态，供全应用共享
const tokensByCharacter = ref({})
const realPersonCharacterId = ref(null)
/** 真人当前「在线」的角色 id：真人打开该角色聊天页时设为 id，离开时清空。用于判断是否由克隆人代回复。 */
const realPersonOnlineForCharacterId = ref(null)
const profileNotes = ref({})
const messagesByCharacter = ref({})

function seedMessagesFromMock() {
  const ids = Object.keys(chatMessages || {})
  ids.forEach((id) => {
    if (!messagesByCharacter.value[id]?.length) {
      const list = (chatMessages[id] || []).map((m) => ({ ...m, source: m.source || (m.role === 'user' ? undefined : undefined) }))
      messagesByCharacter.value[id] = list
    }
  })
}

function persist() {
  saveStored({
    tokensByCharacter: tokensByCharacter.value,
    realPersonCharacterId: realPersonCharacterId.value,
    profileNotes: profileNotes.value,
    messagesByCharacter: messagesByCharacter.value,
  })
}

// 初始化从 localStorage 恢复
const stored = loadStored()
if (stored.tokensByCharacter) tokensByCharacter.value = stored.tokensByCharacter
if (stored.realPersonCharacterId) realPersonCharacterId.value = stored.realPersonCharacterId
if (stored.profileNotes) profileNotes.value = stored.profileNotes
if (stored.messagesByCharacter) messagesByCharacter.value = stored.messagesByCharacter
seedMessagesFromMock()

watch([tokensByCharacter, realPersonCharacterId, profileNotes, messagesByCharacter], persist, { deep: true })

function generateToken(characterId) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const token = Array(8).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000
  tokensByCharacter.value = {
    ...tokensByCharacter.value,
    [characterId]: { token, expiry, allowChat: true, allowNote: true },
  }
  return token
}

function revokeToken(characterId) {
  const next = { ...tokensByCharacter.value }
  delete next[characterId]
  tokensByCharacter.value = next
  if (realPersonCharacterId.value === characterId) {
    realPersonCharacterId.value = null
  }
}

function verifyToken(inputToken) {
  const t = String(inputToken).trim()
  if (!t) return null
  const entries = Object.entries(tokensByCharacter.value)
  for (const [characterId, data] of entries) {
    if (data?.token === t && data?.expiry > Date.now()) {
      realPersonCharacterId.value = characterId
      return characterId
    }
  }
  return null
}

function clearRealPerson() {
  realPersonCharacterId.value = null
  realPersonOnlineForCharacterId.value = null
}

/** 真人进入该角色聊天页时调用，表示「我」在线 */
function setRealPersonOnline(characterId) {
  if (realPersonCharacterId.value === characterId) {
    realPersonOnlineForCharacterId.value = characterId
  }
}

/** 真人离开该角色聊天页时调用，表示「我」下线 */
function clearRealPersonOnline() {
  realPersonOnlineForCharacterId.value = null
}

/** 该角色的真人是否当前在线（在聊天的这一页） */
function isRealPersonOnline(characterId) {
  return realPersonCharacterId.value === characterId && realPersonOnlineForCharacterId.value === characterId
}

function getToken(characterId) {
  return tokensByCharacter.value[characterId] || null
}

function getMessages(characterId) {
  if (!messagesByCharacter.value[characterId]?.length) {
    const mock = (chatMessages[characterId] || []).map((m) => ({ ...m }))
    return mock
  }
  return messagesByCharacter.value[characterId]
}

function addMessage(characterId, message) {
  const list = getMessages(characterId)
  const next = [...list, message]
  messagesByCharacter.value = { ...messagesByCharacter.value, [characterId]: next }
}

function getProfileNote(characterId, sectionKey) {
  return profileNotes.value[characterId]?.[sectionKey]?.text ?? ''
}

function setProfileNote(characterId, sectionKey, text) {
  const byChar = profileNotes.value[characterId] || {}
  if (!text?.trim()) {
    const next = { ...byChar }
    delete next[sectionKey]
    profileNotes.value = { ...profileNotes.value, [characterId]: Object.keys(next).length ? next : {} }
    return
  }
  profileNotes.value = {
    ...profileNotes.value,
    [characterId]: {
      ...byChar,
      [sectionKey]: { text: text.trim(), updatedAt: new Date().toISOString() },
    },
  }
}

export function useCloneToken() {
  return {
    tokensByCharacter,
    realPersonCharacterId,
    realPersonOnlineForCharacterId,
    profileNotes,
    messagesByCharacter,
    generateToken,
    revokeToken,
    verifyToken,
    clearRealPerson,
    setRealPersonOnline,
    clearRealPersonOnline,
    isRealPersonOnline,
    getToken,
    getMessages,
    addMessage,
    getProfileNote,
    setProfileNote,
  }
}

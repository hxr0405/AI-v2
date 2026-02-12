import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'ChatList', component: () => import('../views/ChatList.vue'), meta: { title: '对话' } },
  { path: '/add-character', name: 'AddCharacter', component: () => import('../views/AddCharacter.vue'), meta: { title: '添加角色' } },
  { path: '/clone-login', name: 'CloneLogin', component: () => import('../views/CloneLogin.vue'), meta: { title: '克隆令牌登录' } },
  { path: '/character/:id', name: 'CharacterProfile', component: () => import('../views/CharacterProfile.vue'), meta: { title: '角色档案' } },
  { path: '/character/:id/world', name: 'OurWorld', component: () => import('../views/OurWorld.vue'), meta: { title: '我们的世界' } },
  { path: '/chat/:id', name: 'ChatDetail', component: () => import('../views/ChatDetail.vue'), meta: { title: '聊天' } },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue'), meta: { title: '设置' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · AI 克隆陪伴` : 'AI 克隆陪伴'
})

export default router

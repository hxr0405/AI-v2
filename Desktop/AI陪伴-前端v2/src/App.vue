<template>
  <div class="app sketch-bg" :class="{ 'simple-mode': simpleMode }">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useSimpleMode } from './composables/useSimpleMode'
import { useFontChoice } from './composables/useFontChoice'

const { simpleMode } = useSimpleMode()
const { fontChoice } = useFontChoice()
</script>

<style scoped>
.app {
  min-height: 100vh;
  min-height: 100dvh;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

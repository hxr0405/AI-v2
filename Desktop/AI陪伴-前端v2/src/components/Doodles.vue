<template>
  <span class="doodle-wrap" :class="[type, size]">
    <!-- 手绘感星星 -->
    <svg v-if="type === 'star'" viewBox="0 0 24 24" fill="currentColor" class="doodle-svg">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" stroke="currentColor" stroke-width="0.5" fill="currentColor"/>
    </svg>
    <svg v-else-if="type === 'star-outline'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="doodle-svg">
      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
    </svg>
    <!-- 手绘感爱心 -->
    <svg v-else-if="type === 'heart'" viewBox="0 0 24 24" class="doodle-svg heart-svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="var(--sketch-border)" stroke-width="0.4" fill="currentColor"/>
    </svg>
    <!-- 简笔小猫 -->
    <svg v-else-if="type === 'cat'" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" class="doodle-svg cat-svg">
      <circle cx="16" cy="14" r="8" fill="var(--sketch-white)"/>
      <circle cx="14" cy="13" r="1.2" fill="var(--sketch-black)"/>
      <circle cx="18" cy="13" r="1.2" fill="var(--sketch-black)"/>
      <path d="M14.5 16c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5" stroke-linecap="round"/>
    </svg>
  </span>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'star' },
  size: { type: String, default: 'm' },
})
</script>

<style scoped>
.doodle-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--sketch-gray);
}
.doodle-wrap.heart {
  color: var(--sketch-gray);
}
.doodle-wrap.cat {
  color: var(--sketch-black);
}
.doodle-svg {
  display: block;
}
.doodle-wrap.s .doodle-svg { width: 14px; height: 14px; }
.doodle-wrap.m .doodle-svg { width: 18px; height: 18px; }
.doodle-wrap.l .doodle-svg { width: 24px; height: 24px; }
.heart-svg { opacity: 0.95; }
.cat-svg { stroke: var(--sketch-border); }
</style>

<!-- app/components/ThemeToggle.vue -->
<template>
  <button
    type="button"
    aria-label="Toggle dark mode"
    class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-foreground/5 transition"
    @click="toggle"
  >
    <ClientOnly>
      <i v-if="colorMode.value === 'dark'" class="fa-solid fa-sun" />
      <i v-else class="fa-solid fa-moon" />
      <template #fallback><i class="fa-solid fa-circle-half-stroke" /></template>
    </ClientOnly>
  </button>
</template>

<script setup>
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<!-- app/layouts/dashboard.vue -->
<template>
  <div class="min-h-screen bg-background">
    <LayoutSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:pl-64">
      <!-- Mobile top bar -->
      <header class="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-surface border-b border-border">
        <button aria-label="Open menu" class="text-foreground" @click="sidebarOpen = true">
          <i class="fa-solid fa-bars text-lg" />
        </button>
        <span class="font-semibold text-foreground">Task Manager</span>
      </header>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
</script>

<!-- app/pages/dashboard/index.vue -->
<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-foreground">
        Welcome{{ userStore.user ? `, ${userStore.user.firstName}` : '' }}
      </h1>
      <p class="text-muted mt-1">Here's an overview of your tasks.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-surface border border-border rounded-xl p-5">
        <div class="flex items-center gap-3">
          <span :class="['inline-flex items-center justify-center w-10 h-10 rounded-lg', stat.bg, stat.color]">
            <i :class="['fa-solid', stat.icon]" />
          </span>
          <div>
            <p class="text-2xl font-semibold text-foreground">{{ stat.value }}</p>
            <p class="text-sm text-muted">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-surface border border-border rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-foreground">Recent tasks</h2>
        <span class="text-xs text-muted px-2 py-1 rounded-full bg-background">Mock preview</span>
      </div>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background text-muted mb-3">
          <i class="fa-solid fa-list-check" />
        </span>
        <p class="text-foreground font-medium">Task list goes here</p>
        <p class="text-sm text-muted mt-1">This becomes the real CRUD list in the next phase.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'tm-user-auth',
})

const userStore = useTaskManagerUserStore()

// Mock stats — swapped for real task counts once CRUD lands.
const stats = [
  { label: 'Total tasks', value: 12, icon: 'fa-list-check', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'To do', value: 5, icon: 'fa-circle-dot', color: 'text-status-todo', bg: 'bg-status-todo/10' },
  { label: 'In progress', value: 4, icon: 'fa-spinner', color: 'text-status-progress', bg: 'bg-status-progress/10' },
  { label: 'Done', value: 3, icon: 'fa-circle-check', color: 'text-status-done', bg: 'bg-status-done/10' },
]
</script>

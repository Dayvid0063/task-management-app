<!-- app/components/Layout/Sidebar.vue -->
<template>
  <!-- Mobile backdrop -->
  <div v-if="open" class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" @click="emit('close')" />

  <!-- Panel: fixed drawer on mobile, static column on desktop -->
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-surface border-r border-border transition-transform duration-200 lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between h-14 px-4 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
          <i class="fa-solid fa-list-check text-sm" />
        </span>
        <span class="font-semibold text-foreground">Task Manager</span>
      </div>
      <button aria-label="Close menu" class="lg:hidden text-muted hover:text-foreground" @click="emit('close')">
        <i class="fa-solid fa-xmark text-lg" />
      </button>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-background hover:text-foreground transition"
        active-class="bg-primary/10 text-primary"
        @click="emit('close')"
      >
        <i :class="['fa-solid', item.icon, 'w-5 text-center']" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="border-t border-border p-3">
      <div class="flex items-center gap-3 px-3 py-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
          {{ userStore.user?.firstName?.[0] || 'U' }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-foreground truncate">{{ userStore.fullName || 'User' }}</p>
          <p class="text-xs text-muted truncate">{{ userStore.user?.email }}</p>
        </div>
        <ThemeToggle />
      </div>
      <button
        class="mt-1 flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-danger/10 hover:text-danger transition"
        @click="handleLogout"
      >
        <i class="fa-solid fa-arrow-right-from-bracket w-5 text-center" />
        Sign out
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const userStore = useTaskManagerUserStore()

const navItems = [
  { label: 'Dashboard', icon: 'fa-gauge-high', to: '/dashboard' },
  { label: 'Tasks', icon: 'fa-list-check', to: '/dashboard/tasks' },
]

async function handleLogout() {
  await userStore.logout()
  await navigateTo('/login')
}
</script>

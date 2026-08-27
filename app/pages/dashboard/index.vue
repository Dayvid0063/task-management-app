<!-- app/pages/dashboard/index.vue -->
<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-foreground">
        Welcome{{ userStore.user ? `, ${userStore.user.firstName}` : '' }}
      </h1>
      <p class="text-muted mt-1">Here's an overview of your tasks.</p>
    </div>

    <div v-if="pending" class="py-16 text-center text-muted">
      <i class="fa-solid fa-spinner fa-spin text-xl" />
      <p class="mt-2">Loading dashboard...</p>
    </div>

    <div v-else-if="loadError" class="rounded-xl border border-border bg-surface p-8 text-center">
      <p class="text-danger">{{ loadError }}</p>
      <button class="mt-3 text-sm text-primary font-medium hover:underline" @click="loadDashboard">Try again</button>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="card in statCards" :key="card.label" class="bg-surface border border-border rounded-xl p-5">
          <div class="flex items-center gap-3">
            <span :class="['inline-flex items-center justify-center w-10 h-10 rounded-lg', card.bg, card.color]">
              <i :class="['fa-solid', card.icon]" />
            </span>
            <div>
              <p class="text-2xl font-semibold text-foreground">{{ card.value }}</p>
              <p class="text-sm text-muted">{{ card.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-foreground">Recent tasks</h2>
          <NuxtLink to="/dashboard/tasks" class="text-sm text-primary font-medium hover:underline">View all</NuxtLink>
        </div>

        <div v-if="recentTasks.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
          <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background text-muted mb-3">
            <i class="fa-solid fa-list-check" />
          </span>
          <p class="text-foreground font-medium">No tasks yet</p>
          <NuxtLink to="/dashboard/tasks/form" class="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2.5 transition">
            <i class="fa-solid fa-plus" /> New task
          </NuxtLink>
        </div>

        <div v-else class="divide-y divide-border">
          <NuxtLink
            v-for="task in recentTasks"
            :key="task._id"
            :to="`/dashboard/tasks/${task._id}`"
            class="flex items-center gap-4 py-3 first:pt-0 last:pb-0 -mx-2 px-2 rounded-lg hover:bg-background transition"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2.5">
                <h3 class="font-medium text-foreground truncate">{{ task.title }}</h3>
                <span :class="['text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', taskStatusBadgeClass(task.status)]">
                  {{ taskStatusLabel(task.status) }}
                </span>
              </div>
              <p class="text-sm text-muted mt-1">
                <i class="fa-regular fa-calendar mr-1" /> Due {{ formatDate(task.dueDate) }}
              </p>
            </div>
            <i class="fa-solid fa-chevron-right text-muted text-sm shrink-0" />
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'tm-user-auth',
})

const userStore = useTaskManagerUserStore()

const pending = ref(true)
const loadError = ref('')
const stats = ref({ total: 0, todo: 0, in_progress: 0, done: 0 })
const recentTasks = ref([])

const statCards = computed(() => [
  { label: 'Total tasks', value: stats.value.total, icon: 'fa-list-check', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'To do', value: stats.value.todo, icon: 'fa-circle-dot', color: 'text-status-todo', bg: 'bg-status-todo/10' },
  { label: 'In progress', value: stats.value.in_progress, icon: 'fa-spinner', color: 'text-status-progress', bg: 'bg-status-progress/10' },
  { label: 'Done', value: stats.value.done, icon: 'fa-circle-check', color: 'text-status-done', bg: 'bg-status-done/10' },
])

async function loadDashboard() {
  pending.value = true
  loadError.value = ''
  try {
    const res = await $fetch('/api/dashboard')
    stats.value = res.stats
    recentTasks.value = res.recentTasks
  } catch (e) {
    loadError.value = e.data?.message || 'Failed to load dashboard'
  } finally {
    pending.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(loadDashboard)
</script>

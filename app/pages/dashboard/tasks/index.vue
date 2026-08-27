<!-- app/pages/dashboard/tasks/index.vue -->
<template>
  <div>
    <div class="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Tasks</h1>
        <p class="text-muted mt-1">Manage and track your tasks.</p>
      </div>
      <NuxtLink
        to="/dashboard/tasks/form"
        class="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2.5 transition shrink-0"
      >
        <i class="fa-solid fa-plus" /> New task
      </NuxtLink>
    </div>

    <div v-if="pending" class="py-16 text-center text-muted">
      <i class="fa-solid fa-spinner fa-spin text-xl" />
      <p class="mt-2">Loading tasks...</p>
    </div>

    <div v-else-if="loadError" class="rounded-xl border border-border bg-surface p-8 text-center">
      <p class="text-danger">{{ loadError }}</p>
      <button class="mt-3 text-sm text-primary font-medium hover:underline" @click="loadTasks">Try again</button>
    </div>

    <div v-else-if="tasks.length === 0" class="rounded-xl border border-border bg-surface p-12 text-center">
      <span class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background text-muted mb-3">
        <i class="fa-solid fa-list-check" />
      </span>
      <p class="text-foreground font-medium">No tasks yet</p>
      <p class="text-sm text-muted mt-1 mb-4">Create your first task to get started.</p>
      <NuxtLink
        to="/dashboard/tasks/form"
        class="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2.5 transition"
      >
        <i class="fa-solid fa-plus" /> New task
      </NuxtLink>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="task in tasks"
        :key="task._id"
        :to="`/dashboard/tasks/${task._id}`"
        class="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 transition"
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
        <span class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-muted shrink-0">
          <i class="fa-solid fa-eye" />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'tm-user-auth',
})

const tasks = ref([])
const pending = ref(true)
const loadError = ref('')

async function loadTasks() {
  pending.value = true
  loadError.value = ''
  try {
    const res = await $fetch('/api/tasks')
    tasks.value = res.tasks
  } catch (e) {
    loadError.value = e.data?.message || 'Failed to load tasks'
  } finally {
    pending.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(loadTasks)
</script>

<!-- app/pages/dashboard/tasks/[id].vue -->
<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <NuxtLink to="/dashboard/tasks" class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition">
        <i class="fa-solid fa-arrow-left" /> Back to tasks
      </NuxtLink>
    </div>

    <div v-if="pending" class="py-16 text-center text-muted">
      <i class="fa-solid fa-spinner fa-spin text-xl" />
      <p class="mt-2">Loading task...</p>
    </div>

    <div v-else-if="loadError" class="rounded-xl border border-border bg-surface p-8 text-center">
      <p class="text-danger">{{ loadError }}</p>
      <NuxtLink to="/dashboard/tasks" class="mt-3 inline-block text-sm text-primary font-medium hover:underline">
        Back to tasks
      </NuxtLink>
    </div>

    <div v-else-if="task" class="bg-surface border border-border rounded-xl p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold text-foreground break-words">{{ task.title }}</h1>
          <span :class="['inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full', taskStatusBadgeClass(task.status)]">
            {{ taskStatusLabel(task.status) }}
          </span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <NuxtLink
            :to="`/dashboard/tasks/form?id=${task._id}`"
            class="inline-flex items-center gap-2 rounded-lg border border-border text-foreground font-medium px-3.5 py-2 hover:bg-background transition"
          >
            <i class="fa-solid fa-pen" /> Edit
          </NuxtLink>
          <button
            class="inline-flex items-center gap-2 rounded-lg text-muted hover:bg-danger/10 hover:text-danger font-medium px-3.5 py-2 transition"
            @click="confirmingDelete = true"
          >
            <i class="fa-solid fa-trash" /> Delete
          </button>
        </div>
      </div>

      <!-- Inline delete confirmation -->
      <div
        v-if="confirmingDelete"
        class="mt-4 rounded-lg border border-danger/30 bg-danger/5 p-3 flex flex-wrap items-center justify-between gap-3"
      >
        <p class="text-sm text-foreground">Delete this task? This can't be undone.</p>
        <div class="flex items-center gap-2 shrink-0">
          <button
            class="rounded-lg border border-border text-foreground text-sm font-medium px-3 py-1.5 hover:bg-background transition"
            @click="confirmingDelete = false"
          >
            Cancel
          </button>
          <button
            :disabled="deleting"
            class="rounded-lg bg-danger hover:opacity-90 text-white text-sm font-medium px-3 py-1.5 transition disabled:opacity-60"
            @click="confirmDelete"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>

      <div class="mt-6 border-t border-border pt-6">
        <p class="text-sm font-medium text-foreground mb-1.5">Description</p>
        <p v-if="task.description" class="text-foreground whitespace-pre-line">{{ task.description }}</p>
        <p v-else class="text-muted italic">No description</p>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="rounded-lg bg-background p-4">
          <p class="text-xs text-muted mb-1">Due date</p>
          <p class="text-foreground font-medium">
            <i class="fa-regular fa-calendar mr-1.5" />{{ formatDate(task.dueDate) }}
          </p>
        </div>
        <div class="rounded-lg bg-background p-4">
          <p class="text-xs text-muted mb-1">Created</p>
          <p class="text-foreground font-medium">
            <i class="fa-regular fa-clock mr-1.5" />{{ formatDate(task.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'tm-user-auth',
})

const route = useRoute()
const taskId = route.params.id

const task = ref(null)
const pending = ref(true)
const loadError = ref('')

const confirmingDelete = ref(false)
const deleting = ref(false)

async function loadTask() {
  pending.value = true
  loadError.value = ''
  try {
    const res = await $fetch(`/api/tasks/${taskId}`)
    task.value = res.task
  } catch (e) {
    loadError.value = e.data?.message || 'Failed to load task'
  } finally {
    pending.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    await $fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    await navigateTo('/dashboard/tasks')
  } finally {
    deleting.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(loadTask)
</script>

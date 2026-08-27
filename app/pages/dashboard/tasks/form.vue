<!-- app/pages/dashboard/tasks/form.vue -->
<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <NuxtLink to="/dashboard/tasks" class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition">
        <i class="fa-solid fa-arrow-left" /> Back to tasks
      </NuxtLink>
      <h1 class="text-2xl font-semibold text-foreground mt-3">
        {{ isEdit ? 'Edit task' : 'Create task' }}
      </h1>
    </div>

    <div class="bg-surface border border-border rounded-xl p-6">
      <p v-if="error" class="mb-4 rounded-lg bg-danger/10 text-danger text-sm px-3 py-2">{{ error }}</p>

      <div v-if="loadingTask" class="py-8 text-center text-muted">
        <i class="fa-solid fa-spinner fa-spin" /> Loading task...
      </div>

      <form v-else class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1.5">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="What needs doing?"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Add more detail (optional)"
            class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Status</label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            >
              <option v-for="option in taskStatusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Due date</label>
            <input
              v-model="form.dueDate"
              type="date"
              required
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create task' }}
          </button>
          <NuxtLink
            to="/dashboard/tasks"
            class="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 hover:bg-background transition"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'tm-user-auth',
})

const route = useRoute()
const taskId = computed(() => route.query.id || null)
const isEdit = computed(() => !!taskId.value)

const form = reactive({
  title: '',
  description: '',
  status: 'todo',
  dueDate: '',
})

const loadingTask = ref(false)
const submitting = ref(false)
const error = ref('')

async function loadTask() {
  if (!isEdit.value) return
  loadingTask.value = true
  error.value = ''
  try {
    const res = await $fetch(`/api/tasks/${taskId.value}`)
    form.title = res.task.title
    form.description = res.task.description
    form.status = res.task.status
    form.dueDate = res.task.dueDate ? res.task.dueDate.slice(0, 10) : ''
  } catch (e) {
    error.value = e.data?.message || 'Failed to load task'
  } finally {
    loadingTask.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  try {
    if (isEdit.value) {
      await $fetch(`/api/tasks/${taskId.value}`, { method: 'PUT', body: { ...form } })
    } else {
      await $fetch('/api/tasks', { method: 'POST', body: { ...form } })
    }
    await navigateTo('/dashboard/tasks')
  } catch (e) {
    error.value = e.data?.message || 'Something went wrong'
  } finally {
    submitting.value = false
  }
}

onMounted(loadTask)
</script>

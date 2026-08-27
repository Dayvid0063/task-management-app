<!-- app/pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-4">
          <i class="fa-solid fa-list-check text-lg" />
        </div>
        <h1 class="text-2xl font-semibold text-foreground">Welcome back</h1>
        <p class="text-muted mt-1">Sign in to manage your tasks</p>
      </div>

      <div class="bg-surface border border-border rounded-2xl shadow-sm p-8">
        <p v-if="error" class="mb-4 rounded-lg bg-danger/10 text-danger text-sm px-3 py-2">
          {{ error }}
        </p>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            :disabled="userStore.loading"
            class="w-full rounded-lg bg-primary hover:bg-primary-hover text-white font-medium py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ userStore.loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-muted mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-primary font-medium hover:underline">Create one</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const userStore = useTaskManagerUserStore()

const form = reactive({ email: '', password: '' })
const error = ref('')

async function handleLogin() {
  error.value = ''
  const res = await userStore.login({ email: form.email, password: form.password })
  if (res.success) {
    await navigateTo('/dashboard')
  } else {
    error.value = res.error
  }
}
</script>

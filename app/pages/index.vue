<!-- app/pages/index.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="text-center max-w-md">
      <span class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white mb-6">
        <i class="fa-solid fa-list-check text-xl" />
      </span>
      <h1 class="text-3xl font-semibold text-foreground">Task Manager</h1>
      <p class="text-muted mt-2">Landing page coming soon.</p>
      <div class="flex items-center justify-center gap-3 mt-6">
        <NuxtLink to="/login" class="rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 transition">
          Sign in
        </NuxtLink>
        <NuxtLink to="/register" class="rounded-lg border border-border text-foreground font-medium px-5 py-2.5 hover:bg-surface transition">
          Create account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder landing page — real landing UI comes later.
</script>

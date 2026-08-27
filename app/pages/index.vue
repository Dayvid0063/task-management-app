<!-- app/pages/index.vue -->
<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Nav -->
    <header class="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <i class="fa-solid fa-list-check text-sm" />
          </span>
          <span class="font-semibold">Task Manager</span>
        </div>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <NuxtLink to="/login" class="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface transition">
            Sign in
          </NuxtLink>
          <NuxtLink to="/register" class="rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 transition">
            Get started
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <!-- Background: dot grid + soft emerald glows (token-based, adapts to dark mode) -->
      <div
        class="pointer-events-none absolute inset-0"
        style="background-image: radial-gradient(rgb(var(--color-border)) 1px, transparent 1px); background-size: 22px 22px; -webkit-mask-image: radial-gradient(ellipse 65% 55% at 50% 35%, black, transparent 80%); mask-image: radial-gradient(ellipse 65% 55% at 50% 35%, black, transparent 80%);"
      />
      <div class="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-primary/15 blur-3xl" />
      <div class="pointer-events-none absolute top-20 -left-20 w-[380px] h-[380px] rounded-full bg-primary/10 blur-3xl" />
      <div class="pointer-events-none absolute top-10 -right-16 w-[320px] h-[320px] rounded-full bg-primary/10 blur-3xl" />

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div class="max-w-2xl mx-auto text-center">
          <span class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <i class="fa-solid fa-bolt text-primary" /> Simple task management
          </span>
          <h1 class="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
            Organize your work,<br class="hidden sm:block" /> one task at a time
          </h1>
          <p class="mt-4 text-lg text-muted">
            Capture what needs doing, track it from to-do to done, and never lose sight of a due date. A focused task manager, nothing you don't need.
          </p>
          <div class="mt-8 flex items-center justify-center gap-3">
            <NuxtLink to="/register" class="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium px-5 py-3 transition">
              Get started free <i class="fa-solid fa-arrow-right text-sm" />
            </NuxtLink>
            <NuxtLink to="/login" class="rounded-lg border border-border font-medium px-5 py-3 hover:bg-surface transition">
              Sign in
            </NuxtLink>
          </div>
        </div>

        <!-- App preview -->
        <div class="mt-14 max-w-2xl mx-auto">
          <div class="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
            <div class="flex items-center gap-1.5 px-4 h-10 border-b border-border">
              <span class="w-2.5 h-2.5 rounded-full bg-border" />
              <span class="w-2.5 h-2.5 rounded-full bg-border" />
              <span class="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">Tasks</h3>
                <span class="inline-flex items-center gap-1.5 rounded-lg bg-primary text-white text-xs font-medium px-2.5 py-1.5">
                  <i class="fa-solid fa-plus" /> New task
                </span>
              </div>
              <div class="space-y-2.5">
                <div v-for="task in previewTasks" :key="task.title" class="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-sm truncate">{{ task.title }}</span>
                      <span :class="['text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', taskStatusBadgeClass(task.status)]">
                        {{ taskStatusLabel(task.status) }}
                      </span>
                    </div>
                    <p class="text-xs text-muted mt-0.5"><i class="fa-regular fa-calendar mr-1" />Due {{ task.due }}</p>
                  </div>
                  <i class="fa-solid fa-eye text-muted text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div class="max-w-2xl mx-auto text-center mb-12">
        <h2 class="text-3xl font-semibold tracking-tight">Everything you need, nothing you don't</h2>
        <p class="mt-3 text-muted">The essentials of task management, done well.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="feature in features" :key="feature.title" class="rounded-xl border border-border bg-surface p-6">
          <span class="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary mb-4">
            <i :class="['fa-solid', feature.icon, 'text-lg']" />
          </span>
          <h3 class="font-semibold">{{ feature.title }}</h3>
          <p class="text-sm text-muted mt-1.5">{{ feature.text }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div class="rounded-2xl bg-primary px-6 py-12 sm:py-16 text-center">
        <h2 class="text-3xl font-semibold text-white tracking-tight">Ready to get organized?</h2>
        <p class="mt-3 text-white/80">Create an account and add your first task in under a minute.</p>
        <NuxtLink to="/register" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-white text-primary font-medium px-6 py-3 hover:bg-white/90 transition">
          Get started free <i class="fa-solid fa-arrow-right text-sm" />
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-sm text-muted">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-primary text-white">
            <i class="fa-solid fa-list-check text-xs" />
          </span>
          <span>Task Manager</span>
        </div>
        <p>Built with Nuxt &amp; MongoDB</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const features = [
  {
    icon: 'fa-list-check',
    title: 'Capture everything',
    text: 'Create tasks with a title, description, and due date in seconds.',
  },
  {
    icon: 'fa-bars-progress',
    title: 'Track progress',
    text: 'Move work through to-do, in progress, and done at a glance.',
  },
  {
    icon: 'fa-calendar-day',
    title: 'Stay on schedule',
    text: 'Tasks are sorted by due date, so what matters most stays on top.',
  },
  {
    icon: 'fa-shield-halved',
    title: 'Private by default',
    text: 'Your tasks are scoped to your account — no one else can see them.',
  },
]

const previewTasks = [
  { title: 'Finish project proposal', status: 'in_progress', due: 'Sep 2' },
  { title: 'Review pull requests', status: 'todo', due: 'Sep 3' },
  { title: 'Deploy release v1.2', status: 'done', due: 'Aug 30' },
]
</script>

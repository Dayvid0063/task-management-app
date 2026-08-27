// app/middleware/tm-user-auth.ts
import { useTaskManagerUserStore } from "~/stores/taskManagerUser"

export default defineNuxtRouteMiddleware(async () => {
    // Client-side UX guard; the API routes enforce auth server-side (defense in depth).
    if (import.meta.server) return

    const userStore = useTaskManagerUserStore()

    if (!userStore.user) {
        await userStore.fetchProfile()
    }

    if (!userStore.isAuthenticated) {
        return navigateTo('/login')
    }
})

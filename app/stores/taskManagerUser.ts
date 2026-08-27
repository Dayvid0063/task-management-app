// app/stores/taskManagerUser.ts
import { defineStore } from 'pinia'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
}

interface Credentials {
    email: string
    password: string
}

interface RegisterPayload extends Credentials {
    firstName: string
    lastName: string
}

export const useTaskManagerUserStore = defineStore('taskManagerUser', {
    state: () => ({
        user: null as User | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        fullName: (state) => (state.user ? `${state.user.firstName} ${state.user.lastName}`.trim() : ''),
    },

    actions: {
        async fetchProfile() {
            this.loading = true
            try {
                const res = await $fetch<{ success: boolean; user: User }>('/api/auth/me')
                this.user = res.user
                return true
            } catch {
                this.clearProfile()
                return false
            } finally {
                this.loading = false
            }
        },

        async register(payload: RegisterPayload) {
            this.loading = true
            this.error = null
            try {
                await $fetch('/api/auth/register', { method: 'POST', body: payload })
                await this.fetchProfile()
                return { success: true }
            } catch (error: any) {
                this.error = error.data?.message || 'Registration failed'
                return { success: false, error: this.error }
            } finally {
                this.loading = false
            }
        },

        async login(credentials: Credentials) {
            this.loading = true
            this.error = null
            try {
                await $fetch('/api/auth/login', { method: 'POST', body: credentials })
                await this.fetchProfile()
                return { success: true }
            } catch (error: any) {
                this.error = error.data?.message || 'Login failed'
                return { success: false, error: this.error }
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                await $fetch('/api/auth/logout', { method: 'POST' })
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.clearProfile()
            }
        },

        clearProfile() {
            this.user = null
            this.error = null
            this.loading = false
        },
    },
})

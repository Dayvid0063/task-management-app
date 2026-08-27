// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    content: [
        './app/**/*.{vue,ts,tsx,js,jsx}',
        './components/**/*.{vue,ts,tsx,js,jsx}',
        './pages/**/*.{vue,ts,tsx,js,jsx}',
        './layouts/**/*.{vue,ts,tsx,js,jsx}',
    ],
    darkMode: 'class',
    safelist: [
        'bg-status-todo/10', 'text-status-todo',
        'bg-status-progress/10', 'text-status-progress',
        'bg-status-done/10', 'text-status-done',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
                    hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
                },
                background: 'rgb(var(--color-background) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
                muted: 'rgb(var(--color-muted) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                success: 'rgb(var(--color-success) / <alpha-value>)',
                danger: 'rgb(var(--color-danger) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                status: {
                    todo: 'rgb(var(--color-status-todo) / <alpha-value>)',
                    progress: 'rgb(var(--color-status-progress) / <alpha-value>)',
                    done: 'rgb(var(--color-status-done) / <alpha-value>)',
                },
            },
        },
    },
} satisfies Config

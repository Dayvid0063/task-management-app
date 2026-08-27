// app/utils/taskStatus.ts
export const taskStatusOptions = [
    { value: 'todo', label: 'To do' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'done', label: 'Done' },
]

export function taskStatusLabel(value: string): string {
    return taskStatusOptions.find((option) => option.value === value)?.label || value
}

export function taskStatusBadgeClass(value: string): string {
    const classes: Record<string, string> = {
        todo: 'bg-status-todo/10 text-status-todo',
        in_progress: 'bg-status-progress/10 text-status-progress',
        done: 'bg-status-done/10 text-status-done',
    }
    return classes[value] || 'bg-background text-muted'
}

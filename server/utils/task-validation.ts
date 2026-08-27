// server/utils/task-validation.ts
import { z } from 'zod'
import { TASK_STATUSES } from '../models/task.model'

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().default(''),
    status: z.enum(TASK_STATUSES).default('todo'),
    dueDate: z.coerce.date(),
})

export const updateTaskSchema = z
    .object({
        title: z.string().trim().min(1, 'Title is required'),
        description: z.string().trim(),
        status: z.enum(TASK_STATUSES),
        dueDate: z.coerce.date(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Provide at least one field to update',
    })

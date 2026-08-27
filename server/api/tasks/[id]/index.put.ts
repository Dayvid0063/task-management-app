// server/api/tasks/[id]/index.put.ts
import mongoose from 'mongoose'
import { Task } from '../../../models/task.model'
import { updateTaskSchema } from '../../../utils/task-validation'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)
    const id = getRouterParam(event, 'id')

    if (!mongoose.isValidObjectId(id)) {
        throw createError({ statusCode: 404, message: 'Task not found' })
    }

    const result = updateTaskSchema.safeParse(await readBody(event))
    if (!result.success) {
        throw createError({ statusCode: 400, message: result.error.issues[0]?.message ?? 'Invalid request body' })
    }

    const task = await Task.findOneAndUpdate(
        { _id: id, owner: user._id },
        result.data,
        { new: true, runValidators: true }
    )
    if (!task) {
        throw createError({ statusCode: 404, message: 'Task not found' })
    }

    return { success: true, task }
})

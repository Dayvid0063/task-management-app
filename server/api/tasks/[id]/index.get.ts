// server/api/tasks/[id]/index.get.ts
import mongoose from 'mongoose'
import { Task } from '../../../models/task.model'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)
    const id = getRouterParam(event, 'id')

    if (!mongoose.isValidObjectId(id)) {
        throw createError({ statusCode: 404, message: 'Task not found' })
    }

    const task = await Task.findOne({ _id: id, owner: user._id })
    if (!task) {
        throw createError({ statusCode: 404, message: 'Task not found' })
    }

    return { success: true, task }
})

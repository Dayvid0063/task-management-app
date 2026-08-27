// server/api/tasks/index.get.ts
import { Task } from '../../models/task.model'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)
    const tasks = await Task.find({ owner: user._id }).sort({ dueDate: 1 })
    return { success: true, tasks }
})

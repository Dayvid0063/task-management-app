// server/api/tasks/index.post.ts
import { Task } from '../../models/task.model'
import { createTaskSchema } from '../../utils/task-validation'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)

    const result = createTaskSchema.safeParse(await readBody(event))
    if (!result.success) {
        throw createError({ statusCode: 400, message: result.error.issues[0]?.message ?? 'Invalid request body' })
    }

    const task = await Task.create({ ...result.data, owner: user._id })

    setResponseStatus(event, 201)
    return { success: true, task }
})

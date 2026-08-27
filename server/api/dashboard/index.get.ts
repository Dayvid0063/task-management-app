// server/api/dashboard/index.get.ts
import { Task } from '../../models/task.model'

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event)

    const [counts, recentTasks] = await Promise.all([
        Task.aggregate([
            { $match: { owner: user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Task.find({ owner: user._id }).sort({ createdAt: -1 }).limit(5),
    ])

    const stats: Record<string, number> = { total: 0, todo: 0, in_progress: 0, done: 0 }
    for (const row of counts) {
        if (row._id in stats) {
            stats[row._id] = row.count
            stats.total += row.count
        }
    }

    return { success: true, stats, recentTasks }
})

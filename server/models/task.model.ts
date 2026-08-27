// server/models/task.model.ts
import mongoose, { Schema } from 'mongoose'

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export interface ITask {
    title: string
    description: string
    status: TaskStatus
    dueDate: Date
    owner: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

type TaskModel = mongoose.Model<ITask>

const taskSchema = new Schema<ITask, TaskModel>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: '' },
        status: { type: String, enum: [...TASK_STATUSES], default: 'todo' },
        dueDate: { type: Date, required: true },
        // Scopes every task to its creator; indexed since all queries filter by owner.
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    },
    { timestamps: true }
)

export const Task = (mongoose.models.Task as TaskModel) || mongoose.model<ITask, TaskModel>('Task', taskSchema)
export default Task

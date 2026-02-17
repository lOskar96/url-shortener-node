import { Schema, model, ObjectId } from 'mongoose'

export interface IUrl {
  originalUrl: string
  shortCode?: string
  description?: string
  createdAt: Date
  clicks: number
  user: ObjectId
  lastClick?: Date
}

const urlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastClick: { type: Date }
})

export const Url = model<IUrl>('Url', urlSchema)

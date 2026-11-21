import { INotification } from "./../../Common/interface/notification.interface";
import { NotificationTypeEnum } from "./../../Common/enum/notification.enum";
import mongoose, { HydratedDocument } from "mongoose";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    notification_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationTypeEnum),
      required: true,
    },
    // the like / comment / follow row this alert is about
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    is_read: { type: Boolean, required: true, default: false },
    created_at: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false },
);

// the inbox query: newest first, optionally only the unread ones
notificationSchema.index({ recipient_id: 1, created_at: -1 });
notificationSchema.index({ recipient_id: 1, is_read: 1, created_at: -1 });

export const NotificationModel: mongoose.Model<INotification> =
  (mongoose.models.Notification as mongoose.Model<INotification> | undefined) ??
  mongoose.model<INotification>(
    "Notification",
    notificationSchema,
    "notifications",
  );

export type HNotification = HydratedDocument<INotification>;

import mongoose from "mongoose";
import { NotificationTypeEnum } from "./../enum/notification.enum";

export interface INotification {
  notification_id: mongoose.Types.ObjectId;
  recipient_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  type: NotificationTypeEnum;
  target_id: mongoose.Types.ObjectId;
  is_read: boolean;
  created_at: Date;
}

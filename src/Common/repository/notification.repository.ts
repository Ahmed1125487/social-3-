import { INotification } from "./../interface/notification.interface";
import { NotificationModel } from "./../../DB/model/notification.model";
import { DataBaseRepository } from "./base.repository";

export class NotificationRepository extends DataBaseRepository<INotification> {
  constructor() {
    super(NotificationModel);
  }
}

import DateTime from "./DateTime";
import { Order } from "./Order";

type Notification = {
  title?: string;
  order_id?: number;
  id?: number;
  type?: string;
  establishment_id?: number;
  message?: string;
  data?: any;
  created_at?: DateTime;
  is_read?: boolean;
  order?: Order;
  bar?: NotificationBar;
};

type NotificationBar = {
  id: number;
  type: string;
};

export default Notification;

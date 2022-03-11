import _ from "lodash";
import { ListApiSuccessResponseModel } from "models/api_responses/ListApiSuccessResponseModel";
import { isOrderPending } from "models/enums/EOrderStatus";
import { Order } from "models/Order";

type OrdersResponseModel = ListApiSuccessResponseModel<Order>;

export const arrangeOngoingCompletedOrders = (orders?: Order[]) => {
  const onGoingOrders: Order[] = [];
  const completedOrders: Order[] = [];
  _.sortBy(orders, ["updated_at"])?.forEach((value) => {
    if (isOrderPending(value)) {
      onGoingOrders.push(value);
    } else {
      completedOrders.push(value);
    }
  });
  return [...onGoingOrders, ...completedOrders];
};

export default OrdersResponseModel;

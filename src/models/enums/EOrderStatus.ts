import { DropDownItem } from "models/DropDownItem";
import EOrderType from "models/enums/EOrderType";
import { COLORS } from "config";
import { Order } from "models/Order";

enum EOrderStatus {
  PENDING = "pending",
  RECEIVED = "received",
  APPROVED = "approved",
  PREPARING = "preparing",
  READY = "ready",
  PROCESSING = "processing",
  DELIVERED = "delivered",
  ON_THE_WAY = "on_the_way",
  COMPLETED = "completed",
  READY_FOR_PICKUP = "ready_for_pickup",
  REJECTED = "rejected",
  LOOKING_FOR_DRIVER = "looking_for_driver",
  DRIVER_TO_PICKUP = "driver_en_route_to_pickup",
  DRIVER_AT_PICKUP = "driver_at_pickup",
  READY_TO_DELIVER = "ready_to_deliver",
  REFUND = "refund",
  CANCELLED = "cancelled"
}

export type StatusProperty = {
  status: EOrderStatus;
  displayText: string;
  backgroundColor: string;
  supportedOrderType: EOrderType[];
};

export const statusProperties: StatusProperty[] = [
  {
    status: EOrderStatus.PENDING,
    displayText: "Pending",
    backgroundColor: `${COLORS.theme?.interface[500]}`,
    supportedOrderType: [
      EOrderType.COLLECTION,
      EOrderType.DELIVERY,
      EOrderType.DINE_IN,
      EOrderType.TAKE_AWAY
    ]
  },
  {
    status: EOrderStatus.REFUND,
    displayText: "Refund",
    backgroundColor: "#F14D6B",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.CANCELLED,
    displayText: "Cancelled",
    backgroundColor: "#FFA19C",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.APPROVED,
    displayText: "Approved",
    backgroundColor: `${COLORS.theme?.borderColor}`,
    supportedOrderType: [
      EOrderType.COLLECTION,
      EOrderType.DELIVERY,
      EOrderType.DINE_IN,
      EOrderType.TAKE_AWAY
    ]
  },
  {
    status: EOrderStatus.PROCESSING,
    displayText: "Processing",
    backgroundColor: `${COLORS.orange}`,
    supportedOrderType: [
      EOrderType.COLLECTION,
      EOrderType.DELIVERY,
      EOrderType.DINE_IN,
      EOrderType.TAKE_AWAY
    ]
  },
  {
    status: EOrderStatus.READY,
    displayText: "Ready",
    backgroundColor: "#e5baff",
    supportedOrderType: [EOrderType.COLLECTION, EOrderType.DINE_IN]
  },
  {
    status: EOrderStatus.READY_FOR_PICKUP,
    displayText: "Ready For Pickup",
    backgroundColor: "#ff704d",
    supportedOrderType: [EOrderType.TAKE_AWAY]
  },
  {
    status: EOrderStatus.ON_THE_WAY,
    displayText: "On The Way",
    backgroundColor: "#f5bf20",
    supportedOrderType: [EOrderType.DELIVERY]
  },
  {
    status: EOrderStatus.LOOKING_FOR_DRIVER,
    displayText: "Looking For Driver",
    backgroundColor: "#edf6f9",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.DRIVER_AT_PICKUP,
    displayText: "Driver At Pickup",
    backgroundColor: "#d8f3dc",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.READY_TO_DELIVER,
    displayText: "Ready To Deliver",
    backgroundColor: "#f7ede2",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.DELIVERED,
    displayText: "Delivered",
    backgroundColor: "#69ff97",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.COMPLETED,
    displayText: "Completed",
    backgroundColor: `${COLORS.theme?.primaryShade[700]}`,
    supportedOrderType: [
      EOrderType.COLLECTION,
      EOrderType.DELIVERY,
      EOrderType.DINE_IN,
      EOrderType.TAKE_AWAY
    ]
  },
  {
    status: EOrderStatus.REJECTED,
    displayText: "Rejected",
    backgroundColor: `${COLORS.red}`,
    supportedOrderType: [
      EOrderType.COLLECTION,
      EOrderType.DELIVERY,
      EOrderType.DINE_IN,
      EOrderType.TAKE_AWAY
    ]
  },
  {
    status: EOrderStatus.DRIVER_TO_PICKUP,
    displayText: "Driver To Pickup",
    backgroundColor: "#83c5be",
    supportedOrderType: []
  },
  {
    status: EOrderStatus.RECEIVED,
    displayText: "Received",
    backgroundColor: "#5ce5fb",
    supportedOrderType: []
  }
];

export const getStatusProperty: (
  orderStatus: EOrderStatus
) => StatusProperty = (orderStatus: EOrderStatus) => {
  return (
    statusProperties.find((value) => value.status === orderStatus) ??
    statusProperties[0]
  );
};

export const getDropdownItems = () => {
  let statusDropDownItems: DropDownItem[] = [];
  statusProperties.forEach((status) => {
    statusDropDownItems.push({
      text: status.status,
      value: status.displayText
    });
  });
  return statusDropDownItems;
};

export const isOrderPending = (order: Order) => {
  return (
    order.status !== EOrderStatus.COMPLETED &&
    order.status !== EOrderStatus.REJECTED
  );
};

export default EOrderStatus;

import { COLORS } from "config";

enum EPaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed"
}

export type StatusProperty = {
  status: EPaymentStatus;
  displayText: string;
  textColor: string;
};

const statusProperties: StatusProperty[] = [
  {
    status: EPaymentStatus.PENDING,
    displayText: "Pending",
    textColor: COLORS.red
  },
  {
    status: EPaymentStatus.COMPLETED,
    displayText: "Paid",
    textColor: "#69ff97"
  }
];

export const getStatusProperty = (paymentStatus: EPaymentStatus) => {
  return (
    statusProperties.find((value) => value.status === paymentStatus) ??
    statusProperties[0]
  );
};

export default EPaymentStatus;

import { PaymentMethod } from "models/enums/PaymentMethod";

export type PaymentMethodResponseModel = {
  data: PaymentMethod[];
  pagination?: null;
  message: string;
};

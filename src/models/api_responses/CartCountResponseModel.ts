import { ApiSuccessResponseModel } from "./ApiSuccessResponseModel";

type CartCountResponseModel =
  ApiSuccessResponseModel<EstablishmentCartCount>;

export type EstablishmentCartCount = {
  count: number;
  message: string;
};

export default CartCountResponseModel;

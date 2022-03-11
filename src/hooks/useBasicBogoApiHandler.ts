import Strings from "config/Strings";
import { AddToCartRequestModel } from "models/api_requests/AddToCartRequestModel";
import { AddToCartResponseModel } from "models/api_responses/AddToCartResponseModel";
import { BarMenu } from "models/BarMenu";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { useRef } from "react";
import SimpleToast from "react-native-simple-toast";
import { useAddCartApi } from "repo/myCart/MyCarts";

export default () => {
  const addToCartRequestModel = useRef<AddToCartRequestModel>({});

  const { loading, request: updateCart } = useAddCartApi().addToCart;

  const updateBasicBogo = async (
    bogo: BarMenu,
    menuType: ESupportedOrderType | undefined,
    overrideRequest: AddToCartRequestModel | undefined = undefined,
    onSuccess?: (response: AddToCartResponseModel) => void,
    onFailure?: (error: string) => void
  ) => {
    if (loading) {
      return;
    }

    addToCartRequestModel.current.cart_type =
      menuType === ESupportedOrderType.ALL ? undefined : menuType;
    addToCartRequestModel.current.id = bogo?.id?.toString() ?? "0";
    addToCartRequestModel.current.establishment_id = bogo.establishment_id;
    addToCartRequestModel.current.group_type = "bogo";
    addToCartRequestModel.current.quantity = 1;
    addToCartRequestModel.current.basic_bogo = true;

    let request = {
      ...addToCartRequestModel.current,
      ...overrideRequest
    };

    const { hasError, dataBody, errorBody } = await updateCart(request);

    if (!hasError && dataBody !== undefined) {
      SimpleToast.show(dataBody.message);

      onSuccess?.(dataBody);
    } else {
      SimpleToast.show(errorBody!);
      onFailure?.(errorBody ?? Strings.common.some_thing_bad_happened);
    }
  };
  return {
    updateBasicBogo,
    loading
  };
};

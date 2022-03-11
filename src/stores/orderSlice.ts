import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "models/Order";

export interface OrderState {
  selectedCart: Order | undefined;
}

const initialState: OrderState = {
  selectedCart: undefined
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedCart: (state, { payload }: PayloadAction<Order>) => {
      state.selectedCart = payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setSelectedCart } = orderSlice.actions;

export default orderSlice.reducer;

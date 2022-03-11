enum EOrderType {
  COLLECTION = "collection",
  DELIVERY = "delivery",
  DINE_IN = "dine_in",
  TAKE_AWAY = "take_away"
}

export type TypeProperty = {
  type: EOrderType;
  displayText: string;
};

export const typeProperties: TypeProperty[] = [
  {
    type: EOrderType.COLLECTION,
    displayText: "Collection"
  },
  {
    type: EOrderType.DELIVERY,
    displayText: "Delivery"
  },
  {
    type: EOrderType.DINE_IN,
    displayText: "Dine In"
  },
  {
    type: EOrderType.TAKE_AWAY,
    displayText: "Takeaway"
  }
];

export const getTypeProperty: (orderType: EOrderType) => TypeProperty = (
  orderType: EOrderType
) => {
  return (
    typeProperties.find((value) => value.type === orderType) ??
    typeProperties[0]
  );
};

export default EOrderType;

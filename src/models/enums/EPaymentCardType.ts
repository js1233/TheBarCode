import { Brand } from "react-native-square-in-app-payments";

enum EPaymentCardType {
  VISA = "visa",
  AMEX = "amex",
  MASTER_CARD = "mastercard",
  DINERS = "diners",
  DISCOVER = "discover",
  JCB = "jcb",
  UNION_PAY = "unionpay",
  MAESTRO = "maestro",
  AIR_PLUS = "airplus",
  CARTE_BLUE = "cartebleue",
  DANKORT = "dankort",
  LASER = "laser"
}

const matchingRegex = [
  "^4[0-9]{12}(?:[0-9]{3})?$",
  "^3[47][0-9]{5,}$",
  "^5[1-5][0-9]{14}$",
  "^3(?:0[0-5]|[68][0-9])[0-9]{11}$",
  "^6(?:011|5[0-9]{2})[0-9]{12}$",
  "^(?:2131|1800|35d{3})d{11}$",
  "^(62|88)d+$",
  "^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390|6799)d+$",
  "^(5019)d+$",
  "^389[0-9]{11}$",
  "^(5019|4571)d+$/",
  "^(6304|6706|6709|6771)[0-9]{12,15}$"
];

export const getCardNumberType = (cardNumber: string) => {
  let index = matchingRegex.findIndex((_type) => _type.match(cardNumber));

  switch (index) {
    case 0:
      return EPaymentCardType.VISA;
    case 1:
      return EPaymentCardType.AMEX;
    case 2:
      return EPaymentCardType.MASTER_CARD;
    case 3:
      return EPaymentCardType.DINERS;
    case 4:
      return EPaymentCardType.DISCOVER;
    case 5:
      return EPaymentCardType.JCB;
    case 6:
      return EPaymentCardType.UNION_PAY;
    case 7:
      return EPaymentCardType.MAESTRO;
    case 8:
      return EPaymentCardType.AIR_PLUS;
    case 9:
      return EPaymentCardType.CARTE_BLUE;
    case 10:
      return EPaymentCardType.DANKORT;
    case 11:
      return EPaymentCardType.LASER;
    default:
      return EPaymentCardType.VISA;
  }
};

export const getCardType = (brand: Brand) => {
  switch (brand) {
    case "VISA":
      return EPaymentCardType.VISA;
    case "MASTERCARD":
      return EPaymentCardType.MASTER_CARD;
    case "AMERICAN_EXPRESS":
      return EPaymentCardType.AMEX;
    case "DISCOVER":
      return EPaymentCardType.DISCOVER;
    case "DISCOVER_DINERS":
      return EPaymentCardType.DINERS;
    case "JCB":
      return EPaymentCardType.JCB;
    case "CHINA_UNION_PAY":
      return EPaymentCardType.UNION_PAY;
    case "OTHER_BRAND":
      return EPaymentCardType.VISA;
    default:
      return EPaymentCardType.VISA;
  }
};

export default EPaymentCardType;

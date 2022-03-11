import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EWhatsOnType } from "models/enums/EWhatsOnType";

export type WhatsOnTabParamsList = {
  offers: { menuType: EWhatsOnType.OFFERS };
  events: { menuType: EWhatsOnType.EVENTS };
};

export const whatsOnTab = createBottomTabNavigator<WhatsOnTabParamsList>();

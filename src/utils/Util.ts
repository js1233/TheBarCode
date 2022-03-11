// A utility class

import { SPACE } from "config";
import moment from "moment";
import React from "react";
import { Linking, ViewStyle } from "react-native";
import { Color, NumberProp } from "react-native-svg";

export enum TAG {
  ONE_SIGNAL = "one_signal",
  NOTIFICATION = "notification",
  AUTHENTICATION = "authentication",
  VERSION_CHECK = "version_check",
  API = "api",
  VENUE = "venue",
  TRACE_UPDATE = "trace_update",
  ORDERS = "orders",
  THEME = "theme",
  COMPONENT = "component",
  DYNAMIC_LINK = "dynamiclink",
  EDITS = "edits",
  TRENDING_BUTTON_LOGICS = "trending",
  REDEEM = "redeem",
  REFRESHING_EVENT = "refrshing_event",
  RELOAD_BANNER = "reload_banner",
  Order_Summary = "order_summary",
  SEARCH = "search",
  DETAIL = "detail",
  MENU = "menu",
  CART = "cart",
  SQUARE_UP = "square_up",
  EXCLUSIVE_OFFER = "exclusive_offer",
  IN_APP_PURCHASE = "in_app_purchase",
  PERMISSION = "permissions"
}

export const AppLog = (function () {
  const LOGS_TAG_FILTER: (string | TAG)[] = [TAG.API];
  return {
    log: (onComputeMessage: () => string, tag?: string | TAG) => {
      if (tag && LOGS_TAG_FILTER.includes(tag)) {
        // eslint-disable-next-line no-console
        console.log(onComputeMessage());
      }
    },
    warn: (message?: any, ...optionalParams: any[]) => {
      // eslint-disable-next-line no-console
      console.warn(message, ...optionalParams);
    },
    bug: (message?: any, ...optionalParams: any[]) => {
      // eslint-disable-next-line no-console
      console.error(message, ...optionalParams);
    }
  };
})();

export const Price = (function () {
  return {
    toString: (currency?: string, amount?: number, atMax?: number) => {
      let maxReached = false;
      if (atMax !== undefined && (amount ?? 0) > atMax) {
        maxReached = true;
        amount = atMax;
      }
      return `${currency ?? "£"} ${
        amount != null
          ? (Math.round(amount * 100) / 100).toFixed(2)
          : "0.00"
      }${maxReached ? "+" : ""}`;
    }
  };
})();

export enum TruncateEnum {
  SHORT = 11,
  MEDIUM = 15,
  LONG = 20
}
export const truncateString = function (
  textToTruncate: string,
  truncateLength: TruncateEnum
) {
  return textToTruncate.substring(0, truncateLength);
};

/***
 * @example parameterizedString("my name is %s1 and surname is %s2", "John", "Doe");
 * @return "my name is John and surname is Doe"
 *
 * @firstArgument {String} like "my name is %s1 and surname is %s2"
 * @otherArguments {String | Number}
 * @returns {String}
 */
export const parameterizedString = (...args: string[]) => {
  const str = args[0];
  const params = args.filter((arg: string, index: number) => index !== 0);
  if (!str) {
    return "";
  }
  return str.replace(/%s[0-9]+/g, (matchedStr: string) => {
    const variableIndex =
      Number.parseInt(matchedStr.replace("%s", "")) - 1;
    return params[variableIndex];
  });
};

// export function delay<T, U, V>(t: T, v?: V) {
//   return new Promise<U>(function (resolve) {
//     setTimeout(resolve.bind(null), t);
//   });
// }

export type SvgProp = (
  color?: Color,
  width?: NumberProp,
  height?: NumberProp
) => React.ReactElement;

export const shadowStyleProps: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.4,
  shadowRadius: 2,
  elevation: 3
};

export const listItemSeparator: ViewStyle = {
  height: SPACE.lg
};

export const listContentContainerStyle: ViewStyle = {
  paddingVertical: SPACE.lg
};

export const loginRegx = new RegExp(
  "(?=.*[0-9])(?=.*[A-Z])[A-Za-z\\d]{8,}$"
);

export const formatTime = (date: string, format: string = "h:mm a") => {
  return moment(date).format(format);
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const isValidAge = (date: string) => {
  const formattedDAte = moment(date, "DD / MM / YYYY");

  return moment(new Date()).diff(
    moment(formattedDAte, "DD/MM/yyyy"),
    "years",
    false
  );
};

export const isValidPostcode = (
  postcode: String,
  isUk: boolean
): boolean => {
  let postcode1 = postcode.trim();

  if (isUk) {
    let ePattern = RegExp(
      "^([A-Z][A-Z0-9]?[A-Z0-9]?[A-Z0-9]? {1,2}[0-9][A-Z0-9]{2})$"
    );
    return ePattern.test(postcode1);
  } else {
    let ePattern = new RegExp("(^[1-9][0-9]{5}$)");
    return ePattern.test(postcode1);
  }
};

export const convertMilisecondsToSeconds = (ms: number) => {
  return Math.floor(ms / 1000);
};

export const secondsToTimer = (seconds: number) => {
  const days = Math.floor(seconds / 24 / 60 / 60);
  const hoursLeft = Math.floor(seconds - days * 86400);
  const hours = Math.floor(hoursLeft / 3600);
  const minutesLeft = Math.floor(hoursLeft - hours * 3600);
  const minutes = Math.floor(minutesLeft / 60);
  const remainingSeconds = seconds % 60;
  function pad(n: number) {
    return n < 10 ? "0" + n : n;
  }

  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(
    remainingSeconds
  )}`;
};

export const milesText = (mile: number) =>
  `${mile} mile${mile !== 1 ? "s" : ""}`;

export const openGoogleMap = (
  latitude: number,
  longitude: number,
  title: string
) => {
  Linking.openURL(
    `http://maps.google.com/maps?daddr=${latitude},${longitude} (${title})`
  );
};

export const openLinks = (url: string) => {
  Linking.openURL(url);
};

export const offerStartEndDate = (
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string
) => {
  if (startTime === "00:00:00" && endTime === "23:59:59") {
    return `${moment(startDate).format("MMM DD")} to ${moment(
      endDate
    ).format("MMM DD")} `;
  } else {
    return `${moment(startDate).format("MMM DD")} to ${moment(
      endDate
    ).format("MMM DD")} from ${moment(startTime, "HH:mm").format(
      "HH:mm"
    )} to ${moment(endTime, "HH:mm").format("HH:mm")}`;
  }
};

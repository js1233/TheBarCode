import Constant from "config/Constant";
import { Offer } from "models/Offer";
import moment from "moment-timezone";
import * as RNLocalize from "react-native-localize";

type DateTime = {
  date: Date;
  timezone_type: number;
  timezone: string;
};

export const toString = (dateTime: DateTime) => {
  return moment
    .tz(dateTime.date, dateTime.timezone)
    .clone()
    .tz(RNLocalize.getTimeZone())
    .format("MMMM D, YYYY HH:mm");
};

export const toTimeString = (dateTime: DateTime) => {
  return moment
    .tz(dateTime.date, dateTime.timezone)
    .clone()
    .tz(RNLocalize.getTimeZone())
    .format("HH:mm");
};

export const timeFromNow = (dateTime: DateTime) => {
  return moment
    .tz(dateTime.date, dateTime.timezone)
    .clone()
    .tz(RNLocalize.getTimeZone())
    .from(Date.now());
};

export const toDate = (
  dateTimeString: string,
  formatFrom: string,
  toFormat: string
) => {
  return moment(dateTimeString, formatFrom)
    .clone()
    .tz(RNLocalize.getTimeZone())
    .format(toFormat);
};

export const currentTime = (format: string) => {
  return moment().format(format);
};

export const getUTCMilliSeconds = (dateTimeString: string) => {
  return moment
    .utc(dateTimeString, Constant.FORMAT_DATE_TIME)
    .tz(Constant.SERVER_TIME_ZONE)
    .toDate()
    .getTime();
};

export const getUTCMillisecondForCurrentTime = () => {
  return moment().toDate().valueOf();
};

export const isExpired = (offer: Offer) => {
  if (offer.is_voucher) {
    return false;
  } else {
    return (
      currentTime(Constant.FORMAT_DATE_TIME) >
      toDate(
        offer.end_date_time!,
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD HH:mm:ss"
      )
    );
  }
};

export const isBundleOfferExpired = (offer: Offer) => {
  return (
    currentTime(Constant.FORMAT_DATE_TIME) >
    toDate(offer.end_date!, "YYYY-MM-DD", "YYYY-MM-DD")
  );
};

export const isDealActive = (offer: Offer) => {
  if (offer.is_voucher) {
    return true;
  } else {
    const currentUtcMillis = getUTCMillisecondForCurrentTime();
    // Deal hasn't started yet
    if (
      getUTCMilliSeconds(offer.start_date_time!) >
      getUTCMillisecondForCurrentTime()
    ) {
      return false;
    }
    // Deal has started, but check whether deal times are within the bounds or not
    // with respect to the current time
    return (
      currentUtcMillis >= getStartDateTimeUtcLong(offer) &&
      currentUtcMillis < getEndDateTimeUtcLong(offer)
    );
  }
};

const getStartDateTimeUtcLong = (offer: Offer) => {
  const startTimeUtcMillis = getUTCMilliSeconds(
    currentTime(Constant.FORMAT_DATE) + " " + offer.start_time
  );
  if (startTimeUtcMillis > getEndDateTimeUtcLong(offer)) {
    return startTimeUtcMillis - 86400000;
  } else if (
    getEndDateTimeUtcLong(offer) - startTimeUtcMillis >
    86400000
  ) {
    return startTimeUtcMillis + 86400000;
  } else {
    return startTimeUtcMillis;
  }
};

const getEndDateTimeUtcLong = (offer: Offer) => {
  const currentUtcMillis = getUTCMillisecondForCurrentTime();
  const endTimeUtcMillis = getUTCMilliSeconds(
    currentTime(Constant.FORMAT_DATE) + " " + offer.end_time
  );
  if (currentUtcMillis < endTimeUtcMillis) {
    return endTimeUtcMillis;
  } else {
    const finalEndTimeUtcMillis = getUTCMilliSeconds(offer.end_date_time!);
    if (endTimeUtcMillis < finalEndTimeUtcMillis) {
      return endTimeUtcMillis + 86400000;
    } else {
      return finalEndTimeUtcMillis;
    }
  }
};

export const getStartInMillis = (offer: Offer) => {
  const startDateTimeUtcMillis = getUTCMilliSeconds(
    offer.start_date_time!
  );
  const endDateTimeUtcMillis = getUTCMilliSeconds(offer.end_date_time!);
  const currentUtcMillis = getUTCMillisecondForCurrentTime();

  // if offers have been live at least once, looks for time till next occurance
  if (
    currentUtcMillis > startDateTimeUtcMillis &&
    currentUtcMillis < endDateTimeUtcMillis
  ) {
    let nextStartTimeUtcMillis = getUTCMilliSeconds(
      currentTime(Constant.FORMAT_DATE) + " " + offer.start_time
    );
    if (nextStartTimeUtcMillis < currentUtcMillis) {
      // add one day to start time as it starts on next day same time
      nextStartTimeUtcMillis += 86400000;
    }
    return nextStartTimeUtcMillis - currentUtcMillis;
  } else {
    return startDateTimeUtcMillis - currentUtcMillis;
  }
};

export default DateTime;

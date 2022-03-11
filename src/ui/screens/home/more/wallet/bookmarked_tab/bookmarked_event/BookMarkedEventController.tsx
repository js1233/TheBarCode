import React, { FC, useEffect, useState } from "react";
import { Offer } from "models/Offer";
import { useGeneralApis } from "repo/general/GeneralApis";
import { usePaginatedApi } from "hooks/usePaginatedApi";
import { AppLog, TAG } from "utils/Util";
import { BookMarkedEventsView } from "ui/screens/home/more/wallet/bookmarked_tab/bookmarked_event/BookMarkedEventView";

type Props = {};

const BookMarkedEventController: FC<Props> = () => {
  const [bookMarkedEvents, setBookMarkedEvents] = useState<
    Offer[] | undefined
  >(undefined);

  const {
    isLoading,
    request: fetchBookMarkedEventsRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useGeneralApis().bookMarkedEvents(
    usePaginatedApi,
    setBookMarkedEvents
  );
  useEffect(() => {
    fetchBookMarkedEventsRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  AppLog.log(
    () => "BookMarkedEvents: " + JSON.stringify(bookMarkedEvents),
    TAG.VENUE
  );
  return (
    <BookMarkedEventsView
      offer={bookMarkedEvents!}
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      pullToRefreshCallback={onPullToRefresh}
      onEndReached={onEndReached}
    />
  );
};

export default BookMarkedEventController;

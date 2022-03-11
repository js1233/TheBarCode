import React, { FC, useEffect, useState } from "react";
import { useGeneralApis } from "repo/general/GeneralApis";
import { usePaginatedApi } from "hooks/usePaginatedApi";
import { AppLog, TAG } from "utils/Util";
import { SharedEventsView } from "ui/screens/home/more/wallet/shared/shared_offer/shared_events/SharedEventsView";
import { Offer } from "models/Offer";

type Props = {};

const SharedEventController: FC<Props> = () => {
  const [sharedEvents, setSharedEvents] = useState<Offer[] | undefined>(
    undefined
  );

  const {
    isLoading,
    request: fetchSharedOffersRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useGeneralApis().sharedEvents(usePaginatedApi, setSharedEvents);
  useEffect(() => {
    fetchSharedOffersRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  AppLog.log(
    () => "SharedEvents: " + JSON.stringify(sharedEvents),
    TAG.VENUE
  );
  return (
    <SharedEventsView
      event={sharedEvents!}
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      pullToRefreshCallback={onPullToRefresh}
      onEndReached={onEndReached}
    />
  );
};

export default SharedEventController;

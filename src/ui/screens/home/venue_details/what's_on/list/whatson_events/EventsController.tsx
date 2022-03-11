import { useAppSelector } from "hooks/redux";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import { WhatsOnEventsApiRequestModel } from "models/api_requests/WhatsOnEventsApiRequestModel";
import EScreen from "models/enums/EScreen";
import { Offer } from "models/Offer";
import React, { FC, useEffect, useState } from "react";
import SimpleToast from "react-native-simple-toast";
import { useEditsApis } from "repo/edits/EditsApis";
import { useVenuePaginatedApis } from "repo/venues/Venues";
import { RootState } from "stores/store";
import { EventsView } from "./EventsView";

type Props = {};

const EventsController: FC<Props> = () => {
  const [events, setEvents] = useState<Offer[] | undefined>(undefined);
  const { refreshingEvent, barDetails } = useAppSelector(
    (state: RootState) => state.general
  );
  const requestModel: WhatsOnEventsApiRequestModel = {
    is_for_map: false,
    establishment_id: barDetails?.id?.toString() ?? ""
  };

  const {
    isLoading,
    request: fetchEventsRequest,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useVenuePaginatedApis(setEvents, requestModel).events;

  useEffect(() => {
    fetchEventsRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { request: setEventBookmarkedRequest, loading: bookmarkedPb } =
    useEditsApis().setEventBookmarked;

  const onSaveBookmark = async (item: Offer, callback: () => void) => {
    const request: SetOfferBookMarkedApiRequestModel = {
      event_id: item.id,
      is_favorite: item.is_user_favourite!
    };
    const { hasError, dataBody } = await setEventBookmarkedRequest(
      request
    );
    if (!hasError && dataBody !== undefined) {
      callback();
      SimpleToast.show(dataBody.message);
    }
  };

  //Handle event from refreshing api event
  useEffect(() => {
    if (
      refreshingEvent?.REFRESH_APIS_EXPLORE_SCREEN &&
      refreshingEvent.REFRESH_APIS_EXPLORE_SCREEN.includes(
        EScreen.VENUE_DETAIL_WHATSON
      )
    ) {
      fetchEventsRequest();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return (
    <EventsView
      isLoading={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      pullToRefreshCallback={onPullToRefresh}
      onEndReached={onEndReached}
      data={events!}
      onBookmarked={onSaveBookmark}
      bookmarkedPb={bookmarkedPb}
    />
  );
};
export default EventsController;

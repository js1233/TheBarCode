import React, { FC, useEffect, useState } from "react";
import { Offer } from "models/Offer";
import { useGeneralApis } from "repo/general/GeneralApis";
import { usePaginatedApi } from "hooks/usePaginatedApi";
import { AppLog, TAG } from "utils/Util";
import { BookMarkedOffersView } from "ui/screens/home/more/wallet/bookmarked_tab/bookmarked_offer/BookMarkedOfferView";
import { useEditsApis } from "repo/edits/EditsApis";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import SimpleToast from "react-native-simple-toast";
import _ from "lodash";
import { isExpired } from "models/DateTime";

type Props = {};

const BookMarkedOfferController: FC<Props> = () => {
  const [bookMarkedOffers, setBookMarkedOffers] = useState<
    Offer[] | undefined
  >(undefined);

  const { isLoading, request: fetchBookMarkedOffersRequest } =
    useGeneralApis().bookMarkedOffers(
      usePaginatedApi,
      setBookMarkedOffers
    );

  const { request: setOfferBookmarkedRequest, loading: bookmarkedPb } =
    useEditsApis().setOfferBookmarked;

  const selecteItemCallBack = (id: number) => {
    const itemCopy = _.cloneDeep(
      bookMarkedOffers?.find((item) => item.id === id!)
    );

    AppLog.log(() => "itemCopy: " + itemCopy, TAG.VENUE);

    if (itemCopy) {
      bookMarkedOffers?.splice(
        bookMarkedOffers?.findIndex((item) => item.id === id!!),
        1
      );
      setBookMarkedOffers(_.cloneDeep(bookMarkedOffers));
    }
  };

  const onSaveBookmark = async (
    id: number,
    isFavourite: boolean,
    callBack: () => void
  ) => {
    const requestModel: SetOfferBookMarkedApiRequestModel = {
      offer_id: id,
      is_favorite: !isFavourite
    };
    const { hasError, dataBody } = await setOfferBookmarkedRequest(
      requestModel
    );
    if (!hasError && dataBody !== undefined) {
      callBack();
      selecteItemCallBack(id);
      SimpleToast.show(dataBody.message);
    }
  };
  useEffect(() => {
    fetchBookMarkedOffersRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  AppLog.log(
    () => "BookMarkedOffer: " + JSON.stringify(bookMarkedOffers),
    TAG.VENUE
  );

  const getValidOffers = () => {
    let updatedOffers: Offer[] = [];
    return bookMarkedOffers?.forEach((offer) => {
      if (!isExpired(offer)) {
        updatedOffers.push(offer);
      }
    });
  };

  return (
    <BookMarkedOffersView
      offer={getValidOffers() ?? []}
      setBookmark={onSaveBookmark}
      shouldShowProgressBar={isLoading}
      bookmarkedPb={bookmarkedPb}
    />
  );
};

export default BookMarkedOfferController;

import React, { FC, useEffect, useState } from "react";
import { Offer } from "models/Offer";
import { useGeneralApis } from "repo/general/GeneralApis";
import { usePaginatedApi } from "hooks/usePaginatedApi";
import { SharedOffersView } from "ui/screens/home/more/wallet/shared/shared_offer/shared_offers/SharedOffersView";
import { AppLog, TAG } from "utils/Util";
import { useEditsApis } from "repo/edits/EditsApis";
import _ from "lodash";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import SimpleToast from "react-native-simple-toast";
import { isExpired } from "models/DateTime";

type Props = {};

const SharedOfferController: FC<Props> = () => {
  const [sharedOffers, setSharedOffers] = useState<Offer[] | undefined>(
    undefined
  );

  const { isLoading, request: fetchSharedOffersRequest } =
    useGeneralApis().sharedOffers(usePaginatedApi, setSharedOffers);

  const {
    request: setOfferBookmarkedRequest,
    loading: sharedOfferMarkedPb
  } = useEditsApis().setOfferBookmarked;

  const selecteItemCallBack = (id: number) => {
    const itemCopy = _.cloneDeep(
      sharedOffers?.find((item) => item.id === id!)
    );

    AppLog.log(() => "itemCopy: " + itemCopy, TAG.VENUE);

    if (itemCopy) {
      sharedOffers?.splice(
        sharedOffers?.findIndex((item) => item.id === id!!),
        1
      );
      setSharedOffers(_.cloneDeep(sharedOffers));
    }
  };

  const onSaveSharedOfferMark = async (
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
    fetchSharedOffersRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  AppLog.log(
    () => "SharedOffers: " + JSON.stringify(sharedOffers),
    TAG.VENUE
  );

  const getValidOffers = () => {
    let updatedOffers: Offer[] = [];
    return sharedOffers?.forEach((offer) => {
      if (!isExpired(offer)) {
        updatedOffers.push(offer);
      }
    });
  };

  return (
    <SharedOffersView
      offer={getValidOffers() ?? []}
      shouldShowProgressBar={isLoading}
      sharedOfferMarkedPb={sharedOfferMarkedPb}
      setSharedOfferMark={onSaveSharedOfferMark}
    />
  );
};

export default SharedOfferController;

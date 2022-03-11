import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Strings from "config/Strings";
import { usePreventDoubleTap } from "hooks";
import { useAppSelector } from "hooks/redux";
import { ViewApiRequestModel } from "models/api_requests/ViewApiRequestModel";
import { SetOfferBookMarkedApiRequestModel } from "models/api_requests/SetOfferBookMarkedApiRequestModel";
import { Offer } from "models/Offer";
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { Linking, Platform } from "react-native";
import SimpleToast from "react-native-simple-toast";
import { useEditsApis } from "repo/edits/EditsApis";
import { HomeBottomBarParamsList } from "routes/HomeBottomBar";
import { RootState } from "stores/store";
import HeaderTitle from "ui/components/headers/header_title/HeaderTitle";
import { AppLog, TAG } from "utils/Util";
import { EditsView } from "./EditsView";
import _ from "lodash";
import { isExpired } from "models/DateTime";

export type EditsNavigation = StackNavigationProp<
  HomeBottomBarParamsList,
  "Trending"
>;

type Props = {};

const EditsController: FC<Props> = () => {
  const navigation = useNavigation<EditsNavigation>();
  const [edits, setEditsList] = useState<Offer[] | undefined>();
  const offerId = useRef(0);
  const { refreshingEvent } = useAppSelector(
    (state: RootState) => state.general
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle text={Strings.edits.title} />
    });
  }, [navigation]);

  const { request: getEditsRequest, loading } = useEditsApis().edits;

  const fetchEditsRequest = useCallback(async () => {
    const { hasError, errorBody, dataBody } = await getEditsRequest([]);
    if (hasError || dataBody === undefined) {
      throw new Error(errorBody);
    } else {
      let updatedTrendingOffers: Offer[] = [];
      dataBody.data.forEach((offer) => {
        if (!isExpired(offer)) {
          updatedTrendingOffers.push(offer);
        }
      });
      setEditsList(_.cloneDeep(updatedTrendingOffers));
      offerId.current = dataBody.data[0].id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEditsRequest]);

  useEffect(() => {
    fetchEditsRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOfferSnapChanged = (changedItemIndex: number) => {
    edits?.forEach((offer, index) => {
      if (index === changedItemIndex) {
        offerId.current = offer.id;
      }
    });
    sendAnalytics();
  };

  const { request: sendAnalyticsRequest } = useEditsApis().sendAnalytics;
  const request: ViewApiRequestModel = {
    type: "offer_view",
    value: offerId.current?.toString()!
  };
  const sendAnalytics = usePreventDoubleTap(async () => {
    await sendAnalyticsRequest(request);
  });

  const { request: setOfferBookmarkedRequest, loading: bookmarkedPb } =
    useEditsApis().setOfferBookmarked;

  const onSaveBookmark = async (
    id: number,
    isFavourite: boolean,
    callBack: () => void
  ) => {
    const requestModel: SetOfferBookMarkedApiRequestModel = {
      offer_id: id,
      is_favorite: isFavourite
    };
    const { hasError, dataBody } = await setOfferBookmarkedRequest(
      requestModel
    );
    if (!hasError && dataBody !== undefined) {
      callBack();
      SimpleToast.show(dataBody.message);
    }
  };

  const openGoogleMap = useCallback(
    (lat: string, lng: string, title: string) => {
      AppLog.log(() => lat + " " + lng, TAG.EDITS);
      const provider = Platform.OS === "ios" ? "apple" : "google";
      const link = `http://maps.${provider}.com/?daddr=${lat},${lng}(${title})`;
      Linking.openURL(link);
    },
    []
  );

  //Handle event from refreshing api event
  useEffect(() => {
    if (refreshingEvent?.SUCCESSFULL_REDEMPTION) {
      fetchEditsRequest();
    }

    if (refreshingEvent?.SUCCESSFULL_PURCHASE) {
      fetchEditsRequest();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshingEvent]);

  return (
    <EditsView
      data={edits}
      shouldShowProgressBar={loading}
      saveBookmark={onSaveBookmark}
      onOfferSnapChanged={onOfferSnapChanged}
      openGoogleMap={(latitude, longitude, title) => {
        openGoogleMap(latitude.toString(), longitude.toString(), title);
      }}
      shouldShowBookmarkedPb={bookmarkedPb}
    />
  );
};

export default EditsController;

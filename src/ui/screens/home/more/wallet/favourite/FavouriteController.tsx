import React, { FC, useEffect, useState } from "react";
import { useGeneralApis } from "repo/general/GeneralApis";
import { usePaginatedApi } from "hooks/usePaginatedApi";
import { Venue } from "models/Venue";
import { FavouriteView } from "ui/screens/home/more/wallet/favourite/FavouriteView";
import _ from "lodash";
import { AppLog, TAG } from "utils/Util";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "routes/HomeStack";
import { usePreventDoubleTap } from "hooks";

type Props = {};

type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

const FavouriteController: FC<Props> = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [favourites, setFavourites] = useState<Venue[] | undefined>(
    undefined
  );

  const {
    isLoading,
    request: fetchFavourites,
    isAllDataLoaded,
    onEndReached,
    onPullToRefresh
  } = useGeneralApis().favourites(usePaginatedApi, setFavourites);

  const selecteItemCallBack = (id: number) => {
    const itemCopy = _.cloneDeep(
      favourites?.find((item) => item.id === id!)
    );

    AppLog.log(() => "itemCopy: " + itemCopy, TAG.VENUE);

    if (itemCopy) {
      favourites?.splice(
        favourites?.findIndex((item) => item.id === id!!),
        1
      );
      setFavourites(_.cloneDeep(favourites));
    }
  };
  const openVenueDetailsScreen = usePreventDoubleTap((_venue: Venue) => {
    navigation.navigate("VenueDetails", { venue: _venue });
  });

  useEffect(() => {
    fetchFavourites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FavouriteView
      data={favourites}
      shouldShowProgressBar={isLoading}
      isAllDataLoaded={isAllDataLoaded}
      onEndReached={onEndReached}
      pullToRefreshCallback={onPullToRefresh}
      selectedItemCallBack={selecteItemCallBack}
      openVenueDetailsScreen={openVenueDetailsScreen}
    />
  );
};

export default FavouriteController;

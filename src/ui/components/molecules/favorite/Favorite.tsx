import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import FavIcon from "assets/images/ic_fav.svg";
import FavFillIcon from "assets/images/ic_favorite_fill.svg";
import { useGeneralApis } from "repo/general/GeneralApis";
import { Venue } from "models/Venue";
import { AppLog, TAG } from "utils/Util";
import { COLORS } from "config";
import { SetFavoriteRequestModel } from "models/api_requests/SetFavoriteRequestModel";

type Props = {
  item: Venue;
  isFavorite?: boolean;
  selectedItem?: (id: number) => void;
  size?: number;
  onFavourite?: (isFav: boolean) => void;
};

function Favorite({ selectedItem, item, size = 18, onFavourite }: Props) {
  const [_isFavorite, setFavorite] = useState<boolean>(
    item?.is_user_favourite!
  );
  // call favorite API here
  // show ActivityIndicator while loading === true
  // call setFavorite() & onSuccess?.()
  // const [favourite, setFavourite] = useState(venue.is_user_favourite!);

  const { request: setFavoriteRequest, loading: favoritePb } =
    useGeneralApis().setFavorite;

  const onSetFavorite = async (callback: () => void) => {
    const request: SetFavoriteRequestModel = {
      establishment_id: item.id!,
      is_favorite: !_isFavorite
    };
    const { hasError, dataBody } = await setFavoriteRequest(request);
    if (!hasError && dataBody !== undefined) {
      callback();
    }
  };

  return (
    <View>
      {!favoritePb && (
        <Pressable
          onPress={() => {
            onSetFavorite(() => {
              setFavorite(!_isFavorite);
              selectedItem?.(item.id);
              onFavourite?.(!_isFavorite);
              AppLog.log(() => "isFavoriteID: " + item.id, TAG.VENUE);
            });
            // selectedItem?.(item.id);
          }}>
          {_isFavorite ? (
            <FavFillIcon width={size} height={size} />
          ) : (
            <FavIcon width={size} height={size} />
          )}
        </Pressable>
      )}
      {favoritePb && (
        <View style={[styles.bookmarkedPbContainer]}>
          <ActivityIndicator size={"small"} />
        </View>
      )}
    </View>
  );
}

export default Favorite;

const styles = StyleSheet.create({
  bookmarkedPbContainer: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.theme?.interface["50"],
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  }
});

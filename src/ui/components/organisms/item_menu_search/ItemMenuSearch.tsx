import { COLORS, FONT_SIZE, SPACE } from "config";
import { BarMenu } from "models/BarMenu";
import { Venue } from "models/Venue";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { listContentContainerStyle } from "utils/Util";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import VenueVideoImage, {
  Preference
} from "../venue_video_image/VenueVideoImage";
import ItemMenu from "ui/components/organisms/item_menu/ItemMenu";
import ESupportedOrderType from "models/enums/ESupportedOrderType";

type Props = {
  venue: Venue;
  onPress?: () => void;
  selectedItem?: (id: number) => void;
  type?: ESupportedOrderType;
};

const ItemMenuSearch: FC<Props> = ({ venue, onPress, type }) => {
  const [shouldShowViewMore, setShouldShowViewMore] =
    useState<boolean>(false);
  const renderItem = useCallback(
    ({ item }: { item: BarMenu }) => {
      return <ItemMenu menu={item} menuType={type} _venue={venue} />;
    },
    [type, venue]
  );
  const lessThenThreeMenus = useCallback(() => {
    let limitedMenus: BarMenu[] = [];
    if (venue?.menus.length > 0) {
      limitedMenus.push(venue?.menus[0]);
    }
    if (venue?.menus.length > 1) {
      limitedMenus.push(venue.menus[1]);
    }
    return limitedMenus;
  }, [venue]);

  const [menus, setMenus] = useState<BarMenu[]>(lessThenThreeMenus());

  const getLimitdMenus = useCallback(() => {
    let limitedMenus: BarMenu[] = lessThenThreeMenus();
    setMenus(limitedMenus);
  }, [lessThenThreeMenus]);

  const getAllMenus = useCallback(() => {
    setMenus(venue.menus);
  }, [venue.menus]);

  useEffect(() => {
    if (shouldShowViewMore) {
      getAllMenus();
    } else {
      getLimitdMenus();
    }
  }, [shouldShowViewMore, getAllMenus, getLimitdMenus]);
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onPress}
      key={venue.id}>
      <View style={[styles.venueImage]}>
        <VenueVideoImage
          video={venue.video}
          images={venue.images}
          preference={Preference.IMAGE}
          containerStyle={styles.image}
        />
        <AppLabel
          style={[styles.venueTitle]}
          text={venue.title}
          textType={TEXT_TYPE.BOLD}
        />
      </View>
      <FlatListWithPb
        data={menus}
        renderItem={renderItem}
        style={[styles.container]}
        contentContainerStyle={[
          listContentContainerStyle,
          {
            paddingHorizontal: SPACE._2md,
            paddingTop: SPACE.lg,
            paddingBottom: SPACE.lg
          }
        ]}
        keyExtractor={(item) => item?.id?.toString()}
      />
      {venue.menus.length > 2 && (
        <Pressable
          onPress={() => {
            setShouldShowViewMore(!shouldShowViewMore);
          }}>
          <AppLabel
            style={[styles.viewMore]}
            text={shouldShowViewMore ? "View Less " : "View All Menus"}
            textType={TEXT_TYPE.BOLD}
          />
        </Pressable>
      )}
    </TouchableOpacity>
  );
};

export default ItemMenuSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  venueImage: {
    flex: 0.7
  },
  venueTitle: {
    fontSize: FONT_SIZE.sm,
    paddingBottom: SPACE.lg,
    paddingTop: SPACE.lg
  },
  image: {
    height: 200,
    width: "95%",
    borderRadius: 10,
    alignSelf: "center"
  },
  venueDetailsContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  titleContainer: {
    height: 70,
    marginHorizontal: 10
  },
  favContainer: {
    height: 70,
    alignItems: "center",
    marginHorizontal: 10
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  pinIcon: {
    marginTop: 2,
    marginRight: SPACE._2xs
  },
  distanceText: {
    color: COLORS.theme?.primaryColor
  },
  cartIcon: {
    position: "absolute",
    right: 0,
    marginRight: 20,
    marginTop: 10
  },
  venueStatus: {
    height: 25,
    width: 70,
    position: "absolute",
    borderRadius: 20,
    backgroundColor: COLORS.white,
    bottom: 0,
    marginLeft: 20,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  veneuStatusFont: {
    fontSize: FONT_SIZE._3xs
  },
  dealMilesTitle: {
    fontSize: FONT_SIZE._2xs
  },
  viewMore: {
    padding: SPACE.lg,
    textTransform: "capitalize",
    color: COLORS.theme?.primaryShade[600]
  }
});

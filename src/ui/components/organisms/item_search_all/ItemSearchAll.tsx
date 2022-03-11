import { COLORS, FONT_SIZE, SPACE } from "config";
import { useAppSelector } from "hooks/redux";
import ESearchType from "models/enums/ESearchType";
import ESupportedOrderType from "models/enums/ESupportedOrderType";
import { Offer } from "models/Offer";
import { Venue } from "models/Venue";
import React, { FC, useCallback, useRef, useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { RootState } from "stores/store";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { MenuType } from "ui/screens/home/search/all_search/AllSearchController";
import { listContentContainerStyle } from "utils/Util";
import EventLinksDialog from "../app_dialogs/EventLinksDialog";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import { ItemEvent } from "../item_event/ItemEvent";
import ItemMenuSearch from "../item_menu_search/ItemMenuSearch";
import ItemVenue from "../item_venue/ItemVenue";

type Props = {
  itemType: MenuType;
  onItemClicked: (venue: Venue, title: string) => void;
  onClickedOnViewMore: (title: string) => void;
  onBookmarked: (item: Offer, callback: () => void) => void;
  bookmarkedPb: boolean;
};

const ItemSearchAll: FC<Props> = ({
  itemType,
  onItemClicked,
  onClickedOnViewMore,
  onBookmarked,
  bookmarkedPb
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [shouldShowPopUp, setShouldShowPopup] = useState<boolean>(false);
  const hideSelf = useCallback(() => {
    setShouldShowPopup(false);
  }, []);
  let _offer = useRef<Offer>();
  function getVenueSearchType() {
    if (itemType.title === "VENUES") {
      return ESearchType.VENUE;
    } else if (itemType.title === "DELIVERY") {
      return ESearchType.DELIVERY;
    } else {
      return ESearchType.OFFER;
    }
  }
  const getLinksLength = (offer: Offer) => {
    return offer.links.length > 1;
  };

  const getFirstLink = (offer: Offer) => {
    return offer.links[0].link;
  };

  // const getLinks = (offer: Offer) => {
  //   return offer.links;
  // };
  const renderItem = useCallback(
    ({ item }: { item: Venue | Offer }) => {
      if (
        itemType.title === "VENUES" ||
        itemType.title === "DELIVERY" ||
        itemType.title === "OFFERS"
      ) {
        return (
          <ItemVenue
            venue={item as Venue}
            onPress={() => onItemClicked(item as Venue, itemType.title)}
            type={getVenueSearchType()}
          />
        );
      }
      if (itemType.title === "EVENTS") {
        _offer.current = item as Offer;
        return (
          <ItemEvent
            onItemClicked={() =>
              onItemClicked(item as Venue, itemType.title)
            }
            item={item as Offer}
            bookmarkedPb={bookmarkedPb}
            onBookmarked={onBookmarked}
            onButtonClicked={() => {
              if (getLinksLength(item as Offer)) {
                setShouldShowPopup(true);
              } else {
                Linking.openURL(getFirstLink(item as Offer));
              }
            }}
            linkDomainUriPrefix={`https://thebarcode.page.link`}
            linkToBeDynamic={
              "?shared_by=" +
              user?.id +
              "&event_id=" +
              item.id +
              "&referral=" +
              user?.own_referral_code +
              "&shared_by_name=" +
              user?.full_name.split(" ").join("_")
            }
          />
        );
      }
      if (
        item !== undefined &&
        (itemType.title === "DINE IN" ||
          itemType.title === "TAKEAWAY/DELIVERY")
      ) {
        return (
          <ItemMenuSearch
            venue={item as Venue}
            onPress={() => onItemClicked(item as Venue, itemType.title)}
            type={
              itemType.title === "DINE IN"
                ? ESupportedOrderType.DINE_IN_COLLECTION
                : ESupportedOrderType.TAKEAWAY_DELIVERY
            }
          />
        );
      } else {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemType, user, bookmarkedPb]
  );
  return (
    <>
      <View style={[styles.container]}>
        <View
          style={{
            backgroundColor: COLORS.theme?.primaryColor,
            height: 5,
            width: "100%"
          }}
        />
        <View style={[styles.venueImage]}>
          <AppLabel
            style={[styles.venueTitle]}
            text={itemType.title}
            textType={TEXT_TYPE.BOLD}
          />
        </View>
        <FlatListWithPb<Venue | Offer>
          data={
            itemType.title === "Events"
              ? (itemType.data as Offer[])
              : (itemType.data as Venue[])
          }
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
          keyExtractor={(item) => item.id.toString()}
        />
        {!itemType.is_results_complete && (
          <Pressable onPress={() => onClickedOnViewMore(itemType.title)}>
            <AppLabel
              style={[styles.viewMore]}
              text={"View More " + itemType.title}
              textType={TEXT_TYPE.BOLD}
            />
          </Pressable>
        )}
      </View>
      <EventLinksDialog
        isVisible={shouldShowPopUp}
        hideSelf={hideSelf}
        data={_offer?.current?.links!}
      />
    </>
  );
};

export default ItemSearchAll;

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
    alignSelf: "center",
    padding: SPACE.lg,
    textTransform: "capitalize"
  }
});

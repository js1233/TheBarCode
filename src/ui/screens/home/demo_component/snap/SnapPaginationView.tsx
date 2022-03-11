import { SPACE } from "config";
import React, { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Screen from "ui/components/atoms/Screen";
import ItemSplashSlider from "ui/components/organisms/view_pager/snap_items/ItemSplashSlider";
import { ViewPager } from "ui/components/organisms/view_pager/ViewPager";
import {
  Snap,
  snapDataSplash
} from "ui/screens/home/demo_component/snap/DummyData";
import { shadowStyleProps } from "utils/Util";

type Props = {};

export const SnapPaginationView: FC<Props> = () => {
  const snapItem = useCallback(({ item }: { item: Snap }) => {
    return <ItemSplashSlider item={item} />;
  }, []);

  return (
    // for splash

    <Screen style={styles.container}>
      <View style={styles.splashCard} />
      <View style={styles.viewPagerContainer}>
        <ViewPager
          snapView={snapItem}
          data={snapDataSplash}
          autoPlayDelay={100}
          itemWidthRatio={0.9}
        />
      </View>
    </Screen>

    //for edit offer
    // <ViewPager
    //   snapView={snapItem}
    //   data={snapData}
    //   autoPlayDelay={100}
    //   itemWidthRatio={0.7}
    //   containerStyle={{ backgroundColor: "white" }}
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: SPACE._2xl,
    position: "relative",
    ...shadowStyleProps
  },
  splashCard: {
    backgroundColor: "white",
    height: "25%",
    top: "61%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...shadowStyleProps
  },
  viewPagerContainer: {
    position: "absolute",
    flex: 1,
    height: "100%",
    right: 0,
    left: 10,
    ...shadowStyleProps
  }
});

import { COLORS, FONT_SIZE, SPACE } from "config";
import Colors from "config/Colors";
import { SplashSliderItem } from "models/SplashSliderItem";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { shadowStyleProps } from "utils/Util";

type Props = {
  item: SplashSliderItem;
};

const ItemSplashSlider = React.memo<Props>(({ item }) => {
  return (
    <View style={styles.container} key={item.title}>
      <Image
        source={item.imagePath}
        style={[styles.image]}
        resizeMode={"contain"}
      />
      <LinearGradient
        colors={[COLORS.transparent, COLORS.black]}
        style={styles.linearGradient}
      />
      <View style={styles.card}>
        <AppLabel
          text={item.title}
          style={styles.title}
          textType={TEXT_TYPE.SEMI_BOLD}
        />
        <AppLabel
          text={item.subtitle}
          style={styles.subTitle}
          numberOfLines={0}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingVertical: 0 },
  title: {
    fontSize: FONT_SIZE.sm,
    color: Colors.colors.black
  },
  subTitle: {
    fontSize: FONT_SIZE._2xs,
    color: Colors.colors.black,
    paddingTop: SPACE.sm,
    textAlign: "center"
    //height: 41
  },
  image: { height: 300, zIndex: 100, width: "80%" },
  card: {
    padding: SPACE._2xl,
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: SPACE.lg,
    backgroundColor: COLORS.white,
    borderBottomStartRadius: 12,
    borderBottomEndRadius: 12,
    //marginBottom: SPACE._2xs,
    ...shadowStyleProps
  },
  linearGradient: {
    start: SPACE.lg,
    end: SPACE.lg,
    position: "absolute",
    top: 200,
    height: 100,
    opacity: 0.05
  }
});

export default ItemSplashSlider;

import { COLORS, FONT_SIZE, SPACE } from "config";
import { Venue } from "models/Venue";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import Screen from "ui/components/atoms/Screen";
import Cart from "assets/images/ic_cart.svg";

type Props = {
  venue: Venue;
};

function MenuView({ venue }: Props) {
  return (
    <Screen style={styles.container} shouldAddBottomInset={false}>
      <View style={styles.container1}>
        <Image
          source={require("assets/images/cart_placeholder.png")}
          height={50}
          width={50}
          style={styles.imageStyle}
          resizeMode={"contain"}
        />

        <View style={styles.rightContainer}>
          <AppLabel
            text={venue.title}
            style={styles.heading}
            textType={TEXT_TYPE.SEMI_BOLD}
          />
          <AppLabel
            text={
              "Beef patty, bun sauce, American cheese, iceberg, pickled red onion"
            }
            style={styles.heading}
            numberOfLines={0}
          />

          <Pressable>
            <View style={styles.cartContainer}>
              <Cart stroke={COLORS.theme?.primaryColor} width={18} />

              <AppLabel
                text={"£ 9.50"}
                style={[styles.heading, { paddingStart: SPACE.xs }]}
                textType={TEXT_TYPE.SEMI_BOLD}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container1: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE._2xl
  },
  imageStyle: {
    backgroundColor: COLORS.theme?.interface["50"],
    borderRadius: 5,
    overflow: "hidden"
  },
  rightContainer: {
    flex: 1,
    paddingHorizontal: SPACE._2md
  },
  heading: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.theme?.interface["900"]
  },
  cartContainer: {
    flexDirection: "row",
    marginTop: SPACE.md,
    alignItems: "center",
    alignContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs,
    backgroundColor: COLORS.theme?.primaryBackground,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: COLORS.theme?.borderColor
  }
});

export default MenuView;

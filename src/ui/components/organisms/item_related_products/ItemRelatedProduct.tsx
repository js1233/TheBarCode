import { COLORS, SPACE } from "config";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";

interface Props {
  image: string;
  onPress: () => void;
}

const ItemRelatedProduct = ({ image, onPress }: Props) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={
          image
            ? { uri: image }
            : require("assets/images/cart_placeholder.png")
        }
        style={[
          styles.imageStyle,
          !image && {
            borderColor: COLORS.theme?.interface["300"],
            borderWidth: 1
          }
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  container: {
    // paddingTop: SPACE.sm,
    paddingRight: SPACE.sm
  },
  imageStyle: {
    width: 55,
    height: 55,
    borderRadius: 8,
    resizeMode: "cover"
  }
});

export default ItemRelatedProduct;

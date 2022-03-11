import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Preference from "models/Preference";
import { shadowStyleProps } from "utils/Util";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import CheckCircle from "assets/images/ic_check_circle.svg";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  preference: Preference;
  isSelected?: boolean;
}

const ItemPreference: React.FC<Props> = ({
  containerStyle,
  preference,
  isSelected = false
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        isSelected
          ? { backgroundColor: COLORS.theme?.primaryShade["700"] }
          : { backgroundColor: COLORS.white },
        containerStyle
      ]}>
      <View style={styles.imageContainer}>
        <Image
          style={{ aspectRatio: 1 }}
          source={{ uri: preference.image }}
        />
        {isSelected && (
          <CheckCircle style={styles.check} width={16} height={16} />
        )}
      </View>
      <View style={styles.titleContainer}>
        <AppLabel
          style={[
            styles.title,
            isSelected
              ? { color: COLORS.white }
              : { color: COLORS.theme?.interface["900"] }
          ]}
          numberOfLines={2}
          text={preference.title}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 12,
    padding: SPACE._2xs,
    ...shadowStyleProps
  },
  imageContainer: {
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    overflow: "hidden"
  },
  title: {
    textAlign: "center",
    fontSize: FONT_SIZE._2xs
  },
  check: { position: "absolute", top: SPACE._2xs, start: SPACE._2xs },
  titleContainer: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    flex: 1
  }
});

export default ItemPreference;

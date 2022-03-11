import Cross from "assets/images/ic_cross.svg";
import { COLORS, SPACE } from "config";
import { Links } from "models/Offer";
import React, { FC } from "react";
import { Linking, Modal, Pressable, StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";

type Props = {
  isVisible: boolean;
  hideSelf: () => void;
  data: Links[];
};

const EventLinksDialog: FC<Props> = ({ isVisible, data, hideSelf }) => {
  const renderItem = ({ item }: { item: Links }) => {
    return (
      <Pressable
        onPress={() => {
          hideSelf();
          Linking.openURL(item.link);
        }}>
        <AppLabel text={item.link} style={styles.link} numberOfLines={0} />
      </Pressable>
    );
  };
  return (
    <Modal
      testID="popup-modal"
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View style={styles.container}>
          <Pressable style={styles.crossIconContainer} onPress={hideSelf}>
            <Cross
              fill={COLORS.theme?.primaryShade[900]}
              width={20}
              height={20}
            />
          </Pressable>
          <FlatListWithPb<Links>
            data={data}
            renderItem={renderItem}
            style={{ flex: 1, marginTop: SPACE._4xl }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,94,94,0.6)",
    paddingBottom: SPACE._4xl
  },
  container: {
    width: "70%",
    height: "50%",
    backgroundColor: COLORS.white,
    borderRadius: 15
  },
  crossIconContainer: { position: "absolute", top: "5%", right: "4%" },
  link: {
    paddingHorizontal: SPACE._2lg,
    color: COLORS.theme?.primaryShade[700],
    textDecorationLine: "underline",
    paddingBottom: SPACE._2lg
  }
});

export default EventLinksDialog;

import Cross from "assets/images/ic_cross.svg";
import { COLORS, SPACE } from "config";
import { Venue } from "models/Venue";
import React, { FC } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import Separator from "ui/components/atoms/separator/Separator";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import Discount10 from "assets/images/10Discount.svg";
import Right from "assets/images/right.svg";

type Props = {
  isVisible: boolean;
  hideSelf: () => void;
  venues: Venue[] | undefined;
  onItemClicked?: (venueId: number) => void;
};

const MapDialog: FC<Props> = ({
  isVisible,
  venues,
  hideSelf,
  onItemClicked
}) => {
  const renderItem = ({ item }: { item: Venue }) => {
    return (
      <Pressable
        onPress={() => {
          hideSelf();
          onItemClicked?.(item.id);
        }}>
        <View
          style={{
            flexDirection: "row",
            padding: SPACE.sm,
            justifyContent: "space-between"
          }}>
          <View
            style={{
              flexDirection: "row"
            }}>
            <Discount10 width={20} height={20} style={{ marginTop: 2 }} />
            <AppLabel
              text={item.title}
              style={styles.link}
              numberOfLines={0}
            />
          </View>
          <Right fill={COLORS.black} />
        </View>
        <Separator />
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
          <FlatListWithPb<Venue>
            data={venues}
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
    color: COLORS.theme?.primaryShade[700]
    // padding: SPACE.sm
  }
});

export default MapDialog;

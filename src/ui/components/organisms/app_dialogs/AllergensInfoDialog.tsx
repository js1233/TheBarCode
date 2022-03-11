import React, { FC, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { COLORS, FONT_SIZE, SPACE } from "config";
import Cross from "assets/images/ic_cross.svg";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";
import { AppButtonProps } from "ui/components/molecules/app_button/AppButton";
import { FlatListWithPb } from "../flat_list/FlatListWithPb";
import { getAlergensIcon } from "models/BarMenu";
import Strings from "config/Strings";

export type Props = {
  message?: string;
  isVisible: boolean;
  hideSelf?: () => void;
  buttonsText?: Array<string>;
  appButtonsProps?: Array<AppButtonProps>;
  customView?: React.ReactElement | null;
  textContainerStyle?: StyleProp<ViewStyle>;
  allergensIcons?: string[];
};

const AllergensInfoDialog: FC<Props> = ({
  message,
  isVisible,
  hideSelf,
  textContainerStyle,
  allergensIcons
}) => {
  const [containerWidth, setContainerWidth] = useState<number>();
  return (
    <Modal
      testID="popup-modal"
      visible={isVisible}
      animationType="fade"
      transparent={true}>
      <View style={styles.root}>
        <View
          style={[
            styles.mainContainer,
            {
              // flex:
              //   (allergensIcons?.length ?? 0) === 0
              //     ? 0.3
              //     : (allergensIcons?.length ?? 0) > 4
              //     ? 0.4
              //     : 0.3
            }
          ]}>
          <View style={styles.header}>
            <Pressable
              style={styles.crossIconContainer}
              onPress={hideSelf}>
              <Cross
                stroke={COLORS.theme?.interface["500"]}
                width={25}
                height={25}
              />
            </Pressable>
            <AppLabel
              text={"Allergens Information"}
              textType={TEXT_TYPE.BOLD}
              numberOfLines={0}
              style={styles.heading}
            />
          </View>

          <View
            style={[styles.textContainer]}
            onLayout={(event) => {
              let { width } = event.nativeEvent.layout;
              let result = (width - SPACE.lg - SPACE.lg) / 4;
              setContainerWidth(result);
            }}>
            <ScrollView
              style={[textContainerStyle]}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}>
              {(allergensIcons?.length ?? 0) > 0 && (
                <AppLabel
                  text={Strings.dialogs.allergensInfoDialog.msg_info}
                  numberOfLines={0}
                  style={styles.msgText}
                />
              )}

              <ScrollView horizontal={true} scrollEnabled={false}>
                {containerWidth && (
                  <FlatListWithPb
                    data={allergensIcons}
                    renderItem={(item) => (
                      <View
                        style={{
                          width: containerWidth! - SPACE.sm,
                          justifyContent: "center",
                          alignItems: "center",
                          marginEnd:
                            (item.index + 1) % 4 === 0 ? 0 : SPACE.sm
                        }}>
                        <Image
                          source={getAlergensIcon(item.item)}
                          style={[
                            styles.allergensIcon,
                            {
                              height: undefined,
                              width: "100%",
                              aspectRatio: 132 / 140
                            }
                          ]}
                        />
                      </View>
                    )}
                    shouldShowProgressBar={false}
                    isAllDataLoaded={true}
                    scrollEnabled={false}
                    listKey="2"
                    ItemSeparatorComponent={() => (
                      <View style={{ width: SPACE.sm }} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: SPACE.lg }}
                    numColumns={4}
                  />
                )}
              </ScrollView>

              {message && (
                <AppLabel
                  style={[styles.titleStyle]}
                  text={message}
                  numberOfLines={0}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(90,94,94,0.6)"
  },
  mainContainer: {
    flex: 0,
    height: "auto",
    width: "88%",
    flexDirection: "column",
    borderRadius: 12,
    backgroundColor: COLORS.theme?.primaryBackground
  },
  content: {
    borderRadius: 12,
    flexDirection: "column",
    alignItems: "center"
  },
  header: {
    height: 48,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.theme?.interface["50"],
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.4,
    shadowRadius: 2
  },
  heading: {
    position: "absolute",
    zIndex: 1,
    marginTop: 12,
    paddingHorizontal: SPACE._2md,
    textAlign: "center",
    alignSelf: "center",
    fontSize: FONT_SIZE.base
  },
  textContainer: {
    flexDirection: "column",
    maxHeight: 300
  },
  titleStyle: {
    fontSize: FONT_SIZE._3xs,
    textAlign: "left",
    lineHeight: 17,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.lg
  },
  messageStyle: {
    fontSize: FONT_SIZE.sm,
    textAlign: "center"
  },
  separator: {
    height: 0.5
  },
  spacer: {
    padding: SPACE.xs
  },
  messageText: { fontSize: FONT_SIZE.sm },
  crossIconContainer: {
    position: "absolute",
    zIndex: 1,
    right: 12,
    top: 12
  },
  buttons: {
    marginTop: SPACE.lg
  },
  allergensIcon: {
    marginTop: SPACE.sm,
    marginBottom: SPACE.xs,
    height: 65,
    width: 65
  },
  iconContainer: {
    height: 60,
    width: 56,
    borderWidth: 2,
    borderColor: COLORS.theme?.primaryColor,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  msgText: {
    fontSize: FONT_SIZE._2xs,
    color: COLORS.theme?.interface["700"],
    paddingTop: SPACE._2xl,
    paddingHorizontal: SPACE.lg,
    paddingBottom: SPACE.md
  }
});

export default AllergensInfoDialog;

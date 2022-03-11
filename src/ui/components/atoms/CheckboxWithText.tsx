import { COLORS, FONT_SIZE, FONTS, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React, { useEffect, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle
} from "react-native";
import CheckBox from "react-native-check-box";
import EIntBoolean from "models/enums/EIntBoolean";

interface OwnProps extends ViewProps {
  text: string;
  isBold?: boolean;
  style?: StyleProp<ViewStyle>;
  preSelected?: boolean;
  onChange: (checked: boolean, text?: string) => void;
  shouldNotOptimize?: boolean;
  isLocked?: EIntBoolean;
  textStyle?: StyleProp<TextStyle>;
}

type Props = OwnProps;

const CheckboxWithText = React.memo<Props>(
  ({
    text,
    style,
    preSelected,
    onChange,
    isLocked = EIntBoolean.FALSE,
    textStyle
  }) => {
    const [checked, setChecked] = useState(false);
    const { themedColors } = usePreferredTheme();

    //callback for preselected item only
    useEffect(() => {
      if (preSelected) {
        setChecked(true);
        onChange?.(true, text);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preSelected]);

    return (
      <View style={[styles.container, style]}>
        <CheckBox
          onClick={() => {
            setChecked(!checked);
            onChange(!checked, text);
          }}
          rightTextStyle={[
            styles.textStyle,
            { color: themedColors.interface["900"] },
            textStyle
          ]}
          style={styles.checkBox}
          isChecked={checked}
          rightText={text}
          checkBoxColor={
            !isLocked ? COLORS.blue2 : themedColors.secondaryBackground
          }
        />
      </View>
    );
  }
);
const styles = StyleSheet.create({
  checkboxText: {
    fontSize: FONT_SIZE.xs,
    marginLeft: SPACE.sm
  },
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  checkBox: {
    flex: 1,
    paddingBottom: SPACE._2md
  },
  textStyle: { fontFamily: FONTS.regular, fontSize: FONT_SIZE.sm }
});

export default CheckboxWithText;

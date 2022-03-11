import Cross from "assets/images/cross.svg";
import Search from "assets/images/search.svg";
import { COLORS, FONTS, FONT_SIZE, SPACE } from "config";
import { usePreferredTheme } from "hooks";
import React, {
  MutableRefObject,
  useEffect,
  useRef,
  useState
} from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  placeholder: string;
  onChangeText: (textToSearch?: string) => void;
  leftIcon?: boolean;
  rightIcon?: boolean;
  borderType?: BORDER_TYPE;
  OnClickedSearchField?: () => void;
}

type Props = OwnProps;

export enum BORDER_TYPE {
  DASHED = "dashed",
  SOLID = "solid",
  DOTTED = "dotted"
}

export const SearchField = React.memo<Props>(
  ({
    placeholder,
    style,
    onChangeText,
    leftIcon = false,
    rightIcon = false,
    borderType,
    OnClickedSearchField
  }) => {
    const [currentSearchText, setCurrentSearchText] = useState("");
    const theme = usePreferredTheme();
    let isProcess: MutableRefObject<boolean> = useRef(true);

    useEffect(() => {
      const timeoutRef = setTimeout(() => {
        if (isProcess.current) {
          isProcess.current = false;
          return;
        } else {
          onChangeText(currentSearchText);
        }
      }, 1000);

      return () => {
        clearTimeout(timeoutRef);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSearchText]);

    const getBorderStyle = () => {
      if (borderType === BORDER_TYPE.DASHED) {
        return styles.dashedBorderStyle;
      } else if (borderType === BORDER_TYPE.SOLID) {
        return styles.solidBorderStyle;
      } else if (borderType === BORDER_TYPE.DOTTED) {
        return styles.dottedBorderStyle;
      }
    };

    return (
      <View
        style={[
          getBorderStyle(),
          styles.container,
          {
            backgroundColor: theme.themedColors.primaryBackground,
            borderColor: theme.themedColors.interface["900"]
          },
          style
        ]}>
        {leftIcon && (
          <Search
            width={16}
            height={16}
            style={styles.leftIcon}
            testID={"left-icon"}
            stroke={theme.themedColors.interface["500"]}
          />
        )}
        <TextInput
          value={currentSearchText}
          placeholderTextColor={COLORS.theme?.interface["500"]}
          placeholder={placeholder}
          numberOfLines={1}
          testID="SEARCH"
          style={[
            leftIcon ? styles.textInput : styles.textInput,
            { color: COLORS.theme?.interface["900"] }
          ]}
          onTouchStart={OnClickedSearchField}
          onChangeText={setCurrentSearchText}
        />

        {rightIcon && (
          <TouchableOpacity onPress={() => setCurrentSearchText("")}>
            <Cross
              width={14}
              height={14}
              testID={"right-icon"}
              style={styles.rightIcon}
              fill={theme.themedColors.primaryColor}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10
  },
  leftIcon: {
    aspectRatio: 1,
    marginLeft: 12,
    marginRight: 5
  },
  rightIcon: {
    aspectRatio: 1,
    marginLeft: 8,
    marginRight: SPACE.sm
  },
  textInput: {
    fontFamily: FONTS.regular,
    flex: 1,
    fontSize: FONT_SIZE._3xs,
    paddingRight: SPACE.sm
  },
  dashedBorderStyle: {
    borderStyle: "dashed",
    borderWidth: 1
  },
  solidBorderStyle: {
    borderStyle: "solid",
    borderWidth: 1
  },
  dottedBorderStyle: {
    borderStyle: "dotted",
    borderWidth: 1
  }
});

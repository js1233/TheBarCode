import { COLORS } from "config";
import React, { FC, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { AppLabel } from "ui/components/atoms/app_label/AppLabel";

type Props = {
  text: string;
  targetLines: number;
};

export const ReadMoreLessText: FC<Props> = ({ text, targetLines }) => {
  const MAX_LINES = targetLines;
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<undefined | number>(
    undefined
  );
  const [showMoreButton, setShowMoreButton] = useState(false);

  const onTextLayout = useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    },
    [showText, MAX_LINES]
  );

  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : MAX_LINES);
    }
  }, [showText, showMoreButton, MAX_LINES]);

  return (
    <View>
      <AppLabel
        onTextLayout={onTextLayout}
        numberOfLines={numberOfLines}
        text={text}
      />

      {showMoreButton && (
        <TouchableOpacity
          onPress={() => setShowText(!showText)}
          accessibilityRole="button">
          <AppLabel
            text={showText ? "Read Less" : "Read More"}
            style={{ color: COLORS.theme?.primaryShade[800] }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

import React from "react";
import { StyleSheet } from "react-native";
import { FONT_SIZE } from "config";
import {
  AppLabel,
  TEXT_TYPE
} from "ui/components/atoms/app_label/AppLabel";

interface Props {
  text: string;
  shouldTruncate?: boolean;
}

const MAXIMUM_LENGTH = 20;

const HeaderTitle: React.FC<Props> = ({
  text,
  shouldTruncate = true
}: Props) => {
  const textToDisplay =
    shouldTruncate && text.length > MAXIMUM_LENGTH
      ? text.substring(0, MAXIMUM_LENGTH - 3) + "..."
      : text;
  return (
    <AppLabel
      text={textToDisplay}
      textType={TEXT_TYPE.BOLD}
      style={styles.title}
      numberOfLines={1}
    />
  );
};

const styles = StyleSheet.create({
  title: { fontSize: FONT_SIZE.base }
});

export default HeaderTitle;

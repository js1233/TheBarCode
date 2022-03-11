import React from "react";
import { StyleSheet, View } from "react-native";

interface OwnProps {}

type Props = OwnProps;

const ListItemSeparator = React.memo<Props>(() => {
  return <View style={styles.separator} />;
});

const styles = StyleSheet.create({
  separator: { width: "100%", height: 0.5, backgroundColor: "lightgray" }
});
export default ListItemSeparator;

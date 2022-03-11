import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatListWithPb } from "ui/components/organisms/flat_list/FlatListWithPb";
import BottomBreadCrumbsItem from "ui/components/templates/bottom_bread_crumbs/BottomBreadCrumbsItem";
import usePreferredTheme from "hooks/theme/usePreferredTheme";
import { dataType } from "ui/screens/demo/bottom_bread_crums/BottomBreadCrumbsView";

type Props = {
  children?: React.ReactNode;
  data: dataType[];
};

const BottomBreadCrumbs: FC<Props> = ({ children, data }) => {
  const theme = usePreferredTheme();
  const [selectedId, setSelectedId] = useState(data[0].title);
  const renderItem = ({ item }: { item: dataType }) => {
    const backgroundColor =
      item.title === selectedId
        ? theme.themedColors.interface["900"]
        : theme.themedColors.interface["700"];
    return (
      <BottomBreadCrumbsItem
        title={item.title}
        onPress={() => {
          setSelectedId(item.title);
          item.onPress();
        }}
        style={{ backgroundColor }}
      />
    );
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.themedColors.primaryBackground }
      ]}>
      {children}
      <View
        style={[
          styles.horizontalLine,
          { backgroundColor: theme.themedColors.interface["500"] }
        ]}
      />
      <FlatListWithPb
        data={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={renderItem}
        horizontal={true}
        shouldShowProgressBar={true}
        style={styles.FlatList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  FlatList: {
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  horizontalLine: {
    height: 1
  }
});

export default BottomBreadCrumbs;

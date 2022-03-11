import React from "react";
import { View } from "react-native";
import { AppLog, TAG } from "utils/Util";
import MultiSelectList from "ui/components/organisms/multi_select_list/MultiSelectList";
import Screen from "ui/components/atoms/Screen";
import { COLORS, SPACE } from "config";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { Preferences } from "utils/DataGenerator";
import Preference from "models/Preference";

type Props = {};

const MultiSelectListView = React.memo<Props>(({}) => {
  return (
    <Screen style={{ flex: 1 }}>
      <MultiSelectList<Preference>
        containerStyle={{ padding: SPACE.md }}
        itemView={(isSelected, item) => (
          <View>
            <AppLabel
              text={item.first_name}
              style={[
                { padding: SPACE._2md },
                isSelected
                  ? { color: COLORS.yellow }
                  : { color: COLORS.black }
              ]}
            />
          </View>
        )}
        onSelectionChange={(value) =>
          AppLog.log(
            () => "onSelectionChange: " + JSON.stringify(value),
            TAG.COMPONENT
          )
        }
        data={Preferences}
      />
    </Screen>
  );
});

export default MultiSelectListView;

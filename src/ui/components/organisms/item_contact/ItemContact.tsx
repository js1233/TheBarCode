import Cross from "assets/images/tick.svg";
import { COLORS, FONT_SIZE, SPACE } from "config";
import { Contact } from "models/Contact";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLabel } from "ui/components/atoms/app_label/AppLabel";
import { shadowStyleProps } from "utils/Util";

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
  isSelected?: boolean;
};

const ItemContact = React.memo<Props>(({ contact, isSelected }) => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View>
          {contact.name && (
            <AppLabel
              text={contact.name}
              style={[
                styles.name,
                isSelected
                  ? { color: COLORS.theme?.primaryColor }
                  : { color: COLORS.black }
              ]}
            />
          )}
          <AppLabel
            text={contact.email}
            style={[
              styles.email,
              isSelected
                ? { color: COLORS.theme?.primaryColor }
                : { color: COLORS.black }
            ]}
          />
        </View>
        {isSelected && (
          <Cross
            fill={isSelected ? COLORS.theme?.primaryColor : COLORS.black}
            width={15}
            height={15}
          />
        )}
      </View>
    </View>
  );
});

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    marginBottom: SPACE.lg,
    padding: SPACE.lg,
    backgroundColor: COLORS.theme?.interface["50"],
    ...shadowStyleProps,
    shadowOpacity: 0.2
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 35
  },
  name: {
    fontSize: FONT_SIZE.sm
  },
  email: {
    fontSize: FONT_SIZE._3xs
  }
});

export default ItemContact;

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type AccordionProps = {
  header: (isExpanded: boolean) => React.ReactElement;
  expandableItem: () => React.ReactElement | null;
  isExpanded?: boolean;
  executingTask?: () => boolean;
};

const Accordion: React.FC<AccordionProps> = ({
  header,
  expandableItem,
  isExpanded = false,
  executingTask
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    executingTask && setExpanded(executingTask());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={style.container}>
      <TouchableOpacity
        testID="accordion-header"
        onPress={() => {
          setExpanded((prevState) => !prevState);
        }}>
        {header ? header(expanded) : null}
      </TouchableOpacity>
      <View testID="accordion-body">
        {expanded ? expandableItem() : null}
      </View>
    </View>
  );
};

export default Accordion;

const style = StyleSheet.create({
  container: {
    flex: 1
  }
});

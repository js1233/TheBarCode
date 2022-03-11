import React, { FC } from "react";
import Timings from "ui/components/organisms/timing_list/Timings";
import { deliveryData } from "ui/screens/home/demo_component/expendable_list/DummyData";

type Props = {};

export const ExpandableListView: FC<Props> = () => {
  return (
    <Timings label="OPENING TIMES" data={deliveryData} selectedIndex={1} />
  );
};

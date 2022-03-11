import React, { FC } from "react";
import AppPopUpWithActionsButton from "ui/components/organisms/app_popup/AppPopUpWithActionsButton";

type Props = {
  shouldShow: boolean;
  message: string;
  title: string;
  hideDialogue: () => void;
};

const CustomAlertWithTitleAndMessage: FC<Props> = React.memo(
  ({ title, shouldShow, message, hideDialogue }) => {
    return (
      <AppPopUpWithActionsButton
        isVisible={shouldShow}
        title={title}
        message={message}
        actions={[{ title: "Ok", onPress: hideDialogue }]}
      />
    );
  }
);

export default CustomAlertWithTitleAndMessage;

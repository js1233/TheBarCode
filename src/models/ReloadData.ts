import { AppLog, TAG } from "utils/Util";
import DateTime from "./DateTime";
import { Region } from "./Venue";

type ReloadData = {
  region?: Region;
  credit: number;
  saving: number;
  saving_last_reload?: number;
  redeemed_count?: number;
  is_first_redeem: boolean;
  redeem_datetime?: DateTime;
  current_server_datetime?: DateTime;
  remaining_seconds: number;
};

export const fixDataIssues = (reloadData: ReloadData) => {
  AppLog.log(
    () => "inside fixDataIssues: " + JSON.stringify(reloadData),
    TAG.RELOAD_BANNER
  );
  if (reloadData.is_first_redeem) {
    reloadData.remaining_seconds = 604800;
  }

  // for testing on counter end
  // if (true) {
  //   reloadData.is_first_redeem = false;
  //   reloadData.remaining_seconds = 5;
  // }
  return reloadData;
};

export const isAbleToReload = (reloadData: ReloadData) => {
  return (
    !reloadData?.is_first_redeem && reloadData?.remaining_seconds <= 0
  );
};

export default ReloadData;

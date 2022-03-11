import { ViewApiRequestModel } from "models/api_requests/ViewApiRequestModel";
import { useEditsApis } from "repo/edits/EditsApis";

export default () => {
  const { request: sendAnalyticsRequest } = useEditsApis().sendAnalytics;
  const sendAnalytics = async (type: string, value: string) => {
    const requestModel: ViewApiRequestModel = {
      type: type,
      value: value
    };
    await sendAnalyticsRequest(requestModel);
  };
  return { sendAnalytics };
};

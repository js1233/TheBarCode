import { ListApiSuccessResponseModel } from "models/api_responses/ListApiSuccessResponseModel";
import Preference from "models/Preference";

type GetPreferencesResponseModel = ListApiSuccessResponseModel<Preference>;

export default GetPreferencesResponseModel;

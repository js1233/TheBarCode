import AsyncStorage from "@react-native-async-storage/async-storage";
import { EditsApiResponseModel } from "models/api_responses/EditsApiResponseModel";
import { AppLog } from "utils/Util";

const key = "edits_bookmark";

const storeEditsBookmark = async (edits: EditsApiResponseModel) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(edits));
  } catch (error: any) {
    AppLog.log(() => "Error storing the edits bookmark", error);
  }
};

const getEditsBookmark = async () => {
  try {
    const editsBookmarkAsString = await AsyncStorage.getItem(key);
    if (
      editsBookmarkAsString !== null &&
      editsBookmarkAsString !== undefined
    ) {
      return JSON.parse(editsBookmarkAsString) as EditsApiResponseModel;
    }
  } catch (error) {
    AppLog.warn("Error getting the edits bookmark", error);
  }
};

export default {
  storeEditsBookmark,
  getEditsBookmark
};

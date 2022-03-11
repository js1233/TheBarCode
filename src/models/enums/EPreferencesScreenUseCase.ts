import { STRINGS } from "config";

enum EPreferencesScreenUseCase {
  SET_USER_PREFERENCES,
  UPDATE_USER_PREFERENCES,
  FILTER
}

type Property = {
  enum: EPreferencesScreenUseCase;
  title: string;
  buttonText: string;
};

const properties: Property[] = [
  {
    enum: EPreferencesScreenUseCase.SET_USER_PREFERENCES,
    title: STRINGS.preferences.title_set_preferences,
    buttonText: STRINGS.preferences.action_done
  },
  {
    enum: EPreferencesScreenUseCase.UPDATE_USER_PREFERENCES,
    title: STRINGS.preferences.title_update_preferences,
    buttonText: STRINGS.preferences.action_update
  },
  {
    enum: EPreferencesScreenUseCase.FILTER,
    title: STRINGS.preferences.title_filter,
    buttonText: STRINGS.preferences.action_done
  }
];

export const getProperty = (_enum: EPreferencesScreenUseCase) => {
  return properties.find((value) => value.enum === _enum) ?? properties[0];
};

export default EPreferencesScreenUseCase;

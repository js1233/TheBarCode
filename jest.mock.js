/* eslint-disable no-undef */

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn()
}));

jest.mock("react-native/Libraries/Components/Switch/Switch", () => {
  const mockComponent = require("react-native/jest/mockComponent");
  return mockComponent("react-native/Libraries/Components/Switch/Switch");
});

jest.mock("@react-navigation/native", () => {
  return {
    createNavigatorFactory: jest.fn(),
    useNavigation: jest.fn()
  };
});

jest.mock("@react-navigation/stack", () => ({
  createStackNavigator: jest.fn()
}));

jest.mock("@react-native-community/masked-view", () => ({}));

jest.mock("toggle-switch-react-native", () => "");

// jest.mock("react-native-onesignal", () => "");

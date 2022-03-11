const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "react-native",
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgMocks.js"
  },
  transform: {
    ...tsjPreset.transform,
    "\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "\\.svg$": require.resolve("react-native-svg-transformer")
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|react-native-keychain|react-native-button))"
  ],
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFiles: [
    "./node_modules/react-native-gesture-handler/jestSetup.js",
    "./jest.mock.js"
  ],
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: ".jest/cache"
};

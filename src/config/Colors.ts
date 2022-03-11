import { ColorPalette } from "hooks/theme/ColorPaletteContainer";

let theme: ColorPalette | undefined;

const colors = {
  white: "#FFFFFF",
  black: "#000000",
  yellow: "#FFE000",
  blue: "#1877F2",
  red: "#EF4444",
  green: "#608B2F",
  purple: "#E5BAFF",
  orange: "#F97316",

  green1: "#69FF97",
  green2: "#0F766E",

  blue1: "#E0F2FE",
  blue2: "#00E4FF",

  grey1: "#E5E5E5",
  grey2: "#D4D4D4",

  red1: "#FEE2E2",

  transparent: "transparent",

  facebook: "#3B5998",
  twitter: "#55ACEE",

  theme: theme
};

//for future, if we want to update colors from usePreferredTheme hook
export const updateAppTheme = (appTheme: ColorPalette) => {
  colors.theme = appTheme;
};

export default {
  colors: colors
};

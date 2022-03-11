import Colors from "config/Colors";

export type Shades = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type GrayShades = {
  blueGray: Shades;
  coolGray: Shades;
  gray: Shades;
  trueGray: Shades;
  warmGray: Shades;
};

export const grayShades: GrayShades = {
  blueGray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A"
  },
  coolGray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827"
  },
  gray: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B"
  },
  trueGray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717"
  },
  warmGray: {
    50: "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917"
  }
};

export type PrimaryShades = {
  teal: Shades;
};

export const primaryShades: PrimaryShades = {
  teal: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A"
  }
};

export type ColorPalette = {
  primaryColor: string;
  secondaryColor: string;

  primaryBackground: string;
  secondaryBackground: string;

  error: string;

  placeholderColor: string;
  borderColor: string;

  primaryShade: Shades;
  interface: Shades;
};

type ColorPaletteContainer = {
  light: ColorPalette;
  dark: ColorPalette;
  [key: string]: ColorPalette;
};

export const colorPaletteContainer: ColorPaletteContainer = {
  light: {
    primaryColor: primaryShades.teal[700],
    secondaryColor: grayShades.trueGray[300],

    primaryBackground: Colors.colors.white,
    secondaryBackground: grayShades.trueGray[100],

    error: "#CF6679",

    placeholderColor: grayShades.trueGray[500],
    borderColor: "#D4D4D4",

    primaryShade: primaryShades.teal,
    interface: grayShades.trueGray
  },
  dark: {
    primaryColor: "#2C2C2C",
    secondaryColor: "#5858FF",

    primaryBackground: "#000000",
    secondaryBackground: "#1C1C1E",

    error: "#FF0000",

    placeholderColor: "#6B7280",
    borderColor: "#4A4A4A",

    primaryShade: primaryShades.teal,
    interface: grayShades.trueGray
  }
};

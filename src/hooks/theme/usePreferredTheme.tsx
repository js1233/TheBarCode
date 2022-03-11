import React from "react";
import {
  ColorPalette,
  colorPaletteContainer
} from "hooks/theme/ColorPaletteContainer";
import { useColorScheme } from "react-native";

export enum AppColorScheme {
  SYSTEM = "system",
  LIGHT = "light",
  DARK = "dark"
}

type ThemeContext = {
  isDark: boolean;
  themedColors: ColorPalette;
  setScheme: (scheme: AppColorScheme) => void;
};

const ThemeContext = React.createContext<ThemeContext>({
  isDark: false,
  themedColors: colorPaletteContainer.light,
  setScheme: () => {}
});

interface ThemeProviderProps {
  children: React.ReactNode;
  colorScheme: AppColorScheme;
}

type Props = ThemeProviderProps;

export const AppThemeProvider = React.memo<Props>((props) => {
  const systemColorScheme = useColorScheme();

  const colorScheme =
    props.colorScheme === AppColorScheme.SYSTEM
      ? systemColorScheme
      : props.colorScheme;

  const [isDark, setIsDark] = React.useState(
    colorScheme === AppColorScheme.DARK
  );

  // Listening to changes of device appearance while in run-time
  React.useEffect(() => {
    setIsDark(colorScheme === AppColorScheme.DARK);
  }, [colorScheme]);

  const theme = {
    isDark,
    themedColors: isDark
      ? colorPaletteContainer.dark
      : colorPaletteContainer.light,
    setScheme: (scheme: AppColorScheme) =>
      setIsDark(scheme === AppColorScheme.DARK)
  };

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
});

const usePreferredTheme = () => React.useContext(ThemeContext);

export default usePreferredTheme;

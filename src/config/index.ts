export { default as API } from "./Api";
export { default as FONTS } from "./Fonts";
export { default as STRINGS } from "./Strings";

export { FONT_SIZE } from "./Dimens";
export { SPACE } from "./Dimens";

import { colorPaletteContainer } from "hooks/theme/ColorPaletteContainer";
import { default as _COLORS } from "./Colors";
_COLORS.colors.theme = colorPaletteContainer.light;
export const COLORS = _COLORS.colors;

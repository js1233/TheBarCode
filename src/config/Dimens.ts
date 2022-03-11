import { Dimensions } from "react-native";

export const { width, height } = Dimensions.get("window");

// Guideline sizes are based on iPhone 11 Pro screen
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scaleWidth = width / guidelineBaseWidth;
const scaleHeight = height / guidelineBaseHeight;
const minScale = Math.min(scaleWidth, scaleHeight);
const threshold = 0.85;

const scaleWithThreshold = (size: number) => {
  let _minScale = minScale;
  if (minScale < threshold) {
    _minScale = threshold;
    size = size + 1;
  }
  // console.log("Debugging Fonts, minScale: " + minScale);
  // console.log("Debugging Fonts, minScaleWithThreshold: " + _minScale);

  return Math.ceil(size * _minScale);
};

export { scaleWithThreshold };

type SIZE_HEIGHT_DOUBLE = { size: number; height: number };

let mapsOfSizesAndHeight = new Map<String, SIZE_HEIGHT_DOUBLE>();
mapsOfSizesAndHeight.set("_4xs", {
  size: scaleWithThreshold(9.0),
  height: scaleWithThreshold(15.0)
});
mapsOfSizesAndHeight.set("_3xs", {
  size: scaleWithThreshold(13.0),
  height: scaleWithThreshold(17.0)
});
mapsOfSizesAndHeight.set("_2xs", {
  size: scaleWithThreshold(14.0),
  height: scaleWithThreshold(19.0)
});
mapsOfSizesAndHeight.set("xs", {
  size: scaleWithThreshold(15.0),
  height: scaleWithThreshold(21.0)
});
mapsOfSizesAndHeight.set("sm", {
  size: scaleWithThreshold(16.0),
  height: scaleWithThreshold(23.0)
});
mapsOfSizesAndHeight.set("base", {
  size: scaleWithThreshold(17.0),
  height: scaleWithThreshold(25.0)
});
mapsOfSizesAndHeight.set("lg", {
  size: scaleWithThreshold(19.0),
  height: scaleWithThreshold(27.0)
});
mapsOfSizesAndHeight.set("xl", {
  size: scaleWithThreshold(21.0),
  height: scaleWithThreshold(29.0)
});
mapsOfSizesAndHeight.set("_2xl", {
  size: scaleWithThreshold(25.0),
  height: scaleWithThreshold(33.0)
});
mapsOfSizesAndHeight.set("_3xl", {
  size: scaleWithThreshold(31.0),
  height: scaleWithThreshold(37.0)
});

export const FONT_SIZE = {
  _4xs: mapsOfSizesAndHeight.get("_4xs")?.size,
  _3xs: mapsOfSizesAndHeight.get("_3xs")?.size,
  _2xs: mapsOfSizesAndHeight.get("_2xs")?.size,
  xs: mapsOfSizesAndHeight.get("xs")?.size,
  sm: mapsOfSizesAndHeight.get("sm")?.size,
  base: mapsOfSizesAndHeight.get("base")?.size,
  lg: mapsOfSizesAndHeight.get("lg")?.size,
  xl: mapsOfSizesAndHeight.get("xl")?.size,
  _2xl: mapsOfSizesAndHeight.get("_2xl")?.size,
  _3xl: mapsOfSizesAndHeight.get("_3xl")?.size
};

const _mapsOfSizesAndHeightWithSizeKey = new Map(
  parseMap(mapsOfSizesAndHeight)
);

function parseMap(mapWithLabelAsKey: Map<String, SIZE_HEIGHT_DOUBLE>) {
  let mapWithSizeAsKey = new Map<number, number>();
  mapWithLabelAsKey.forEach((value) => {
    mapWithSizeAsKey.set(value.size, value.height);
  });
  return mapWithSizeAsKey;
}

export const FONT_SIZE_LINE_HEIGHT = {
  xs: mapsOfSizesAndHeight.get("xs")?.height,
  sm: mapsOfSizesAndHeight.get("sm")?.height,
  base: mapsOfSizesAndHeight.get("base")?.height,
  lg: mapsOfSizesAndHeight.get("lg")?.height,
  xl: mapsOfSizesAndHeight.get("xl")?.height,
  _2xl: mapsOfSizesAndHeight.get("_2xl")?.height,
  _3xl: mapsOfSizesAndHeight.get("_3xl")?.height,
  ofFontSize: (size: number) =>
    _mapsOfSizesAndHeightWithSizeKey.get(size) ??
    mapsOfSizesAndHeight.get("base")?.height
};

export const SPACE = {
  _2xs: 4.0,
  xs: 6.0,
  sm: 8.0,
  _2md: 10.0,
  md: 12.0,
  _2lg: 14.0,
  lg: 16.0,
  xl: 18.0,
  _2xl: 24.0,
  _3xl: 32,
  _4xl: 48
};

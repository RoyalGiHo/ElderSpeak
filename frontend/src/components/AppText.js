import React, { useMemo } from "react";
import { StyleSheet, Text as RNText } from "react-native";
import { useAppSettings } from "../store/AppSettingsContext";

function getFontScale(fontSizeSetting) {
  if (fontSizeSetting === "A+") return 1.08;
  if (fontSizeSetting === "A-") return 0.92;
  return 1;
}

function scaleTypography(style, scale) {
  const flatStyle = StyleSheet.flatten(style);
  if (!flatStyle || scale === 1) return style;

  const scaledStyle = { ...flatStyle };
  if (typeof flatStyle.fontSize === "number") {
    scaledStyle.fontSize = Math.round(flatStyle.fontSize * scale);
  }
  if (typeof flatStyle.lineHeight === "number") {
    scaledStyle.lineHeight = Math.round(flatStyle.lineHeight * scale);
  }
  if (typeof flatStyle.letterSpacing === "number") {
    scaledStyle.letterSpacing = Number((flatStyle.letterSpacing * scale).toFixed(2));
  }

  return scaledStyle;
}

export default function AppText({ style, ...props }) {
  const { settings } = useAppSettings();
  const scale = getFontScale(settings.fontSize);
  const scaledStyle = useMemo(() => scaleTypography(style, scale), [style, scale]);

  return <RNText {...props} style={scaledStyle} />;
}

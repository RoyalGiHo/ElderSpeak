import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useAppSettings } from "../store/AppSettingsContext";
import { playSfx } from "../utils/soundEffects";

export default function PrimaryButton({ label, onPress, disabled, style }) {
  const { settings } = useAppSettings();
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={() => {
        playSfx("tap", settings.soundFx);
        onPress?.();
      }}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
      <View style={styles.arrowCircle}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D5CFF",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 24,
    height: 60,
  },
  disabled: { backgroundColor: "#A0A8E0" },
  text: { color: "#fff", fontSize: 16, fontWeight: "700" },
  arrowCircle: {
    position: "absolute",
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: { color: "#3D5CFF", fontSize: 18, fontWeight: "600" },
});

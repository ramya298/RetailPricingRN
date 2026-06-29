import React from "react";
import { View } from "react-native";
import { useColors, Spacing } from "../../theme";

export function Divider() {
  const c = useColors();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: c.border,
        marginVertical: Spacing.md,
      }}
    />
  );
}

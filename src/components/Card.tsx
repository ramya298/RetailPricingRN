// ─── Card ─────────────────────────────────────────────────────────────────────
import React from "react";
import { View, ViewStyle } from "react-native";
import { useColors, Spacing, Radius } from "../theme";

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const c = useColors();
  return (
    <View
      style={[
        {
          backgroundColor: c.surface1,
          borderRadius: Radius.lg,
          borderWidth: 1,
          borderColor: c.border,
          padding: Spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

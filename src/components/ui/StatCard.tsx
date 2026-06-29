import React from "react";
import { View, Text } from "react-native";
import { useColors, Spacing, Radius, FontSize, FontWeight } from "../../theme";

export function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  const c = useColors();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: c.surface2,
        borderRadius: Radius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: c.border,
      }}
    >
      <Text
        style={{ fontSize: FontSize.xs, color: c.textMuted, marginBottom: 4 }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: FontWeight.semibold,
          color: color ?? c.textPrimary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

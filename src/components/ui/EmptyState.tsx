import React from "react";
import { View, Text } from "react-native";
import { useColors, Spacing, FontSize, FontWeight } from "../../theme";

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const c = useColors();
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 60,
        paddingHorizontal: 32,
      }}
    >
      <View style={{ marginBottom: 12, opacity: 0.4 }}>{icon}</View>
      <Text
        style={{
          fontSize: FontSize.lg,
          fontWeight: FontWeight.medium,
          color: c.textPrimary,
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: FontSize.sm,
            color: c.textMuted,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

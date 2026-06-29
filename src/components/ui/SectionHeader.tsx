import React from "react";
import { View, Text } from "react-native";
import { useColors, Spacing, FontSize, FontWeight } from "../../theme";

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const c = useColors();
  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <Text
        style={{
          fontSize: FontSize.xxl,
          fontWeight: FontWeight.semibold,
          color: c.textPrimary,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: FontSize.sm,
            color: c.textSecondary,
            marginTop: 4,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

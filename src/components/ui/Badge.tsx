import React from "react";
import { View, Text } from "react-native";
import { useColors, Spacing, Radius, FontSize, FontWeight } from "../../theme";

export function Badge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
}) {
  const c = useColors();
  const config = {
    success: { bg: c.bgSuccess, text: c.textSuccess },
    danger: { bg: c.bgDanger, text: c.textDanger },
    warning: { bg: c.bgWarning, text: c.textWarning },
    info: { bg: c.bgAccent, text: c.textAccent },
    neutral: { bg: c.surface0, text: c.textMuted },
  } as const;
  const { bg, text } = config[variant];

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: Radius.pill,
      }}
    >
      <Text
        style={{
          color: text,
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

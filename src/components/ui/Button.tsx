import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import { useColors, Spacing, Radius, FontSize, FontWeight } from "../../theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  small?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  style,
  small,
}: ButtonProps) {
  const c = useColors();
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const isSecondary = variant === "secondary";

  const bg = isPrimary ? c.fillAccent : isDanger ? c.textDanger : "transparent";
  const borderColor = isSecondary
    ? c.borderStrong
    : isPrimary
      ? c.fillAccent
      : isDanger
        ? c.textDanger
        : c.border;
  const textColor = isPrimary || isDanger ? "#fff" : c.textPrimary;
  const pad = small
    ? { paddingHorizontal: 12, paddingVertical: 7 }
    : { paddingHorizontal: 18, paddingVertical: 12 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor,
          borderRadius: Radius.md,
          opacity: disabled ? 0.5 : 1,
          ...pad,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? "#fff" : c.textAccent}
        />
      ) : (
        <>
          {icon}
          <Text
            style={{
              color: textColor,
              fontSize: small ? FontSize.sm : FontSize.base,
              fontWeight: FontWeight.medium,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

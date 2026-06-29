import { View, Text, TouchableOpacity, TextStyle } from "react-native";
import { useColors, FontSize, FontWeight } from "../../theme";

export function RowItem({
  label,
  value,
  labelStyle,
  valueStyle,
  onPress,
}: {
  label: string;
  value: string;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  onPress?: () => void;
}) {
  const c = useColors();
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <Text
        style={[
          { fontSize: FontSize.sm, color: c.textSecondary, flex: 1 },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          {
            fontSize: FontSize.sm,
            color: c.textPrimary,
            fontWeight: FontWeight.medium,
            textAlign: "right",
            flex: 1,
          },
          valueStyle,
        ]}
      >
        {value}
      </Text>
    </Container>
  );
}

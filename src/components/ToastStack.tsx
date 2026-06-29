import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { useColors, Spacing, Radius, FontSize, FontWeight } from '../theme';
import type { NotificationType } from '../types';

export function ToastStack() {
  const { notifications, removeNotification } = useAppStore();
  const insets = useSafeAreaInsets();
  const c = useColors();

  const config: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; bg: string; text: string; border: string }> = {
    success: { icon: 'checkmark-circle', bg: c.bgSuccess, text: c.textSuccess, border: c.bgSuccess },
    error: { icon: 'alert-circle', bg: c.bgDanger, text: c.textDanger, border: c.bgDanger },
    warning: { icon: 'warning', bg: c.bgWarning, text: c.textWarning, border: c.bgWarning },
    info: { icon: 'information-circle', bg: c.bgAccent, text: c.textAccent, border: c.bgAccent },
  };

  if (!notifications.length) return null;

  return (
    <View style={[styles.stack, { top: insets.top + 12 }]}>
      {notifications.map((n) => {
        const { icon, bg, text } = config[n.type];
        return (
          <View key={n.id} style={[styles.toast, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={18} color={text} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: text }}>{n.title}</Text>
              {n.message && <Text style={{ fontSize: FontSize.xs, color: text, opacity: 0.8, marginTop: 2 }}>{n.message}</Text>}
            </View>
            <TouchableOpacity onPress={() => removeNotification(n.id)}>
              <Ionicons name="close" size={16} color={text} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
});

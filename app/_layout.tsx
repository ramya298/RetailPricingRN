import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastStack } from "../src/components/ToastStack";
import { seedIfEmpty } from "../src/services/dataService";
import { useAppStore } from "../src/store/appStore";
import { AppProvider, store } from "../src/store/reduxStore";
import { Colors } from "../src/theme";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppLayout() {
  const colorScheme = useColorScheme();
  const c = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { isSeeded, setSeeded } = useAppStore();

  useEffect(() => {
    if (!isSeeded) {
      seedIfEmpty().then(setSeeded);
    }
  }, [isSeeded, setSeeded]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <ToastStack />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider store={store}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppLayout />
        </QueryClientProvider>
      </SafeAreaProvider>
    </AppProvider>
  );
}

# Retail Pricing Feed Manager — React Native (Expo 54)

Mobile version of the Retail Pricing Feed Management case study.

## Stack

- **Expo 54** + **Expo Router 4** (file-based routing)
- **React Native 0.76**
- **expo-document-picker** — native file picker (iOS Files + Android file manager)
- **expo-file-system** — read CSV from `file://` URI to string
- **PapaParse** — CSV parsing (same config as web)
- **AsyncStorage** — replaces localStorage for persistence
- **TanStack React Query** — server state, caching
- **Redux Toolkit** — global UI state (toasts, seed flag)
- **@expo/vector-icons** (Ionicons) — icons

## Quick Start

```bash
cd retail-pricing-rn
npm install
npx expo start
```

Scan QR with Expo Go app, or press `i` for iOS Simulator / `a` for Android.

## Key web → mobile changes

| Concern | Web SPA | React Native |
|---|---|---|
| File picker | `<input type="file">` | `expo-document-picker` |
| Read file | `FileReader` / File object | `FileSystem.readAsStringAsync(uri)` |
| Storage | `localStorage` | `AsyncStorage` |
| Routing | React Router | Expo Router (file-based) |
| Navigation | Sidebar | Bottom tab bar |
| Styling | CSS / CSS variables | `StyleSheet.create` + theme tokens |
| Modals | `position: fixed` | `<Modal>` with `presentationStyle="pageSheet"` |
| Lists | HTML table | `<FlatList>` (virtualised) |
| Notifications | DOM overlay | Absolute-positioned `<View>` above tabs |
| Dark mode | `prefers-color-scheme` media query | `useColorScheme()` hook + token map |

## Screens

- **Upload** — tap to open native file picker → parse → validate → ingest → show summary
- **Search** — `FlatList` with search bar, inline edit (modal), delete with Alert

## iOS note

On iOS, MIME type filtering (`text/csv`) is unreliable. The app includes `*/*` as a fallback and validates by `.csv` extension after picking.

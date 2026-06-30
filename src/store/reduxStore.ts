import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { Notification, NotificationType } from "../types";

interface AppState {
  notifications: Notification[];
  isSeeded: boolean;
}

const initialState: AppState = {
  notifications: [],
  isSeeded: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        id: string;
        type: NotificationType;
        title: string;
        message?: string;
      }>,
    ) => {
      state.notifications.push({
        id: action.payload.id,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },
    setSeeded: (state) => {
      state.isSeeded = true;
    },
  },
});

export const { addNotification, removeNotification, setSeeded } =
  appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const AppProvider = Provider;

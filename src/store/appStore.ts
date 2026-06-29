import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  removeNotification,
  setSeeded,
  store,
  type AppDispatch,
  type RootState,
} from "./reduxStore";
import type { NotificationType } from "../types";

export function useAppStore() {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.app.notifications,
  );
  const isSeeded = useSelector((state: RootState) => state.app.isSeeded);

  return useMemo(
    () => ({
      notifications,
      isSeeded,
      addNotification: (
        type: NotificationType,
        title: string,
        message?: string,
      ) => {
        dispatch(addNotification({ type, title, message }));
        setTimeout(() => {
          dispatch(
            removeNotification(getNotificationIdForToast(type, title, message)),
          );
        }, 4000);
      },
      removeNotification: (id: string) => dispatch(removeNotification(id)),
      setSeeded: () => dispatch(setSeeded()),
    }),
    [dispatch, notifications, isSeeded],
  );
}

function getNotificationIdForToast(
  type: NotificationType,
  title: string,
  message?: string,
) {
  return `${type}-${title}-${message ?? ""}`;
}

export { store };

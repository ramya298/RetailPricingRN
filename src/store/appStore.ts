import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "../services/uuid";
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
        const id = uuid();
        dispatch(addNotification({ id, type, title, message }));
        setTimeout(() => {
          dispatch(removeNotification(id));
        }, 4000);
      },
      removeNotification: (id: string) => dispatch(removeNotification(id)),
      setSeeded: () => dispatch(setSeeded()),
    }),
    [dispatch, notifications, isSeeded],
  );
}

export { store };

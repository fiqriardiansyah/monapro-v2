import { notification } from "antd";
import { NotificationInstance } from "antd/lib/notification";
import React, { createContext, useMemo, useState } from "react";

type Props = {
    children: any;
};

type ValueContextType = {
    notificationInstance: NotificationInstance | null;
};

const StateContext = createContext<ValueContextType>({
    notificationInstance: null,
});

function StateProvider({ children }: Props) {
    const [notificationInstance, contextHolder] = notification.useNotification();

    const value = useMemo(
        () => ({
            notificationInstance,
        }),
        []
    );
    return (
        <StateContext.Provider value={value as any}>
            {contextHolder}
            {children}
        </StateContext.Provider>
    );
}

export { StateContext, StateProvider };

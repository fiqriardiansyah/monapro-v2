import Cookies from "js-cookie";
import { AuthData } from "models";
import React, { createContext, Dispatch, SetStateAction, useMemo, useState } from "react";
import { useQuery } from "react-query";
import authService from "services/api-endpoints/auth";
import { EMAIL_USER, NAME_USER, ROLE_ACCESS, TOKEN_USER } from "utils/constant";

type Props = {
    children: any;
};

type StateType = {
    user?: Partial<AuthData> | null;
};

type ValueContextType = {
    state: StateType;
    setState?: Dispatch<SetStateAction<StateType>>;
};

const UserContext = createContext<ValueContextType>({
    state: {
        user: {
            token: Cookies.get(TOKEN_USER),
            fullname: Cookies.get(NAME_USER),
            email: Cookies.get(EMAIL_USER),
            role_access: JSON.parse(localStorage.getItem(ROLE_ACCESS) || "{}"),
        },
    },
});

function UserProvider({ children }: Props) {
    const [state, setState] = useState<StateType | null>({
        user: {
            token: Cookies.get(TOKEN_USER),
            fullname: Cookies.get(NAME_USER),
            email: Cookies.get(EMAIL_USER),
            role_access: JSON.parse(localStorage.getItem(ROLE_ACCESS) || "{}"),
        },
    });

    useQuery(
        [authService.getLoginUser],
        async () => {
            return (await authService.GetLoginUser()).data.data;
        },
        {
            enabled: !!Cookies.get(TOKEN_USER),
            onSuccess: (data) => {
                setState((prev) => ({
                    ...prev,
                    user: data,
                }));
            },
        }
    );

    const value = useMemo(
        () => ({
            state,
            setState,
        }),
        [state]
    );
    return <UserContext.Provider value={value as any}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };

import Cookies from "js-cookie";
import { AuthData } from "models";
import React, { createContext, Dispatch, SetStateAction, useMemo, useState } from "react";
import { TOKEN_USER } from "utils/constant";

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
        },
    },
});

function UserProvider({ children }: Props) {
    const [state, setState] = useState<StateType | null>({
        user: {
            token: Cookies.get(TOKEN_USER),
        },
    });

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

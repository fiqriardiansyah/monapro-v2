import { AuthData } from "models";
import React, { createContext, useMemo, useState } from "react";

type Props = {
    children: any;
};

type StateType = {
    user?: AuthData | null;
};

const UserContext = createContext(null);

function UserProvider({ children }: Props) {
    const [state, setState] = useState<StateType | null>(null);

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

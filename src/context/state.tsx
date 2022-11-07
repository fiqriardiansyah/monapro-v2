import React, { createContext, useMemo, useState } from "react";

type Props = {
    children: any;
};

const StateContext = createContext(null);

function StateProvider({ children }: Props) {
    const [state, setState] = useState();

    const value = useMemo(
        () => ({
            state,
            setState,
        }),
        [state]
    );
    return <StateContext.Provider value={value as any}>{children}</StateContext.Provider>;
}

export { StateContext, StateProvider };

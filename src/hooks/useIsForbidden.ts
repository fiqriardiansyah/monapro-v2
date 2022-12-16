import { AuthData } from "models";
import React from "react";

type Props = {
    roleAccess?: AuthData["role_access"] | undefined;
    access: "dashboard" | "agenda" | "justification" | "data_recap" | "master_data" | "profile";
};

const useIsForbidden = ({ roleAccess, access }: Props) => {
    if (!roleAccess) return true;
    const isForbid = (roleAccess.find((rl) => Object.keys(rl)[0] === access) as any)[access as any]!;
    return !isForbid;
};

export default useIsForbidden;

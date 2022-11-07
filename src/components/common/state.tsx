/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { FC } from "react";

type StateType = "empty" | "loading" | "data" | "error" | "blank";

const Data = ({ children, state }: { children: any; state: StateType }) => (state === "data" ? <>{children}</> : <></>);
const Loading = ({ children, state }: { children: any; state: StateType }) => (state === "loading" ? <>{children}</> : <></>);
const Empty = ({ children, state }: { children: any; state: StateType }) => (state === "empty" ? <>{children}</> : <></>);
const Error = ({ children, state }: { children: any; state: StateType }) => (state === "error" ? <>{children}</> : <></>);

type Props = {
    data: any;
    isLoading?: boolean;
    isEmpty?: boolean;
    isError?: any;
    isBlank?: boolean;
    children: (element: StateType) => void;
};

type ComponentProps = {
    Data: typeof Data;
    Loading: typeof Loading;
    Empty: typeof Empty;
    Error: typeof Error;
};

type IndexProps = FC<Props> & ComponentProps;

const State: IndexProps = ({ data, isLoading, isEmpty, isError, children, isBlank }) => {
    let state: StateType = "loading";

    if (data && !isEmpty) state = "data";
    else if (isLoading) state = "loading";
    else if (isEmpty && !isLoading && !isError) state = "empty";
    else if (isError) state = "error";
    else if (isBlank) state = "blank";
    else state = "blank";

    return <>{children(state)}</>;
};

State.Data = Data;
State.Loading = Loading;
State.Empty = Empty;
State.Error = Error;

export default State;

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { StateProvider } from "context/state";
import { UserProvider } from "context/user";
import { ReactQueryDevtools } from "react-query/devtools";
import App from "./app";
import "./style/index.css";
import "./style/theme.less";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <StateProvider>
                    <App />
                </StateProvider>
            </UserProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </React.StrictMode>
);

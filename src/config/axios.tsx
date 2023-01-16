/* eslint-disable react/react-in-jsx-scope */
import { Button, notification } from "antd";
import axios from "axios";
import { errorLogger, requestLogger, responseLogger } from "axios-logger";
import Cookies from "js-cookie";
import Utils from "utils";
import { DEFAULT_ERROR_MESSAGE, TOKEN_USER } from "utils/constant";

const axiosClient = axios.create();

axiosClient.defaults.baseURL =
    process.env.NODE_ENV === "production" ? process.env.REACT_APP_BASE_URL_PROD_TELKOM : process.env.REACT_APP_BASE_URL_PROD_DEV;

axiosClient.defaults.timeout = 1000000;

axiosClient.defaults.withCredentials = true;

axiosClient.defaults.validateStatus = (status) => true;

axiosClient.interceptors.request.use(
    (req) => {
        req.headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
            Authorization: Cookies.get(TOKEN_USER)!,
        };
        return process.env.NODE_ENV === "development" ? requestLogger(req) : req;
    },
    (error) => (process.env.NODE_ENV === "development" ? errorLogger(error) : error)
);

axiosClient.interceptors.response.use(
    (res) => {
        const { status, data } = res;
        if (status === 401 || data?.status === 401) {
            Utils.SignOut();
            window.location.reload();
            // notification.error({
            //     message: "Authentication",
            //     description: data.message || DEFAULT_ERROR_MESSAGE,
            //     btn: (
            //         <Button type="primary" onClick={() => }>
            //             Refresh
            //         </Button>
            //     ),
            // });
        }
        return process.env.NODE_ENV === "development" ? responseLogger(res) : res;
    },
    (error) => {
        if (error.response?.status === 401) {
            Utils.SignOut();
            window.location.reload();
            // notification.error({
            //     message: "Authentication",
            //     description: error.response?.message || DEFAULT_ERROR_MESSAGE,
            //     btn: (
            //         <Button type="primary" onClick={() => window.location.reload()}>
            //             Refresh
            //         </Button>
            //     ),
            // });
        }
        return process.env.NODE_ENV === "development" ? errorLogger(error) : error;
    }
);

export default axiosClient;

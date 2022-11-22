import axios from "axios";
import { errorLogger, requestLogger, responseLogger } from "axios-logger";
import Cookies from "js-cookie";
import Utils from "utils";
import { TOKEN_USER } from "utils/constant";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = process.env.NODE_ENV === "production" ? process.env.REACT_APP_BASE_URL_PROD : process.env.REACT_APP_BASE_URL_DEV;

axiosClient.defaults.timeout = 10000;

axiosClient.defaults.withCredentials = true;

axiosClient.defaults.validateStatus = (status) => true;

axiosClient.interceptors.request.use(
    (req) => {
        req.headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
            // Authorization: Cookies.get(TOKEN_USER)!,
            Authorization: "$2a$10$w70dYzx1ZC6HleTGqbZ46ObUBP4Yjfk.RhEyPURWbJJcqI1KlXv3O",
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
        }
        return process.env.NODE_ENV === "development" ? responseLogger(res) : res;
    },
    (error) => {
        if (error.response?.status === 401) {
            Utils.SignOut();
        }
        return process.env.NODE_ENV === "development" ? errorLogger(error) : error;
    }
);

export default axiosClient;

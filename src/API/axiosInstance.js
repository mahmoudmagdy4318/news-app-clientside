import axios from "axios";
import _ from "lodash";
import { toast } from "react-toastify";
import { getToken, removeToken } from "../services/tokenService";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/`,
});

axiosInstance.interceptors.request.use((cfg) => {
  if (getToken()) cfg.headers["Authorization"] = `${getToken()}`;
  return cfg;
});

axiosInstance.interceptors.response.use(
  ({ data }) => data,
  async (error) => {
    if (_.get(error, "response.data.code") === "AUTHORIZATION_ERROR") {
      removeToken();
      window.location.href = "/login";
      toast("unauthorized", error);
      return;
    }
    return Promise.reject(_.get(error, "response.data.err"));
  }
);

export default axiosInstance;

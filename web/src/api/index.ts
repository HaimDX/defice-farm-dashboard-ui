import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

const defaultConfig = {
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
};

function paramsSerializer(params: any) {
  return qs.stringify(params, { arrayFormat: "comma" });
}

// Bearer-token plumbing. The token is set by the device-farm dashboard's
// login page (same origin → shared localStorage), so this side just reads it
// and attaches the header. On a 401 from any request we drop the token and
// bounce the user to the device-farm login.
const TOKEN_KEY = "df_token";

axios.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        window.localStorage.removeItem(TOKEN_KEY);
      } catch {
        // ignore
      }
      const here = window.location.pathname + window.location.search;
      window.location.assign(`/device-farm/login?from=${encodeURIComponent(here)}`);
    }
    return Promise.reject(error);
  },
);

export default class Api {
  static base_url = process.env.REACT_APP_API_BASE_URL;

  static get(
    url: string,
    params?: any,
    config: Partial<AxiosRequestConfig> = {},
  ) {
    return axios
      .get(url, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }

  static post(
    url: string,
    payload: any = {},
    params?: any,
    config: Partial<AxiosRequestConfig> = {},
  ) {
    return axios
      .post(url, payload, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }

  static delete(
    url: string,
    params?: any,
    config: Partial<AxiosRequestConfig> = {},
  ) {
    return axios
      .delete(url, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }
}

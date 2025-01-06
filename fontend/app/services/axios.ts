import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient() {
  const api = axios.create({
    baseURL: "http://localhost:8080",
  });

  api.interceptors.request.use(
    (config) => {
      const { "nextauth.token": token } = parseCookies();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}

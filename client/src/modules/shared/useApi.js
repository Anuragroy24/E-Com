import axios from "axios";
import { useAuthContext } from "../auth/context/AuthProvider";

/**
 * A pre-configured axios instance that:
 *  1. attaches the current in-memory access token to every request
 *  2. on a 401 (access token expired/missing), silently calls
 *     /api/auth/refresh-token using the httpOnly cookie, stores the
 *     new access token, and retries the original request ONCE.
 *  3. if the refresh itself fails, the refresh token is gone too -
 *     log the user out locally so the UI reflects reality.
 */
export default function useApi() {
    const authContext = useAuthContext();

    const api = axios.create({
        baseURL: "/api",
        withCredentials: true
    });

    api.interceptors.request.use((config) => {
        if (authContext.accessToken) {
            config.headers.Authorization = `Bearer ${authContext.accessToken}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            const isAuthEndpoint = originalRequest?.url?.includes("/auth/login")
                || originalRequest?.url?.includes("/auth/register")
                || originalRequest?.url?.includes("/auth/refresh-token");

            if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
                originalRequest._retry = true;

                try {
                    const refreshRes = await axios.post(
                        "/api/auth/refresh-token",
                        {},
                        { withCredentials: true }
                    );

                    authContext.setAccessToken(refreshRes.data.accessToken);

                    originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    authContext.logoutLocally();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
}

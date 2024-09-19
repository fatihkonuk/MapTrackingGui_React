import { RouterProvider } from "react-router-dom";
import router from "./routes";
import useAuthStore from "./stores/auth.store";
import { useEffect } from "react";
import axiosInstance from "./plugins/axios";

function App() {
  const authStore = useAuthStore((state) => state);

  useEffect(() => {
    authStore.init();
  }, []);

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        authStore.purgeAuth();
      }

      return Promise.reject(error);
    }
  );

  return <RouterProvider router={router} />;
}

export default App;

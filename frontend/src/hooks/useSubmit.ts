import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import getToken from "../utils/getToken.ts";
import axiosInstance from "../utils/axiosInstance.ts";
type AllowedMethods = "GET" | "POST" | "PATCH" | "DELETE";

const useSubmit = () => {
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  const submit = async (
    url: string,
    method: AllowedMethods,
    body?: unknown,
    options?: {
      includeToken?: boolean;
    },
  ) => {
    setLoading(true);
    try {
      if (options?.includeToken && !token) {
        toast.error("You need to sign in first");
        navigate("/accounts/login");
        return { success: false, data: null };
      }
      const config = options?.includeToken
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      let res;
      switch (method) {
        case "GET":
          res = await axiosInstance.get(url, config);
          break;
        case "POST":
          res = await axiosInstance.post(url, body, config);
          break;
        case "PATCH":
          res = await axiosInstance.patch(url, body, config);
          break;
        case "DELETE":
          res = await axiosInstance.delete(url, config);
          break;
      }
      console.log("Submit response", res.data);
      return { success: true, data: res.data };
    } catch (err) {
      if (err instanceof AxiosError) {
        // Handle 403 Forbidden
        if (err.response?.status === 403) {
          toast.error("Access Denied: Admins only");
          navigate("/notadmin");
          return { success: false, data: null }; // Exit early to prevent further error handling
        }
        toast.error(err.response?.data?.message);
        return { success: false, data: err.response?.data };
      }
      toast.error("An unexpected error occurred");
      console.error(err);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
};

export default useSubmit;

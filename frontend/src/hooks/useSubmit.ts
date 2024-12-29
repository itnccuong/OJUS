import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getToken from "../utils/getToken.ts";
import axiosInstance from "../utils/axiosInstance.ts";
type AllowedMethods = "GET" | "POST" | "PATCH" | "DELETE";

const useSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();
  const navigate = useNavigate();

  const submit = async <T>(
    url: string,
    method: AllowedMethods,
    body?: unknown,
    options?: {
      includeToken?: boolean;
    },
  ) => {
    try {
      setIsSubmitting(true);

      if (options?.includeToken && !token) {
        toast.error("You need to sign in first");
        navigate("/accounts/login");
        return null;
      }
      const config = options?.includeToken
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      let res;
      switch (method) {
        case "GET":
          res = await axiosInstance.get<{ data: T }>(url, config);
          break;
        case "POST":
          res = await axiosInstance.post<{ data: T }>(url, body, config);
          break;
        case "PATCH":
          res = await axiosInstance.patch<{ data: T }>(url, body, config);
          break;
        case "DELETE":
          res = await axiosInstance.delete<{ data: T }>(url, config);
          break;
      }
      return res.data.data;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting };
};

export default useSubmit;

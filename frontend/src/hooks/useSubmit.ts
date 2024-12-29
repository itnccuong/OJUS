import { useState } from "react";
import getToken from "../utils/getToken.ts";
import axiosInstance from "../utils/axiosInstance.ts";
type AllowedMethods = "GET" | "POST" | "PATCH" | "DELETE";

const useSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = getToken();

  const submit = async <T>(
    method: AllowedMethods,
    url: string,
    body?: unknown,
    options?: {
      includeToken?: boolean;
    },
  ) => {
    try {
      setIsSubmitting(true);

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

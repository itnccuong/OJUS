import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import getToken from "../utils/getToken.ts";
import axiosInstance from "../utils/axiosInstance.ts";

const useFetch = <T>(
  url: string,
  options?: {
    includeToken?: boolean; // Whether to include the Authorization token
    skip?: boolean;
  },
) => {
  const [data, setData] = useState<{ data: T } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (options?.skip) {
        setLoading(false);
        return;
      }
      try {
        if (options?.includeToken && !token) {
          toast.error("You need to sign in first");
          navigate("/accounts/login");
          return;
        }
        const config = options?.includeToken
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axiosInstance.get(url, config);

        console.log("Fetch response", res.data);
        setData(res.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          const errorMessage =
            err.response?.data?.message || "An error occurred";
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError("An unexpected error occurred");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options?.includeToken, options?.skip, token, navigate]);

  return { data, loading, error };
};

export default useFetch;

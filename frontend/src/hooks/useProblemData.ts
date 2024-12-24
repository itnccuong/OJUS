import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  ProblemWithUserStatusInterface,
  ResponseInterface,
} from "../../interfaces/interface.ts";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/getURL.ts";

const useProblemData = (problemId: string) => {
  const [problem, setProblem] = useState<ProblemWithUserStatusInterface>();
  const [problemLoading, setProblemLoading] = useState(true);
  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = token
          ? `/api/problems/with-account/${problemId}`
          : `/api/problems/no-account/${problemId}`;

        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axiosInstance.get<
          ResponseInterface<{ problem: ProblemWithUserStatusInterface }>
        >(endpoint, config);

        setProblem(res.data.data.problem);
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
        console.error(error);
      } finally {
        setProblemLoading(false);
      }
    };

    fetchData();
  }, [problemId, token]);

  return { problem, problemLoading };
};

export default useProblemData;

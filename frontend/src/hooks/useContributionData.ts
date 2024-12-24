import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  ProblemInterface,
  ResponseInterface,
} from "../../interfaces/interface.ts";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/getURL.ts";
import { useNavigate } from "react-router-dom";

const useContributionData = (problemId: string) => {
  const [problem, setProblem] = useState<ProblemInterface>();
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          navigate("/accounts/login");
          return;
        }

        const res = await axiosInstance.get<
          ResponseInterface<{ contribution: ProblemInterface }>
        >(`/api/contributions/${problemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Contribution", res.data);
        setProblem(res.data.data.contribution);
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [problemId, token, navigate]);

  return { problem, loading };
};

export default useContributionData;

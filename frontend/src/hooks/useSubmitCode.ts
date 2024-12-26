import { useNavigate } from "react-router-dom";
import getToken from "../utils/getToken.ts";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance.ts";
import { AxiosError } from "axios";
import { language_FE_to_BE_map } from "../utils/constanst.ts";

const useSubmitCode = () => {
  const navigate = useNavigate();
  const token = getToken();

  const submitCode = async (
    code: string | undefined,
    language: string,
    problemId: string,
    isContribution: boolean,
  ) => {
    if (!token) {
      toast.error("Please login to submit your code");
      return;
    }

    try {
      const res = await toast.promise(
        axiosInstance.post(
          `/api/problems/${problemId}`,
          {
            code,
            language: language_FE_to_BE_map[language],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        {
          pending: "Submitting...",
          success: "All test cases passed",
        },
      );

      console.log("Submit response: ", res.data);
      navigate(
        `/${isContribution ? "contributions" : "problems"}/${problemId}/submissions`,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
          navigate(
            `/${isContribution ? "contributions" : "problems"}/${problemId}/submissions`,
          );
        }
      }
      console.error(error);
    }
  };

  return { submitCode };
};

export default useSubmitCode;

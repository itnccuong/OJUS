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
  ) => {
    if (!token) {
      toast.error("Please login to submit your code");
      return;
    }

    try {
      const res = await toast.promise(
        axiosInstance.post<{
          data: {
            submissionId: number;
          };
        }>(
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
      const submissionId = res.data.data.submissionId;
      navigate(`/submissions/${submissionId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else if (error.response?.status === 400) {
          const submissionId = error.response.data.data.submissionId;
          navigate(`/submissions/${submissionId}`);
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
      }
      console.error(error);
    }
  };

  return { submitCode };
};

export default useSubmitCode;

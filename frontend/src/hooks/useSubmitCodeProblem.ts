import { useNavigate } from "react-router-dom";
import getToken from "../utils/getToken.ts";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance.ts";
import { ResponseInterface } from "../interfaces/interface.ts";
import { AxiosError } from "axios";
import { language_FE_to_BE_map } from "../utils/constanst.ts";

const useSubmitCodeProblem = () => {
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
        axiosInstance.post<ResponseInterface<{ submissionId: number }>>(
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
      navigate(`/problems/${problemId}/submissions`);

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
          navigate(`/problems/${problemId}/submissions`);
        }
      }
      console.error(error);
    }
  };

  return { submitProblem: submitCode };
};

export default useSubmitCodeProblem;

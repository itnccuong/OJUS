import useSubmit from "./useSubmit.ts";
import { language_FE_to_BE_map } from "../utils/constanst.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useSubmitCode = () => {
  const { submit, isSubmitting } = useSubmit();
  const navigate = useNavigate();
  const handleSubmit = async (
    problemId: string,
    code: string | undefined,
    language: string,
  ) => {
    try {
      const res = await submit<{ submissionId: number }>(
        "POST",
        `/api/problems/${problemId}`,
        {
          code,
          language: language_FE_to_BE_map[language],
        },
        {
          includeToken: true,
        },
      );

      console.log("Submit response: ", res);
      const submissionId = res.submissionId;
      navigate(`/submissions/${submissionId}`);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else if (error.response?.status === 400) {
          const submissionId = error.response.data.data.submissionId;
          navigate(`/submissions/${submissionId}`);
        }
      }
    }
  };
  return { handleSubmit, isSubmitting };
};

export default useSubmitCode;

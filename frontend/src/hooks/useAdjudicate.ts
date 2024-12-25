import { useNavigate } from "react-router-dom";
import getToken from "../utils/getToken.ts";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance.ts";
import {
  ProblemInterface,
  ResponseInterface,
} from "../interfaces/interface.ts";
import { AxiosError } from "axios";

const useAdjudicate = () => {
  const navigate = useNavigate();

  const adjudicateHandler = async (isAccept: boolean, problemId: string) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to submit your code");
      return;
    }

    try {
      const { data } = await toast.promise(
        axiosInstance.put<
          ResponseInterface<{ contribution: ProblemInterface }>
        >(
          `/api/contributions/${problemId}/${isAccept ? "accept" : "reject"}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        ),
        {
          pending: "Loading...",
          success: "Done",
        },
      );
      navigate("/contributions");

      console.log("Adjudicate response:", data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.name === "UNAUTHORIZED") {
          toast.error("Please login to submit your code");
          navigate("/accounts/login");
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
      }
      console.error(error);
    }
  };

  return { adjudicateHandler };
};

export default useAdjudicate;

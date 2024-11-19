import { languageDetails } from "./code-executor/executor-utils";
import { ConvertLanguageError } from "../utils/error";

//Convert language string from frontend to match backend
export const convertLanguage = (language: string) => {
  const convertMap: Record<string, string> = {
    Python: "py",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Javascript: "js",
  };

  const convertedLanguage = convertMap[language];
  if (!languageDetails[convertedLanguage]) {
    throw new ConvertLanguageError("Invalid language", language);
  }
  return convertedLanguage;
};

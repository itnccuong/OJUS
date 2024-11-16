import { jwtDecode } from "jwt-decode";
import storageKeyMap from "./storageKeyMap.ts";

const getToken = () => {
  try {
    const key = storageKeyMap.token;
    const token = localStorage.getItem(key);
    if (!token) {
      return null;
    }

    const decode = jwtDecode(token);
    if (!decode || !decode.exp || decode.exp * 1000 < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }

    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getToken;

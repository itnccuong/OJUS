import { jwtDecode } from "jwt-decode";
import { StorageConfig } from "../interfaces/interface";

const getStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) {
    return null;
  }
  const parsedUser: StorageConfig = JSON.parse(user);
  const decode = jwtDecode(parsedUser.token);
  if (!decode.exp || decode.exp * 1000 < Date.now()) {
    localStorage.removeItem("user");
    return null;
  }
  return parsedUser;
};

export default getStorage;

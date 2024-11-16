import { jwtDecode } from "jwt-decode";
import { StorageConfig } from "../interfaces/interface";

const getToken = (): string | null => {
  const user = localStorage.getItem("user");
  if (!user) {
    return null; // Không có dữ liệu trong localStorage
  }

  try {
    const parsedUser: StorageConfig = JSON.parse(user);
    const decode = jwtDecode(parsedUser.token);

    // Kiểm tra token đã hết hạn hay chưa
    if (!decode.exp || decode.exp * 1000 < Date.now()) {
      localStorage.removeItem("user");
      return null; // Token đã hết hạn
    }

    return parsedUser.token; // Trả về token hợp lệ
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("user"); // Xóa dữ liệu hỏng
    return null;
  }
};

export default getToken;
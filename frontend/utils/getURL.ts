import axios from "axios";
import { port_server } from "../constants/Network";

const axiosInstance = axios.create({
  baseURL: `http://localhost:${port_server}`,
});

export default axiosInstance;

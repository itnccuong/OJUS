import axios from "axios";
// import { url_server } from "../constants/Network.ts";
import { port_server } from "../constants/Network";

const axiosInstance = axios.create({
  baseURL: `http://localhost:${port_server}`,
  // baseURL: url_server,
});

export default axiosInstance;

import axios from "axios";
// import { port_server } from "../constants/Network";

const axiosInstance = axios.create({
  // baseURL: `http://localhost:${port_server}`,
  baseURL: `https://ojus.onrender.com`,
});

export default axiosInstance;

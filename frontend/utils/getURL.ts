import { port_server } from "../constants/Network";
const getURL = (api: string) => {
    return 'http://localhost:' + port_server + api
}
export default getURL
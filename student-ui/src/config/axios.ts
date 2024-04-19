import axios from "axios";
//@TODO: check environment variables for production set urls
const codeApi = axios.create({
    baseURL: "http://localhost:8080/",
});
const mainApi = axios.create({
    baseURL: "http://localhost:4000/api"
});
export {
    codeApi,
    mainApi
}
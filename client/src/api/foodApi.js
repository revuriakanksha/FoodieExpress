
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getFoods = async () => {
  const response = await API.get("/foods");
  return response.data;
};

export default API;

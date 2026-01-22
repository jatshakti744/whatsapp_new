import axios from "axios";
import * as config from "../utils/config";

export async function LoginApi(data) {
  try {
    const response = await axios.post(`${config.base_url}user/login`, data);
    return response.data;
  } catch (error) {
    console.log("Error fetching login:", error.message || error);
    throw error;
  }
}

export async function AuthCheck(payload) {
  try {
    const response = await axios.post(
      `${config.base_url}user/checkcrmstatus`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.log("Error fetching login:", error.message || error);
    throw error;
  }
}


import axios from "axios";
const BASE_URL = "http://localhost:8000/api/v1";

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL || "http://localhost:3000/api/v1",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  get connection() {
    return this.instance;
  }

  async setAuthorizationHeader(token) {
    this.instance.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
}

export default new Http();

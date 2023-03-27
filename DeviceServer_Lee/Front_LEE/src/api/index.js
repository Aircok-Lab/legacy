import axios from "axios";

export default axios.create({
  // baseURL: `http://localhost:3000/`,
  // baseURL: `http://211.252.84.91:13701/`,
  baseURL: `http://smart.aircok.com:13701/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
  }
});

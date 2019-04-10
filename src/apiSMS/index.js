import axios from "axios";

export default axios.create({
  baseURL: `https://sms.gabia.com/`,
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    authorization: "Basic YWlyY29rOmM3MjMwOWZkNjRjZGRlYzkyNmM5ZTM2N2Y0ODU1ZjAz"
  }
});

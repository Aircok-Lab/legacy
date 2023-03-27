import axios from "axios";

export default axios.create({
  baseURL: `https://sms.gabia.com/`,
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    authorization: "Basic 179dbc6aec1c8c55c5ab47caf5bfa4a1"
    // YWlyY29rOmM3MjMwOWZkNjRjZGRlYzkyNmM5ZTM2N2Y0ODU1ZjAz
  }
});

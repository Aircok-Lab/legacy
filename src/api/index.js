import axios from "axios";

export default axios.create({
  //baseURL: `http://localhost:3000/`,
  baseURL: `http://115.178.65.141:13701/`,
  headers: {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  }
});

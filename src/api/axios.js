import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_NODE + "/api"

// insecure axios (no token sent)
// default, insecure
export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json'}
});

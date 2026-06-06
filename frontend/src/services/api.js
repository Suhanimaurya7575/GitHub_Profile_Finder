import axios from "axios";


const API = axios.create({
  baseURL: "https://github-profile-finder-zlwv.onrender.com/api/auth",
});


export default API;
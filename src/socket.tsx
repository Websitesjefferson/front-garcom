import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  // http://localhost:8000 
  "https://api-z2id.onrender.com/";
  
export const socket = io(URL,);
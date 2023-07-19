import "../../styles/globals.scss";
import { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../socket";
import { AuthProvider } from "../contexts/AuthContext";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    socket.on("connect", () => console.log("connected"));
    socket.on("disconnect", () => console.log("disconnected"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={1300} />
    </AuthProvider>
  );
}

export default MyApp;

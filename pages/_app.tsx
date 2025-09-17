import type { AppProps } from "next/app";
import "../styles/globals.css";

function VoyageAIApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default VoyageAIApp;

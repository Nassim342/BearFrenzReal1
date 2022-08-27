import "../styles/globals.css";
import Head from 'next/head'
import { StatusProvider } from "../context/statusContext";

function MyApp({ Component, pageProps }) {
  return (
      <StatusProvider>
        <Head>
          <title>Mint - Bearfrenz</title>
          <meta property="og:image" content="https://i.gyazo.com/f2959e8362b6bfdc6743b213cf0eb781.png" />
          <meta property="og:url" content="www.bearfrenz.com" />
          <meta property="og:title" content="BearFrenz" />
          <meta name="twitter:card" content="Bears are the real kings of the forests, no fake promises! Just Roar!" />
          <meta
          property="og:description"
          content="Bears are the real kings of the forests, no fake promises! Just Roar!"
        />
        </Head>
        <Component {...pageProps} />
      </StatusProvider>
  );
}

export default MyApp;

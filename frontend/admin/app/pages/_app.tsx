import "../globals.css";
import { AppProps } from "next/app";
import MenuBar from "../Components/MenuBar";
import Layout from "../layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex md:flex-row flex-col">
      <div className="flex-none md:block hidden">
        <MenuBar />
      </div>
      <main className="flex-1 w-full md:w-64">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </div>
  );
}

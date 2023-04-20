import "@/styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "@/components/Header"
import Head from "next/head"

const MORALIS_SERVER = process.env.NEXT_PUBLIC_MORALIS_SERVER
export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <Header />
                <Component {...pageProps} />
            </MoralisProvider>
        </div>
    )
}

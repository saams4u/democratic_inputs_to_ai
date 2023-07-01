
import '@/styles/globals.css'
import NavBar from '@/components/NavBar'; // Assuming NavBar is placed inside a components directory
import { SessionProvider } from "next-auth/react"

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
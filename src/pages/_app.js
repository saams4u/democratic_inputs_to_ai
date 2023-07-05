
import '@/styles/globals.css'
import NavBar from '@/components/NavBar'; 
import { UserProvider } from '@/context/UserContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <NavBar />
      <Component {...pageProps} />
    </UserProvider>
  )
}
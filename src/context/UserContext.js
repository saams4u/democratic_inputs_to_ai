
import { createContext, useContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(user => setUser(user));
  }, []);

  return (
    <UserContext.Provider value={{ user, mutateUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

async function fetchUser() {
  const res = await fetch('/api/user');
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.statusText}`);
  }
  const user = await res.json();
  return user;
}
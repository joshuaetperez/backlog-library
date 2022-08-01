import {createContext, useEffect, useState} from 'react';

export const myContext = createContext();
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export default function Context(props) {
  const [user, setUser] = useState(undefined);

  // Set user in state to be used in other components
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          credentials: 'include',
        });
        const jsonData = await response.json();
        setUser(jsonData);
      } catch (err) {
        // If req.user is null, user is not logged in
        setUser(null);
      }
    };
    getUser();
  }, []);

  return <myContext.Provider value={user}>{props.children}</myContext.Provider>;
}

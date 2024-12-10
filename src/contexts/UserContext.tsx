import{ createContext, useState, ReactNode } from "react";
import { User } from "../interfaces/IUser";

// Define the shape of your context
interface UserContextType {
  user: User | null ; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserContextProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const UserContext = createContext({} as UserContextType);



export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null); // You can replace 'any' with a more specific type if you have one
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get the authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const getUserFromToken = () => {
  const decodedToken = jwtDecode(getAuthToken());
  console.log("DECODED TOKEN: ", decodedToken);
  return decodedToken;
};


// Clear the authentication token from localStorage
const clearAuthToken = () => {
  return localStorage.removeItem('authToken');
};


  return (
    <UserContext.Provider value={{ user, setUser, setAuthToken, getAuthToken, clearAuthToken,getUserFromToken }}>
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
}
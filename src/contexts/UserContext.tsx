import{ createContext, useState, ReactNode } from "react";
import { User } from "../interfaces/IUser";
import { jwtDecode, JwtPayload } from "jwt-decode";


// Define the shape of your context

interface UserContextType {
  user: User | null;
  setUser: (token: JwtPayload) => JwtPayload;
  setAuthToken: (token: string) => void;
  getAuthToken: () => string | null;
  clearAuthToken: () => void;
  getUserFromToken: () => JwtPayload;
}

interface UserContextProviderProps {
  children: ReactNode;
}


interface MyToken {
    aud: string; // Audience, e.g., "OLRacingUsers"
    credits: string; // OOPS! convert to number
    exp: number; // Expiration time (UNIX timestamp), e.g., 1733830048
    id: string; // User ID, e.g., "6"
    iss: string; // Issuer, e.g., "OLRacing"
    jti: string; // Unique identifier for the token, e.g., "b91026c3-afad-4cfe-9766-bfacc615ed54"
    profilename: string; // Profile name, e.g., "Toyo Baker1"
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    sub: string; // Subject identifier, e.g., "tuyut"
    username: string; // Username, e.g., "tuyut"
}



// Create the context with a default value
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext({} as UserContextType);



export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  // Get the authentication token from localStorage


const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string) => {
  return localStorage.setItem('authToken', token);
};


 const getUserFromToken = () => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("No auth token found");
  }
  const decodedToken = jwtDecode<MyToken>(authToken);
  console.log("DECODED TOKEN: ", decodedToken);
  console.log("DECODED TOKEN WITH SUB: ", decodedToken.sub);
  return decodedToken;
};


// Clear the authentication token from localStorage
const clearAuthToken = () => {
  return localStorage.removeItem('authToken');
};


  return (
    <UserContext.Provider value={{ user, setUser, setAuthToken, getAuthToken, clearAuthToken, getUserFromToken }}>
      { children }
    </UserContext.Provider>
  );
}
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


  const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
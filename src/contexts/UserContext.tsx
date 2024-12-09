import{ createContext, useState, ReactNode } from "react";
import { User } from "../interfaces/IUser";

// Define the shape of your context
interface UserContextType {
  user: User | undefined ; 
  setUser: (user: User) => void; // You can replace 'any' with a more specific type if you have one
}

interface UserContextProviderProps {
  children: ReactNode;
}

// Create the context with a default value
export const UserContext = createContext({} as UserContextType);


export default function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>(); // You can replace 'any' with a more specific type if you have one

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
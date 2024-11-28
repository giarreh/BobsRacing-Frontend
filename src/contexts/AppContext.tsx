import { useState, createContext, ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext(
  {} as {
    money: number;
    setMoney: (money: number) => void;
    bet: number;
    setBet: (bet: number) => void;
  }
);

export default function AppContextProvider({ children }: { children: ReactNode }) {
  const [money, setMoney] = useState(100);
  const [bet, setBet] = useState(0);

  return (
    <AppContext.Provider value={{ money, setMoney, bet, setBet }}>
      {children}
    </AppContext.Provider>
  );
}

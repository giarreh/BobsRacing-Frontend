import "./App.css";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Race from "./components/Race";
import Header from "./components/Header";
import AppContextProvider from "./contexts/AppContext";
import Home from "./pages/Home";
import Error from "./pages/Error";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import ProfilePage from "./pages/profile/ProfilePage";
import Athletes from "./pages/Athletes/Athletes";
import AthleteDetails from "./pages/Athletes/AthleteDetails";

// Import the UserType interface
import { UserType } from "./interfaces/IUser";
import PrivateRoutes from "./components/PrivateRoutes";

// Define the context type
export interface myContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const MyContext = createContext<myContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const getUser = () => {
    fetch(`https://localhost:64968/api/user/1`)
      .then((response) => response.json())
      .then((data) => setUser(data));
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log(user);

  return (
    <MyContext.Provider value={{ user, setUser }}>
      <Router>
        <AppContextProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/athletes" element={<Athletes />}></Route>
              <Route path="/athlete/:id" element={<AthleteDetails />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="/race" element={<Race />}></Route>
            </Route>
              <Route path="*" element={<Error />}></Route>
              <Route path="/signin" element={<SignIn />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
            </Routes>
          </div>
        </AppContextProvider>
      </Router>
    </MyContext.Provider>
  );
};

export default App;

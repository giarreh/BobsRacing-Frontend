import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home/Home";
import Error from "./pages/Error";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Athletes from "./pages/Athletes/Athletes";
import AthleteDetails from "./pages/Athletes/AthleteDetails";
import UserContextProvider from "./contexts/UserContext";
import PrivateRoutes from "./components/PrivateRoutes";
import ProfilePage from "./pages/profile/ProfilePage";
import Races from "./pages/races/Races";
import Results from "./pages/Results/Results"
import CreateRace from "./pages/races/create/CreateRace";
import RaceDetails from "./pages/races/details/RaceDetails";
import { SignalRProvider } from "./contexts/SignalR/SignalRContext";
import Bets from './pages/bets/BetPage';
import AppContextProvider from "./contexts/AppContext";


const App: React.FC = () => {
  return (
    <Router>
      <SignalRProvider>
        <UserContextProvider>
          <AppContextProvider>
            <div className="App">
              <div className="content-wrapper">
                <Header />
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path="*" element={<Error />}></Route>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/races" element={<Races />}></Route>
                    <Route path="/results" element={<Results />}></Route>
                    <Route path="/races/:id" element={<RaceDetails />}></Route>
                    <Route path="/createrace" element={<CreateRace />}></Route>
                    <Route path="/athletes" element={<Athletes />}></Route>
                    <Route path="/betting" element={<Bets />}></Route>
                    <Route
                      path="/athlete/:id"
                      element={<AthleteDetails />}
                    ></Route>
                    <Route path="/profile" element={<ProfilePage />}></Route>
                  </Route>
                  <Route path="/signin" element={<SignIn />}></Route>
                  <Route path="/signup" element={<SignUp />}></Route>
                </Routes>
              </div>
            </div>
          </AppContextProvider>
        </UserContextProvider>
      </SignalRProvider>
    </Router>
  );
};

export default App;

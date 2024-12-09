import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Race from './components/Race';
import Header from './components/Header';
import AppContextProvider from './contexts/AppContext';
import Home from './pages/Home';
import Error from './pages/Error';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import Athletes from './pages/Athletes/Athletes';
import AthleteDetails from './pages/Athletes/AthleteDetails';
import UserContextProvider from './contexts/UserContext';
import PrivateRoutes from './components/PrivateRoutes';
import ProfilePage from './pages/profile/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <AppContextProvider>
        <UserContextProvider>
          <div className="App">
            <Header />
              <Routes>
                <Route element={<PrivateRoutes/>}>
                  <Route path='*' element={<Error/>} ></Route>
                  <Route path='/' element={<Home/>} ></Route>
                  <Route path='/race' element={<Race/>} ></Route>
                  <Route path='/athletes' element={<Athletes/>} ></Route>
                  <Route path='/athlete/:id' element={<AthleteDetails/>} ></Route>
                  <Route path='/profile' element={<ProfilePage/>} ></Route>
                </Route>
                <Route path='/signin' element={<SignIn/>}></Route>
                <Route path='/signup' element={<SignUp/>}></Route>
              </Routes>
          </div>
        </UserContextProvider>
      </AppContextProvider>
    </Router>
  );
};

export default App;

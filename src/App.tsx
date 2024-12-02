import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Race from './components/Race';
import Header from './components/Header';
import AppContextProvider from './contexts/AppContext';
import Home from './pages/Home';

const App: React.FC = () => {

  return (
    <Router>
      <AppContextProvider>
        <div className="App">
          <Header />
            <Routes>
              <Route path='/' element={<Home/>} ></Route>
              <Route path='/race' element={<Race/>} ></Route>
            </Routes>
        </div>
      </AppContextProvider>
    </Router>
  );
};

export default App;

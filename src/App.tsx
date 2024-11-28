import './App.css';
import Race from './components/Race';
import Header from './components/Header';
import AppContextProvider from './contexts/AppContext';
import Bet from './components/Bet';
const App: React.FC = () => {

  return (
    <AppContextProvider>
      <div className="App">
        <Header />
        <Race />
        <Bet />
      </div>
    </AppContextProvider>
  );
};

export default App;

import './App.css';
import Race from './components/Race';
import Header from './components/Header';
const App: React.FC = () => {

  return (
    <div className="App">
      <Header />
      <h1>Horse Race</h1>
      <Race />
    </div>
  );
};

export default App;

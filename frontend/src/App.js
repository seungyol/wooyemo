import './App.css';
import {Routes, Route} from 'react-router-dom';
import Game from './Game';
import Main from './Main';
import Team from './Team';
import Score from './Score';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/Game" element={<Game />}/>
      <Route path="/Team" element={<Team />}/>
      <Route path="/Score" element={<Score />} />
    </Routes>
  )
}

export default App;

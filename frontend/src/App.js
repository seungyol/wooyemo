import './App.css';
import {Link,Routes, Route} from 'react-router-dom';
import History from './History';
import Game from './Game';
import Main from './Main';
import Team from './Team';
import React, {useEffect, useState} from 'react';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/History" element={<History />}/>
      <Route path="/Game" element={<Game />}/>
      <Route path="/Team/:gameid" element={<Team />}/>
    </Routes>
  )
}

export default App;

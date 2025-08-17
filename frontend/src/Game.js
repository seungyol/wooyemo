import './App.css';
import React, {useEffect, useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';

export default function Game() {
  const [gameTypes, setGameTypes] = useState([]);
  const navigate = useNavigate(); //initialize navigate
  const [selectedGameType, setSelectedGameType] = useState('');
  const [selectedGameDate, setSelectedGameDate] = useState('');  

  useEffect(() => {

   fetch('http://localhost/api/gametype.php')
    .then(res => res.json())
    .then(data => setGameTypes(data));
  
  }, [])
 
  const saveGame = ()=>{
    const gameType = selectedGameType; // Replace with your state variable for selected game type
    const gameDate = selectedGameDate; // Replace with your state variable for selected game date

    fetch('http://localhost/api/savegame.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameType: gameType,
        gameDate: gameDate
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Game saved!');
        navigate('/Team');
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      alert('Network error');
      console.error(err);
    });
  };
  
  const gameTypeOptions = gameTypes.map(m=> <option value={m.SportsCode} key={m.SportsCode}>{m.SportsName}</option>);
  return (
    <div className="container">
      <div className="row game-type">
        <label className='text-end col form-label'>Game Type</label>
        <select className='col form-control'  value={selectedGameType} onChange={e => setSelectedGameType(e.target.value)}>
          <option>Select</option>
          {gameTypeOptions}
        </select>
      </div>
      <div className='row'>
        <label className='text-end col form-label'>Game Date: </label>
        <input className='col form-control' type='date' value={selectedGameDate} onChange={e => setSelectedGameDate(e.target.value)}/>
      </div>
      <div className="game-alloc-action">
        <button className='btn btn-primary' onClick={saveGame}>Save</button>
        <Link className='btn btn-secondary' to='/'>Back</Link>
      </div>      
    </div>
  );
}
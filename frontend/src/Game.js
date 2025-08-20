import './App.css';
import React, {useEffect, useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';

export default function Game() {
  const [gameTypes, setGameTypes] = useState([]);
  const navigate = useNavigate(); //initialize navigate
  const [selectedGameType, setSelectedGameType] = useState('');
  const [selectedGameDate, setSelectedGameDate] = useState('');  
  const [selectedGameTypeName, setSelectedGameTypeName] = useState('');
  useEffect(() => {

   fetch('/api/gametype.php')
    .then(res => res.json())
    .then(data => setGameTypes(data));
  
  }, []);

  const changeGameType = (ev) => {
    console.log(ev.target.value);
    console.log(ev.target.selectedIndex);
    console.log(ev.target.options[ev.target.selectedIndex].text);
    setSelectedGameType(ev.target.value);
    setSelectedGameTypeName(ev.target.options[ev.target.selectedIndex].text);
  };
 
  const saveGame = ()=>{
    const gameType = selectedGameType; // Replace with your state variable for selected game type
    const gameDate = selectedGameDate; // Replace with your state variable for selected game date

    fetch('/api/savegame.php', {
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
        navigate('/Team', {
          state: {id: data.id, details: selectedGameTypeName + " " + gameDate}});
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
        <div className='col'>
          <label className='text-end form-label'>Game Type</label>
        </div>
        <div className='col'>  
          <select className='form-control'  value={selectedGameType} onChange={e => changeGameType(e)}>
            <option>Select</option>
            {gameTypeOptions}
          </select>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <label className='text-end form-label'>Game Date: </label>
        </div>
        <div className='col'>
          <input className='form-control' type='date' value={selectedGameDate} onChange={e => setSelectedGameDate(e.target.value)}/>
        </div>
      </div>
      <div className="row mt-3">
        <div className='col'>
          <button className='col btn btn-primary' onClick={saveGame}>Save</button>
        </div>
        <div className='col text-end'>
          <Link className='btn btn-light' to='/'>Back</Link>
        </div>           
      </div>      
    </div>
  );
}
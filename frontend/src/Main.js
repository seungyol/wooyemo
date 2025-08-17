import {Link,Routes, Route} from 'react-router-dom';
import {useEffect,useState} from 'react';
import Team from './Team';
export default function Main(){
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');

  useEffect(()=> {
   fetch('http://localhost/api/retrievegames.php')
    .then(res => res.json())
    .then(data => setGames(data)); 
  }, []);

  

  const gamesTRs = games.map(m => <tr><td>{m.GameID}</td><td>{m.GameDate}</td><td>{m.SportsName}</td><td>{m.NoOfGames}</td><td><Link to={`Team/${m.GameID}`}>Team</Link></td></tr>);
  console.log('gamesTRs',gamesTRs);
  return (
    <div className='container'>
      <div className='row'>
        <h1>Games</h1>
      </div>
      <div classsName='row'>
        <table className='table'>
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Game date</th>
              <th>Game</th>
              <th>No of games</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {gamesTRs}
          </tbody>
        </table>
      </div>
      <div classsName='row'>
        <div className='col-5'>
          <Link to="/Game" className='btn btn-success'>New Game</Link>
        </div>
      </div>     
    </div>
  )
}
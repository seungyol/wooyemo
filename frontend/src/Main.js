import {Link, useNavigate} from 'react-router-dom';
import {useEffect,useState} from 'react';

export default function Main(){
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  
  useEffect(()=> {
   fetch('/api/retrievegames.php')
    .then(res => res.json())
    .then(data => setGames(data)); 
  }, []);

  function goToTeam(id, details){
    navigate('Team', {
      state: {id: id, details: details}
    });
  }  

  const gamesTRs = games.map(m => <tr><td>{m.GameID}</td><td>{m.GameDate}</td><td><button className='btn btn-link' onClick={()=> goToTeam(m.GameID, m.SportsName + ' ' + m.GameDate)}>{m.SportsName}</button></td><td className='text-end'>{m.NoOfGames}</td>
    </tr>);
  
  return (
    <div className='container'>
      <div className='row'>
        <h1 className='text-center'>Wooyemo Game History</h1>
      </div>
      <div classsName='row'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Game date</th>
              <th>Game</th>
              <th className='text-end'>Games Played</th>
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
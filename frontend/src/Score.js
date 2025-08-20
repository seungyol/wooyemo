import {Link, useLocation,useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
function Score(){
  const location = useLocation();
  const navigate = useNavigate();
  let {game,details} = location.state;
  const [homePoint, setHomePoint] = useState(0);
  const [awayPoint, setAwayPoint] = useState(0);
  const [gameStart, setGameStart] = useState(null);
  const [scorelist, setScorelist] = useState([]);
  const [homeMemberNames, setHomeMemberNames] = useState([]);
  const [awayMemberNames, setAwayMemberNames] = useState([]);

  function retrieveGameMembers(id){   
    console.log('id', id);
    if(id !== ''){
      fetch('/api/retrievegamemembers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameid: id
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('data',data);
        setHomeMemberNames(data.filter(m=> parseInt(m.IsHomeTeam) === 1).map(m=>m.Username));
        setAwayMemberNames(data.filter(m=> parseInt(m.IsHomeTeam) === 0).map(m=>m.Username));
      });
    }else{
      homeMemberNames = [];
      awayMemberNames = [];
    }
  }
    //gamei

  useEffect(() => {
    setGameStart(new Date());
    retrieveScores();
    retrieveGameMembers(game);
  },[]);
  
  function retrieveScores(){
    fetch('/api/retrievegamescores.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameid: game
      })
    })
    .then(res => res.json())
    .then(data => {
      setScorelist(data);
      setHomePoint(0);
      setAwayPoint(0);
      setGameStart(new Date());
    });
  }
    

  function addPoint(isHome){
    if(isHome){
      setHomePoint(homePoint + 1);
    }else {
      setAwayPoint(awayPoint + 1);
    }
  }

  function savePoint(){
    fetch('/api/savegamescore.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameid: game,
        homescore: homePoint,
        awayscore: awayPoint,
        gamestart: gameStart.toISOString(),
        gameend : new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Score saved!');
        retrieveScores();
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      alert('Network error');
    });  
  }

  return (
<div className="container">
      <div className="row">
        <h2 className="col text-center">{details}</h2>
      </div>
      <div className="row">
        <h3 className='col-6 text-center'>Home</h3>
        <h3 className='col-6 text-center'>Away</h3>   
      </div>
      <div className="row gx-4">
          <ul className='col members me-3'>
            {homeMemberNames.map((player, index) => (<li key={index}>{player}</li>))}
          </ul>
          
          <ul className='col members'>
            {awayMemberNames.map((player, index) => (<li key={index}>{player}</li>))}
          </ul>
      </div>
      <div className="row gx-4">
        <div className={`col point me-3 ${homePoint > awayPoint ? 'winning' : homePoint === awayPoint ? '' : 'losing'}`} onClick={()=>addPoint(true)}>
          {homePoint}
        </div>
        <div className={`col point ${awayPoint > homePoint ? 'winning' : awayPoint === homePoint ? '' : 'losing'}`} onClick={()=>addPoint(false)}>
        {awayPoint}
        </div>
      </div>
      <div className='row'>
        <table className='table mt-3'>
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th className='text-end'>Home</th>
              <th className='text-end'>Away</th>
            </tr>
          </thead>
          <tbody>
          {scorelist.map(m=> <tr><td>{m.GameStartDT}</td><td>{m.GameEndDT}</td><td className='text-end'>{parseInt(m.HomeTeamScore)}</td><td className='text-end'>{parseInt(m.AwayTeamScore)}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="mt-3 team-alloc-action">
        <button className='btn btn-primary' onClick={savePoint} >Save</button>
        <Link className='btn btn-light' to='/'>Back</Link>
      </div>
    </div>
  );
}
export default Score;
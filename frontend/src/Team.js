import { useEffect,useState} from "react";
import {Link,useParams} from 'react-router-dom';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [gameMembers, setGameMembers] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [homeMembers, setHomeMembers] = useState([]);
  const [awayMembers, setAwayMembers] = useState([]);
  let { gameid } = useParams();

//  setSelectedGame(gameid);
  console.log('gameid:',gameid);
  useEffect(() => {
   fetch('http://localhost/api/user.php')
    .then(res => res.json())
    .then(data => setMembers(data));

   fetch('http://localhost/api/retrievegames.php')
    .then(res => res.json())
    .then(data => setGames(data));
  
    retrieveGameMembers(gameid);
  }, []);

  useEffect(() => {
    console.log('gameMembers updated:', gameMembers);
    const hMembers = gameMembers.filter(m=> m.IsHomeTeam === 1).map(m=>m.Usercode);
    const aMembers = gameMembers.filter(m=> m.IsHomeTeam === 0).map(m=>m.Usercode);
    setHomeMembers(hMembers);
    setAwayMembers(aMembers);

  }, [gameMembers]);
  
  useEffect(()=> {
    console.log('HOME Members',homeMembers);
  },[homeMembers]);
  useEffect(()=> {
    console.log('AWAY Members',awayMembers);
  },[awayMembers]);

  const handleHomeSelect = (event) => {
    const selected = Array.from(event.target.selectedOptions, option=> option.value);
    setHomeMembers(selected);
  }

  const handleAwaySelect = (event) => {
    const selected = Array.from(event.target.selectedOptions, option=> option.value);
    setAwayMembers(selected);
  }

  function retrieveGameMembers(id){   
    //setSelectedGame(id);
    if(id !== ''){
      fetch('http://localhost/api/retrievegamemembers.php', {
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
        setGameMembers(data);
        console.log('data', data);
      });
    }else{
      setGameMembers([]);
    }
    gameid = id;
  }

  function saveTeams(){
    //gameid, homeMembers, awayMembers
    fetch('http://localhost/api/saveTeams.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameid: gameid,
        homeMembers: homeMembers,
        awayMembers: awayMembers
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Team saved!');
        //navigate('/Team');
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      alert('Network error');
    });  
  }


 
  
  const memberOptions = members.map(m => <option value={m.usercode} >{m.username}</option>);
  const gamesOptions = games.map(m=> <option value={m.GameID} key={m.GameID}>{m.SportsName} at {m.GameDate}</option>);

  return (
    <div className="container">
      <div className="row">
        <label className="col text-end"> Select a Game</label>
        <select className='col form-control' value={gameid} onChange={(e)=> {retrieveGameMembers(e.target.value);}}>
          <option value=''>Select</option>
          {gamesOptions}
        </select>
      </div>
      <div className="teams">
        <div className="team">
          <label>Home Team </label>
          <select className='form-control' multiple value={homeMembers} onChange={handleHomeSelect} >
            {memberOptions}
          </select>
        </div>
        <div className="team">
          <label>Away Team</label>
          <select className='form-control' multiple value={awayMembers} onChange={handleAwaySelect}>
            {memberOptions}
          </select>
        </div>
      </div>
      <div className="team-alloc-action">
        <Link className='btn btn-default' to="/Game">New Game</Link>
        <button className='btn btn-primary' onClick={saveTeams}>Save</button>
        <Link to='/'>Back to Game history</Link>
      </div>
    </div>
  );
}

export default Team;

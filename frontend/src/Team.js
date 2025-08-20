import { useEffect,useState} from "react";
import {Link,useParams,useNavigate,useLocation} from 'react-router-dom';
import CheckboxGroup from './CheckboxGroup';

const Team = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id,details} = location.state;

  const [members, setMembers] = useState([]);
  const [gameMembers, setGameMembers] = useState([]);
  const [homeMembers, setHomeMembers] = useState([]);
  const [awayMembers, setAwayMembers] = useState([]);
  
  useEffect(() => {
   fetch('/api/user.php')
    .then(res => res.json())
    .then(data => setMembers(data));
  
    retrieveGameMembers(id);
  }, []);

  useEffect(() => {
    const hMembers = gameMembers.filter(m=> parseInt(m.IsHomeTeam) === 1).map(m=>m.Usercode);
    const aMembers = gameMembers.filter(m=> parseInt(m.IsHomeTeam) === 0).map(m=>m.Usercode);
    
    setHomeMembers(hMembers);
    setAwayMembers(aMembers);
  }, [gameMembers]);

  function retrieveGameMembers(id){   
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
        setGameMembers(data);
      });
    }else{
      setGameMembers([]);
    }
    //gameid = id;
  }

  function saveTeams(){
    fetch('/api/saveTeams.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameid: id,
        homeMembers: homeMembers,
        awayMembers: awayMembers
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Team saved!');
        navigate('/Team', {
          state: {id: id, details: details}
        });        
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      alert('Network error');
    });  
  }

  function goToScore(){
    navigate('/Score', {
        state: {game: id, details: details}
      }
    );
  }
 
  
  const memberOptions = members.map(m => {
    return {
      'value': m.usercode , 
      'label': m.username
    }
  }); 

  return (
    <div className="container">
      <div className="row">
        <h2 className="col text-center">{details}</h2>
      </div>
      <div className="row">
        <div className="col-6">
          <h3>Home</h3>
        </div>
        <div className="col-6">
          <h3>Away</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <CheckboxGroup title='Home' options={memberOptions} selected={homeMembers} onChange={setHomeMembers} />
        </div>
        <div className="col-6">     
          <CheckboxGroup title='Away' options={memberOptions} selected={awayMembers} onChange={setAwayMembers} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-4">
          <button className='btn btn-success' onClick={goToScore}>Record Score</button>
        </div>
        <div className="col-4">
          <button className='btn btn-primary' onClick={saveTeams}>Save</button>  
        </div>
        <div className="col-4">
          <Link className='btn btn-light' to='/'>Back</Link>  
        </div>
      </div>
    </div>
  );
}

export default Team;

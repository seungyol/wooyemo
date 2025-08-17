<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$gameid = $data['gameid'] ?? null;
$homeMembers = $data['homeMembers'] ?? null;
$awayMembers = $data['awayMembers'] ?? null;

if (!$gameid || !$homeMembers || !$awayMembers) {
    echo json_encode(['success' => false, 'message' => 'Missing Game, HomeMembers, or AwayMembers']);
    exit;
}

try {
  //Insert home team record if it does not exist
  $ishometeam = 1;
  $stmt = $pdo->prepare("select 1 from  team where gameid = :gameid  and IsHomeTeam = 1 limit 1");  
  $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
  $stmt->execute();

  $hometeamexist = $stmt->fetchColumn();

  if($hometeamexist != 1){
    $stmt = $pdo->prepare("INSERT INTO Team (GameID, IsHomeTeam) VALUES (:gameid, :ishometeam)");
    $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
    $stmt->bindParam(':ishometeam', $ishometeam, PDO::PARAM_INT);
    $stmt->execute();
  }
  //Insert away team record if it does not exist
  $stmt = $pdo->prepare("select 1 from  team where gameid = :gameid  and IsHomeTeam = 0 limit 1");  
  $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
  $stmt->execute();
  
  $isawayteam = 0;
  if(!$stmt->fetchColumn()){
    $stmt = $pdo->prepare("INSERT INTO Team (GameID, IsHomeTeam) VALUES (:gameid, :ishometeam)");
    $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
    $stmt->bindParam(':ishometeam', $isawayteam, PDO::PARAM_INT);
    $stmt->execute();
  }  

  //Delete existing members from home and awayteam
  $stmt = $pdo->prepare("delete from teammember where TeamID IN (select TeamID from team where GameID = :gameid)");
  $stmt->bindParam(':gameid',$gameid,PDO::PARAM_INT);
  $stmt->execute();

  //Read teamid for home team and away team
  $stmt = $pdo->prepare('select TeamID, IsHomeTeam from wooyemo.team where gameid = :gameid');
  $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
  $stmt->execute();
  while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if($row["IsHomeTeam"] == 1){
      $hometeamid = $row["TeamID"];
    }else {
      $awayteamid = $row["TeamID"];
    }    
  }
  //Insert home members 
  $stmt = $pdo->prepare("INSERT INTO teammember (teamid, usercode) VALUES (:teamid, :usercode)");
  foreach($homeMembers as $m) {
    $stmt->bindParam(':teamid', $hometeamid, PDO::PARAM_INT);
    $stmt->bindParam(':usercode', $m, PDO::PARAM_STR);
    $stmt->execute();
  }

  //Insert away members
  foreach($awayMembers as $m) {
    $stmt->bindParam(':teamid', $awayteamid, PDO::PARAM_INT);
    $stmt->bindParam(':usercode', $m, PDO::PARAM_STR);
    $stmt->execute();
  }
  
  echo json_encode(['success' => true, 'message' => 'Team saved']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
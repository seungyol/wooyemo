<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$gameid = $data['gameid'] ?? null;
$gamestart = $data['gamestart'] ?? null;
if($gamestart) {
    $gamestart = new DateTime($gamestart);
}
$gameend = $data['gameend'] ?? null;
if($gameend){
    $gameend = new DateTime($gameend);
}
$homescore = $data['homescore'] ?? null;
$awayscore = $data['awayscore'] ?? null;

if (!$gameid) {
    echo json_encode(['success' => false, 'message' => 'Missing gameid']);
    exit;
}

try {

  $stmt = $pdo->prepare('select TeamID, IsHomeTeam from team where gameid = :gameid');
  $stmt->bindParam(':gameid', $gameid, PDO::PARAM_INT);
  $stmt->execute();
  while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    if($row["IsHomeTeam"] == 1){
      $hometeamid = $row["TeamID"];
    }else {
      $awayteamid = $row["TeamID"];
    }    
  }

    $stmt = $pdo->prepare("INSERT INTO gamescore (GameId, GameStartDT, GameEndDT, HomeTeamID, HomeTeamScore, AwayTeamID, AwayTeamScore) " 
        . " VALUES (:GameId, :GameStartDT, :GameEndDT, :HomeTeamID, :HomeTeamScore, :AwayTeamID, :AwayTeamScore)");
    $stmt->bindParam(':GameId', $gameid, PDO::PARAM_INT);
    $stmt->bindValue(':GameStartDT', $gamestart->format('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt->bindValue(':GameEndDT',  $gameend->format('Y-m-d H:i:s'), PDO::PARAM_STR);
    $stmt->bindParam(':HomeTeamID', $hometeamid, PDO::PARAM_INT);
    $stmt->bindParam(':HomeTeamScore', $homescore, PDO::PARAM_INT);
    $stmt->bindParam(':AwayTeamID', $awayteamid, PDO::PARAM_INT);
    $stmt->bindParam(':AwayTeamScore', $awayscore, PDO::PARAM_INT);

    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Game Score has been saved']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
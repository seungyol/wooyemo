<?php
  header('Content-Type: application/json');
  require_once __DIR__ . '/../config/db.php'; // Adjust path if needed

  // Get POST data
  $data = json_decode(file_get_contents('php://input'), true);

  $gameid = $data['gameid'] ?? null;

  $query = "select DATE_FORMAT(GameStartDT,'%H:%i:%s') as GameStartDT, " .
    "DATE_FORMAT(GameEndDT,'%H:%i:%s') as GameEndDT,  HomeTeamScore,AwayTeamScore " . 
  " FROM gamescore where gameID = :gameid order by GameStartDT desc";
  $stmt = $pdo->prepare($query);
  $stmt->bindParam(':gameid',$gameid, PDO::PARAM_INT);
  $stmt->execute();
  $scores = $stmt->fetchAll();
  echo json_encode($scores);
?>
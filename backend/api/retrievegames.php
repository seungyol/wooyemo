<?php
  header('Content-Type: application/json');
  require_once __DIR__ . '/../config/db.php'; // Adjust path if needed

  $query = "select g.GameID, DATE_FORMAT(g.GameDate,'%d/%m/%Y') as GameDate, s.SportsName,count(gs.gameid) as NoOfGames " . 
  " FROM game g inner join sports s on g.sportscode = s.sportscode " . 
  "   left join gamescore gs on g.gameid = gs.gameid group by 1,2,3";
  $stmt = $pdo->query($query);
  $users = $stmt->fetchAll();
  echo json_encode($users);
?>
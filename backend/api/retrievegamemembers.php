<?php
  header('Content-Type: application/json');
  require_once __DIR__ . '/../config/db.php'; // Adjust path if needed

  // Get POST data
  $data = json_decode(file_get_contents('php://input'), true);

  $gameid = $data['gameid'] ?? null;

  $stmt = $pdo->query("SELECT t.TeamID,tm.Usercode,u.Username, t.IsHomeTeam FROM wooyemo.teammember tm inner join team t on t.TeamID = tm.TeamID "
   . " inner join game g on t.GameID = g.GameID "
   . " inner join user u on tm.Usercode = u.Usercode "
   . " where g.GameID = " . $gameid . " order by IsHomeTeam desc, tm.TeamMemberID");
  $members = $stmt->fetchAll();
  echo json_encode($members);
?>
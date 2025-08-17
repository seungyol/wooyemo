
<?php
  header('Content-Type: application/json');
  require_once __DIR__ . '/../config/db.php'; // Adjust path if needed

  $stmt = $pdo->query('select SportsCode, SportsName from wooyemo.sports');
  $users = $stmt->fetchAll();
  echo json_encode($users);
?>
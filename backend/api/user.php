<?php
  header('Content-Type: application/json');
  require_once __DIR__ . '/../config/db.php'; // Adjust path if needed

  $stmt = $pdo->query('select usercode, username from user');
  $users = $stmt->fetchAll();
  echo json_encode($users);
?>
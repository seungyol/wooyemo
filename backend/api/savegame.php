<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$gameType = $data['gameType'] ?? null;
$gameDate = $data['gameDate'] ?? null;

if (!$gameType || !$gameDate) {
    echo json_encode(['success' => false, 'message' => 'Missing gameType or gameDate']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO game (GameDate, SportsCode) VALUES (?, ?)");
    $stmt->execute([$gameDate, $gameType]);
    echo json_encode(['success' => true, 'message' => 'Game saved']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
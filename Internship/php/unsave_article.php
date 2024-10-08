<?php

$host = 'localhost';
$port = '3306';
$dbname = 'articles_db';
$username = 'root';
$password = '12Malax34';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $article_id = $_POST['article_id'];

    $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
    $stmt->execute([$article_id]);

    echo "Article unsaved successfully!";

    header("Location: saved_articles.php");
    exit;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

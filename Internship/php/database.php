<?php

$host = 'localhost';
$port = '3306';
$dbname = 'articles_db';
$username = 'root';
$password = '12Malax34';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");

    $pdo->exec("USE $dbname");

    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        url VARCHAR(255),
        url_to_image VARCHAR(255)
    )");

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

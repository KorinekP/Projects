<?php
$host = 'localhost';
$port = '3306';
$dbname = 'articles_db';
$username = 'root';
$password = '12Malax34';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $title = $_POST['title'];
    $description = $_POST['description'];
    $url = $_POST['url'];
    $url_to_image = $_POST['url_to_image'];
    $published_at = $_POST['published_at'];
    $content = $_POST['content'];

    $stmt = $pdo->prepare("INSERT INTO articles (title, description, url, url_to_image, published_at, content) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$title, $description, $url, $url_to_image, $published_at, $content]);

    echo "Article saved successfully!";

    if(isset($_GET['search_query'])) {
        $search_query = urlencode($_GET['search_query']);
        header("Location: index.php?search_query=" . $search_query);
    } else {
        header("Location: index.php");
    }
    exit;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NewsAPI</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
<form action="index.php" method="post">
<input type="text" name="search_query" placeholder="Search" value="<?php echo isset($_POST['search_query']) ? htmlspecialchars($_POST['search_query']) : ''; ?>">
    <button type="submit">Search</button>
</form>
    <section>
        <a href="./saved_articles.php">Saved articles</a>
    <section>
</header>
<main>
<?php
include("database.php");

function articleExists($pdo, $title)
{
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM articles WHERE title = ?");
    $stmt->execute([$title]);
    $count = $stmt->fetchColumn();
    return $count > 0;
}

try {
    if(isset($_POST['search_query'])) {
        $query = $_POST['search_query'];
    } elseif(isset($_GET['search_query'])) {
        $query = $_GET['search_query'];
    } else {
        $query = "apple";
    }
    
    $apiUrl = 'https://newsapi.org/v2/everything';
    $apiKey = '5fbacf48c69d4f3393cc04f15a8139e4';

    $url = "$apiUrl?qInTitle=$query&from=2024-03-30&sortBy=publishedAt&apiKey=$apiKey";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $userAgent = 'phphomework';
    curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
    $result = curl_exec($ch);

    if ($result === FALSE) {
        echo "Error fetching data from API: " . curl_error($ch);
    } else {
        $data = json_decode($result, TRUE);

        if (isset($data['status']) && $data['status'] == 'ok') {
            if ($data['totalResults'] > 0) {
                echo "<table>";
                echo '<tr> <td class="title">TITLE</td> <td>IMAGE</td> <td class="description">DESCRIPTION</td> <td>LINK</td> <td>ACTION</td>';
                foreach ($data['articles'] as $article) {
                    echo "<tr>";
                    echo '<td class="title">' . $article['title'] . "</td>";
                    echo "<td>" . '<img alt="failed to load image" src=' . $article['urlToImage'] . ">" . "</td>";
                    echo '<td class="description">' . $article['description'] . "</td>";
                    echo "<td>" . "<a href=" . $article['url'] . ">" . $article['title'] . "</a> </td>";
                    if (!articleExists($pdo, $article['title'])) {
                        echo "<td><form action='save_article.php?search_query=" . urlencode($query) . "' method='post'>";
                        echo "<input type='hidden' name='title' value='{$article['title']}'>";
                        echo "<input type='hidden' name='description' value='{$article['description']}'>";
                        echo "<input type='hidden' name='url' value='{$article['url']}'>";
                        echo "<input type='hidden' name='url_to_image' value='{$article['urlToImage']}'>";
                        echo "<button type='submit'>Save</button>";
                        echo "</form></td>";
                    } else {
                        echo "<td><button disabled>Saved</button></td>";
                    }
                }
                echo "</table>";
            } else {
                echo "No articles found";
            }
        } else {
            echo "Error: {$data['code']}: {$data['message']}";
        }
    }
    curl_close($ch);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
</main>
</body>
</html>

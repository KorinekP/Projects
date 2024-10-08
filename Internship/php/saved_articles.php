<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Articles</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <section>
            <a href="./index.php">Back</a>
        <section>
    </header>
    <main>
        <h1>Saved Articles</h1>
        <?php
        include("database.php");

        try {
            $stmt = $pdo->query("SELECT * FROM articles");
            $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($articles) {
                echo "<table>";
                echo '<tr> <td class="title">TITLE</td> <td>IMAGE</td> <td class="description">DESCRIPTION</td> <td>LINK</td> <td></td>';
                foreach ($articles as $article) {
                    echo "<tr>";
                    echo '<td class="title">' . $article['title'] . "</td>";
                    echo "<td>" . '<img alt="failed to load image" src=' . $article['url_to_image'] . ">" . "</td>";
                    echo '<td class="description">' . $article['description'] . "</td>";
                    echo "<td>" . "<a href=" . $article['url'] . ">" . $article['title'] . "</a> </td>";
                    echo "<td><form action='unsave_article.php' method='post'>";
                    echo "<input type='hidden' name='article_id' value='{$article['id']}'>";
                    echo "<button type='submit'>Unsave</button></form></td>";
                    echo "</tr>";
                }
                echo "</table>";
            } else {
                echo "No articles found";
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
        ?>
    </main>
</body>
</html>

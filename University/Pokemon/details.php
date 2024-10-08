<?php
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);

$allPokemonCards = $pokemonCardStorage->findAll();
$cardId = $_GET['id'] ?? null;
$cardDetails = $pokemonCardStorage->findById($cardId);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IKémon | <?php echo $cardDetails['name']; ?></title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/details.css">
</head>

<body>
    <header>
        <h1><a href="index.php">IKémon</a> > <?php echo $cardDetails['name']; ?></h1>
    </header>
    <div id="content">
        <div id="details">
            <div class="image clr-<?php echo $cardDetails['type']; ?>">
                <img src="<?php echo $cardDetails['image']; ?>" alt="">
            </div>
            <div class="info">
                <h2><?php echo $cardDetails['name']; ?></h2>
                <div class="description">
                <?php echo $cardDetails['description']; ?> </div>
                <span class="card-type"><span class="icon">🏷</span> Type: <?php echo $cardDetails['type']; ?></span>
                <div class="attributes">
                    <div class="card-hp"><span class="icon">❤</span> Health: <?php echo $cardDetails['hp']; ?></div>
                    <div class="card-attack"><span class="icon">⚔</span> Attack: <?php echo $cardDetails['attack']; ?></div>
                    <div class="card-defense"><span class="icon">🛡</span> Defense: <?php echo $cardDetails['defense']; ?></div>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>
</html>
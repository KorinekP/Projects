<?php
session_start();
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);

$allPokemonCards = $pokemonCardStorage->findAll();

$filteredPokemonCards = [];
foreach ($allPokemonCards as $cardId => $card) {
    if($card["owner"] == $_SESSION["user"])
    {
        $filteredPokemonCards[$cardId] = $card;
    }
}
$allPokemonCards = $filteredPokemonCards;

$allUsersStorage = new Storage(new JsonIO('users.json'), true);

$user = $allUsersStorage->findOne(["name" => $_SESSION["user"]]);

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IKémon | <?php echo $cardDetails['name']; ?></title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/cards.css">
    <style>
        .stats {
            font-size: 40px;
        }
        .card-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
    </style>
</head>

<body>
    <header>
        <h1><a href="index.php">IKémon</a> > <?php echo $user['name']; ?></h1>
    </header>
    <div id="content">
        <div id="card-list">
            <div class="info">
                <div class="stats">
                    <div class="name"> Name: <?php echo $user['name']; ?></div>
                    <div class="email"> Email: <?php echo $user['email']; ?></div>
                    <div class="wealth"> Money: <?php echo $user['money']; ?></div>
                </div>
                <div class="card-list">
                    <h2>Your Cards:</h2>
                    <?php foreach ($allPokemonCards as $cardId => $card): ?>
                        <div class="pokemon-card">
                            <div class="image clr-<?php echo $card['type']; ?>">
                                <img src="<?php echo $card['image']; ?>" alt="">
                            </div>
                            <div class="details">
                                <h2><a href="details.php?id=<?php echo $cardId; ?>"><?php echo $card['name']; ?></a></h2>
                                <span class="card-type"><span class="icon">🏷</span> <?php echo $card['type']; ?></span>
                                <span class="attributes">
                                    <span class="card-hp"><span class="icon">❤</span> <?php echo $card['hp']; ?></span>
                                    <span class="card-attack"><span class="icon">⚔</span> <?php echo $card['attack']; ?></span>
                                    <span class="card-defense"><span class="icon">🛡</span> <?php echo $card['defense']; ?></span>
                                </span>
                                <?php if ($_SESSION["user"] != "admin"): ?>
                                <div class="buy">
                                <a href="sell.php?id=<?php echo $cardId; ?>"><span class="icon">💰</span> <?php echo $card['price']; ?></a>
                                </div>
                                <?php endif ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>

</html>

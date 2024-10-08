<?php
//buy random gomb megjelenik de semmi hatása nincsen. A 9 kártya megjelenítést ugyan megcsináltam de nem ajax/fetch-el hanem csak simán sessionnel (ez lehet csak részponot ér vagy azt sem)
//peter peter1234 az egyik felhasználó ha ez hasznos lehet
session_start();
if (!isset($_SESSION['offset'])) {
    $_SESSION['offset'] = 0;
}
if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = "";
}
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);

$allPokemonCards = $pokemonCardStorage->findAll();

$allUsersStorage = new Storage(new JsonIO('users.json'), true);

$user = $allUsersStorage->findOne(["name" => $_SESSION["user"]]);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["element"])) $selectedElement = $_POST["element"];
else $selectedElement = "all";
if($selectedElement != "all")
{
    $offset = 0;
    $filteredPokemonCards = [];
    foreach ($allPokemonCards as $cardId => $card) {
        if($card["type"] == $selectedElement)
        {
            $filteredPokemonCards[$cardId] = $card;
        }
    }
    $allPokemonCards = $filteredPokemonCards;
}

$offset = $_SESSION['offset'];

if (isset($_GET['offset'])) {
    $offset = max(0, intval($_GET['offset']));
    if ($offset >= count($allPokemonCards)) {
        $offset = $offset - 9;
    }
    $_SESSION['offset'] = $offset;
}

$counter = 0;
if($selectedElement != "all") $offset = 0;
$filteredPokemonCards = [];
foreach ($allPokemonCards as $cardId => $card) {
    if($counter >= $offset && $counter <= $offset+8)
    {
        $filteredPokemonCards[$cardId] = $card;
    }
    $counter++;
}
$allPokemonCards = $filteredPokemonCards;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IKémon | Home</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/cards.css">
    <style>
        .button-container {
            display: inline-block;
            margin-right: 20px;
            margin-top: 20px;
            margin-left: 20px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #517d81;
            color: white;
            border-radius: 4px;
        }

        input{
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #517d81;
            color: white;
            border-radius: 4px;
        }

        .button:hover {
            background-color: #008C95;
        }

        select {
            padding: 10px;
            font-size: 16px;
        }
        form{
            display:inline-block;
        }
        .user-info {
            float: right;
        }
    </style>
</head>

<body>
    <header>
    <h1><a href="index.php">IKémon</a> > Home 
        <span class="user-info">
            <?php 
                if (!empty($_SESSION["user"])) {
                    echo '<a href="user.php">'; echo $user["name"]; echo "</a>";
                    echo " | ";
                    echo "{$user["money"]} <span>💰</span>";
                }
            ?>
        </span>
    </h1>
    </header>
    <?php if (($_SESSION["user"] == "admin")): ?>
    <div class="button-container">
        <a href="newcard.php" class="button">Add a new card</a>
    </div>
    <?php endif ?>
    <div class="button-container">
    <?php if (empty($_SESSION["user"])): ?>
        <a href="register.php" class="button">Register</a>
    <?php else: ?>
        <a href="index.php" class="button">Buy Random</a>
    <?php endif; ?>
    </div>
    <div class="button-container">
    <?php if (empty($_SESSION["user"])): ?>
        <a href="login.php" class="button">Login</a>
    <?php else: ?>
        <a href="logout.php" class="button">Log out</a>
    <?php endif; ?>
    </div>   
    <div class="button-container">
    <form action="index.php" method="post">
        <input type="submit" value="Filter">
        <select id="element" name="element">
            <option value="all">All</option>
            <option value="electric">Electric</option>
            <option value="poison">Poison</option>
            <option value="normal">Normal</option>
            <option value="bug">Bug</option>
            <option value="fire">Fire</option>
            <option value="grass">Grass</option>
            <option value="water">Water</option>
        </select>
    </form>
    <div class="button-container">
        <a href="index.php?offset=<?php echo max(0, $offset - 9); ?>" class="button">Previous</a>
        <a href="index.php?offset=<?php echo $offset + 9; ?>" class="button">Next</a>
    </div>
</div>
    <div id="content">
        <div id="card-list">
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
                    </div>
                    <?php if (!empty($_SESSION["user"]) && $_SESSION["user"] != "admin" && $card["owner"] == "admin"): ?>
                    <div class="buy">
                      <a href="buy.php?id=<?php echo $cardId; ?>"><span class="icon">💰</span> <?php echo $card['price']; ?></a>
                    </div>
                    <?php endif ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <footer>
        <p>IKémon | ELTE IK Webprogramozás</p>
    </footer>
</body>

</html>
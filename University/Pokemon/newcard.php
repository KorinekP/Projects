<?php
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);

$allPokemonCards = $pokemonCardStorage->findAll();

$possibleElements = ["electric", "poison", "normal", "bug", "fire", "grass", "water"];

$name = $type = $hp = $attack = $defense = $price = $description = $image = "";
$nameErr = $typeErr = $hpErr = $attackErr = $defenseErr = $priceErr = "";

function validateNumber($input) {
    return is_numeric($input) && $input > 0;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $type = htmlspecialchars($_POST["type"]);
    $hp = htmlspecialchars($_POST["hp"]);
    $attack = htmlspecialchars($_POST["attack"]);
    $defense = htmlspecialchars($_POST["defense"]);
    $price = htmlspecialchars($_POST["price"]);
    $description = htmlspecialchars($_POST["description"]);
    $image = htmlspecialchars($_POST["image"]);

    if (empty($name)) {
        $nameErr = "Name is required";
    }

    if (!in_array($type, $possibleElements)) {
        $typeErr = "Invalid element";
    }

    if (!validateNumber($hp)) {
        $hpErr = "HP must be a number greater than 0";
    }

    if (!validateNumber($attack)) {
        $attackErr = "Attack must be a number greater than 0";
    }

    if (!validateNumber($defense)) {
        $defenseErr = "Defense must be a number greater than 0";
    }

    if (!validateNumber($price)) {
        $priceErr = "Price must be a number greater than 0";
    }

    if (empty($nameErr) && empty($typeErr) && empty($hpErr) && empty($attackErr) && empty($defenseErr) && empty($priceErr)) {
        $newCard = [
            "name" => $name,
            "type" => $type,
            "hp" => (int)$hp,
            "attack" => (int)$attack,
            "defense" => (int)$defense,
            "price" => (int)$price,
            "description" => $description,
            "image" => $image,
            "owner" => "admin",
        ];

        $pokemonCardStorage->add($newCard);

        header("Location: index.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Card</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/cards.css">

    <style>
        body {
            font-family: 'Arial', sans-serif;
        }

        form {
            max-width: 600px;
            margin: 0 auto;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-size: 20px;
        }

        input[type="text"], textarea {
            width: 100%;
            padding: 8px;
            font-size: 16px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        .error {
            color: #ff0000;
            font-size: 14px;
            margin-bottom: 10px;
            display: block;
        }

        input[type="submit"] {
            background-color: #517d81;
            color: white;
            padding: 10px 15px;
            font-size: 18px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #008C95;
        }
    </style>
</head>
<body>
    <header>
        <h1><a href="index.php">IKémon</a> > Add new card</h1>
    </header>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <label for="name">Name:</label>
        <input type="text" name="name" value="<?php echo $name; ?>">
        <span class="error"><?php echo $nameErr; ?></span>

        <label for="type">Type:</label>
        <input type="text" name="type" value="<?php echo $type; ?>">
        <span class="error"><?php echo $typeErr; ?></span>

        <label for="hp">HP:</label>
        <input type="text" name="hp" value="<?php echo $hp; ?>">
        <span class="error"><?php echo $hpErr; ?></span>

        <label for="attack">Attack:</label>
        <input type="text" name="attack" value="<?php echo $attack; ?>">
        <span class="error"><?php echo $attackErr; ?></span>

        <label for="defense">Defense:</label>
        <input type="text" name="defense" value="<?php echo $defense; ?>">
        <span class="error"><?php echo $defenseErr; ?></span>

        <label for="price">Price:</label>
        <input type="text" name="price" value="<?php echo $price; ?>">
        <span class="error"><?php echo $priceErr; ?></span>

        <label for="description">Description:</label>
        <textarea name="description"><?php echo $description; ?></textarea>

        <label for="image">Image Link:</label>
        <input type="text" name="image" value="<?php echo $image; ?>">

        <input type="submit" value="Add Card">
    </form>
</body>
</html>

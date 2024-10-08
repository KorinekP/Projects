<?php
session_start();
include_once("storage.php");
$allUsersStorage = new Storage(new JsonIO('users.json'), true);

$allUsers = $allUsersStorage->findAll();

$name = $password = "";
$nameErr = $passworderr = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["name"]);
    $password = htmlspecialchars($_POST["password"]);

    $existingUser = $allUsersStorage->findOne(["name" => $name]);

    if (empty($name)) {
        $nameErr = "Name is required";
    } else if (!$existingUser) {
        $nameErr = "Username is not recognised";
    }

    if (empty($password)) {
        $passworderr = "Password is required";
    } elseif ($existingUser && $existingUser['password'] != $password) {
        $passworderr = "Incorrect password";
    }

    if (empty($nameErr) && empty($passworderr)) {
        $_SESSION['user'] = $name;
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
    <title>Login</title>
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

        input[type="text"], textarea, input[type="password"] {
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
        <h1><a href="index.php">IKémon</a> > Login</h1>
    </header>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <label for="name">Name:</label>
        <input type="text" name="name" value="<?php echo $name; ?>">
        <span class="error"><?php echo $nameErr; ?></span>

        <label for="password">Password:</label>
        <input type="password" name="password" value="<?php echo $password; ?>">
        <span class="error"><?php echo $passworderr; ?></span>

        <input type="submit" value="Login">
    </form>
</body>
</html>

<?php
session_start();
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);
$allUsersStorage = new Storage(new JsonIO('users.json'), true);
$cardId = $_GET['id'];
$card = $pokemonCardStorage->findById($cardId);
$user = $allUsersStorage->findOne(["name" => $_SESSION["user"]]);
if($user["numcards"] > 4 || $user["money"]<$card["price"])
{
    header('Location: index.php');
    exit();
}
$card['owner'] = $_SESSION['user'];
$pokemonCardStorage->update($cardId, $card);
$user["money"] = $user["money"] - $card["price"];
$user["numcards"] = $user["numcards"] +1;
$allUsersStorage->update($user["id"], $user);
header('Location: index.php');
exit();
?>

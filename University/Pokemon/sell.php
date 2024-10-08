<?php
session_start();
include_once("storage.php");
$pokemonCardStorage = new Storage(new JsonIO('cards.json'), true);
$allUsersStorage = new Storage(new JsonIO('users.json'), true);
$cardId = $_GET['id'];
$card = $pokemonCardStorage->findById($cardId);
$user = $allUsersStorage->findOne(["name" => $_SESSION["user"]]);
$card['owner'] = "admin";
$pokemonCardStorage->update($cardId, $card);
$user["money"] = ceil($user["money"] + $card["price"] * 0.9);
$user["numcards"] = $user["numcards"] -1;
$allUsersStorage->update($user["id"], $user);
header('Location: user.php');
exit();
?>

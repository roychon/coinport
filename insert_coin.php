<?php

try {
    $db = new PDO('mysql:host=localhost;dbname=coinport;charset=utf8', 'root', '');
} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

$data = json_decode(file_get_contents('php://input'), true);

$rank = $data['rank'];
$name = $data['name'];
$price = $data['price'];

$req = $db->prepare('INSERT INTO coin (price, name, rank) VALUES(:price, :name, :rank)');
$req->bindParam(":name", $name, PDO::PARAM_STR);
$req->bindParam(":price", $price, PDO::PARAM_INT);
$req->bindParam(":rank", $rank, PDO::PARAM_INT);
$req->execute();



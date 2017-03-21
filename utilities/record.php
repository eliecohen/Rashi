<?php 


$book = $_POST['book'];
$perek= $_POST['perek'];
$type = $_POST['type'];

//$data = json_decode($_POST['db']);

$file = "./../source/sound/{$book}/{$perek}_{$type}.json";
file_put_contents ($file, $_POST['db']);


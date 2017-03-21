<?php

$book = $_GET['b'];
$perek= $_GET['p'];

//file_put_contents("1.log", $book);

//http://localhost/1/comment.php?b=1&p=6



$file1 = "./../source/comment/{$book}_{$perek}.js";
$file2 = "./../source/comment/{$book}_{$perek}_wiki.json";

$ar1 = array();
$ar2 = array();

if (file_exists($file1))
{
	$json1=file_get_contents($file1);
	$ar1 = json_decode($json1,true);
}

if (file_exists($file2))
{
	$json2=file_get_contents($file2);
	$ar2 = json_decode($json2,true);
}


$ar3 = array_merge($ar1, $ar2);

header('Content-Type: application/json; charset=utf8');
header('Cache-Control: no-cache, must-revalidate');
echo json_encode($ar3);

?>


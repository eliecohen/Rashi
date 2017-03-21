<?php

$book = $_GET['b'];
$perek= $_GET['p'];

$mp3 = array();

$rootDir = "./../source/sound/{$book}/";
$dirs = scandir($rootDir);

foreach ($dirs as $file)
{
	if ( substr($file,0,1) != "." && !is_dir($file) && $file != "." && $file != ".." && (int)$file == (int)$perek && substr($file, -4) == ".mp3" )
	{
		$mp3[] = $file;
	}
}

header('Content-Type: application/json; charset=utf8');
header('Cache-Control: no-cache, must-revalidate');
echo json_encode($mp3);

?>


<?php

//$formData = json_decode($_GET['formData']);
//$b=0;
//if (isset($_POST['formData']))
	//	$b = 1;

//$_POST["first"]; // Decode JSON object into readable PHP object



//$title = array("ddddd", $formData['etitle']);

//print_r ($formData);
//$username = $formData->{'username'}; // Get username from object
//$password = $formData->{'password'}; // Get password from object

//$indexFirstWord = $_GET['index-first-word'];
//$perek= $_GET['p'];

//http://localhost/1/comment.php?b=1&p=6

//echo $indexFirstWord;
//return;

//$data = array ($_GET);

$book   = (int)$_GET['book'];
$perek  = (int)$_GET['perek'];
$id     = (int)$_GET['id'];
$p      = (int)$_GET['passouk'];
$w      = (int)$_GET['w'];
$offset = (int)$_GET['offset'];
$type   = (int)$_GET['type'];

$action   = $_GET['action'];
$title    = $_GET['title'];
$comment  = $_GET['comment'];
$question = $_GET['question'];
$html     = $_GET['html'];
$author   = $_GET['author'];

$from      = NULL;
$to        = NULL;
$direction = NULL;

if (isset($_GET['from']))
	$from     = $_GET['from'];
if (isset($_GET['to']))
	$to       = $_GET['to'];
if (isset($_GET['direction']))
	$direction= $_GET['direction'];

$data = array();

$file = "./../source/comment/{$book}_{$perek}.js";

// ************************************************
// get the current data structure for the request perek 
// ************************************************

if (file_exists($file))
{
	$json=file_get_contents($file);
	$data = json_decode($json,true);
}

// ************************************************
// for intro & condense & communication
// ************************************************

if ($type == "5" || $type == "6" || $type == "7")
{
	if ($action == "update")
		$action = "create";

	// ***************************************************
	// if exist delete a older item of the same passouk
	// ***************************************************

	foreach ($data as $item){
		if ($item["p"] == $p && $item["type"] == $type)
			;
		else
			$data2[] = $item;
	}
	$data = $data2;	
}	


// ************************************************
// create (add)
// ************************************************

if ($action == "create"){
	$data[] = array("p"=>$p, "w"=>$w, "type"=>$type,"offset"=>$offset, "author"=>$author,"title"=>$title, "question" => $question,"html"=>$html,"content"=>$comment,"id"=>$id,"direction"=>$direction, "from"=>$from, "to"=>$to);
}

// ************************************************
// modify (update)
// ************************************************

else if ($action == "update"){
	foreach ($data as $item){
		if ($item["id"] != $id)
			$data2[] = $item;
	}
	$data = $data2;
	$data[] = array("p"=>$p, "w"=>$w, "type"=>$type,"offset"=>$offset, "author"=>$author,"title"=>$title, "question" => $question, "html"=>$html,"content"=>$comment,"id"=>$id);	
}

// ************************************************
// delete
// ************************************************

else if ($action == "delete"){
	foreach ($data as $item){		
		if ($item["id"] != $id)
			$data2[] = $item;
	}
	$data = $data2;
}

// ************************************************
// order the data by passouk & word
// ************************************************

$sort = array();
foreach($data as $k=>$v) {
	$sort['p'][$k] = $v['p'];
	$sort['w'][$k] = $v['w'];
	$sort['offset'][$k] = $v['offset'];
}
# sort by event_type desc and then title asc
array_multisort($sort['p'], SORT_ASC, $sort['w'], SORT_ASC,$sort['offset'], SORT_ASC,$data);

header('Content-Type: application/json; charset=utf8');
header('Cache-Control: no-cache, must-revalidate');

// ************************************************
// save the update data
// ************************************************

if (file_put_contents($file, json_encode($data)) === FALSE)
{
	echo json_encode($data);
}
else
{ 
	//echo phpinfo();
	echo "{\"error\":1}";
}


?>


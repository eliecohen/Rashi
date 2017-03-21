<?php

$dirs = scandir("./../source/comment/");

//error_reporting(E_ERROR | E_PARSE);

    foreach ($dirs as $file)
    {	
       if ( substr($file,0,1) != "." && !is_dir($file) && $file != "." && $file != ".." && strpos($file, ".json"))
       {
       		$underscorePosition = strpos($file, "_");  // 1_11.json
       		if ($underscorePosition !== false)
       		{       		
       			$book  = (int)(substr($file, 0, $underscorePosition));
       			$perek = (int)(substr($file, $underscorePosition+1));
       		}       		       		       		     	          	
       	
           $json = file_get_contents("./source/comment/".$file);
	   	   echo "read file source/comment/{$file}\n<br/>";
	   	   
	   	   echo "Book={$book} Perek={$perek}<br/>";
	   	   
	   	   $arrayData = json_decode($json, true);
	   	   
	   	   foreach ($arrayData as $item)
	   	   {
	   	   	 if ($item['type'] == 5)  // intro
	   	   	 {
	   	   	 	$indexWeight = (int)(($book*100000)+($perek*1000)+(int)($item['p']));  
	   	   	 	$p[$indexWeight]=array("book"=>$book,"perek"=>$perek,"passouk"=>$item['p'],"text"=>$item['title']);
	   	   	 	echo $item['title'];
	   	   	 	echo "<br/>";
	   	   	 }	   	   	 
	   	   }	                        
       }
    }   
    
    ksort($p);
    
   foreach ($p as $value)
    $output[]=$value;

    //echo "/comments/".$fileOutput." generated <br/>";
    file_put_contents("./../source/comment/intro_all", json_encode($output));
    
?>
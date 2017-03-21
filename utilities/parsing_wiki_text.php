<?php

// 1. open wikisource in mobile mode 
// http://he.m.wikisource.org/wiki/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA_%D7%91
// 2. saved the whole page as html only
// 3. put in the tmp directory

$root_dir = "./../tmp/wikisource/";

$dirs = scandir($root_dir); 

$ppp = array();
$t2  = array();
$all = array();

error_reporting(E_ERROR | E_PARSE);

    foreach ($dirs as $file)
    {	
       if ( substr($file,0,1) != "." && !is_dir($file) && $file != "." && $file != "..")
       {
		  // if ($file != "1_13.html")
		  	//if (substr($file,0,1) != "5")
		   		//continue;
       	
       	   $fileOutput = str_replace(".html", ".json", $file);
       	
       	   unset($all);
           $data = file_get_contents($root_dir.$file);
	   	   echo "read file $root_dir{$file}\n<br/>";
	   
           unset($t);
	   	   $dom = new DOMDocument;
           $dom->loadHTML( '<?xml encoding="UTF-8">'.$data );
           
           $NavContentCounter = 1;
           foreach ($dom->getElementsByTagName('div') as $element) 
           { 
           	                 	
           	if (strpos($element->getAttribute('class'), 'NavContent') !== false) 
           	{
           	   /*
           		*   i == 1   hebrew wihtout nikoud
           		*   i == 2   hebrew with nikoud
           		*   i == 4   hebrew with nikoud and taamim
           		*
           		*/
           		
           		if ($NavContentCounter == 3 || $NavContentCounter== 5)
           		{
           			$NavContentCounter++;
           			continue;
           		}   
           		
           		echo "################## {$NavContentCounter}######################<br/>";
           		unset($pieces);
           		unset($ppp);
           		
           		foreach ($element->childNodes as $item)
           		{
           			$j = 1;
           			//echo "-1-->Type ".$item->nodeType. " | nodeName =".$item2->nodeName."<br/>";
           			if ($item->nodeType)
           			{
           				foreach ($item->childNodes as $item2)
           				{           					
           					$smallTagActive = FALSE;
           					
           					foreach ($item2->childNodes as $item3)
           					{
           						//echo $item3->nodeName."</br>";
           						
           						// *****************************
           						// ecrit/oral 
           						// <small>ecrit</small>[oral]
           						// *****************************
           						
           						if ($item3->nodeName == "small" )
           						{
           							//echo "small=>".$item3->nodeValue."</br>";
           							$ppp[count($ppp)-1][]=$item3->nodeValue; 
           							//echo "---".implode(",",$ppp[count($ppp)-1])."---<br/>";
           							$smallTagActive = TRUE;
           						} 
           						if ($item3->nodeName != "br" && $item3->nodeType == 3 )  // for furst and second
           						{
           							
           							$str = $item3->C14N();

           							//echo "*{$j}*".$str."*<br/>";
           							
           							$str = preg_replace("/\[([^\[\]]++|(?R))*+\]/", "", $str);
           							
           							$pieces = explode(" ", trim($str));
           							//foreach ($pieces as $piece)
           							//	echo " ---> ".$piece."<br/>";
									//echo "<br/>";
           							if ($smallTagActive)
           							{
           								foreach ($pieces as $piece)
           									$ppp[count($ppp)-1][]=$piece;
           								$smallTagActive = FALSE;
           								echo "---".implode(",",$ppp[count($ppp)-1])."---<br/>";
           							}
           							else
										$ppp[]=$pieces;								           										
           							$j++;
           						}
           					}           					
           				}
           			}
           		}
           		
           		//echo $i."_".$file." generated<br/>";
           		//file_put_contents("./source/".$i."_".$file, json_encode($ppp));
           		
           		$all[]=$ppp;
           		
           		$NavContentCounter++;
           	} // if div is NavContent           	
           }//for each div  

           if (count($all)>0)
           {
           		echo "/source/text/".$file." generated (all)<br/>";
           		//file_put_contents("./source/text/".$fileOutput, json_encode($all));
           		file_put_contents("./../source/wikitext/".$fileOutput, json_encode($all));
           }           
           
       }// if relevant file
    }// for each file   

?>
<?php

error_reporting(E_ERROR | E_PARSE);

// 1. open wikisource in mobile mode 
// http://he.m.wikisource.org/wiki/%D7%91%D7%A8%D7%90%D7%A9%D7%99%D7%AA_%D7%91
// 2. saved the whole page as html only
// 3. put in the tmp directory

$rootDir = "./../tmp/wikisource/";
$dirs = scandir($rootDir);
$ppp = array();
$t2 = array();
$all = array();

// ***************************************************
// count number of word in a given string
// ***************************************************

function count_words($string) {
	// Return the number of words in a string.
	$string= str_replace("&#039;", "'", $string);
	$t= array(' ', "\t", '=', '+', '-', '*', '/', '\\', ',', '.', ';', ':', '[', ']', '{', '}', '(', ')', '<', '>', '&', '%', '$', '@', '#', '^', '!', '?', '~'); // separators
	$string= str_replace($t, " ", $string);
	$string= trim(preg_replace("/\s+/", " ", $string));
	$num= 0;
	if (my_strlen($string)>0) {
		$word_array= explode(" ", $string);
		$num= count($word_array);
	}
	return $num;
}

// ***************************************************
// Return mb_strlen with encoding UTF-8.
// ***************************************************

function my_strlen($s) {
	return mb_strlen($s, "UTF-8");
}

// ***************************************************
// Main Procedure
// ***************************************************

$lastExplanationSourceLenght = 0;
$scenario = 1;  
	
// ***************************************************
// for each file in the directory
// ***************************************************
		
foreach ($dirs as $file)
{	
   if ( substr($file,0,1) != "." && !is_dir($file) && $file != "." && $file != "..")
   {
      $current_passouk = 0;	
      unset($comments); 
       	
      if ($file != "1_1.html")
      {
       	 //continue;
      }
       	
      $fileOutput = str_replace(".html", "_wiki.json", $file);
       	
      unset($all);
      unset($t);
      
      echo "read file {$rootDir}{$file}\n<br/>";
      $data = file_get_contents($rootDir.$file);
   
      // create the dom object
      
	  $dom = new DOMDocument;
      $dom->loadHTML( '<?xml encoding="UTF-8">'.$data );
            
      $NavContentCounter = 1;
      foreach ($dom->getElementsByTagName('div') as $element) 
      { 
          //echo "------".$element->nodeName."<br/>";
           	
          if (strpos($element->getAttribute('class'), 'NavContent') !== false) 
          {
           	echo "NavContent</br>";
           	if ($NavContentCounter != 5)  // 1 hebrew wihtout nikoud |  2 hebrew with nikoud | 4 hebrew with nikoud and taamim
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
           		//echo "--[level 1] Type ".$item->nodeType. " | nodeName =".$item->nodeName."<br/>";
           		if ($item->nodeType)
           		{
           			foreach ($item->childNodes as $item2)
           			{   
           				if ($item2->nodeName == "#text")
           					continue;
           					
           				//echo "----[level 2] NodeType=".$item2->nodeType." | NodeName=".$item2->nodeName."<br/>";
           				$isTransition = false;
           				if ($item2->nodeName == "div")
           				{
           					if (strpos($item2->getAttribute("style"), "background-color:#eee") !== false)
           					 	$isTransition = true;           					 	
           				}
           					
           				foreach ($item2->childNodes as $item3)
           				{
           					if ($item3->nodeName != "br" && $item3->nodeName != "table" /*&& $item3->nodeType == 3*/ )  // for furst and second
           					{           							           							
           						if ($item3->nodeType == 1)
           						{
           							//echo "------[level 3] NodeType=".$item3->nodeType." | NodeName=".$item3->nodeName."<br/>";
           								
           							foreach ($item3->childNodes as $item4)
           							{           									
           								if ($item4->nodeName == "img" || $item4->nodeName == "tr" || $item4->nodeName == "big")
           									continue;
           								
           								$isNewPassouk  = false;
           								$isExplanation = false;

           								// ************************************
           								// passouk number link 
           								// ************************************
           										
           								if ($item4->nodeName == "a" && $item4->getAttribute('class') == "mw-redirect")
           								{
           									$current_passouk++;
           									echo "-------- NEW PASSOUK {$current_passouk}<br/>";
           									$isNewPassouk = true;
           									$current_word = 0;           											
           								}
           										
           								else if ($isTransition)
           								{
           									echo "-------- TRANSITION AFTER {$current_passouk}<br/>";
           									echo "--------".trim(strip_tags($item4->C14N()));
           									$comments[] = array("p"=>$current_passouk+1,"w"=>0,"offset"=>0,"type"=>5,"title"=>trim(strip_tags($item4->C14N())),"id"=>6892973459,"author"=>null,"question"=>null,"html"=>null,"content"=>null,"direction"=>null,"from"=>null,"to"=>null );
           								}

           								else 
           								{
           										
           									$string = trim(strip_tags(($item4->C14N())));
           									$string= trim(str_replace("←", "",$string));
           										
           										
           									$nbOfWord = count_words($string);
           										           										           										           									
           									// *******************************
           									// parse the Explanation
           									// *******************************
           										
           									if ($item4->nodeName == "span" && $item4->getAttribute('class') == "the_explain")
           									{
           										echo "-------- EXPLANATION<br/>";
           										echo "--------**{$string}**<br/>";           											
           										$isExplanation = true;
           										$current_word = $current_word+1;
           										echo "-------- ADD COMMENT p={$current_passouk} w={$current_word} offset={$lastExplanationSourceLenght}<br/>";
           										$comments[] = array("p"=>$current_passouk,"w"=>$current_word,"offset"=>$lastExplanationSourceLenght,"type"=>4,"title"=>"wikisource","content"=>$string,"id"=>6892973459,"author"=>"","question"=>"","html"=>null,"direction"=>null,"from"=>null,"to"=>null );           											
												$current_word+= $lastExplanationSourceLenght-1;           											
           									}
           										
           									// *******************************
           									// parse the explanation source
           									// *******************************
           										
           									else if  (!$isExplanation && !$isNewPassouk && !$isTransition)
           									{
           										echo "--------##{$string}## lenght={$nbOfWord}<br/>";
           										$lastExplanationSourceLenght = $nbOfWord;
           									}           										
           							           									           							           										
           									//echo "-------- current_word={$current_word}][item4] NodeType=".$item4->nodeType." | NodeName=".trim(strip_tags($item4->nodeName))." | j={$j}#".trim($item4->C14N())."# $nbOfWord={$nbOfWord}<br/>";
           								}           										           												
           							}           								
           						}
           						else if ($item3->nodeType == 3) 
           						{           						
           							$t= array( "\t", '=', '+', '-', '*', '/', '\\', ',', '.', ';', ':', '[', ']', '{', '}', '(', ')', '<', '>', '&', '%', '$', '@', '#', '^', '!', '?', '~',"\""); // separators
           							$string2= trim(str_replace($t, "",$item3->C14N()));
           							if (strlen($string2)>2)           									
           							{           									
           								$pieces = explode(" ", $string2);
           								$nbOfWord = count($pieces);
           								echo "------%%".$string2."%% lenght={$nbOfWord}<br/>";
           								$current_word+=$nbOfWord;
           								echo "------ current_word={$current_word}<br/>";
           								//foreach ($pieces as $piece)
           								//	echo " ---> ".$piece."<br/>";
           							}
           						}
           					}
           				}           					
           			}
           		}
           	}//foreach ($element->childNodes as $item)
           	
           	//echo $i."_".$file." generated<br/>";
           	//file_put_contents("./source/".$i."_".$file, json_encode($ppp));
           		
           	$all[]=$ppp;
           		
           	$NavContentCounter++;
           	} // if div is NavContent 
           	/*else //NavContent not found
           	{
           		if ($NavContentCounter<3){ // this means we are in the biour type 2
           			$scenario = 2;
           			echo "scenario 2</br>";
           			break;
           		}
           	} */         	
           }//for each div  

           /////////////////////////////////////////////////////////////////////
           // SCENARIO 2
           /////////////////////////////////////////////////////////////////////
           
           $passouk = 0;
           
           /*if ($scenario == 2)
           {

           		$root = $dom->getElementById('mw-content-text');
                      		
           		foreach ($root->childNodes as $el)
           		{  
           			echo "**".$el->nodeName."**<br/>\n";
           			if ($el->nodeName == "div")  // first div
           			{
           				echo $el->nodeValue."<br/>\n";
           				
           				foreach ($el->childNodes as $el2)
           				{
           					if ($el2->nodeName == "p")
           					{
           						foreach ($el2->childNodes as $el3)
           						{
           							
           							
           							///////////// new Passouk
           							
           							if ($el3->nodeName == "span" && $el3->getAttribute('class') == "low_opacity") 
           							{
           								
           								$passouk++;
           								echo "NEW PASSOUK (".$passouk.")</br>";
           								$index_word = 0;           								
           							}
           							
           							///////////// text
           							
           							if ($el3->nodeName == "#text") 
           							{
           								echo "--".$el3->nodeName."--<br/>\n";
           								echo "--".$el3->nodeValue."--<br/>\n";
           								echo "number of word = ".count_words($el3->nodeValue)."</br>";
           								$index_word += count_words($el3->nodeValue);
           							}
           							           							
           							///////////// explanation
           							
           							if ($el3->nodeName == "span" && $el3->getAttribute('class') == "word_with_explain")
           							{
           								//echo "----".$el3->nodeName."--<br/>\n";
           								//echo "----".$el3->nodeValue."**<br/>\n";
           								
           								foreach ($el3->childNodes as $el4)
           								{
           									if ($el4->nodeName == "#text")
           									{
           										echo "------".$el4->nodeName."--<br/>\n";
           										echo "------".$el4->nodeValue."**<br/>\n";
           										$offset = count_words($el4->nodeValue);
           										echo "number of word = ".$offset."</br>";
           										$index_word += $offset;
           										
           									}
           									
           									if ($el4->nodeName == "span" && $el4->getAttribute('class') == "the_explain")
           									{
           										if ($offset == 1)
           											$word = $index_word;
           										else
           											$word = $index_word - $offset + 1;
           										echo "EXPLANATION sur le mot numero ".$word." offset = ".$offset."==>".$el4->nodeValue."<br/>\n";
           										//echo "-------- ADD COMMENT p={$current_passouk} w={$current_word} offset={$lastExplanationSourceLenght}<br/>";
           										$comments[] = array("p"=>$passouk,"w"=>$word,"offset"=>$offset,"type"=>4,"title"=>"wikisource","content"=>$el4->nodeValue,"id"=>689299773459,"author"=>"","question"=>"","html"=>null,"direction"=>null,"from"=>null,"to"=>null );
           										 
           									}
           								}
           							}
           						}
           					}
           				}	
           				break; 
           			}	
           		}
       } //if ($scenario == 2)*/
           
       // *****************************************
       // write comment to file
       // *****************************************
       
       if (count($comments)>0)
       {
         echo "/comments/".$fileOutput." generated#### <br/>";
         //file_put_contents("./source/comment/".$fileOutput, json_encode($comments));
         file_put_contents("./../source/comment/".$fileOutput, json_encode($comments));
       }  
       else
       {
       	 echo "comments variable is empty"."<br/>";
       } 
       
     }// if relevant file   
   }// for each file   

?>
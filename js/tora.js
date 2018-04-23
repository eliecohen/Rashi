
//
//
// - title of the page
// - revoir la data structure des comments
// -  mettre a jours le array aveec le commencement de chaque passouk
// - validation form for all page
// -  picture upload
// - faire plus jolie data table
// - generic comment reuse for example efod
// - pas clair qunad le button des resume est allume
// - disable the passouk not clickable if not commentregular
// - est ce que le get tooltip comment is x2 1 fois pour le editor et une fois pour la page ?
//
// low priority
// ==============
// - option choisir sa langue
// - save state of the layout in cookie
// - missing passouk /perek in editor mode
// -  goto the current parasha
// -. teoudat zeout in the option form



//************************************************
//*******  footbar  Module                  ******
//************************************************

"use strict";

var footbarModule = {

	  // *****************************************
		// init function
		// *****************************************

		init: function(){

			this.checkboxPausePlay      = $("#checkbox-play");
			this.checkboxPausePlayLabel = $("#checkbox-play-label");

            this.checkboxIntro          = $("#checkbox-resume");
            this.checkboxIntroLabel     = $("#checkbox-resume-label");

            this.checkboxRecord         = $('#checkbox-record');
            this.checkboxRecordLabel    = $('#checkbox-record-label');

            this.buttonSave             = $('#save-record');
            this.selectMenuSound        = $('#select-sound-type-button');

            this.selectSoundType        = $('#select-sound-type');

            this.bindUIActions();

		},

	  // *****************************************
		// change PausePlay button label
		// *****************************************

		changePausePlayLabel: function (label){
			this.checkboxPausePlayLabel.text(label);
		},

	  // *****************************************
		// hide intro button function
		// *****************************************

		hideIntroButton: function() {
			this.checkboxIntro.hide();
			this.checkboxIntroLabel.hide();
		},

	  // *****************************************
		// show intro button function
		// *****************************************

		showIntroButton: function() {
			this.checkboxIntro.show();
			this.checkboxIntroLabel.show();
		},

	    // *****************************************
		// hide sound button function
		// *****************************************

		hideSoundButton: function (){
			this.checkboxPausePlay.hide();
			this.checkboxPausePlayLabel.hide();
		},

	    // *****************************************
		// show sound button function
		// *****************************************

		showSoundButton: function (){
			this.checkboxPausePlay.show();
			this.checkboxPausePlayLabel.show();
		},

	    // *****************************************
		// hide Record button function
		// *****************************************

		hideRecordButton: function (){
			this.checkboxRecord.hide();
			this.checkboxRecordLabel.hide();
		},

	    // *****************************************
		// show record button function
		// *****************************************

		showRecordButton: function (){
			this.checkboxRecord.show();
			this.checkboxRecordLabel.show();
		},

	    // *****************************************
		// hide 'Save' button function
		// *****************************************

		hideSaveButton: function (){
			this.buttonSave.hide();
		},

	    // *****************************************
		// show 'save' button function
		// *****************************************

		showSaveButton: function (){
			this.buttonSave.show();
		},

	    // *****************************************
		// hide 'SelectMenu' button function
		// *****************************************

		hideSelectMenuSound: function (){
			this.selectMenuSound.hide();
		},

	    // *****************************************
		// show 'SelectMenu' button function
		// *****************************************

		showSelectMenuSound: function (){
			this.selectMenuSound.show();
		},

	    // *****************************************
		// update Sound Selection 'SelectMenu'
		// *****************************************

		updateSoundSelection:  function (data){

			var type, selectText;

			$(".dynamic-type").remove();
			$.each( data, function( key, value ) {

				type = value.split("_").pop().split(".")[0];  // 1_1.mp3  perek 1 & type 1

				if (type === "1") {
                    selectText = "אשכנזית";
                }
				else if (type === "2") {
                    selectText = "ספרדית";
                }
				else {
                    selectText = "other";
                }

				footbarModule.selectSoundType.append($("<option class='dynamic-type'></option>").attr("value",type).text(selectText));

			});

			footbarModule.selectSoundType.selectmenu( "refresh" );
		},

	    // *****************************************
		// refresh function
		// *****************************************

		refreshFootBar: function() {

			if (layoutModule.setting.mode === layoutModule.LAYOUT_TAAMIM)
			{
				this.showSoundButton();
				this.showSelectMenuSound();

				this.hideIntroButton();

				if (metaDataModule.isAuthor())
				{
					this.showSaveButton();
					this.showRecordButton();
				}
				else
				{
					this.hideSaveButton();
					this.hideRecordButton();
				}
			}
			else if (layoutModule.setting.mode === layoutModule.LAYOUT_PCHAT)
			{
				this.showIntroButton();
				this.hideSoundButton();
				this.hideSaveButton();
				this.hideRecordButton();
				this.hideSelectMenuSound();
			}
			else if (layoutModule.setting.mode === layoutModule.LAYOUT_MODERN)
			{
				this.showIntroButton();
				this.hideSoundButton();
				this.hideSaveButton();
				this.hideRecordButton();
				this.hideSelectMenuSound();
			}
			else if (layoutModule.setting.mode === layoutModule.LAYOUT_TRADUCTION)
			{
				this.showIntroButton();
				this.hideSoundButton();
				this.hideSaveButton();
				this.hideRecordButton();
				this.hideSelectMenuSound();
			}

		},

		// **********************************************
		//  bindUIAction
		// **********************************************

		bindUIActions: function() {

			// **********************************************
			// register the button play/pause action
			// **********************************************

			$("body").delegate("#checkbox-play-label",'click', function(event) {
				//alert('play');
				if (mp3Module.getStatus() == "play")
					mp3Module.pause();
				else
					mp3Module.play();
			});

			// **********************************************
			// register the change event on the mp3 selection
			// **********************************************

			$("#select-sound-type").change(function() {
				mp3Module.currentType = $("#select-sound-type").val();
				mp3Module.openSound(pageModule.setting.book,pageModule.setting.perek,mp3Module.currentType);
				mp3Module.readTimeAssociation(pageModule.setting.book,pageModule.setting.perek,mp3Module.currentType);
				mp3Module.stop();

			});

		}
};


//************************************************
//*******  mp3  Module                      ******
//************************************************

var mp3Module = {

		my_jPlayer: null,
		jsonDb: null,
		current_time: null,
		playStatus: null,
		player: null,
		playerData: null,
		currentFile:null,
		currentType:null,

	    // *****************************************
		// init function
		// *****************************************

		init: function(){

			this.player = $("#jquery_jplayer_1");
			this.jsonDb = [];
			this.playStatus = "stop";
			this.current_time = 0;
			this.bindUIActions();
			this.playerData = this.player.data('jPlayer');
		},

	    // *****************************************
		// setStatus function
		// *****************************************

		setStatus: function (status){
			this.playStatus = status;
		},

	    // *****************************************
		// getStatus function
		// *****************************************

		getStatus: function (){
			return this.playStatus;
		},

	    // *****************************************
		// pause function
		// *****************************************

		pause: function (){
			if (this.getStatus() !== "play") {
                return;
            }
			this.setStatus ("pause");
			this.player.jPlayer("pause");
			footbarModule.changePausePlayLabel('Play');
		},

	    // *****************************************
		// stop function
		// *****************************************

		stop: function (){
			if (this.getStatus() === "stop") {
                return;
            }
			this.setStatus("stop");
			this.player.jPlayer("stop");
			footbarModule.changePausePlayLabel('Play');
		},

	    // *****************************************
		// play function
		// *****************************************

		play: function(time){

			this.setStatus("play");
			footbarModule.changePausePlayLabel("Pause");

			if (typeof time === "undefined")
			{
				this.player.jPlayer("play");        //continue from the current position
			}
			else {
				this.player.jPlayer("play", time);	//play from a given position
            }
		},

	    // *****************************************
		// refreshSound function
		// *****************************************

		requestPage: function (book,perek){

			var selectText = "";

			// if mode is not TAAMIM return

			if (layoutModule.setting.mode !== layoutModule.LAYOUT_TAAMIM) {
                return;
            }

			$.get("/utilities/check_sound.php",{"b":book,"p":perek}, function(data) {

				if ($.isEmptyObject(data)){  // if no mp3 file found hide the sound Button
					footbarModule.hideSoundButton();
					footbarModule.hideSelectMenuSound();
					mp3Module.stop();
				}
				else
				{
					footbarModule.updateSoundSelection (data);
					mp3Module.currentType = $("#select-sound-type").val();	// the first of the list
					footbarModule.showSoundButton();
					mp3Module.openSound(book,perek,mp3Module.currentType);
					mp3Module.readTimeAssociation(book, perek,mp3Module.currentType);
				}
			});
		},

	    // *****************************************
		// read time association
		// *****************************************

		readTimeAssociation: function(book,perek,type){

			console.log("read sound time association file:"+metaDataModule.serverRoot+'/source/sound/'+book+'/'+perek+'_'+type+'.json');
			$.getJSON( metaDataModule.serverRoot+'/source/sound/'+book+'/'+perek+'_'+type+'.json', function( json ){
				if (json === null){
					alert("sound metadata is null");
				}
				mp3Module.jsonDb = json;
				if (metaDataModule.isAuthor()) {
                    mp3Module.markKeyWord();
                }
			}).fail(function(){
				console.log("missing sound time association");
				mp3Module.jsonDb = [];
				mp3Module.markKeyWord(); // in this case this will remove the marker
			});

		},

	    // *****************************************
		// mark key words (for sound)
		// *****************************************

		markKeyWord: function (){

			$('.word').removeClass('key-text');

			for (var i in mp3Module.jsonDb)
				$('#p'+mp3Module.jsonDb[i].passouk+'-'+mp3Module.jsonDb[i].word).addClass('key-text');
		},

	    // *****************************************
		// openSound function
		// *****************************************

		openSound: function (book, perek, type){
			var file = "source/sound/"+book+"/"+perek+"_"+type+".mp3";
			var oggfile = "source/sound/"+book+"/"+perek+"_"+type+".ogg";
			this.currentFile = perek+"_"+type+".mp3";
			console.log("setMedia set to:"+file);
			mp3Module.player.jPlayer("setMedia", {mp3:file,oga: oggfile});
		},

		// *****************************************
		// save time
		// *****************************************

		save: function(){

			var u = JSON.stringify(this.jsonDb);

			var data = {
					"book"  : pageModule.setting.book,
					"perek"  : pageModule.setting.perek,
					"type"  : mp3Module.currentType,
				    "db"  : u
			};

			$.post( "/utilities/record.php", data ).done(function( data ) {
                console.log("Data Loaded: " + data );
            });

			event.preventDefault();
			return false;
		},

	    // *****************************************
		// needed by sort
		// *****************************************

		compareWord: function (a, b) {return a.time - b.time;},

		// *****************************************
		// Add [used to add new word]
		// *****************************************

		Add: function (passouk, word, current_time)
		{
			// automatically add the first word is not present
		    if (this.jsonDb.length == 0 ||  (this.jsonDb[0].passouk != 1 && this.jsonDb[0].word != 1))
		    {
		    	this.jsonDb.push({'time':0,'passouk': 1,'word': 1});
		    	$('#p1-1').addClass('key-text');
		    }

			this.jsonDb.push({'time':current_time,'passouk': passouk,'word': word});
		    this.jsonDb.sort(this.compareWord);

		    if (metaDataModule.isAuthor())
		    	$('#p'+passouk+'-'+word).addClass('key-text');
		},

		// *****************************************
		// Delete
		// *****************************************

		Delete: function (passouk,word){

			var found = null;

			for (var i in this.jsonDb)
			{
		        if (this.jsonDb[i].passouk == passouk && this.jsonDb[i].word == word )
		           found = i;
		        if (this.jsonDb[i].passouk > passouk)
		           break;
			}

			if (found != null)
			{
				this.jsonDb.splice(found, 1);
				this.markKeyWord();
			}
		},

		// *****************************************
		//  Found the time associate to a given word
		// *****************************************

		getTime: function (passouk,word)
		{
		   var time = null;

		   for (var i in this.jsonDb)
		   {
	            if (this.jsonDb[i].passouk == passouk && this.jsonDb[i].word <= word )
	               time = this.jsonDb[i].time;

	            if (this.jsonDb[i].passouk > passouk || (this.jsonDb[i].passouk == passouk && this.jsonDb[i].word > word))
	            	break;
		   }

	       return time;
		},

		// *****************************************
		//  Found the words associated to a given time
		// *****************************************

		getPlace: function (time)
		{
		   var found={passouk:0,word_start:0,word_offset:0};
		   var start_index=-1;

		   for (var i in this.jsonDb)
		   {
	            if ( this.jsonDb[i].time > time )
	            {
	               start_index = parseInt(i)-1; // take the index of the item before

	               if (start_index < 0 )
	                   start_index =0;

	               break;
	            }
		   }

		   if (start_index != -1)
		   {
              found.passouk     = this.jsonDb[start_index].passouk;
              found.word_start  = this.jsonDb[start_index].word;

              if (this.jsonDb.length-1 != start_index) // last i
              {
                  if (this.jsonDb[start_index].passouk == this.jsonDb[start_index+1].passouk)  // next index is on the same passouk
                  {
                      found.word_offset =  this.jsonDb[start_index+1].word - this.jsonDb[start_index].word;
                  }
              }
		   }
		   else {

			   for (var i in this.jsonDb)
			   {
		            if ( this.jsonDb[i].time < time )
		            {
		               found.passouk    = this.jsonDb[i].passouk;
		               found.word_start = this.jsonDb[i].word;
		            }
			   }

			   // check how many offset until the end of the passouk

			   found.word_offset = 0;

		   }

	       return found;
		},

	    // *********************************************
	    // mark the current position in the html
	    // *********************************************

		markCurrentPassouk: function  (c)  //{passouk:0,word_start:0,word_offset:0};
		{
        	var z;
			$('.word').removeClass('active-text');

        	if  (c.word_offset == 0)
        	  c.word_offset = $(".p"+c.passouk+" .text span").length;

	        for(var x=0; x<c.word_offset; x++)
	        {
	        	z = c.word_start + x;
		        $('#p'+c.passouk+'-'+z).addClass('active-text');
	        }
		},

	    // *********************************************
	    // create the Jplayer object
	    // *********************************************

		createJplayerObject:function (){
			mp3Module.player.jPlayer({
				supplied: "mp3, oga",
				timeupdate: function(event)
                {
			       if (layoutModule.setting.mode != layoutModule.LAYOUT_TAAMIM)
			    	   return;
				   console.log("mp3.timeupdate");
		           mp3Module.current_time = parseInt(event.jPlayer.status.currentTime);
		           var cText = mp3Module.getPlace (mp3Module.current_time); //return type {passouk:0,word_start:0,word_offset:0};

		           //$("#daf_info").text("t="+mp3Module.current_time+" passouk="+cText.passouk+" start="+cText.word_start+" offset="+cText.word_offset);
		           mp3Module.markCurrentPassouk(cText);
                }
			});
		},

	    // *********************************************
	    // delete the Jplayer object
	    // *********************************************

		destroyJplayerObject:function (){
			mp3Module.player.jPlayer("destroy");
		},

		// **********************************************
		//  bindUIAction
		// **********************************************

		bindUIActions: function() {

			// ******************************************
			// register event handler to delete key word (right click)
			// ******************************************

			$(document).on("contextmenu", ".key-text", function(e){

				   current_id = $(this).attr('id');
			       var index_separator = current_id.indexOf("-");
				   var lp = parseInt(current_id.substring(1,index_separator));
				   var lw = parseInt(current_id.substring(index_separator+1));
				   console.log("right click detected: delete key text - passouk="+lp+" word="+lw);

			       mp3Module.Delete (lp,lw);
				   return false;
				});

			// ******************************************
			// register event handler to word click
			// ******************************************

			$("body").delegate('.word-taam','click', function(event) {

				// Record Mode
                var index_separator;

				if (layoutModule.setting.recordMode == true)
				{
			       var current_id = $(this).attr('id');
			       index_separator = current_id.indexOf("-");
				   var lp = parseInt(current_id.substring(1,index_separator));
				   var lw = parseInt(current_id.substring(index_separator+1));

			       mp3Module.Add (lp,lw,mp3Module.current_time);
			       console.log("add to record: passouk="+lp+" word="+lw+" time="+current_time);
				}
				else
				{
				   var str = this.id; //p16-14
				   index_separator = str.indexOf("-");  //to=p9-2
				   var p = parseInt(str.substring(1,index_separator));  //lp=9
				   var w = parseInt(str.substring(index_separator+1));	 //lw=2
				   var time = mp3Module.getTime (p,w);

				   console.log("play from: passouk="+p+" word="+w+" time="+time);
				   mp3Module.play(time);

				}


				//$('#ui-tooltip-step').qtip('toggle',false);
				event.preventDefault();
				return false;
			});

		}
};

//************************************************
//*******  Editor-Table View Module         ******
//************************************************

var allIntroModule = {

	allIntroDb: new Array(),

	// **************************************
	// init
	// **************************************

	init: function(){
		this.bindUIActions();
		this.allIntroDb = null;
	},

	updatePage: function (){
		var m = "";
		var parasha;
		var book;
		var perek;
		var book_name;
		var perek_name;
		var passouk;

		for (var i=0; i < allIntroModule.allIntroDb.length;i++) {
			book       = parseInt(allIntroModule.allIntroDb[i].book);
			perek      = parseInt(allIntroModule.allIntroDb[i].perek);
			passouk    = allIntroModule.allIntroDb[i].passouk;
			book_name  = metaDataModule.parasha[book-1][0][0];
			perek_name = metaDataModule.digit_heb[perek-1];

			parasha = metaDataModule.getParasha(book,perek);

			m+="<div class='text-resume-all intro"+allIntroModule.allIntroDb[i].book+"_"+allIntroModule.allIntroDb[i].perek+"' id='intro"+allIntroModule.allIntroDb[i].book+"_"+allIntroModule.allIntroDb[i].perek+"_"+allIntroModule.allIntroDb[i].passouk+"'>";
			m+=allIntroModule.allIntroDb[i].text;
			m+="<span style='margin-right:20px;color:grey;' class='reference'>";
			m+=book_name+"-"+parasha+"-"+perek_name;
			m+="</span></div>";
		}

		// $.mobile.changePage("#main-page",{ transition: "slide",reverse:true});
		//El += '<a dir="rtl" href="#switch-page?b='+parseInt(book+1)+'&p='+i+'" class="cperek" id="r'+i+'">'+metaDataModule.digit_heb[i-1]+'</a> | ';


		$('#intro_body').html(m);

	},


	// *******************************************
	// Request a given page
	// *******************************************

	requestAllIntro : function (){

		console.log("call requestAllIntro");
		//$('#ui-tooltip-step').qtip('toggle',false);
		commentModule.closeTooltip();

		if (this.allIntroDb == null){
			//$.mobile.showPageLoadingMsg(); 1.3.2
			$.mobile.loading('show');
			console.log("retrieve the allIntro data from ajax call");
			$.getJSON( metaDataModule.serverRoot+'/source/comment/intro_all', function( json ){
				allIntroModule.allIntroDb = json;
				//$.mobile.hidePageLoadingMsg(); 1.3.2
				$.mobile.loading('hide')
				allIntroModule.updatePage();

			}).fail(function() { alert('/commment/intro_all NOT FOUND'); });
		}
		else
			return;
	},


	bindUIActions: function() {

		// *****************************************************************
		// click handler
		// *****************************************************************

		$("body").delegate(".text-resume, #bysubject1","click", function(event, ui) {
			//eliecohen
			//$('#ui-tooltip-step').qtip('toggle',false);
			commentModule.closeTooltip();
			allIntroModule.requestAllIntro();
			$.mobile.changePage("#allIntro",{ transition: "slide",reverse:false});

		});

		$("body").delegate("#intro_body .text-resume-all","click", function(event, ui) {
			//$('#ui-tooltip-step').qtip('toggle',false);
			commentModule.closeTooltip();
			$.mobile.changePage("#main-page",{ transition: "slide",reverse:true});
			var currentId = $(this).attr('id'); //intro3_4_22
			var b = parseInt(currentId.substring(5)); //book
			var p = parseInt(currentId.substring(7));   //parasha
			pageModule.requestPage(b,p);
		});


		$("#allIntro").on( "pageshow", function( event, data ) {
			var target = ".intro"+pageModule.setting.book+"_"+pageModule.setting.perek;
			$('.text-resume-all').removeClass('intro-item-active');
			$(target).addClass('intro-item-active');
			$.mobile.silentScroll(($(target).offset().top)-100);


		});
	}


};

//************************************************
//*******  Editor-Table View Module         *****************
//************************************************

var dataTableModule = {

	page: new Array(),

	// **************************************
	// init
	// **************************************

	init: function(){
		//$('#example').dataTable();
		this.bindUIActions();
	},

	fnFormatDetails: function ( oTable, nTr )
	{
	    var aData = oTable.fnGetData( nTr );
	    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
	    sOut += '<tr><td>Question:</td><td>'+aData[6]+'</td></tr>';
	    sOut += '<tr><td>Content:</td><td>'+aData[7]+'</td></tr>';
	    sOut += '<tr><td>Html:</td><td>'+aData[8]+'</td></tr>';
	    sOut += '</table>';

	    return sOut;
	},

	bindUIActions: function() {

		 $('#example tbody td img').live('click', function () {
		        var nTr = $(this).parents('tr')[0];
		        if ( dataTableModule.oTable.fnIsOpen(nTr) )
		        {
		            /* This row is already open - close it */
		            this.src = "../images/details_open.png";
		            dataTableModule.oTable.fnClose( nTr );
		        }
		        else
		        {
		            /* Open this row */
		            this.src = "../images/details_close.png";
		            dataTableModule.oTable.fnOpen( nTr, dataTableModule.fnFormatDetails(dataTableModule.oTable, nTr), 'details' );
		        }
		    } );

		// *****************************************************************
		// click handler
		// *****************************************************************

		$("#checkbox-datatable").click(function(){

			// *****************************************************************
			// prepare the array of array to be used by the dataTable object
			// *****************************************************************

			var index=0;
			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {

					if (commentModule.getComment(i,"type") == commentModule.COMMENT_MODERN ||
						commentModule.getComment(i,"type") == commentModule.COMMENT_EXTRA  ||
						commentModule.getComment(i,"type") == commentModule.COMMENT_PIRUSH ){

						action = "del | edit";
						passouk   = commentModule.getComment(i,"p");
						passouk = (passouk == undefined) ? "" : passouk;
						word      = commentModule.getComment(i,"w");
						word = (word == undefined) ? "" : word;
						offset    = commentModule.getComment(i,"offset");
						offset = (offset == undefined) ? "" : offset;
						author    = commentModule.getComment(i,"author");
						author = (author == undefined) ? "" : author;
						title     = commentModule.getComment(i,"title");
						title = (title == undefined) ? "" : title;
						question  = commentModule.getComment(i,"question");
						question = (question == undefined) ? "" : question;
						content   = commentModule.getComment(i,"content");
						content = (content == undefined) ? "" : content;
						html      = commentModule.getComment(i,"html");
						html = (html == undefined) ? "" : html;

						dataTableModule.page[index] = [action,passouk,word,offset,author,title,question,content,html];
						index++;

						}
					}
			}

			// *****************************************************************
			// construct the data table object
			// *****************************************************************

			$('#table-x').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );

				dataTableModule.oTable = $('#example').dataTable( {
			        "aaData": dataTableModule.page,
			        "bAutoWidth": false,
			        "aoColumns": [
			            { "sTitle": "Action" },
			            { "sTitle": "passouk" },
			            { "sTitle": "w" },
			            { "sTitle": "offset" },
			            { "sTitle": "title" },
			            { "sTitle": "Author" },
			            { "sTitle": "Question" },
			            { "sTitle": "Content", "sClass": "center" },
			            { "sTitle": "Html", "sClass": "center" }
			        ],
			        "aoColumnDefs": [
			 			            { "bSortable": false, "aTargets": [ 0 ] },
			 			            { "bVisible": false, "aTargets": [ 6 ] },
			 			            { "bVisible": false, "aTargets": [ 8 ] }
			 			        ],
			 	    "aaSorting": [[1, 'asc']]
			 } );

			// *****************************************************************
			// Insert a '+' column to the table
			// *****************************************************************

			  var nCloneTh = document.createElement( 'th' );
			  var nCloneTd = document.createElement( 'td' );
			  nCloneTd.innerHTML = '<img src="../images/details_open.png">';
			  nCloneTd.className = "center";

			  $('#example thead tr').each( function () {
			     this.insertBefore( nCloneTh, this.childNodes[0] );
			  } );

			  $('#example tbody tr').each( function () {
			     this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
			  } );

			 // *****************************************************************
			 // Change Page to the datatable page
			 // *****************************************************************

			  $.mobile.changePage("#table-all-comments",{ transition: "slide",reverse:false});

			 // $('#ui-tooltip-step').qtip('toggle',false);
			  commentModule.closeTooltip();
		  });

		// *****************************************************************
		// prepare the array of array to be used by the dataTable object
		// *****************************************************************

		$("body").delegate("#return_option_data_table,.returnToMainPage","click", function(event, ui) {
			$.mobile.changePage("#main-page",{ transition: "slide",reverse:true});
			//pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
			return false;
		 });

		}
};

//************************************************
//*******  Option Module           ***************
//************************************************

var optionModule = {

	mode:0, // EDITOR_OFF | EDITOR_ON

	EDITOR_OFF: 1,
	EDITOR_ON: 2,

	init: function() {
		if ($.cookie('editing-mode') == "2") //EDITOR_ON
			this.mode = this.EDITOR_ON;
		else
			this.mode = this.EDITOR_OFF;

		this.bindUIActions();
	},

	bindUIActions: function() {

		// ****************************************************
		// populate the the option screen before it is shown
		// ****************************************************

		$("#optionpanel").on( "panelbeforeopen", function( event, data ) {
			//console.log("call panelbeforeopen (option)");

			commentModule.closeTooltip();

			if (optionModule.mode == optionModule.EDITOR_ON)
				$('#editor-slider').val('on').slider("refresh");
		}),

		$("#optionpanel").on( "panelclose", function( event, data ) {
			//console.log("call panelbeforeopen (option)");

			//commentModule.closeTooltip();

			//pageModule.requestPage(parseInt(book_), parseInt(perek_));
			pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
			footbarModule.refreshFootBar();

			//alert('close');//eliecoco
		}),

		// ****************************************************
		// toggle switch handler
		// ****************************************************


		$("#editor-slider").change(function() {
			if ($("#editor-slider").val() == "on")
				optionModule.mode = optionModule.EDITOR_ON;
			else
				optionModule.mode = optionModule.EDITOR_OFF;

			$.cookie('editing-mode', optionModule.mode , { expires: 700 });
			return false;
		});
	},
};

//************************************************
//*******  editor Module           ***************
//************************************************

var editorModule = {

		page:1,

		FORM_COMMENT : 1,
		FORM_INTRO   : 2,
		FORM_KEYWORD : 3,
		FORM_COM     : 4,

		mode:1,   //1 for new, 2 for update

		MODE_UPDATE: 2,  // using the title of the comment
		MODE_NEW:1, // '+' button

		perek:1,
		passouk:1,

		COM_DIRECTION_RIGHT:3,
		COM_DIRECTION_LEFT:1,
		COM_DIRECTION_BOTH:2,

		commentId:1,         // for regular comment
		commentIdIntro:0,
		commentIdCommunication:0,
		commentIdkeyText:0,

		// *******************************************************
		// init
		// *******************************************************

		init: function (){
			this.bindUIActions();
		},

		// *******************************************************
		// show or hide input according to the editor tab screen
		// *******************************************************

		hideShowFormInput:function (i){
			if (i == this.FORM_COMMENT){ // comment page

				$(".btt_navigate").removeClass('ui-btn-active');
				$("#bt_add_comment").addClass('ui-btn-active');

				$(".category-intro").hide();
				$(".category-who").hide();
				$(".category-essence").hide();
				$(".category-comment").show();
			}
			else if (i == this.FORM_INTRO){ //intro page

				$(".btt_navigate").removeClass('ui-btn-active');
				$("#bt_add_intro").addClass('ui-btn-active');

				$(".category-intro").show();
				$(".category-who").hide();
				$(".category-essence").hide();
				$(".category-comment").hide();
			}
			else if (i == this.FORM_KEYWORD){ //condense text

				$(".btt_navigate").removeClass('ui-btn-active');
				$("#bt_add_condense").addClass('ui-btn-active');

				$(".category-intro").hide();
				$(".category-who").hide();
				$(".category-essence").show();
				$(".category-comment").hide();
			}
			else if (i == this.FORM_COM){ //whotowho

				$(".btt_navigate").removeClass('ui-btn-active');
				$("#bt_add_who_who").addClass('ui-btn-active');

				$(".category-intro").hide();
				$(".category-who").show();
				$(".category-essence").hide();
				$(".category-comment").hide();
			}
		},

		// **********************************************************************
		// return the first word index selected and the number of selected word
		// **********************************************************************

		getWordIndexAndDeltaFromSelected:function (){
			var min = 10000;
			var max = 0;
			var temp;

			$(".editor-selected-text").each(function() {
		  		temp = $(this).attr('id');
		  		temp = parseInt(temp.substring(1)); // w2 => 2
		  		if (min > temp)
		  			min = temp;
		  		if (max < temp)
		  			max = temp;
			});

			var delta = (max-min)+1;
			//alert ("min="+min+" delta="+delta+"");
			return {min:min, delta: delta};
		},

		// **********************************************************************
		// generate a random id for a new comment.
		// **********************************************************************

		createID: function(){
			var randVal = 1+(Math.random()*(9999999999-1));
			  return Math.round(randVal);
		},

		// **********************************************************************
		// retrieve the input values of the regule comment
		// **********************************************************************

		getCommentFormValues:function (){

			  var title    = $('#editor-title').val();
			  var author   = $('#editor-author').val();
			  var comment  = $('#editor-comment').val();
			  var html     = $('#editor-html').val();
			  var question = $('#editor-question').val();

			  var passouk  = editorModule.passouk;

			  var type ;

			  if ($('#radio-explication').is(':checked'))
				  type = commentModule.COMMENT_MODERN;
			  else if ($('#radio-other').is(':checked'))
				  type = commentModule.COMMENT_EXTRA;
			  else
			  {
				  type = commentModule.COMMENT_PIRUSH;
				  author = "רש'י";
			  }


			  return ({title:title,author:author,question:question,comment:comment,html:html, passouk:passouk,type:type});
		},

		// **********************************************************************
		// retrieve the input values of the tab intro
		// **********************************************************************

		getIntroFormValues:function (){

			  var title    = $('#editor-intro').val();
			  var passouk  = editorModule.passouk;
			  var type     = commentModule.COMMENT_INTRO;

			  return ({title:title,passouk:passouk,type:type});
		},

		// **********************************************************************
		// retrieve the input values of the tab keyword
		// **********************************************************************

		getKeywordFormValues:function (){

			  var title    = $('#editor-condense').val();
			  var passouk  = editorModule.passouk;
			  var type     = commentModule.COMMENT_KEYWORD;
			  // TODO should not be the title here
			  return ({title:title,passouk:passouk,type:type});
		},

		// **********************************************************************
		// retrieve the input values of the tab communication
		// **********************************************************************

		getCommunicationFormValues: function (){
			var passouk  = editorModule.passouk;
			var from    = $('#editor-who').val();
			var to      = $('#editor-towho').val();

			var type    = commentModule.COMMENT_COM;
			var direction = 0;

			if ($('#radio-left').is(':checked'))
				direction = this.COM_DIRECTION_LEFT;
			else if ($('#radio-both').is(':checked'))
				direction = this.COM_DIRECTION_BOTH;
			 else
				 direction = this.COM_DIRECTION_RIGHT;

			return ({from:from,to:to,type:type,direction:direction,passouk:passouk});

		},

		// **********************************************************************
		// generate the title and content based on the comment form values
		// **********************************************************************

		generateTooltipTitleAndContent:function (i){
			var h = "";
			var t = "";

			if (i.question.length > 0)
				h+= i.question +"<hr/>";

			h+= i.comment;

			t += i.title;
			t += " - ";
			t += i.author;

			return {title:t,content:h};
		},

		// **********************************************************************
		// refresh the tooltip based on the comment form values
		// **********************************************************************

		refreshEditorToolTip: function (){

			if ($(".editor-selected-text").length != 0){

				var formData = editorModule.getCommentFormValues ();
				//alert(fromData);
				var html = editorModule.generateTooltipTitleAndContent (formData);

				commentModule.setCurrentComment (html.title, html.content,$(".editor-selected-text"),0);
				//commentModule.openTooltip();

			}
			else{ //no target
				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
			}
		},

		// **********************************************************************
		// editor related handler
		// **********************************************************************

		bindUIActions: function() {

			console.log("editorModule: Register Handlers");

			// ***************************************
			// Regular Comment Button Handler
			// ***************************************

			$("body").delegate('#bt_add_comment','click',function(event,data){
				editorModule.page = editorModule.FORM_COMMENT ;
				editorModule.hideShowFormInput (editorModule.page);
			});

			// ***************************************
			// 'Intro' Button Handler
			// ***************************************

			$("body").delegate('#bt_add_intro','click',function(event,data){
				editorModule.page = editorModule.FORM_INTRO;
				editorModule.hideShowFormInput (editorModule.page);
			});

			// ***************************************
			// 'keyword' Button Handler
			// ***************************************

			/*$("body").delegate('#bt_add_condense','click',function(event,data){
				editorModule.page = editorModule.FORM_KEYWORD;
				editorModule.hideShowFormInput (editorModule.page);
			});*/

			// ***************************************
			// 'Communication' Button Handler
			// ***************************************

			/*$("body").delegate('#bt_add_who_who','click',function(event,data){
				editorModule.page = editorModule.FORM_COM;
				editorModule.hideShowFormInput (editorModule.page);
			});*/

			// **********************************************
			// switch to editor screen using the + icon
			// **********************************************

			$(document).on('click','#editor-icon', function(){
				var temp = $(this).closest('div').attr('id');
				editorModule.passouk = parseInt(temp.substring(5)); // text_3 => 3
				editorModule.mode = editorModule.MODE_NEW;
				editorModule.page = editorModule.FORM_COMMENT;

				$.mobile.changePage("#editor-page", {"to":"switch-to-edit-mode", transition: "slide",reverse:false});
			});

			// **********************************************
			// toggle the text when clicking on any word in the passouk
			// **********************************************

			$(document).on('click',".word-editor", function(){
					$(this).toggleClass("editor-selected-text");
					editorModule.refreshEditorToolTip();
			});

			// **********************************************
			// update the tooltip as user type text in any input
			// **********************************************

			$(document).on('keyup',".editor-input",function() {
				  console.log("Handler for .keypress() called.");
				  editorModule.refreshEditorToolTip();
				});

			// **********************************************
			// update the editor form before it is shown
			// **********************************************

			$("#editor-page").on( "pagebeforeshow", function( event, data ) {

				var json;
				console.log("call pagebeforeshow (editor)");

				commentModule.closeTooltip();

				// ************************************************
				// add the passouk on the top of the editor form
				// ************************************************

				var m = "";
				var _j;
				if (dbModule.isTextDefined(s.book,s.perek))
					json = dbModule.getText(s.book, s.perek);
				else
					alert('not in cache');
				m+="<div class='text' id='text_"+editorModule.passouk+"'>";

				for (var j in json[editorModule.passouk-1]) {
					_j = parseInt(j)+1;
					m+="<span id='w"+_j+"' class='word-editor'>"+json[editorModule.passouk-1][j]+"</span>";
				}
				m+= "</div>";
				$('#text-top').html( m );

				// ************************************************
				// hide non-relevant input field
				// ************************************************

				editorModule.hideShowFormInput (editorModule.page);

				// ********************************************************************
				// populate all field with empty string to avoid garbage in the text
				// ********************************************************************

				$('#editor-title').val("");
				$('#editor-comment').val("");
				$('#editor-author').val("");
				$('#editor-question').val("");
				$('#editor-html').val("");
				$('#editor-intro').val("");
				//$('#editor-condense').val("");
				//$('#editor-who').val("");
				//$('#editor-towho').val("");

				// *************************************************
				// for update mode populate the regular comment form
				// *************************************************

				if (editorModule.mode == editorModule.MODE_UPDATE)
				{

					var commentIndex = commentModule.q.qtip('api').get('content.idc');

					var content    = commentModule.getComment(commentIndex,"content",false);
					var title      = commentModule.getComment(commentIndex,"title");
					var author     = commentModule.getComment(commentIndex,"author");
					var question   = commentModule.getComment(commentIndex,"question",false);
					var html       = commentModule.getComment(commentIndex,"html",false);
					var firstIndex = commentModule.getComment(commentIndex,"w");
					var offset     = commentModule.getComment(commentIndex,"offset");

					editorModule.commentId = commentModule.getComment(commentIndex,"id");

					// *****************************
					// populate the form
					// *****************************

					$('#editor-title').val(title);
					$('#editor-comment').val(content);
					$('#editor-author').val(author);
					$('#editor-question').val(question);
					$('#editor-html').val(html);

					// *****************************
					// highligh the word of interest
					// *****************************

					for(var x=firstIndex; x<firstIndex+offset; x++){
						$('#w'+x).addClass('editor-selected-text');
					}

					// *****************************
					// redisplay the tooltip
					// *****************************

					editorModule.refreshEditorToolTip();
				}

				// ******************************************************
				// populate the intro
				// ******************************************************

				var intro    = commentModule.getIntroForPassouk(editorModule.passouk);

				if (intro != null)
				{
					$('#editor-intro').val(intro.value);
					editorModule.commentIdIntro = intro.id;
				}
				else
					editorModule.commentIdIntro = 0;

				/*if (condense != null)
				{
					$('#editor-condense').val(condense.value);
					editorModule.commentIdkeyText = condense.id;
				}
				else
					editorModule.commentIdkeyText = 0;

				if (com != null)
				{
					$('#editor-who').val(com.from);
					$('#editor-towho').val(com.to);
					editorModule.commentIdCommunication = com.id;

					$("#radio-right").attr('checked', false).checkboxradio("refresh");
					$("#radio-both").attr('checked', false).checkboxradio("refresh");
					$("#radio-left").attr('checked', false).checkboxradio("refresh");

					if (com.direction == editorModule.COM_DIRECTION_RIGHT)
						$("#radio-right").attr('checked', true).checkboxradio("refresh");
					else if ((com.direction == editorModule.COM_DIRECTION_LEFT))
						$("#radio-left").attr('checked', true).checkboxradio("refresh");
					else
						$("#radio-both").attr('checked', true).checkboxradio("refresh");
				}
				else
					editorModule.commentIdCommunication = 0;*/

			});

			// **********************************************
			// Editor "cancel" button
			// **********************************************

			 $(document).on('click', '#cancel-button', function() {
                 $.mobile.changePage("#main-page",{ transition: "slide",reverse:true});
                 commentModule.closeTooltip();
                 return true;
			 });

			// **********************************************
			// Editor "delete" button
			// **********************************************

		    $(document).on('click', '#delete-button', function() {

		    	//$('#ui-tooltip-step').qtip('toggle',false);
		    	commentModule.closeTooltip();

		    	var comment ={};

		    	// ***********************************
		    	// add the id attribute
		    	// ***********************************

		    	if (editorModule.page == editorModule.FORM_COMMENT)
		    		comment.id = editorModule.commentId;
		    	else if (editorModule.page == editorModule.FORM_INTRO)
		    		comment.id = editorModule.commentIdIntro;
	        	/*else if (editorModule.page == editorModule.FORM_KEYWORD)
		    		comment.id = editorModule.commentIdkeyText;
	        	else if (editorModule.page == editorModule.FORM_COM)
		    		comment.id = editorModule.commentIdCommunication;*/
	        	else
	        		alert('error 654');

   	        	comment.book   = pageModule.setting.book;
   	        	comment.perek  = pageModule.setting.perek;
   	        	comment.action = "delete";

   				// **********************************************
   				// Send the Ajax request to delete
   				// **********************************************

		    	$.ajax(
                		{
                			url: '/utilities/edit.php',
                			data: comment,
                			type: 'GET',
                			async: true,
                			beforeSend: function() {
                				//$.mobile.showPageLoadingMsg(true); 1.3.2
                				$.mobile.loading('show');
                			},
                			complete: function() {
                				//$.mobile.hidePageLoadingMsg(); 1.3.2
                				$.mobile.loading('hide');
                			},
                			success: function (result) {

                				// delete all the comments of the current page
                				dbModule.deleteComments(comment.book,comment.perek);

                				// request again all the comments for this perek (ajax call)
                				commentModule.requestPage(comment.book,comment.perek);

                				// return to the main-page
                				$.mobile.changePage("#main-page",{ transition: "slide",reverse:true});

                			},
                			error: function (request,error) {
                				alert('Network error has occurred please try again!');
                			}
                		});

	             return false;
		    });

			// **********************************************
			// submit process
			// **********************************************

	        $(document).on('click', '#submit-button', function() {

	        	//$('#ui-tooltip-step').qtip('toggle',false);
	        	commentModule.closeTooltip();

	        	var comment;

	        	if (editorModule.page == editorModule.FORM_COMMENT)
	        	{
	        		var indexes = editorModule.getWordIndexAndDeltaFromSelected();

	        		comment = editorModule.getCommentFormValues();

	        		comment.w = indexes.min;
       	        	comment.offset = indexes.delta;
	        	}

	        	if (editorModule.page == editorModule.FORM_INTRO)
	        		comment = editorModule.getIntroFormValues();

	        	else if (editorModule.page == editorModule.FORM_KEYWORD)
	        		comment = editorModule.getKeywordFormValues();

	        	else if (editorModule.page == editorModule.FORM_COM)
	        		comment = editorModule.getCommunicationFormValues();

	        	// ***********************************
	        	// form validation
	        	// ***********************************

	        	var displayWarning = null;

	        	// comment page
        		if(editorModule.page == editorModule.FORM_COMMENT && ($(".editor-selected-text").length == 0 || $('#editor-comment').val().length == 0))
        			displayWarning = 'Please click at least one word and fill all mandatory fields';

        		// TODO elie

	        	// ***********************************
	        	// add comment.id & comment.action
	        	// ***********************************

	        	comment.action = "update";

   	        	if ((editorModule.mode == editorModule.MODE_NEW     && editorModule.page == editorModule.FORM_COMMENT) ||  // '+' and comment
   	        		(editorModule.page == editorModule.FORM_INTRO   && editorModule.commentIdIntro         == 0) ||
   	        		(editorModule.page == editorModule.FORM_KEYWORD && editorModule.commentIdkeyText       == 0) ||
   	        		(editorModule.page == editorModule.FORM_COM     && editorModule.commentIdCommunication == 0))
   	        	{
   	        		comment.id = editorModule.createID ();
   	        		comment.action = "create";
   	        	}
   	        	else if (editorModule.page == editorModule.FORM_COMMENT) {
   	        		comment.id = editorModule.commentId;
   	        	}
   	        	else if (editorModule.page == editorModule.FORM_INTRO) {
   	        		comment.id = editorModule.commentIdIntro;
   	        	}
   	        	else if (editorModule.page == editorModule.FORM_KEYWORD) {
   	        		comment.id = editorModule.commentIdkeyText;
   	        	}
   	        	else if (editorModule.page == editorModule.FORM_COM) {
   	        		comment.id = editorModule.commentIdCommunication;
   	        	}

	        	// ***********************************
	        	// add comment.id & comment.action
	        	// ***********************************

	        	comment.book =  pageModule.setting.book;
   	        	comment.perek = pageModule.setting.perek;

	        	// ***********************************
	        	// send the comment object
	        	// ***********************************

   	        	if (displayWarning == null)
   	        	{

   	        		$.ajax({
                			url: '/utilities/edit.php',
                			data: comment,
                			type: 'GET',
                			async: false,
                			beforeSend: function() {
                                console.log("beforeSend");
                				$.mobile.loading('show');
                				//$.mobile.showPageLoadingMsg(true); 1.3.2
                				},
                			complete: function() {
                				//$.mobile.hidePageLoadingMsg(); 1.3.2
                				$.mobile.loading('hide');
                                //return;
                				},
                			success: function (result) {                				              	       console.log("success");
                				dbModule.deleteComments(comment.book,comment.perek);
                				commentModule.requestPage(comment.book,comment.perek);
                				$.mobile.changePage("#main-page",{ transition: "slide",reverse:true});
                				//return true;
                			},
                			error: function (request,error) {
                				alert('Network error has occurred please try again!');
                			}
   	        			});
   	        	}
   	        	else
   	        	{
   	        		alert(displayWarning);
   	        		return true; //false
   	        	}
   	        	return true; // cancel original event to prevent form submitting

	         });  //$(document).on('click', '#submit-button',
		} //bindUIActions: function() {
}; //editorModule


//************************************************
//*******  db Module           *******************
//************************************************

var dbModule = {

		page: new Array(),

		init: function (){

			this.page[0] = new Array(50);  //bereshit 50 chapters
			this.page[1] = new Array(40);
			this.page[2] = new Array(27);
			this.page[3] = new Array(36);
			this.page[4] = new Array(34);

			this.bindUIActions();
		},

		// ***********************************************
		// Add comment element to the database [NOT USED]
		// ***********************************************

  	   	addComment: function (book,perek,passouk,i, c){

  	   		var o = {'p':passouk,w:i.min,offset:i.delta,type:c.type,title:c.title,question:c.question, author:c.author,content:c.comment,id:c.id};

  	   		if (this.page[book-1][perek-1].hasOwnProperty("comment") === false) // if comment doesn't exist create it first
  	   			this.page[book-1][perek-1]['comment'] = new Array();

  	   		this.page[book-1][perek-1]['comment'].push(o);
		},

		// *********************************************************
		// Check if text of a given book/perek is in the cache db
		// *********************************************************

		isTextDefined: function (book,perek){
			if (this.page[book-1][perek-1] instanceof Object)
				return true;
			else
				return false;
		},

		// *********************************************************
		// Check if a given translation for a given book/perek is defined
		// *********************************************************

		isTranslationDefined: function (book,perek,translation_index){
			var key = "t"+translation_index;
			if (this.page[book-1][perek-1] instanceof Object && this.page[book-1][perek-1].hasOwnProperty(key) === true)
				return true;
			else
				return false;
		},

		// *********************************************************
		// Check if comment has been defined for a given book/perek
		// *********************************************************

		isCommentDefined: function (book,perek){
			if (this.page[book-1][perek-1] instanceof Object && this.page[book-1][perek-1].hasOwnProperty("comment") === true)
				return true;
			else
				return false;
		},

		// *********************************************************
		// Set the text of a given perek
		// *********************************************************

		setText: function (book,perek,value){
			this.page[book-1][perek-1] = {text:value[1],textNo:value[0],textTaam:value[2]};
		},

		// *********************************************************
		// Get the text of a given perek
		// *********************************************************

		getText: function (book,perek,mode){
			if (mode === undefined || mode == 2)
				return this.page[book-1][perek-1].text;
			else if (mode == 1)
				return this.page[book-1][perek-1].textNo;
			else
				return this.page[book-1][perek-1].textTaam;
		},

		// *********************************************************
		// Set the translation of a given perek
		// *********************************************************

		setTranslation: function (book,perek,translation_index,value){
			var key = "t"+translation_index;
			this.page[book-1][perek-1][key] = value;
		},

		// *********************************************************
		// Get translation
		// *********************************************************

		getTranslation: function (book, perek, translation_index){
			var key = "t"+translation_index;
			return this.page[book-1][perek-1][key];
		},

		// *********************************************************
		// set comment
		// *********************************************************

		setComment: function (book,perek,value){
			this.page[book-1][perek-1]['comment'] = value;
		},

		// *********************************************************
		// get comment
		// *********************************************************

		getComment: function (book,perek){
			return this.page[book-1][perek-1]['comment'];
		},

		// *********************************************************
		// delete comment
		// *********************************************************

		deleteComments: function (book,perek){

			if (this.page[book-1][perek-1].hasOwnProperty("comment") === true) // comment exist
			{
  	   			delete this.page[book-1][perek-1]['comment'];
			}
		},

		// *********************************************************
		// handler
		// *********************************************************

		bindUIActions: function() {

		}
};

//************************************************
//*******  toc  Module              **************
//************************************************

var tocModule = {

		init: function (){
			this.bindUIActions();
		},

		// ***********************************************
		// Update Parasha
		// ***********************************************

		updatePash:function (book){
			$('#parasha-section').remove();
			$('#prakim-section').remove();
			$('.book-selected').removeClass('book-selected');
			$('#b'+parseInt(book+1)).addClass('book-selected');

			var UL = $('#parasha');
			var El = '<span id="parasha-section">';

			for (var i = 0; i < metaDataModule.parasha[book].length; i++)
				El += '<a class=\"cparasha\" id="p'+i+'">'+metaDataModule.parasha[book][i][0]+'</a> | ';

			El = El.substring(0,El.length - 2);
			El += "</span>";
			UL.append(El);
		},

		// ***********************************************
		// Update Prakim
		// ***********************************************

		updatePrakim: function (book,parasha){

			var UL = $('#prakim');
			var El = '<span id="prakim-section">';

			if (typeof parasha == 'undefined'){
				for (var i = 0; i < metaDataModule.prakim_number[book]; i++)
					El += '<a dir="rtl" href="#switch-page?b='+parseInt(book+1)+'&p='+parseInt(i+1)+'" class="cperek" id="r'+i+'">'+metaDataModule.digit_heb[i]+'</a> | ';
			}
			else{
				for (var i = metaDataModule.parasha[book][parasha][1]; i <= metaDataModule.parasha[book][parasha][2]; i++)
					El += '<a dir="rtl" href="#switch-page?b='+parseInt(book+1)+'&p='+i+'" class="cperek" id="r'+i+'">'+metaDataModule.digit_heb[i-1]+'</a> | ';
			}

			El = El.substring(0,El.length - 2);
			El += "</span>";
			UL.append(El);
		},

		// ***********************************************
		// Register Handler
		// ***********************************************

		bindUIActions: function() {

			// **************************************************
			// book handler
			// **************************************************

			$("body").delegate("#b1,#b2,#b3,#b4,#b5", "click", function(event, ui) {
				var book = parseInt(this.id.substring(1))-1; //0 for bereshit ....
				tocModule.updatePash(book);
				tocModule.updatePrakim(book);
			});

			// ***********************************************************
			// parashiyot handler
			// ***********************************************************

			$("body").delegate('.cparasha','click', function(event) {
				var book_   = $('.book-selected').attr("id"); //b1
				var book    = parseInt(book_.substring(1))-1; //0 for bereshit ....
				var parasha = parseInt(this.id.substring(1)); // 0 bereshit
				$('.parasha-selected').removeClass('parasha-selected');
				// mark the parasha selected
				$('#'+this.id).addClass('parasha-selected');  //p0 bereshit....
				// update the prakim for this parasha
				$('#prakim-section').remove();
				tocModule.updatePrakim(book,parasha);
				return false;
			});

			// ***********************************************************
			// catch url connection before handler
			// ***********************************************************

			$(document).bind( "pagebeforechange", function( e, data ) {
				console.log("call pagebeforechange (editor)");
				if ( typeof data.toPage === "string" )
				{
					var u = $.mobile.path.parseUrl( data.toPage ),re = /^#switch-page/;
					if ( u.hash.search(re) !== -1 )
					{
						var temp = u.hash.replace( /.*b=/, "" );  //3&p=14
						var b = parseInt(temp.substring(0,1)); //book
						var p = parseInt(temp.substring(4));   //parasha
						pageModule.requestPage(b, p);
						$( "#popupInfo" ).popup( "close" );
						e.preventDefault();
					}
				}
			});
		}
};

//************************************************
//*******  metaData  Module         **************
//************************************************

var metaDataModule = {

	   // numeric eng to heb
	   digit_heb: [ "א", "ב" ,"ג", "ד","ה","ו","ז","ח","ט","י","יא", "יב" ,"יג", "יד","טו","טז","יז","יח","יט","כ","כא","כב","כג","כד","כה","כו","כז","כח","כט", "ל","לא","לב","לג","לד","לה","לו","לז","לח","לט","מ","מא","מב","מג","מד","מה","מו","מז","מח","מט","נ","נא","נב","נג"],

	   // number of prakim in each book
	   prakim_number :[ 50,40,27,36,34],

	   // parasha [book][parasha_name][perek_start][perek_end][passouk_start]
	   parasha: [
	     	         		[["בראשית", 1, 6,1], ["נח",6,11,9], ["לך לך", 12, 17,1],["וירא", 18, 22,1], ["חיי שרה",23,25,1],["תולדות",25,28], ["ויצא", 28, 32,1], ["וישלח", 28, 36,1],["וישב", 37, 40,1], ["מקץ",41,44,1], ["ויגש", 44, 47,1],["ויחי", 47, 50,1]],
	     	         		[["שמות", 1,6,1]  , ["וארא", 6, 9,1]  , ["בא", 10,13,1],["בשלח", 13, 17,1]  , ["יתרו", 18, 20,1]  , ["משפטים", 21,24,1],["תרומה", 25, 27,1]  , ["תצוה", 27, 30,1]  , ["כי תישא", 30,35,1],["ויקהל", 35, 38,1], ["פקודי", 38, 40,1]],
	     	         		[["ויקרא", 1, 5,1]  , ["צו", 6, 8,1]  , ["שמיני", 9,11,1],["תזריע", 12, 13,1]  , ["מצורע", 14, 15,1]  , ["אחרי מות", 16,18,1],["קדושים", 19, 20,1]  , ["אמר", 21, 24,1]  , ["בהר", 25,26,1],["בחקתי", 26, 27,1]],
	     	         		[["במדבר", 1, 4,1]  , ["נשא", 4, 7, 1]  , ["בהעלותך", 8,12,1],["שלח", 13, 15,1]  , ["קורח", 16, 18,1]  , ["חוקת", 19,22,1],["בלק", 22, 25,1]  , ["פינחס", 25, 30,1]  , ["מטות", 30,32,1],["מסעי", 33, 36,1]],
	     	         		[["דברים", 1, 3,1]  , ["ואתחנן", 3, 7,1]  , ["עקב", 7,11,1],["ראה", 11, 16,1]  , ["שפטים", 16, 21,1]  , ["כי תצא", 21,25,1],["כי תבוא", 26, 29,1]  , ["ניצבים", 29, 30,1]  , ["וילך", 31,31,1],["האזינו", 32, 32,1], ["וזאת הברכה", 33, 34,1]]
	     	          ],

	 // *****************************************************
	 // init
	 // *****************************************************

	 init: function (){
		 metaDataModule.serverRoot = "";
	 },

	// *****************************************************
	// Return Parashiyot Separator Information if exist
	// *****************************************************

	getSeparatorPassoukIfExist: function (book,perek){
		var passouk_begin = null;
		var passouk_end   = null;
		var pash_begin    = null;
		var pash_end      = null;

		for(var x=0; x<this.parasha[book-1].length;x++){ // loop over parashiyot for the given book
			if (perek == this.parasha[book-1][x][1]) {  // if we are in a starting perek
				passouk_begin = this.parasha[book-1][x][3];
				pash_begin    = this.parasha[book-1][x][0];
				if (x>0 && this.parasha[book-1][x-1][2] == perek){ // check if this perek is also the end of the previous one
					passouk_end = passouk_begin;
					pash_end    = this.parasha[book-1][x-1][0];
				}
				return {passouk_begin:passouk_begin, passouk_end:passouk_end, pash_begin:pash_begin, pash_end:pash_end};
			}
		}
		return null;
	},

	// *****************************************************
	// Check if current user is Author (can edit the text)
	// *****************************************************

	isAuthor: function (){
		if (optionModule.mode == 2)
			return true;
		else
			return false;
	},

	// *****************************************************
	// Generate the page Title
	// *****************************************************

	generatePageTitle: function (book,perek){
		var title;
		title = this.getParasha(book,perek);
		title += " - ";
		title +=" פרק ";
		title +=this.digit_heb[perek-1];
		title += " - ";
		title += this.parasha[book-1][0][0];
		return title;
	},

	// *****************************************************
	// Retrieve the Parasha index for a given perek
	// Note: this method return only the first match
	// *****************************************************

	getParashaIndexFromPerek: function (book, perek){
		for(var x=0; x<this.parasha[book-1].length;x++){
			if (perek >= this.parasha[book-1][x][1] && perek <= this.parasha[book-1][x][2]){
				return x;
			}
		}
		return false;
	},

	// *****************************************************
	// Generate a list of Parashiyot found in a given perek
	// *****************************************************

	getParasha: function (book, perek){
		var para = " ";
		for(var x=0; x<this.parasha[book-1].length;x++){
			if (perek >= this.parasha[book-1][x][1] && perek <= this.parasha[book-1][x][2]){
				para += " "+this.parasha[book-1][x][0];
			}
		}
		para += " ";
		return para;
	}
};

//************************************************
//*******  Layout Module         *****************
//************************************************

var layoutModule = {

		LAYOUT_TRADUCTION: 1,
		LAYOUT_EXTRA:2,
		LAYOUT_PCHAT:3,
		LAYOUT_MODERN:4,
		LAYOUT_TAAMIM:5,

		NIKOUDMODE_WITHOUT:1,
		NIKOUDMODE_NIKOUD:2,
		NIKOUDMODE_TAAMIM:3,

		setting: {
			book:1,
			perek:1,
			mode:0,
			intro:false,
			nikoudMode:0,
			recordMode:0,
		},

		// **************************************
		// init
		// **************************************

		init: function(){

			this.setting.nikoudMode = this.NIKOUDMODE_NIKOUD;

			if ($.cookie('intro-section-visible') == "true"){
				$("#checkbox-resume").attr('checked', true).checkboxradio("refresh");
				layoutModule.setting.intro = true;
			}
			else{
				$("#checkbox-resume").attr('checked', false).checkboxradio("refresh");
				layoutModule.setting.intro = false;
			}

			this.bindUIActions();

			this.clickMode(this.LAYOUT_PCHAT);
		},


		// **************************************
		// set mode
		// **************************************

		setMode: function (mode){
			layoutModule.setting.mode = mode;
		},

		// **************************************
		// switch Layout mode
		// TODO: not sure if best method
		// **************************************

		clickMode: function(mode){
			switch(mode)
			{
				case this.LAYOUT_TRADUCTION:
					$("#bt_traduction").click();
					break;
				case this.LAYOUT_EXTRA:
					$("#bt_other_comment").click();
					break;
				case this.LAYOUT_PCHAT:
					$("#bt_rashi").click();
					break;
				case this.LAYOUT_MODERN:
					$("#bt_explanation").click();
					break;
				case this.LAYOUT_TAAMIM:
					$("#bt_taamim").click();
					break;
				default:
			}
		},

		// **************************************
		// Show or Hide Intro
		// **************************************

		ShowHideIntro: function (){

			if (layoutModule.setting.intro == true && layoutModule.setting.mode != layoutModule.LAYOUT_TAAMIM)
				$('.text-resume').show();
			else
				$('.text-resume').hide();
	   },

		// **************************************
		// Refresh the layout button state
		// **************************************

	   refreshButtonState: function (t){

			$(".bt_navigate").removeClass('ui-btn-active');
			$(".bt_navigate").removeClass('ui-state-persist');

			t.addClass('ui-btn-active');
			t.addClass('ui-state-persist');

	   },

		// **************************************
		// change the layout content
		// **************************************

	   ChangeLayoutContent: function (mode,buttonID){

		    mp3Module.stop();
			layoutModule.setMode(mode);
			$('.translation').hide();
			layoutModule.refreshButtonState($(buttonID));
			pageModule.refreshTextSelection();
			if (mode == layoutModule.LAYOUT_TRADUCTION)
				translationModule.showCurrentLanguage();
			commentModule.closeTooltip();


	   },

		// **************************************
		// Register Layout Handler
		// **************************************

		bindUIActions: function() {

			// ***********************************************************
			// traduction button handler
			// ***********************************************************

			$( "#bt_traduction" ).bind( "click", function(event, ui) {

				mp3Module.destroyJplayerObject();

				layoutModule.ChangeLayoutContent(layoutModule.LAYOUT_TRADUCTION,"#bt_other_comment");

				if (layoutModule.setting.nikoudMode != layoutModule.NIKOUDMODE_NIKOUD)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_NIKOUD;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
				}

				footbarModule.refreshFootBar();

			});

			// ***********************************************************
			// extra commentary button handler
			// ***********************************************************

			$( "#bt_other_comment" ).bind( "click", function(event, ui) {

				mp3Module.destroyJplayerObject();

				layoutModule.ChangeLayoutContent(layoutModule.LAYOUT_EXTRA,"#bt_other_comment");

				if (layoutModule.setting.nikoudMode != layoutModule.NIKOUDMODE_NIKOUD)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_NIKOUD;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
				}

				footbarModule.refreshFootBar();
			});

			// ********************************************
			// Pchat button handler
			// ********************************************

			$( "#bt_rashi" ).bind( "click", function(event, ui) {

				mp3Module.destroyJplayerObject();

				layoutModule.ChangeLayoutContent(layoutModule.LAYOUT_PCHAT,"#bt_rashi");

				if (layoutModule.setting.nikoudMode != layoutModule.NIKOUDMODE_NIKOUD)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_NIKOUD;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
				}

				footbarModule.refreshFootBar();

			});

			// ***********************************************************
			// Modern Explanation
			// ***********************************************************

			$( "#bt_explanation" ).bind( "click", function(event, ui) {

				mp3Module.destroyJplayerObject();

				layoutModule.ChangeLayoutContent(layoutModule.LAYOUT_MODERN,"#bt_explanation");

				if (layoutModule.setting.nikoudMode != layoutModule.NIKOUDMODE_NIKOUD)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_NIKOUD;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
				}

				footbarModule.refreshFootBar();

			});

			// ***********************************************************
			// Modern Explanation
			// ***********************************************************

			$( "#bt_taamim" ).bind( "click", function(event, ui) {

				layoutModule.ChangeLayoutContent(layoutModule.LAYOUT_TAAMIM,"#bt_taamim");

				if (layoutModule.setting.nikoudMode == layoutModule.NIKOUDMODE_TAAMIM)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_WITHOUT;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
				}
				else if (layoutModule.setting.nikoudMode != layoutModule.NIKOUDMODE_TAAMIM)
				{
					layoutModule.setting.nikoudMode = layoutModule.NIKOUDMODE_TAAMIM;
					pageModule.requestPage(pageModule.setting.book,pageModule.setting.perek);
					//mp3Module.play();
				}

				mp3Module.destroyJplayerObject();
				mp3Module.createJplayerObject();

				footbarModule.refreshFootBar();
			});

			// ***********************************************************
			// 'Intro' toggle button handler - switch the inline summary
			// ***********************************************************

			$("#checkbox-resume").click(function(){
			    if ($("#checkbox-resume").is(':checked')){
			    	layoutModule.setting.intro = true;
			    } else {
			    	layoutModule.setting.intro = false;
			    }
			    $.cookie('intro-section-visible', layoutModule.setting.intro , { expires: 700 });
				layoutModule.ShowHideIntro();
				setTimeout( function(){ $('#ui-tooltip-step').qtip('reposition'); }, 100 );
				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
			  });

			// ***********************************************************
			// 'who to who' toggle button handler - switch the inline summary
			// ***********************************************************

			$("#checkbox-who").click(function(){
			    if ($("#checkbox-who").is(':checked'))
					sideMenuModule.set(sideMenuModule.MENU_COMMUNICATION);
				else
					sideMenuModule.set(sideMenuModule.MENU_CLOSE);

			    //$.cookie('intro-section-visible', layoutModule.setting.intro , { expires: 700 });
				//layoutModule.ShowHideIntro();
				//setTimeout( function(){ $('#ui-tooltip-step').qtip('reposition'); }, 100 );
				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
			  });

			// ***********************************************************
			// record toggle button handler
			// ***********************************************************

			$("#checkbox-record").click(function(){
			    if ($("#checkbox-record").is(':checked')){
			    	layoutModule.setting.recordMode = true;
			    } else {
			    	layoutModule.setting.recordMode = false;
			    }

				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
			  });

			// ***********************************************************
			// save time/word association
			// ***********************************************************

			$("#save-record").click(function(){
				mp3Module.save();
				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
			});

		}
};

//************************************************
//*******  page Module         *******************
//************************************************

var s;

var pageModule = {

		setting: {
			book:1,
			perek:1,
		},

		// *******************************************
		// init
		// *******************************************

		init: function () {
			//eliecohen $.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
			s = this.setting;
			s.book  = 1;
			s.perek = 1;
			this.content = $('#content');
			this.bindUIActions();
		},

		// *******************************************
		// Set Book Perek
		// *******************************************

		setBookPerek: function (book,perek){
			this.setting.book = book;
			this.setting.perek = perek;
		},

		// *******************************************
		// get Book Perek
		// *******************************************

		getBookPerek: function (){
			return {book:this.setting.book, perek: this.setting.perek};
		},

		// *******************************************
		// RefreshTextSelection (highlight)
		// *******************************************

		refreshTextSelection:function (){

			pageModule.ClearAllHighlightText();

			if (layoutModule.setting.mode == layoutModule.LAYOUT_TRADUCTION)
				$('.word').addClass('highlight');
			else if (layoutModule.setting.mode == layoutModule.LAYOUT_TAAMIM)
				$('.word').addClass('word-taam');
			else
				commentModule.HighlightWordWithComment (layoutModule.setting.mode);
		},

		// *******************************************
		// get next chapter
		// *******************************************

		getNextChapterPage: function (){
			var b=s.book,p=s.perek;
			if (s.perek < metaDataModule.prakim_number[s.book-1])
				p = s.perek+1;
			else
			{
				if (book < 5){
					b = s.book+1;
					p = 1;
				}
				else{
					b = s.book;
					p = s.perek;
				}
			}
			return {book:b, perek: p};
		},

		// *******************************************
		// get previous chapter
		// *******************************************

		getPreviousChapterPage: function (){
			var b=s.book,p=s.perek;
			if (s.perek > 1){
				b = s.book;
				p = s.perek-1;
			}
			else
			{
				if (s.book > 1){
					b = s.book-1;
					p = metaDataModule.prakim_number[s.book-2];
				}
				else{
					b = s.book;
					p = s.perek;
				}
			}

			return {book: b,perek: p};
		},

		// *******************************************
		// get Text File Name
		// *******************************************

		getFileName : function (book,perek){
					return metaDataModule.serverRoot+'/source/wikitext/'+book+"_"+perek+'.json';
		},

		// *******************************************
		// Clear all highligh text
		// *******************************************

		ClearAllHighlightText: function(){
			this.clearTaamText();
			this.clearUsedText();
			this.clearActiveText();
			this.clearHighlight();
		},

		// *******************************************
		// Clear taam text
		// *******************************************

		clearTaamText: function (){
			$('.word').removeClass('word-taam');
		},


		// *******************************************
		// Clear all used text
		// *******************************************

		clearUsedText: function (){
			$('.word').removeClass('used');
		},

		// *******************************************
		// Clear all active text
		// *******************************************

		clearActiveText: function (){
			$('span').removeClass('active-text');
		},

		// *******************************************
		// Clear all highlight text
		// *******************************************

		clearHighlight: function (){
			$('span').removeClass('highlight');
		},

		// *******************************************
		// Make active the text associate to a given comment
		// *******************************************

		setActiveText: function (commentIndex){
			$(commentModule.getComment(commentIndex,"target")).addClass("active-text");
		},

		updatePage: function (book,perek, nikoudMode){
			pageModule.updateContent(dbModule.getText(book, perek,nikoudMode));
			pageModule.updateSeparatorPassouk(book, perek);
			pageModule.updateTitle(metaDataModule.generatePageTitle(book, perek));

			commentModule.requestPage(book,perek);

			translationModule.requestTranslation (book,perek,'ft','1');
			translationModule.requestTranslation (book,perek,'pt','2');

			if (layoutModule.setting.mode === layoutModule.LAYOUT_TRADUCTION)
				translationModule.showCurrentLanguage();

			mp3Module.requestPage(book, perek);

		},

		// *******************************************
		// Request a given page
		// *******************************************

		requestPage : function (book,perek){

			console.log("call pageModule.requestPage("+book+","+perek+")");
			//$('#ui-tooltip-step').qtip('toggle',false);
			commentModule.closeTooltip();
			//$.mobile.showPageLoadingMsg(); 1.3.2
			$.mobile.loading('show')
			pageModule.setBookPerek(book, perek);

			$.cookie('book', book , { expires: 700 });
			$.cookie('perek', perek , { expires: 700 });

			if (!dbModule.isTextDefined(book,perek)){

				console.log("retrieve the page data from ajax call");
				$.getJSON( pageModule.getFileName(book,perek), function( json ){

					dbModule.setText(book, perek, json);
					pageModule.updatePage(book, perek,layoutModule.setting.nikoudMode);
					//$.mobile.hidePageLoadingMsg(); 1.3.2
					$.mobile.loading('hide');

				}).fail(function() { alert('/source/t0'+b+p+'.htm'+' NOT FOUND'); });
			}
			else //text is found in cache
			{
				console.log("retrieve page data from cache");
				pageModule.updatePage(book, perek,layoutModule.setting.nikoudMode);
				//$.mobile.hidePageLoadingMsg(); 1.3.2
				$.mobile.loading('hide');
			}
		},

		// *******************************************
		// Request the next page
		// *******************************************

		requestNextPage : function (){
			var t = this.getNextChapterPage();
			this.requestPage (t.book, t.perek);
		},

		// *******************************************
		// Request the previous page
		// *******************************************

		requestPreviousPage : function (){
			var t = this.getPreviousChapterPage();
			this.requestPage (t.book, t.perek);
		},

		// *******************************************
		// update title
		// *******************************************

		updateTitle: function (title){
			$('#title').text(title);
		},

		// *******************************************
		// update Page Content
		// *******************************************

		updateContent: function (json){
			var i_ ;
			var j_;
			var m = "";
			for (var i in json) {
				i_ = parseInt(i)+1;

				m+="<div class='passouk p"+i_+"'>";
				m+="<span class='nb'>"+metaDataModule.digit_heb[i_-1]+"</span>";
				m+="<div class='text' id='text_"+i_+"'>";

				if (metaDataModule.isAuthor())
					m+="<a id='editor-icon'><img class='edit editor' src='"+metaDataModule.serverRoot+"/images/edit.png'></a>";

				for (var j in json[i]) {
					if (json[i].hasOwnProperty(j)) {
						j_ = parseInt(j)+1;
						m+="<span class='word' id='p"+i_+"-"+j_+"'>"+json[i][j]+"</span>";
						//console.debug("<span class='word' id='p"+i_+"-"+j_+"'>"+json[i][j]+"</span>");
					}
				}

				m+= "</div>";
				m += "<div class='translation t1'>Loading French Translation</div>";
				m += "<div class='translation t2'>Loading English Translation</div>";
				m += "<div class='translation t3'>Loading Arameic Translation</div>";
				m+= "</div>";
			}

			this.content.html( m );
		},

		// *******************************************
		// update Parashiyot separators
		// *******************************************

		updateSeparatorPassouk: function (book, perek){
			var r = metaDataModule.getSeparatorPassoukIfExist(book,perek);

			//alert(r.pash_begin+" "+r.passouk_begin+" | "+r.pash_end+" "+r.passouk_end);

			var m="";
			var strEnd = "";

			$('.text-separator-parasha').remove();

			if (r == null)
				return;

			if (r.pash_end != null && r.passouk_end != null){
				strEnd=" <span style='color:grey'>[ סוף"+r.pash_end+" ]</span>";
				//$( ".p"+r.passouk_end).before(m);
			}

			if (r.pash_begin != null && r.passouk_begin != null){
				m="<div class='text-separator-parasha'>"+" פרשת "+r.pash_begin+" "+strEnd+"</div>";
				$( ".p"+r.passouk_begin).before(m);
			}

		},

		bindUIActions: function() {

			$("#main-page").on( "pagebeforeshow", function( event, data ) {
				//$('#ui-tooltip-step').qtip('toggle',false);
				commentModule.closeTooltip();
				//$.mobile.hidePageLoadingMsg(); 1.3.2
				$.mobile.loading('hide');
				//if (optionModule.mode == optionModule.EDITOR_ON)
					//$("#checkbox-datatable").remove().checkboxradio("refresh");

					//$('#').hide();
			}),

			// *********************************************
			// Header swipeleft handler ==> Goto Previous Page
			// *********************************************

			$('#header_area').on('swipeleft', function(event) {
				pageModule.requestPreviousPage();
			});

			// ********************************************
			// Header swiperight handler ==> Goto Next Page
			// ********************************************

			$('#header_area').on('swiperight', function(event) {
				pageModule.requestNextPage();
			});

			// *********************************************
			// Text swipeleft handler ==> Goto previous comment
			// *********************************************

			$('#content').on('swipeleft', function(event) {
				$('#ui-tooltip-step').triggerHandler('next');
			});

			// ********************************************
			// Text swiperight handler ==> goto next comment
			// ********************************************

			$('#content').on('swiperight', function(event) {
				$('#ui-tooltip-step').triggerHandler('prev');
			});
		}
};

// ************************************************
// *******  translation Module  *******************
// ************************************************

var translationModule = {

		setting: {
		  numLanguages: 3,
		  label: ["Francais","English","עיברית"],
		  LANGUAGE_FR: 1,
		  LANGUAGE_EN: 2,
		  LAGUAGE_HE:3,
		  current: 1,
		},

		// *******************************************
		// init
		// *******************************************

		init: function (){
			this.setting.current = this.setting.LANGUAGE_FR;
			this.bindUIActions();
		},

		// *******************************************
		// inject translation into the html
		// *******************************************

		injectTranslation: function (b,p,index){
			var i=0;
			var json = dbModule.getTranslation(b, p, index);
		  	$(".t"+index).each(function(){
		  		$(this).text(json[i]);
		  		i++;
		  	});
		  },

		// *******************************************
		// get the translation file name
		// *******************************************

		getFileName : function (book,perek,prefix){
			var p1;
				if (perek < 10)
					p1 = "0"+perek;
				else
					p1 = perek;

				if (prefix == 'ft')
				    return metaDataModule.serverRoot+'/source/translation/french/'+prefix+'0'+book+p1+'.htm';
				else if (prefix == 'pt')
				    return metaDataModule.serverRoot+'/source/translation/english/'+prefix+'0'+book+p1+'.htm';
				else
				    alert ('should not happens! error 6754390');
			},

		// *******************************************
		// Show the current translation language
		// *******************************************

		showCurrentLanguage: function (){
			$('.t'+this.setting.current).show();
		},

		// *******************************************
		// Request Translation ('ft','1') | ('pt','2');
		// *******************************************

		requestTranslation: function (b,p,prefix,index){

		  	if (!dbModule.isTranslationDefined(b,p,index)){
		  		console.log("retrieve the translation from ajax call (prefix="+prefix+")");
			  	// eliecohen $.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
			  	$.getJSON(translationModule.getFileName(b, p, prefix), function( json ){
			  		dbModule.setTranslation(b,p,index,json);
			  		translationModule.injectTranslation (b,p,index);
			  		//$.mobile.hidePageLoadingMsg(); 1.3.2
			  		$.mobile.loading('hide');
			  	}).fail(function() {
			  		console.debug(translationModule.getFileName(b, p, prefix)+" not found");
			  		alert('error download translation failed (see log)'); });
		  	}
		  	else{
		  		this.injectTranslation(b,p,index);
		  		console.log("retrieve the translation from local variable (prefix="+prefix+")");
		  		//$.mobile.hidePageLoadingMsg(); 1.3.2
		  		$.mobile.loading('hide');
		  	}
		  },

		// *******************************************
		// Register translation handler
		// *******************************************

		  bindUIActions: function() {

			// ***********************************************************
			// change language handler
			// ***********************************************************

			// TODO switch_language is not more display

			$("body").delegate("#switch_language,.translation", "click", function(event, ui) {

				$('.t'+translationModule.setting.current).hide();

				translationModule.setting.current++;

				if (translationModule.setting.current > translationModule.setting.numLanguages)
					translationModule.setting.current = 1;

				$('.t'+translationModule.setting.current).show();

			});
		  }

		};

// *********************************************
// ******** Comment Module  ********************
// *********************************************

var commentModule = {

		COMMENT_EXTRA   : 2,
		COMMENT_PIRUSH  : 3,
		COMMENT_MODERN  : 4,
		COMMENT_INTRO   : 5,
		COMMENT_KEYWORD : 6,
		COMMENT_COM     : 7,

		steps : 1,
		type: 1,

		q: {},

		// ****************************************************************
		// init
		// ****************************************************************

		init: function (){
			this.bindUIActions();
		},

		closeTooltip: function (){
			$('#ui-tooltip-step').qtip('toggle',false);
		},

		openTooltip: function (){
			$('#ui-tooltip-step').qtip('toggle',true);
			},

		// ****************************************************************
		// update the button label to show the number of comment for the given type
		// ****************************************************************

		refreshCommentCountInButton: function(){

			var new_txt="";
			// ************** modern *************
			new_txt = "ביאורי מילים";
			new_txt += " - "+this.countType(this.COMMENT_MODERN)+"";
			$('#bt_explanation').text(new_txt);
			// ************** pirush *************
			new_txt = "עיקרי רשי";
			new_txt += " - "+this.countType(this.COMMENT_PIRUSH)+"";
			$('#bt_rashi').text(new_txt);
			// ************** drashot *************
			new_txt = "פרשנים מובחרים";
			new_txt += " - "+this.countType(this.COMMENT_EXTRA)+"";
			$('#bt_other_comment').text(new_txt);

		},

		// ****************************************************************
		// Count the total number of comment of a given type
		// ****************************************************************

		countType: function  (type){

			var x,count;
			count = 0;
		    if (this.getCommentNumber()>0){
		    	for(x=0; x<this.getCommentNumber(); x++) {
		    		if (this.getComment(x, "type") == type){
		    			count++;
		    		}
		    	}
		    }
		    return count;
		},

		// ****************************************************************
		//  set the current Comment
		// ****************************************************************

		setCurrentComment:function (title, text, target,id)
		{
			 commentModule.q.qtip('api').set('content.title.text',  title);
			 commentModule.q.qtip('api').set('content.text', text);
			 commentModule.q.qtip('api').set('position.target', target);
			 commentModule.q.qtip('api').set('content.idc', id);
		},

		// ****************************************************************
		//  requestPage
		// ****************************************************************

		requestPage: function(book,perek){

			if (dbModule.isCommentDefined(book, perek) === true){  //in cache
				commentModule.refreshComment(book,perek);
			}
			else
			{
				console.debug('comment.requestPage not found in memory => AJAX call');
				$.get('utilities/comment.php',{"b":book,"p":perek}, function(data) {
					$('.result').html(data);
					var obj = data;//jQuery.parseJSON(data);
					if (obj != null){
						dbModule.setComment(book, perek, obj);
						commentModule.refreshComment(book,perek);
					}
				});
			}
		},

		// ****************************************************************
		//  refresh Comment on the page
		// ****************************************************************

		refreshComment: function (book,perek){
			if (dbModule.isCommentDefined(book, perek) === true){
				var json = dbModule.getComment(book, perek);
				this.steps = json;
				commentModule.createTarget();
				pageModule.refreshTextSelection();
				commentModule.refreshCommentCountInButton();
				commentModule.updateIntro();
				commentModule.updateCondense();
				commentModule.updateCondenseToc();
				commentModule.updateCommunication();
				sideMenuModule.set(sideMenuModule.mode);
				layoutModule.ShowHideIntro();
			}
			else{
				alert("should not occurs error 45345652");
			}
		},

		// ****************************************************************
		// mark all words associated to a comment with class 'used'
		// ****************************************************************

		HighlightWordWithComment: function  (type){

			var x,y,z;
		    if (this.getCommentNumber()>0)
			for(x=0; x<this.getCommentNumber(); x++) {
				if (this.getComment(x, "type") == type){
					for(y=0;y<this.getComment(x,"offset");y++){
						z = this.getComment(x,"w")+y;
						$('#p'+this.getComment(x,"p")+'-'+z).addClass('used');
					}
				}
			}
		},

		// ********************************************************************************************
		// scan all the comments and add a new target attributes to be used by the tooltip object
	    // ********************************************************************************************

		createTarget: function (){
			console.debug('create target');
			var target,z;

		    if (this.getCommentNumber()>0){
				for(var x=0; x<this.getCommentNumber(); x++){
					target = "";
					for(var y=0;y<this.getComment(x, "offset");y++){
						z = this.getComment(x, "w")+y;
						target = target +"#p"+this.getComment(x, "p")+'-'+z+',';
					}
					target = target.substring(0, target.length-1);  // remove the last ,
					this.setComment(x, "target", $(target));
				}
			}
			else{
			}
		},

		// *********************************************
		// retreive the content of the x th element
		// *********************************************

		getContent: function(x){

			var content='';

			var text     = this.getComment(x, "content");
			var html     = this.getComment(x, "html");
			var question = this.getComment(x, "question");

			if (typeof question != 'undefined' && question.length > 3)
			{
				content = 	'<span class=\'question\'>'+question+'</span>';
				content+=   '<br/><br/>';
				content+=   '<span class=\'text-content\'>'+text+'</span>';
			}
			else
				content = 	'<span class=\'text-content\'>'+text+'</span>';


			if (html != "" && html != undefined)
				content += "<hr/>"+html;

			return content;
		},

		// *********************************************
		// retreive the title of the x th element
		// *********************************************

		getTitle: function (x){
			var title='';
			if (typeof this.getComment(x,"title") != undefined && this.getComment(x,"title") != "" && this.getComment(x,"author") != "" )
			    title = this.getComment(x,"author")+' - '+this.getComment(x,"title");
			else if (this.getComment(x,"author") != "")
			    title = this.getComment(x,"author");
			else if (this.getComment(x,"title") != "")
			    title = this.getComment(x,"title");
			return title;
		},

		// *********************************************
		// retreive the value of the index i, with a given key
		// *********************************************

		getComment: function (i,key, htmlTransformationFlag){

			if (htmlTransformationFlag === undefined) {
				htmlTransformationFlag = true;
			  }

			var text = this.steps[i][key];

			if (text != undefined && typeof text === "string" )
			{
				if (key == "html"){
					text = text.replace(/\\\"/g, "'");
					if (text.substring(0,7)=="http://")
						text = "<img src='"+text+"'/>";
				}
				else{
					text = text.replace(/\\/g, "");
				}

				if (htmlTransformationFlag)
				{
					text = text.replace(/\]/g, "</strong>");
					text = text.replace(/#/g, "<br/>");
					text = text.replace(/\[/g, "<strong>");

				}

			}
			return text;
		},

		// *********************************************
		// set the value of the index i, with a given key
		// *********************************************

		setComment:function(i,key,value){
			this.steps[i][key] = value;
		},

		// *********************************************
		// getthe total number of comment for a given perek
		// *********************************************

		getCommentNumber: function (){
			return commentModule.steps.length;
		},

		// *********************************************
		// update the communication comment
		// *********************************************

		updateCommunication: function (){

			var passouk,to,from,direction,passouk,m;

			$('.sidebar3').remove();

			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {

					if (commentModule.getComment(i,"type") == this.COMMENT_COM ){
						to        = commentModule.getComment(i,"to");
						from      = commentModule.getComment(i,"from");
						direction = commentModule.getComment(i,"direction");
						passouk   = commentModule.getComment(i,"p");

						m="<div class='sidebar3'>";
						m+="<span>"+from+"</span>";
						if (direction == editorModule.COM_DIRECTION_RIGHT)
							m+="<img src='images/right.png' class='arrow' alt=''>";
						else if (direction == editorModule.COM_DIRECTION_BOTH)
							m+="<img src='images/both.png' class='arrow' alt=''>";
						else
							m+="<img src='images/left.png' class='arrow' alt=''>";
						m+="<span>"+to+"</span>";
						m+="</div>";
						$( ".p"+passouk ).before(m);
					}
				}
			}
		},

		// *********************************************
		// update the Keyword Toc comment
		// *********************************************

		updateCondenseToc: function(){
			var text="";
			var found = 0;

			$('#sidebar1 ul').remove();

			var m="<ul dir='rtl'>";

			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == this.COMMENT_KEYWORD ){
						found = 1;
						text = commentModule.getComment(i,"title");
						m+="<li>"+text+"</li>";
					}
				}

				m+="</ul>";

				$( "#sidebar1").append(m);
			}
			if (!found || commentModule.getCommentNumber() == 0){
				$( "#sidebar1").append("<ul dir='rtl'><li>empty list</li></ul>");
			}
		},

		// *********************************************
		// update the Keyword comment
		// *********************************************

		updateCondense: function(){
			var text="";
			var passouk;

			$('.sidebar2').remove();

			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == this.COMMENT_KEYWORD ){
						text = commentModule.getComment(i,"title");
						passouk = commentModule.getComment(i,"p");
						m="<div class='sidebar2'>"+text+"</div>";
						$( ".p"+passouk ).before(m);
					}
				}
			}
		},

		// *********************************************
		// update the Intro comment
		// *********************************************

		updateIntro: function (){
			var text="";
			var passouk;
			var m;

			//first remove all previous intro
			$('.text-resume').remove();

			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == commentModule.COMMENT_INTRO ){
						text    = commentModule.getComment(i,"title");
						passouk = commentModule.getComment(i,"p");
						m="<div class='text-resume'>"+text+"</div>";
						$( ".p"+passouk ).before(m);
					}
				}
			}
		},

		// *********************************************
		// return the intro of a given passouk if exist
		// *********************************************

		getIntroForPassouk: function (passouk){
			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == commentModule.COMMENT_INTRO && commentModule.getComment(i,"p") == passouk)
						return {id:commentModule.getComment(i,"id"), value:commentModule.getComment(i,"title")};
				}
			}
			return null;
		},

		// *********************************************
		// return the Condense of a given passouk if exist
		// *********************************************

		getCondenseForPassouk: function (passouk){
			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == this.COMMENT_KEYWORD && commentModule.getComment(i, "p") == passouk)
						return {id:commentModule.getComment(i,"id"), value:commentModule.getComment(i,"title")};
				}
			}
			return null;
		},


		// *********************************************
		// return the com of a given passouk if exist
		// *********************************************

		getCommunicationForPassouk: function (passouk){
			var from, to ,direction,id;
			if (commentModule.getCommentNumber()>0){
				for(var i=0; i<commentModule.getCommentNumber(); i++) {
					if (commentModule.getComment(i,"type") == this.COMMENT_COM && commentModule.getComment(i, "p") == passouk){
						from      = commentModule.getComment(i, "from");
					    to        = commentModule.getComment(i, "to");
						direction = parseInt(commentModule.getComment(i, "direction"));
						id        = commentModule.getComment(i, "id");
						return {from:from, to: to, direction: direction, id:id};
					}
				}
			}
			return null;
		},

		// *********************************************************
		// return the index of the first comment for a given word
		// *********************************************************

		searchFirstComment:function(event,to) {

			var index_separator = to.indexOf("-");  //to=p9-2
			var lp = parseInt(to.substring(1,index_separator));  //lp=9
			var lw = parseInt(to.substring(index_separator+1));	 //lw=2

			var i;
			if (commentModule.getCommentNumber()>0)
			for(i=0; i<commentModule.getCommentNumber(); i++) {
				if (commentModule.getComment(i,"type") == layoutModule.setting.mode && lp == commentModule.getComment(i,"p") && ((lw - commentModule.getComment(i,"w")) <= (commentModule.getComment(i,"offset")-1))){
					return i;
				}
			}
		},

		// *********************************************************
		// return the index of next/previous tooltip
		// *********************************************************

		getNextTooltipIndex: function (event_type, current_index){

			if (event_type === 'next'){
			   for(var x=current_index+1; x<commentModule.getCommentNumber(); x++){
					if (commentModule.getComment(x,"type") == layoutModule.setting.mode){
					   //console.debug('next index found for this type:'+x);
					   return x;
					}
				}
			}

			else if (event_type === 'prev'){
			   for(x=current_index-1; x>0; x--) {
					if (commentModule.getComment(x,"type") == layoutModule.setting.mode){
					   //console.debug('previous index found for this type:'+x);
					   return x;
					}
			   }
			}
		},

		// *********************************************************
		// return the index of next/previous tooltip
		// *********************************************************

		setCurrentTooltip: function (commentIndex){

			var content = commentModule.getContent(commentIndex);
			var title   = commentModule.getTitle(commentIndex);
			var target  = commentModule.getComment(commentIndex,"target");

			commentModule.setCurrentComment (title, content, target,commentIndex);

		},

		// *********************************************************
		// register comment handlers
		// *********************************************************

		bindUIActions: function() {

			// **********************************************
			// click on any comment content to continue to next comment
			// **********************************************

			$("body").delegate('.ui-tooltip-content','click taphold',function(event,data){
					$('#ui-tooltip-step').triggerHandler('next');
			});


		    // **********************************************************
			// Setup the direct links (click on .used word)
			// **********************************************************

			$("body").delegate('.used','click', function(event) {
				//console.debug('click on used id='+this.id);
				//$('#ui-tooltip-step').qtip('toggle',true);
				commentModule.openTooltip();
				$('#ui-tooltip-step').triggerHandler('goto',[ this.id ]);
				event.preventDefault();
				return false;
			});

			// **********************************************************
			// update the toc popup to point to the current page
			// **********************************************************

			$("#popupInfo").bind({popupbeforeposition: function(event, ui) {
				commentModule.closeTooltip();
				tocModule.updatePash(s.book-1);
				var parasha = metaDataModule.getParashaIndexFromPerek(s.book,s.perek);
				$('.parasha-selected').removeClass('parasha-selected');
				$('#p'+parasha).addClass('parasha-selected');  //p0 bereshit....
				tocModule.updatePrakim(s.book-1, parasha);
				$('.perek-selected').removeClass('perek-selected');
				$('#r'+s.perek).addClass('perek-selected');  //r1 is the first perek
				}
			});

			// **********************************************
			// click on any comment title to edit it (only for author)
			// **********************************************

			$("body").delegate('.ui-tooltip-titlebar','click taphold',function(event,data){

				if (metaDataModule.isAuthor()){
					var commentIndex = commentModule.q.qtip('api').get('content.idc');
					editorModule.passouk = commentModule.getComment(commentIndex, "p");
					editorModule.mode = editorModule.MODE_UPDATE;
					editorModule.page = editorModule.FORM_COMMENT;

					$.mobile.changePage("#editor-page",{ transition: "slide",reverse:false});
				}
			});

			//// elie
            $("body").delegate('.ui-tooltip-content','contextmenu',function(event,data){


				if (metaDataModule.isAuthor()){
					var commentIndex = commentModule.q.qtip('api').get('content.idc');
					editorModule.passouk = commentModule.getComment(commentIndex, "p");
					editorModule.mode = editorModule.MODE_UPDATE;
					editorModule.page = editorModule.FORM_COMMENT;

					$.mobile.changePage("#editor-page",{ transition: "slide",reverse:false});
				}
			});


		    // **********************************************************
			// Setup the keypress body handler (press anykey goto next)
			// **********************************************************
			/*
			$("#body").keypress(function(e) {
				$('#ui-tooltip-step').qtip('toggle',true);
				if (e.keyCode == 37)
		  		   $('#ui-tooltip-step').triggerHandler('prev');
		  		else
		  		   $('#ui-tooltip-step').triggerHandler('next');
				event.preventDefault();
		  		return false;
			});*/

		    // **********************************************************
			// Setup the click body handler (click anywhere goto next)
			// **********************************************************

		/*	$("#page-bgtop").click(function(e) {
				console.debug('click on wrapper');
				$('#ui-tooltip-step').qtip('toggle',true);
		  		$('#ui-tooltip-step').triggerHandler('next');
		  		//event.preventDefault();
		  		//return false;
			});*/


		    // **********************************************************
			// register the qtip handler
			// **********************************************************

			this.q = $(document.body).qtip({
				id: 'step', // Give it an ID of ui-tooltip-step so we an identify it easily
				content: {
			   		text: "ffff",
			   		idc:0,
					title: {
						text: "aaaa",
						button: true
					}
				},
				position: {
					my: 'top center',
					at: 'bottom center',
					//target: commentModule.steps[0].target, // Also use first steps position target...
					viewport: $(window) // ...and make sure it stays on-screen if possible
				},
				show: {
					event: false, // Only show when show() is called manually
					ready: true // Also show on page load
				},
				hide: false, // Don't' hide unless we call hide()
				events: {
					render: function(event, api) {

						var tooltip = api.elements.tooltip;

						// **************************************************************
						// Track the current step in the API
						// **************************************************************

						api.step = 0;

						// **************************************************************
						// Bind custom custom events we can fire to step forward/back
						// **************************************************************

						tooltip.bind('next prev', function(event) {

							api.step = commentModule.q.qtip('api').get('content.idc');
							api.step = commentModule.getNextTooltipIndex (event.type, api.step ); //event.type == 'next | previous'
							api.step = Math.min(commentModule.steps.length - 1, Math.max(0, api.step));

							if(commentModule.steps[api.step]) {


								commentModule.setCurrentTooltip (api.step);

								pageModule.clearActiveText();
								pageModule.setActiveText(api.step);
							}
						});

						// **************************************************************
						// Bind custom custom events we can click directly on any word
						// **************************************************************

						tooltip.bind('goto', function(event,to) {

							api.step = commentModule.searchFirstComment(event,to);

							if(commentModule.steps[api.step]) {

								commentModule.setCurrentTooltip (api.step);

								pageModule.clearActiveText();
								pageModule.setActiveText(api.step);
							}
						});

					},

					// Destroy the tooltip after it hides as its no longer needed
					hide: function(event, api) { /*api.destroy();*/ }
				}
			});

		},



};

//*********************************************
//******** Right Side Menu Module  ***********
//*********************************************


var sideMenuModule = {

	mode: 1,

	MENU_CLOSE: 1,
	MENU_KEYWORD_COMPACT: 2,
	MENU_KEYWORD_IN_PLACE: 3,
	MENU_COMMUNICATION: 4,

	summary_compact:  $('#sidebar1'),  // mode = 2
	summary_disperse: $('.sidebar2'),  // mode = 3
	communication:    $('.sidebar3'),  // mode = 4

	init: function() {
		    this.mode = 1;
		    this.bindUIActions();
	},

	bindUIActions: function() {

		$("body").delegate("#resume,.nb, #sidebar1,.sidebar2,.sidebar3,#switch-right-menu","click", function(event, ui) {
				sideMenuModule.switchMode();
		});
	},

	set: function (mode){

		if (mode == 'disabled' || mode == this.MENU_CLOSE)
		{
			this.mode = this.MENU_CLOSE;

			//this.summary_compact.hide();
			//this.summary_disperse.hide();
			//this.communication.hide();

			//$('switch-right-menu .ui-btn-text').val("jjjh");

		    $('#sidebar1').hide();
		    $('.sidebar2').hide();
		    $('.sidebar3').hide();

		    $('#switch-right-menu .ui-btn-text').text('סגור');

		    $('#content').css( 'margin-right', '30px' );
		    $('.passouk').css( 'margin-right', '30px');
		    $('.text-separator-parasha').css('margin-right', '30px');
		    $('.text-resume').css('margin-right', '30px');

		}
		else if (mode === 'summary_compact' || mode === this.MENU_KEYWORD_COMPACT)
		{
			this.mode = this.MENU_KEYWORD_COMPACT;

			//this.summary_compact.show();
			//this.summary_disperse.hide();
			//this.communication.hide();

		    $('#switch-right-menu .ui-btn-text').text('רשימת נושאים');


		    $('#sidebar1').show();
		    $('.sidebar2').hide();
		    $('.sidebar3').hide();

		    $('#content').css( 'margin-right', '300px' );
		    $('.passouk').css( 'margin-right', '0px');
		    $('.text-separator-parasha').css('margin-right', '30px');
		    $('.text-resume').css('margin-right', '30px');

		}
		else if ( mode === 'summary_disperse' || mode === this.MENU_KEYWORD_IN_PLACE)
		{
			this.mode = this.MENU_KEYWORD_IN_PLACE;

			//this.summary_compact.hide();
			//this.summary_disperse.show();
			//this.communication.hide();

		    $('#switch-right-menu .ui-btn-text').text('נושאים');

			 $('#sidebar1').hide();
			 $('.sidebar2').show();
			 $('.sidebar3').hide();

			 $('#content').css( 'margin-right', '30px' );
			 $('.passouk').css( 'margin-right', '300px');
			 $('.text-resume').css('margin-right', '300px');
			 $('.text-separator-parasha').css('margin-right', '300px');

		}
		else if ( mode === 'communication' || mode === this.MENU_COMMUNICATION)
		{
			this.mode = this.MENU_COMMUNICATION;

			//this.summary_compact.hide();
			//this.summary_disperse.hide();
			//this.communication.show();

		    $('#sidebar1').hide();
		    $('.sidebar2').hide();
		    $('.sidebar3').show();

		    $('#switch-right-menu .ui-btn-text').text('מי מדבר למי');

		    $('#content').css( 'margin-right', '30px' );
		    $('.passouk').css( 'margin-right', '300px');
		    $('.text-separator-parasha').css('margin-right', '300px');
		    $('.text-resume').css('margin-right', '300px');

		}

	    setTimeout( function(){ $('#ui-tooltip-step').qtip('reposition'); }, 100 );
	},

	switchMode : function (){
		/*if (this.mode < this.MENU_COMMUNICATION)
			this.set(++this.mode);
		else
			this.set(this.MENU_CLOSE); */

		if (this.mode == this.MENU_COMMUNICATION)
			this.set(this.MENU_CLOSE);
		else
			this.set(this.MENU_COMMUNICATION);

	}

};



// ***************************************************************
// ***************************************************************
// ***************   READY ***************************************
// ***************************************************************
// ***************************************************************

$(document).on('pageinit', '#main-page',  function(event)
{
	console.debug("=== pageinit ===");

	metaDataModule.serverRoot = "";//"/1";

	// **************************
	// Init Module
	// **************************
	footbarModule.init();
	mp3Module.init();
	optionModule.init();
	translationModule.init();
	dbModule.init();
	metaDataModule.init();
	layoutModule.init();
	pageModule.init();
	sideMenuModule.init();
	tocModule.init();
	commentModule.init();
	editorModule.init();
	dataTableModule.init();
	allIntroModule.init();

	// **************************
	// request Page
	// **************************

	var book_  = $.cookie('book');
	var perek_ = $.cookie('perek');

	console.debug("read cookie book="+book_);
	console.debug("read cookie perek="+perek_);

	if (book_ != undefined && perek_ != undefined)
	{
		pageModule.requestPage(parseInt(book_), parseInt(perek_));
	}
	else
		pageModule.requestPage(1, 1);

});

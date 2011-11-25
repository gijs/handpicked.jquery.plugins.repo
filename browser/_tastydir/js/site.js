//			 _     _ _
//			| |__ (_) |
//			| '_ \| | |
//			| | | | |_|
//			|_| |_|_(_)
//
//		This is Tastydir's Javascript.
//		I'm sorry if this seems inefficient or difficult to read, I did my best, but feel free to contact me with suggestions!
//		READ THE DOCUMENTATION FIRST! You can find it in /doc. Also, contact details are in the README file.
//		- vladh
//
//		PS. If you're in a hurry to get somewhere, just search for a function name! eg. "function editfile"
//

//			  __                  _   _
//			 / _|_   _ _ __   ___| |_(_) ___  _ __  ___
//			| |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
//			|  _| |_| | | | | (__| |_| | (_) | | | \__ \
//			|_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
//

var jsonlock,cdir,mcname,mcpath,mcmove,t_cfiles;

function basename (path, suffix) {
	//var b = path.replace(/^.*[\/\\]/g, '');
	var b = path.replace(/^.*[\/]/g, '');
	if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix){
		b = b.substr(0, b.length-suffix.length);
	}
	return b;
}
function dirname (path) {
    return path.replace(/\\/g,'/').replace(/\/[^\/]*\/?$/, '');
}

function urlencode (str) {
    str = (str+'').toString();
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')/*.replace(/%2F/g, '/')*/;
}

function obIsEmpty(o) {
	for(var i in o){ return false; }
	return true;
}

String.prototype.escape = function(){
	return this.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/* firefox (only?) bugfix - innerHTML also does some urlencoding for some strange reason. silly firefox. */
String.prototype.htmlfix = function(){
	return this.replace(/\&amp\;/g, "\&");
}
String.prototype.nicer = function(){
	if(this.length > 55){
		return this.substr(0,51)+'...';
	}else{
		return this;
	}
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

function toggle(umm) {
	if(umm==0){
		return 1;
	}else{
		return 0;
	}
}

//							 _       _          __ _ _
//			 _   _ _ __   __| | __ _| |_ ___   / _(_) | ___  ___
//			| | | | '_ \ / _` |/ _` | __/ _ \ | |_| | |/ _ \/ __|
//			| |_| | |_) | (_| | (_| | ||  __/ |  _| | |  __/\__ \
//			 \__,_| .__/ \__,_|\__,_|\__\___| |_| |_|_|\___||___/
//				  |_|
//

function updateFiles(dir){
	if(dir.length < 1){
		dir=t_path;
	}
	$("#files_outer").slideUp('slow',function(){
		$("#files").html('<tr class="loading"><td colspan="4"><img src="_tastydir/images/loading.gif"></td></tr>');
			
		/* here we assign a random number to a variable called jsonlock... */
		jsonlock=Math.floor(Math.random()*99999);
		/* then do the json request */
		$.getJSON(t_dn+"_tastydir/do.php?d="+urlencode(dir)+"&lock="+jsonlock+"&cb=?", function(data){
			var i, totalhref='', fname, fsize, fperms, nofiles=0, fbin, finbs, ldisabled, noperms='', ffperms, firstpart=false, showdirs=false, pathhtml, pathfname;
			/* 	callback for json request: jsonlock has the json lock from when we initially started the request - we send it to the dir function and it sends it back
				if the jsonlock var isn't the same as the one above then another request has taken place and we need to stop updating everything
				because if we do update it we'll get two sets of results on top of each other and that's not cool
			*/
			if(jsonlock == data.jsonlock){
				cdir=data.cdir.escape();
				t_cfiles=data;
				/* if the result is obsolete we just drop it, otherwise proceed */
				if(loggedin){
					ldisabled='class="enabled" ';
				}else{
					ldisabled='class="disabled" ';
				}
				$("tr.loading").remove();
				for(i in data.cdirs){
					pathfname=data.cdirs[i].escape();
					totalhref+=data.cdirs[i].escape();
					if(data.cdirs[i]!='/') totalhref=totalhref+'/';
					if(!loggedin)
						if(totalhref==t_path+'/'){ pathfname='/'; showdirs=true; }
					if(showdirs || loggedin){
						pathhtml='<div class="pathpart"><a id="path'+i+'" href="'+'#'+urlencode(totalhref)+'">'+pathfname+'<div class="breadcrumb"></div></a></div>';
						if(firstpart){
							$("#path").append(pathhtml);
						}else{
							$("#path").html(pathhtml);
						}
						firstpart=true;
					}
				}
				if(!obIsEmpty(data.dirs)){
					for(i in data.dirs){
						if(data.dirs[i]){
							fname=data.dirs[i]['n'].escape();
							fsize=data.dirs[i]['s'];
							fperms=data.dirs[i]['p'];
							ffperms=data.dirs[i]['fp'];
							if(fperms=='?---------'){
								noperms=' noperms';
							}else{
								noperms='';
							}
						}else{
							fname='ERROR';
							fsize='';
							fperms='';
							ffperms='';
						}
						$("#files")
						.append(	'<tr class="frow'+noperms+'" id="folder'+i+'">'+
										'<td class="fcell folder"><a class="fname folder" href="'+'#'+urlencode(data.cdir+'/'+fname)+'">'+fname+'</a></td>'+
										'<td><span class="fsize">'+fsize+'</span></td>'+
										'<td><a class="fperms" href="javascript:;">'+ffperms+'</a></td>'+
										'<td class="actions">'+
											'<img class="action_editfolder" '+ldisabled+' title="Edit" alt="Edit" src="_tastydir/images/page_white_edit.png">'+
											'<img class="action_deletefolder" '+ldisabled+' title="Delete" alt="Delete" src="_tastydir/images/doc_shred.png">'+
										'</td>'+
									'</tr>');
						$("#folder"+i+" .action_editfolder").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); editFolderDialog(data.cdir+'/'+fname); });
						$("#folder"+i+" .action_deletefolder").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); deleteFolder(data.cdir+'/'+fname); });
						$("#folder"+i+" .fperms").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); fperms=$(this).children('span').html(); chmod(data.cdir+'/'+fname,fperms); });
					}
				}else{
					nofiles+=1;
				}
				if(!obIsEmpty(data.files)){
					for(i in data.files){
						if(data.files[i]){
							fname=data.files[i]['n'].escape();
							fsize=data.files[i]['s'];
							fperms=data.files[i]['p'];
							ffperms=data.files[i]['fp'];
							ftype=data.files[i]['t'];
							fbin=data.files[i]['b'];
							if(fbin=='true' || !loggedin){
								fbins='class="disabled" ';
							}else{
								fbins='class="enabled" ';
							}
							if(fperms=='?---------'){
								noperms=' noperms';
							}else{
								noperms='';
							}
						}else{
							fname='ERROR';
							fsize='';
							fperms='';
							ffperms='';
							ftype='';
							fbin='';
							fbins='';
						}
						$("#files")
						.append(	'<tr class="frow'+noperms+'" id="file'+i+'">'+
										'<td class="fcell file"><a class="fname file action_downloadfile"' + ((ftype!='img') ? ' href="_tastydir/do.php?download='+urlencode(data.cdir+'/'+fname)+'" target="_blank"' : ' href="javascript:;"') + '>'+fname+'</a></td>'+
										'<td><span class="fsize">'+fsize+'</span></td>'+
										'<td><a class="fperms" href="javascript:;">'+ffperms+'</a></td>'+
										'<td class="actions">'+
											'<img class="action_editfile" '+fbins+'title="Edit" alt="Edit" src="_tastydir/images/page_white_edit.png">'+
											'<img class="action_deletefile" '+ldisabled+'title="Delete" alt="Delete" src="_tastydir/images/doc_shred.png">'+
											'<img class="action_copyfile" '+ldisabled+'title="Copy/Move" alt="Copy/Move" src="_tastydir/images/page_copy.png">'+
										'</td>'+
									'</tr>')
						$("#file"+i+" .fname").css('background',"url('_tastydir/images/file_"+ftype+".png') no-repeat");
						$("#file"+i+" .action_editfile").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); editFileDialog(data.cdir+'/'+fname); });
						$("#file"+i+" .action_deletefile").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); deleteFile(data.cdir+'/'+fname); });
						$("#file"+i+" .action_copyfile").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); copyBar(data.cdir+'/'+fname); });
						if(ftype=='img'){
							$("#file"+i+" .action_downloadfile").click(function(){ fname=$(this).html(); lightboxImage(data.cdir+'/'+fname); });
						}
						$("#file"+i+" .fperms").click(function(){ fname=$(this).parents('.frow').children('.fcell').children('.fname').html(); fperms=$(this).children('span').html(); chmod(data.cdir+'/'+fname,fperms); });
					}
				}else{
					nofiles+=1;
				}
				if(nofiles==2){
					$("#files").append('<tr><td colspan="4" class="no" style="text-align:center;">Directory is either empty or could not be accessed!</td></tr>');
				}
				/* image fading */
				$("tr.frow").hover(
					function(){
						$(this).find('td').stop(true,true).animate({backgroundColor:'#f6f6f6'},'whatev');
					},
					function(){
						$(this).find('td').stop(true,true).animate({backgroundColor:'white'},'whatev');
					}
				);
				$("td.actions").find("img.enabled").hover(
					function(){
						$(this).stop(true,true).fadeTo('fast',1);
					},
					function(){
						$(this).stop(true,true).fadeTo('fast',0.6);
					}
				);
			}
			$("#files_outer").slideDown('slow');
		});
	});
}

//							_              _          __  __
//			 _ __ ___   ___| |_ __ _   ___| |_ _   _ / _|/ _|
//			| '_ ` _ \ / _ \ __/ _` | / __| __| | | | |_| |_
//			| | | | | |  __/ || (_| | \__ \ |_| |_| |  _|  _|
//			|_| |_| |_|\___|\__\__,_| |___/\__|\__,_|_| |_|
//

function getInfo(path,callback){
	var name=basename(path);
	/*
	//
	// Return object looks like this:
	//
	Array
	(
		[status] => 0
		[0] => Array
		(
			[dev] => 3
			[ino] => 0
			[mode] => 33206
			[nlink] => 1
			[uid] => 0
			[gid] => 0
			[rdev] => 3
			[size] => 108907
			[atime] => 1280616258
			[mtime] => 1280616258
			[ctime] => 1280700400
			[blksize] => -1
			[blocks] => -1
		)

		[1] => Array
		(
			[name] => VLADH-DESK-WIN7$
			[passwd] => 
			[uid] => 0
			[gid] => 0
			[geocs] => 
			[dir] => 
			[shell] => 
		)

		[2] => Array
		(
			[name] => N/A
			[passwd] => 
			[members] => Array
				(
				)

			[gid] => 0
		)
	)
	//
	*/
	if(!loggedin){
		noPerms();
		return 0;
	}
	$.getJSON(t_dn+"_tastydir/do.php?getinfo="+urlencode(path)+"&cb=?", function(data){
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'Info Error - '+name.escape(),
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to get info for doesn\'t exist.');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			callback(data);
			return 0;
		}
	});
}

function getLetters(){
	var letters='', i;
	$.getJSON(t_dn+"_tastydir/do.php?lt&cb=?", function(data){
		for(i in data){
			letters+='<button id="letter'+i+'" onclick="document.location=\''+'#'+urlencode(data[i]+':/')+'\';">'+data[i]+':\\</button>';
		}
		$("#letters").html(letters);
	});
}

//					  _ _ _      __ _ _
//			  ___  __| (_) |_   / _(_) | ___
//			 / _ \/ _` | | __| | |_| | |/ _ \
//			|  __/ (_| | | |_  |  _| | |  __/
//			 \___|\__,_|_|\__| |_| |_|_|\___|
//

function editFileDialog(path){
	if(!loggedin){
		noPerms();
		return 0;
	}
	var name=basename(path);
	$("#loading_modal").dialog({
		modal:true,
		height:60,
		width:60,
		resizable:false,
		draggable:false
	});
	$.getJSON(t_dn+"_tastydir/do.php?getf="+urlencode(path)+"&cb=?", function(data){
		$("#loading_modal").dialog('close');
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'File Editing Error - '+name.escape(),
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to edit doesn\'t exist.');
			}else if(data.status==2){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to edit is a binary file, such as an image. Editing it will only cause corruption (and there\'s no point in viewing it).');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			$("#editfile_modal").append('<div id="editfile_top">Name: <input type="text" value="'+name.escape()+'" id="editfile_fname"><label></label></div><textarea id="editfile_textarea" onkeydown="return onTextareaKey(this,event)">'+data.data.escape()+'</textarea>');
			$("#editfile_modal").dialog({
				title: 'Edit File - '+name.escape(),
				modal: true,
				width: 800,
				height: 600,
				buttons: {
					'Save': function() {
						if($("#editfile_fname").val().trim().length>0){
							if($("#editfile_fname").val() != name){
								mcfile=name;
								mcpath=path;
								path=dirname(path)+'/'+$("#editfile_fname").val();
								moveFile(path,true);
							}
							if($('#editfile_textarea').val() != data.data){
								writeFile(path,$('#editfile_textarea').val());
							}
						}else{
							$("#editfile_top label").html('please enter a filename');
						}
					},
					'Close': function() {
						$(this).dialog('close');
					}
				},
				open: function(event,ui){
					$("#editfile_textarea").height($("#editfile_modal").height() - $("#editfile_top").height() - 27);
				},
				resize: function(event,ui){
					$("#editfile_textarea").height($("#editfile_modal").height() - $("#editfile_top").height() - 27);
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
		}
	});
}

function createFileDialog(path){
	if(!loggedin){
		noPerms();
		return 0;
	}
	$("#editfile_modal").append('<div id="editfile_top">Name: <input type="text" value="" id="editfile_fname"><label></label></div><textarea id="editfile_textarea" onkeydown="return onTextareaKey(this,event)"></textarea>');
	$("#editfile_modal").dialog({
		title: 'Create File',
		modal: true,
		width: 800,
		height: 400,
		buttons: {
			'Save File': function() {
				if($("#editfile_fname").val().trim().length>0){
					writeNewFile(path+'/'+$('#editfile_fname').val(),$('#editfile_textarea').val());
					$(this).dialog('close');
				}else{
					$("#editfile_top label").html('please enter a filename');
				}
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		open: function(event,ui){
			$("#editfile_textarea").height($("#editfile_modal").height() - $("#editfile_top").height() - 27);
		},
		resize: function(event,ui){
			$("#editfile_textarea").height($("#editfile_modal").height() - $("#editfile_top").height() - 27);
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
}

function writeNewFile(path,fdata){
	var name=basename(path);
	$.getJSON(t_dn+"_tastydir/do.php?fcheck="+urlencode(path)+"&cb=?", function(data){
		if(data.exists){
			if(data.type=='dir'){
				$("#editfile_modal").html('<strong>'+name.escape()+'</strong> already exists, and it\'s a folder, so overwriting it is a bad idea. If you\'d like to, you can remove the folder, then try creating the file again.');
				$("#editfile_modal").dialog({
					title: 'File creation - <strong>'+name.escape()+'</strong> already exists',
					modal: true,
					width: 500,
					height: 215,
					buttons: {
						'Alright': function() {
							$(this).dialog('close');
						}
					},
					close: function(event,ui){
						$(this).empty();
					}
				});
			}else{
				$("#editfile_modal").html('<strong>'+name.escape()+'</strong> already exists. Would you like to overwrite it?');
				$("#editfile_modal").dialog({
					title: 'File creation - <strong>'+name.escape()+'</strong> already exists',
					modal: true,
					width: 500,
					height: 215,
					buttons: {
						'No': function() {
							$("#editfile_modal").html('File not created.');
							$("#editfile_modal").dialog({
								title: 'Overwrite confirmation',
								modal: true,
								width: 500,
								height: 215,
								buttons: {
									'Close': function(){
										$(this).dialog('close');
									}
								}
							});
						},
						'Yes': function() {
							writeFile(path,fdata);
							$(this).dialog('close');
						}
					},
					close: function(event,ui){
						$(this).empty();
					}
				});
			}
		}else{
			writeFile(path,fdata);
			updateFiles(document.location.hash.substr(1));
		}
	});
}

function writeFile(path,fdata){
	var name=basename(path);
	$.ajax({
		url: t_dn+"_tastydir/do.php?editf="+urlencode(path)+"&cb=?",
		dataType: 'json',
		type: 'POST',
		data: 'fdata='+fdata,
		success: function(data){
			if(data.status>0){
				$("#editfile_modal").dialog({
					title: 'File Editing Error - '+name.escape(),
					modal: true,
					width: 500,
					height: 215,
					buttons: {
						'Close': function() {
							$(this).dialog('close');
						}
					},
					close: function(event,ui){
						$(this).empty();
					}
				});
				if(data.status==1){
					$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to edit (or its parent folder) isn\'t writable. Please set permissions of at least 755 in order to be able to modify files.');
				}else if(data.status==2){
					$("#editfile_modal").append('<h3 class="no">Error</h3> Couldn\'t write to file. This is either a permission problem, or the filename is invalid. Sorry!');
				}else if(data.status==100){
					$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
				}else{
					$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
				}
			}
		}
	});
}

//					  _ _ _      __       _     _
//			  ___  __| (_) |_   / _| ___ | | __| | ___ _ __
//			 / _ \/ _` | | __| | |_ / _ \| |/ _` |/ _ \ '__|
//			|  __/ (_| | | |_  |  _| (_) | | (_| |  __/ |
//			 \___|\__,_|_|\__| |_|  \___/|_|\__,_|\___|_|
//

function editFolderDialog(path){
	var name=basename(path);
	if(!loggedin){
		noPerms();
		return 0;
	}
	$("#editfile_modal").append('Name: <input type="text" value="'+name.escape()+'" id="editfile_fname"><label></label>');
	$("#editfile_modal").dialog({
		title: 'Edit Folder - '+name.escape()+'',
		modal: true,
		width: 500,
		height: 215,
		buttons: {
			'Edit': function() {
				if($("#editfile_fname").val().trim().length>0){
					if($("#editfile_fname").val() != name){
						mcfile=name;
						mcpath=path;
						moveFile(dirname(path)+'/'+$("#editfile_fname").val(),true);
					}
					$(this).dialog('close');
				}else{
					$("#editfile_top label").html('please enter a filename');
				}
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
}

function createFolderDialog(path){
	if(!loggedin){
		noPerms();
		return 0;
	}
	$("#editfile_modal").append('Name: <input type="text" value="'+name.escape()+'" id="editfile_fname"><label></label>');
	$("#editfile_modal").dialog({
		title: 'Create Folder',
		modal: true,
		width: 500,
		height: 150,
		buttons: {
			'Create': function() {
				if($("#editfile_fname").val().trim().length>0){
					if($("#editfile_fname").val() != name){
						createFolder(path+'/'+$("#editfile_fname").val());
					}
					$(this).dialog('close');
				}else{
					$("#editfile_top label").html('please enter a filename');
				}
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
}

function createFolder(path){
	var name=basename(path);
	$.getJSON(t_dn+"_tastydir/do.php?fcheck="+urlencode(path)+"&cb=?", function(data){
		if(data.exists){
			$("#editfile_modal").html('<strong>'+name.escape()+'</strong> already exists.');
			$("#editfile_modal").dialog({
				title: 'File creation - <strong>'+name.escape()+'</strong> already exists',
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Alright': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
		}else{
			mkdir(name,path);
		}
	});
}

function mkdir(name,path){
	$.getJSON(t_dn+"_tastydir/do.php?mkdir="+urlencode(path)+"&cb=?", function(data){
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'Folder Creation Error - '+name.escape(),
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The parent folder of the folder you\'re trying to create isn\'t writable. Please set permissions of at least 755 in order to be able to modify files.');
			}else if(data.status==2){
				$("#editfile_modal").append('<h3 class="no">Error</h3> <p>Sorry, but the following characters can\'t be used in filenames:</p> <pre style="margin-bottom:0;"> '+t_fname_blacklist+'</pre>');
			}else if(data.status==3){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Couldn\'t write to file. This is either a permission problem, or the filename is invalid. Sorry!');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			updateFiles(document.location.hash.substr(1));
		}
	});
}

//				 _      _      _          __ _ _
//			  __| | ___| | ___| |_ ___   / _(_) | ___
//			 / _` |/ _ \ |/ _ \ __/ _ \ | |_| | |/ _ \
//			| (_| |  __/ |  __/ ||  __/ |  _| | |  __/
//			 \__,_|\___|_|\___|\__\___| |_| |_|_|\___|
//

function deleteFile(path){
	if(!loggedin){
		noPerms();
		return 0;
	}
	var name=basename(path);
	$("#editfile_modal").append('Are you sure you want to delete <strong>'+name.escape()+'</strong>?');
	$("#editfile_modal").dialog({
		title: 'File Deletion Confirmation - '+name.escape(),
		modal: true,
		width: 500,
		height: 215,
		buttons: {
			'Delete': function() {
				$(this).dialog('close');
				$.getJSON(t_dn+"_tastydir/do.php?delf="+urlencode(path)+"&cb=?", function(data){
					if(data.status>0){
						$("#editfile_modal").dialog({
							title: 'File Deletion Error - '+name.escape(),
							modal: true,
							width: 500,
							height: 215,
							buttons: {
								'Close': function() {
									$(this).dialog('close');
								}
							},
							close: function(event,ui){
								$(this).empty();
							}
						});
						if(data.status==1){
							$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to delete doesn\'t exist.');
						}else if(data.status==2){
							$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to delete isn\'t writable. Please set permissions of at least 755 in order to be able to modify files.');
						}else if(data.status==3){
							$("#editfile_modal").append('<h3 class="no">Error</h3> For some reason, the file couldn\'t be deleted. This is most likely a permission issue. Sorry!');
						}else if(data.status==100){
							$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
						}else{
							$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
						}
					}else{
						updateFiles(document.location.hash.substr(1));
					}
				});
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
}

//				 _      _      _          __       _     _
//			  __| | ___| | ___| |_ ___   / _| ___ | | __| | ___ _ __
//			 / _` |/ _ \ |/ _ \ __/ _ \ | |_ / _ \| |/ _` |/ _ \ '__|
//			| (_| |  __/ |  __/ ||  __/ |  _| (_) | | (_| |  __/ |
//			 \__,_|\___|_|\___|\__\___| |_|  \___/|_|\__,_|\___|_|
//

function deleteFolder(path){
	var name=basename(path);
	if(!loggedin){
		noPerms();
		return 0;
	}
	$("#editfile_modal").append('Are you REALLY sure you want to delete the folder <strong>'+name.escape()+'</strong> and everything in it?');
	$("#editfile_modal").dialog({
		title: 'Folder Deletion Confirmation - '+name.escape(),
		modal: true,
		width: 500,
		height: 215,
		buttons: {
			'Do it': function() {
				$(this).dialog('close');
				$("#loading_modal").dialog({
					modal:true,
					height:60,
					width:60,
					resizable:false,
					draggable:false
				});
				$.getJSON(t_dn+"_tastydir/do.php?delfld="+urlencode(path)+"&cb=?", function(data){
				$("#loading_modal").dialog('close');
					if(data.status>0){
						$("#editfile_modal").dialog({
							title: 'Folder Deletion Error - '+name.escape(),
							modal: true,
							width: 500,
							height: 215,
							buttons: {
								'Close': function() {
									$(this).dialog('close');
								}
							},
							close: function(event,ui){
								$(this).empty();
							}
						});
						if(data.status==1){
							$("#editfile_modal").append('<h3 class="no">Error</h3> The folder you\'re trying to delete doesn\'t exist.');
						}else if(data.status==2){
							$("#editfile_modal").append('<h3 class="no">Error</h3> The folder you\'re trying to delete isn\'t writable. Please set permissions of at least 755 in order to be able to modify files.');
						}else if(data.status==3){
							$("#editfile_modal").append('<h3 class="no">Error</h3> For some reason, the folder couldn\'t be deleted. This is most likely a permission issue. Sorry!');
						}else if(data.status==100){
							$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
						}else{
							$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
						}
					}else{
						updateFiles(document.location.hash.substr(1));
						$("#editfile_modal").append('Folder succesfully deleted.');
						$("#editfile_modal").dialog({
							title: 'Folder Deletion Completed - '+name.escape(),
							modal: true,
							width: 500,
							height: 215,
							buttons: {
								'Close': function() {
									$(this).dialog('close');
								}
							},
							close: function(event,ui){
								$(this).empty();
							}
						});
					}
				});
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
}

//									  __ _ _
//			  ___ ___  _ __  _   _   / _(_) | ___
//			 / __/ _ \| '_ \| | | | | |_| | |/ _ \
//			| (_| (_) | |_) | |_| | |  _| | |  __/
//			 \___\___/| .__/ \__, | |_| |_|_|\___|
//					  |_|    |___/
//

function copyBar(path){
	if(!loggedin){
		noPerms();
		return 0;
	}
	var name=basename(path);
	mcfile=name;
	mcpath=path;
	$("#copyname").html(name);
	$("#bottombar").show();
}
function copyFileAttempt(path,move){
	mcmove=move;
	if(mcfile!=undefined && mcpath!=undefined){
		$.getJSON(t_dn+"_tastydir/do.php?fcheck="+urlencode(path+'/'+mcfile)+"&cb=?", function(data){
			if(data.exists){
				if(data.type=='dir'){
					$("#editfile_modal").html('<strong>'+mcfile.escape()+'</strong> already exists, and it\'s a folder, so overwriting it is a bad idea. If you\'d like to, you can remove the folder, then try '+(mcmove ? 'mov' : 'copy')+'ing the file again.');
					$("#editfile_modal").dialog({
						title: 'File '+(mcmove ? 'move' : 'copy')+' - <strong>'+mcfile+'</strong> already exists',
						modal: true,
						width: 500,
						height: 215,
						buttons: {
							'Alright': function() {
								$(this).dialog('close');
							}
						},
						close: function(event,ui){
							$(this).empty();
						}
					});
				}else{
					$("#editfile_modal").html('<strong>'+mcfile.escape()+'</strong> already exists. Would you like to overwrite it?');
					$("#editfile_modal").dialog({
						title: 'File '+(mcmove ? 'move' : 'copy')+' - <strong>'+mcfile+'</strong> already exists',
						modal: true,
						width: 500,
						height: 215,
						buttons: {
							'No': function() {
								closeCopyBar();
								$("#editfile_modal").html('File not '+(mcmove ? 'moved' : 'copied')+'.');
								$("#editfile_modal").dialog({
									title: 'Overwrite confirmation',
									modal: true,
									width: 500,
									height: 215,
									buttons: {
										'Close': function(){
											$(this).dialog('close');
										}
									}
								});
							},
							'Yes': function() {
								if (mcmove){
									moveFile(path);
								}else{
									copyFile(path);
								}
								closeCopyBar();
								$(this).dialog('close');
							}
						},
						close: function(event,ui){
							$(this).empty();
						}
					});
				}
			}else{
				if(mcmove){
					moveFile(path);
				}else{
					copyFile(path);
				}
				closeCopyBar();
				updateFiles(document.location.hash.substr(1));
			}
		});
	}
}
function copyFile(path){
	$.getJSON(t_dn+"_tastydir/do.php?copy=copy&from="+urlencode(mcpath)+'&to='+urlencode(path+'/'+mcfile)+"&cb=?", function(data){
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'File Copy Error - '+mcfile,
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to copy doesn\'t exist.');
			}else if(data.status==2){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The destination path isn\'t writable. Please set permissions of at least 755.');
			}else if(data.status==3){
				$("#editfile_modal").append('<h3 class="no">Error</h3> <p>Sorry, but the following characters can\'t be used in filenames:</p> <pre style="margin-bottom:0;"> '+t_fname_blacklist+'</pre>');
			}else if(data.status==4){
				$("#editfile_modal").append('<h3 class="no">Error</h3> For some reason, the file couldn\'t be copied. This is most likely a permission issue. Sorry!');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			updateFiles(document.location.hash.substr(1));
		}
	});
}
function moveFile(path,newname){
	if(!newname){
		fpath=path+'/'+mcfile;
	}else{
		fpath=path;
	}
	$.getJSON(t_dn+"_tastydir/do.php?copy=move&from="+urlencode(mcpath)+'&to='+urlencode(fpath)+"&cb=?", function(data){
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'File Move Error - '+mcfile,
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to move doesn\'t exist.');
			}else if(data.status==2){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to move isn\'t writable. Please set permissions of at least 755.');
			}else if(data.status==3){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The destination path isn\'t writable. Please set permissions of at least 755.');
			}else if(data.status==4){
				$("#editfile_modal").append('<h3 class="no">Error</h3> <p>Sorry, but the following characters can\'t be used in filenames:</p> <pre style="margin-bottom:0;"> '+t_fname_blacklist+'</pre>');
			}else if(data.status==5){
				$("#editfile_modal").append('<h3 class="no">Error</h3> For some reason, the file couldn\'t be move. This is most likely a permission issue. Sorry!');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			updateFiles(document.location.hash.substr(1));
		}
	});
}
function closeCopyBar(){
	$("#bottombar").hide();
}

//				  _                         _
//			  ___| |__  _ __ ___   ___   __| |
//			 / __| '_ \| '_ ` _ \ / _ \ / _` |
//			| (__| | | | | | | | | (_) | (_| |
//			 \___|_| |_|_| |_| |_|\___/ \__,_|
//

function chmod(path, fperms){
	if(!loggedin){
		noPerms();
		return 0;
	}
	var name=basename(path);
	var ur,uw,ux,gr,gw,gx,wr,ww,wx,octal,changed=false,finfo;
	getInfo(path,function(finfo){
		// code in this function is pretty inefficient but I
		// couldn't figure out a much better way in javascript
		function chchange(initial){
			octal=String((ur*4)+(uw*2)+(ux*1))+String((gr*4)+(gw*2)+(gx*1))+String((wr*4)+(ww*2)+(wx*1));
			$("#octal").html(octal);
			if(!initial){
				changed=true;
			}
		}
		ur=(fperms[1]=='r') ? 1 : 0;
		if(ur){ urs=' checked="checked"'; }else{ urs=''; }
		uw=(fperms[2]=='w') ? 1 : 0;
		if(uw){ uws=' checked="checked"'; }else{ uws=''; }
		ux=(fperms[3]=='x') ? 1 : 0;
		if(ux){ uxs=' checked="checked"'; }else{ uxs=''; }
		
		gr=(fperms[4]=='r') ? 1 : 0;
		if(gr){ grs=' checked="checked"'; }else{ grs=''; }
		gw=(fperms[5]=='w') ? 1 : 0;
		if(gw){ gws=' checked="checked"'; }else{ gws=''; }
		gx=(fperms[6]=='x') ? 1 : 0;
		if(gx){ gxs=' checked="checked"'; }else{ gxs=''; }
		
		wr=(fperms[7]=='r') ? 1 : 0;
		if(wr){ wrs=' checked="checked"'; }else{ wrs=''; }
		ww=(fperms[8]=='w') ? 1 : 0;
		if(ww){ wws=' checked="checked"'; }else{ wws=''; }
		wx=(fperms[9]=='x') ? 1 : 0;
		if(wx){ wxs=' checked="checked"'; }else{ wxs=''; }
		$("#editfile_modal").append(
		'<table id="chmodstuff">'+
			'<tr>'+
				'<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'+
				'<td>read</td>'+
				'<td>write</td>'+
				'<td>execute</td>'+
			'</tr>'+
			'<tr>'+
				'<td>user</td>'+
				'<td><input type="checkbox" id="ur"'+urs+'></td>'+
				'<td><input type="checkbox" id="uw"'+uws+'></td>'+
				'<td><input type="checkbox" id="ux"'+uxs+'></td>'+
			'</tr>'+
			'<tr>'+
				'<td>group</td>'+
				'<td><input type="checkbox" id="gr"'+grs+'></td>'+
				'<td><input type="checkbox" id="gw"'+gws+'></td>'+
				'<td><input type="checkbox" id="gx"'+gxs+'></td>'+
			'</tr>'+
			'<tr>'+
				'<td>world</td>'+
				'<td><input type="checkbox" id="wr"'+wrs+'></td>'+
				'<td><input type="checkbox" id="ww"'+wws+'></td>'+
				'<td><input type="checkbox" id="wx"'+wxs+'></td>'+
			'</tr>'+
			'<tr>'+
				'<td>octal</td>'+
				'<td colspan="3"><span id="octal"></span></td>'+
			'</tr>'+
			'<tr>'+
				'<td>owner</td>'+
				'<td colspan="3"><abbr title="id: '+finfo['f']['uid']+'">'+finfo['u']['name']+'</abbr></td>'+
			'</tr>'+
			'<tr>'+
				'<td>&nbsp;</td>'+
				'<td colspan="3"><abbr title="id: '+finfo['f']['gid']+'">'+finfo['g']['name']+'</abbr></td>'+
			'</tr>'+
		'</table>'
		);
		$("#ur").change(function(){ur=toggle(ur);chchange();});
		$("#uw").change(function(){uw=toggle(uw);chchange();});
		$("#ux").change(function(){ux=toggle(ux);chchange();});
		$("#gr").change(function(){gr=toggle(gr);chchange();});
		$("#gw").change(function(){gw=toggle(gw);chchange();});
		$("#gx").change(function(){gx=toggle(gx);chchange();});
		$("#wr").change(function(){wr=toggle(wr);chchange();});
		$("#ww").change(function(){ww=toggle(ww);chchange();});
		$("#wx").change(function(){wx=toggle(wx);chchange();});
		chchange(true);
		$("#editfile_modal").dialog({
			title: 'chmod - '+name.escape(),
			modal: true,
			width: 500,
			height: 300,
			buttons: {
				'chmod': function() {
					$(this).dialog('close');
					if(changed){
						$.getJSON(t_dn+"_tastydir/do.php?chmod="+urlencode(path)+"&to="+octal+"&cb=?", function(data){
							if(data.status>0){
								$("#editfile_modal").dialog({
									title: 'chmod Error - '+name.escape(),
									modal: true,
									width: 500,
									height: 215,
									buttons: {
										'Close': function() {
											$(this).dialog('close');
										}
									},
									close: function(event,ui){
										$(this).empty();
									}
								});
								if(data.status==1){
									$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to chmod doesn\'t exist.');
								}else if(data.status==2){
									$("#editfile_modal").append('<h3 class="no">Error</h3> For some reason, the file couldn\'t be chmodded. This is most likely a permission issue. Sorry!');
								}else if(data.status==100){
									$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
								}else{
									$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
								}
							}else{
								updateFiles(document.location.hash.substr(1));
							}
						});
					}
				},
				'Cancel': function() {
					$(this).dialog('close');
				}
			},
			close: function(event,ui){
				$(this).empty();
			}
		});
	});
}

//						 _                 _    __ _ _
//			 _   _ _ __ | | ___   __ _  __| |  / _(_) | ___
//			| | | | '_ \| |/ _ \ / _` |/ _` | | |_| | |/ _ \
//			| |_| | |_) | | (_) | (_| | (_| | |  _| | |  __/
//			 \__,_| .__/|_|\___/ \__,_|\__,_| |_| |_|_|\___|
//				  |_|
//

function showUploadForm(){
	if(!loggedin){
		noPerms();
		return 0;
	}
	$("#uploadtext").hide();
	$("#uploadform").show();
	$("#uploadform_seriously").append('<input type="hidden" name="dir" value="'+cdir+'">');
}
function startUpload(){
	if($("#upload_finput").val()!=""){
		$("#uploadform_progress").show();
		return true;
	}else{
		return false;
	}
}
function stopUpload(data){
	$("#uploadform_progress").hide();
	$("#uploadform").hide();
	if(data.status==0){
		$("#uploadtext_really").html('File succesfully uploaded');
		$("#uploadtext_really").delay(1000).fadeOut('whatev',function(){
			$(this).html('Upload file');
			$(this).fadeIn('whatev');
		});
	}else if(data.status==1){
		$("#uploadtext_really").html('Waiting for confirmation...');
		if(data.type=='dir'){
			$("#editfile_modal").html('<strong>'+($("#upload_finput").val())+'</strong> already exists, and it\'s a folder, so overwriting it is a bad idea. If you\'d like to, you can remove the folder, then try uploading the file again.');
			$("#editfile_modal").dialog({
				title: 'File upload - <strong>'+($("#upload_finput").val())+'</strong> already exists',
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Alright': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
		}else if(data.type.length>0){
			$("#editfile_modal").html('<strong>'+($("#upload_finput").val())+'</strong> already exists. Would you like to overwrite it?');
			$("#editfile_modal").dialog({
				title: 'File upload - <strong>'+($("#upload_finput").val())+'</strong> already exists',
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'No': function() {
						$("#uploadtext_really").html('<strong>'+($("#upload_finput").val())+'</strong> not uploaded.');
						$("#uploadtext_really").delay(1000).fadeOut('whatev',function(){
							$(this).html('Upload file');
							$(this).fadeIn('whatev');
						});
						$(this).dialog('close');
					},
					'Yes': function() {
						$("#uploadform_seriously").append('<input type="hidden" id="uploadform_force" name="force" value="force">');
						$("#uploadform_seriously").submit();
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
		}
	}else if(data.status==2){
		$("#uploadtext_really").html('<span class="no">There was an error while uploading your file. This is probably a permissions problem. Sorry!</span>');
	}else if(data.status==100){
		$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
	}else if(data.status.length>0){
		$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
	}
	$("#uploadtext").show();
	if($("#uploadform_force").length != 0){
		$("#uploadform_force").remove();
	}
	if(data.status==0){
		updateFiles(document.location.hash.substr(1));
	}
	return true;
}

//			 _ _       _     _   _
//			| (_) __ _| |__ | |_| |__   _____  __
//			| | |/ _` | '_ \| __| '_ \ / _ \ \/ /
//			| | | (_| | | | | |_| |_) | (_) >  <
//			|_|_|\__, |_| |_|\__|_.__/ \___/_/\_\
//				 |___/
//

function lightboxImage(file){
	var newheight, maxwidth, dialogwidth;
	$.getJSON(t_dn+"_tastydir/do.php?getsize="+urlencode(file)+"&cb=?", function(data){
		if(data.status>0){
			$("#editfile_modal").dialog({
				title: 'Image Error - '+basename(file),
				modal: true,
				width: 500,
				height: 215,
				buttons: {
					'Close': function() {
						$(this).dialog('close');
					}
				},
				close: function(event,ui){
					$(this).empty();
				}
			});
			if(data.status==1){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The image you\'re trying to view doesn\'t exist.');
			}else if(data.status==2){
				$("#editfile_modal").append('<h3 class="no">Error</h3> The file you\'re trying to view isn\'t an image, or there was an error determining its size.');
			}else if(data.status==100){
				$("#editfile_modal").append('<h3 class="no">Error</h3> Access denied.');
			}else{
				$("#editfile_modal").append('<h3 class="no">Error</h3> Error code '+data.status+'.');
			}
		}else{
			maxwidth=Number((data.width>=800) ? '800' : data.width);
			dialogwidth=Number((maxwidth<270) ? 300 : maxwidth+30);
			newheight=Math.ceil(Number(data.height/(data.width/maxwidth)));
			tbuttons={};
			if(data.imga.length>0){
				$("#editfile_modal").data('imga',data.imga);
				tbuttons['Next']=function(){
					lightboxImage($("#editfile_modal").data('imga'));
					$("#editfile_modal").dialog("close");
				};
			}
			tbuttons['Download']=function(){
					$(this).dialog('close');
					document.location='_tastydir/do.php?download='+file+'&forcedl';
				};
			tbuttons['Close']=function(){
					$(this).dialog('close');
				};
			if(data.imgb.length>0){
				$("#editfile_modal").data('imgb',data.imgb);
				tbuttons['Previous']=function(){
					lightboxImage($("#editfile_modal").data('imgb'));
					$("#editfile_modal").dialog("close");
				};
			}
			$("#editfile_modal").html('<img src="_tastydir/do.php?download='+file+'" width="'+maxwidth+'">');
			$("#editfile_modal").dialog({
				modal: true,
				title: 'Image Preview - '+basename(file),
				width: dialogwidth,
				height: newheight+120,
				buttons: tbuttons,
				open: function(event,ui){
					//$(this).siblings('.ui-dialog-titlebar').hide();
					//$(this).css('text-align','center');1
				},
				beforeclose: function(event,ui){
					//$(this).siblings('.ui-dialog-titlebar').show();
				},
				close: function(event,ui){
					//$(this).css('text-align','left');
					$(this).empty();
					$(this).dialog('destroy');
				}
			});
		}
	});
}

//				  _
//			  ___| |_ ___
//			 / _ \ __/ __|
//			|  __/ || (__ _
//			 \___|\__\___(_)
//

// if the user isn't logged in, we disallow him from editing and stuff
// YES, I ALSO CHECK FOR THIS SERVERSIDE
function noPerms(){
	$("#editfile_modal").dialog({
		title: 'Permission Error',
		modal: true,
		width: 500,
		height: 215,
		buttons: {
			'Close': function() {
				$(this).dialog('close');
			}
		},
		close: function(event,ui){
			$(this).empty();
		}
	});
	$("#editfile_modal").append('<h3 class="no">Error</h3> You need to log in to modify files.');
}

function unFrontSlash(string){
	while(string[0]=='/' && string[1]=='/'){
		alert(string);
		string=string.substr(1);
	}
	alert(string);
	return string;
}

// tab character stuff

function setSelectionRange(input, selectionStart, selectionEnd) {
 if (input.setSelectionRange) {
   input.focus();
   input.setSelectionRange(selectionStart, selectionEnd);
 }
 else if (input.createTextRange) {
   var range = input.createTextRange();
   range.collapse(true);
   range.moveEnd('character', selectionEnd);
   range.moveStart('character', selectionStart);
   range.select();
 }
}

function replaceSelection (input, replaceString) {
   if (input.setSelectionRange) {
       var selectionStart = input.selectionStart;
       var selectionEnd = input.selectionEnd;
       input.value = input.value.substring(0, selectionStart)+
replaceString + input.value.substring(selectionEnd);

       if (selectionStart != selectionEnd){
           setSelectionRange(input, selectionStart, selectionStart +
   replaceString.length);
       }else{
           setSelectionRange(input, selectionStart +
replaceString.length, selectionStart + replaceString.length);
       }

   }else if (document.selection) {
       var range = document.selection.createRange();

       if (range.parentElement() == input) {
           var isCollapsed = range.text == '';
           range.text = replaceString;

            if (!isCollapsed)  {
               range.moveStart('character', -replaceString.length);
               range.select();
           }
       }
   }
}

function onTextareaKey(item,e){
	if(navigator.userAgent.match("Gecko"))
		c=e.which;
	else
		c=e.keyCode;
	if(c==9){
		replaceSelection(item,String.fromCharCode(9));
		setTimeout("document.getElementById('"+item.id+"').focus();",0);
		return false;
	}
}

function replaceLogin(){
	$("#login").html(
		'<form action="index.php" method="post">'+
		'<labeL>password</label> <input id="loginpw" type="password" name="pw" size="20">'+
		'<input type="hidden" name="action" value="login">'+
		'<input type="submit" value="Go" style="display:none;">'+
		'</form>'
	);
	$("#loginpw").focus();
}

function switchLayout(){
	if($("#everything").hasClass('fluid')){
		$("#everything").animate({width: 960},2000,function(){
			$("#everything").removeClass('fluid').addClass('fixed');
		});
	}else{
		$("#everything").animate({width: '80%'},2000,function(){
			$("#everything").removeClass('fixed').addClass('fluid');
		});
	}
}

//						 _                 _
//			  ___  _ __ | | ___   __ _  __| |
//			 / _ \| '_ \| |/ _ \ / _` |/ _` |
//			| (_) | | | | | (_) | (_| | (_| |
//			 \___/|_| |_|_|\___/ \__,_|\__,_|
//

/* stuff we want to run initially */
$(document).ready(function(){
	getLetters();
	
	/* hashchange stuff for history when you hit back */
	if(document.location.hash.length > 0){
		updateFiles(document.location.hash.substr(1));
	}else{
		updateFiles('');
	}
	$(window).bind("hashchange",function(e){
		updateFiles(document.location.hash.substr(1));
	});
	
	/* tipsy tooltips YEA */
	$(function(){
		$('#topinfo').tipsy({
			delayOut: 250,
			fade: true, 
			gravity: 'ne',
			opacity: 0.8,
			html: true,
			title: function(){
				var rt=
				'<table id="topinfo_table">'+
					'<tr>'+
						'<td><strong>Version</strong><span class="hackyspacer"></span></td>'+
						'<td><abbr title="build '+t_subversion+'">'+t_version+'</abbr></td>'+
					'</tr>'+
					'<tr>'+
						'<td><strong>Running as</strong></td>'+
						'<td>'+t_metainfo.user+'</td>'+
					'</tr>'+
					'<tr>'+
						'<td><strong>Layout</strong></td>'+
						'<td>' + (($("#everything").hasClass('fluid')) ? 'fluid' : 'fixed') + ' - <a href="javascript:;" id="layoutswitch" class="softlink" onclick="t_switchlayout=true;$(\'#topinfo\').tipsy(\'hide\');">switch?</a></td>'+
					'</tr>'+
					'<tr>'+
						'<td><strong>Info</strong></td>'+
						'<td><a href="http://tastydev.net/#tastydir" title="tastydir info" class="softlink">tastydev.net</a></td>'+
					'</tr>'+
					'<tr>'+
						'<td><strong>Copyright</strong></td>'+
						'<td><a href="http://vladh.net/" title="vladh.net" class="softlink">Vlad Harbuz</a></td>'+
					'</tr>'+
				'</table>';
				return rt;
			}
		});
	});
});


























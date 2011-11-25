<?php

// Tastydir is copyright Vlad Harbuz (vladh.net)

define('TASTYDIR_VERSION','1.2');
define('TASTYDIR_SUBVERSION','1252');

error_reporting(E_ALL);

if(!file_exists('_tastydir/settings.php')){
	require_once('_tastydir/install.php');
	die();
}

require_once '_tastydir/common.php';
require_once '_tastydir/settings.php';

//////////////////////////
//	authentication
////////
$auth['loggedin']=false;

if($auth['use']){

	// login action
	if(isset($_POST['action']) && $_POST['action']=='login' && !empty($_POST['pw'])){
		if(sha1($_POST['pw'])==$auth['pass']){
			// set cookie for 24 hours
			setcookie('tastydir_auth',sha1($auth['pass']),time()+86400);
			header('Location: index.php');
		}
	}

	// logout action
	if(isset($_GET['action']) && $_GET['action']=='logout'){
		setcookie('tastydir_auth','',time()-86400);
		header('Location: index.php');
	}

	// check if logged in
	if(!empty($_COOKIE['tastydir_auth']) && $_COOKIE['tastydir_auth']==sha1($auth['pass'])){
		$auth['loggedin']=true;
	}
}else{
	$auth['loggedin']=true;
}

?>
<!doctype html>
<html>
	<head>
		<title>tastydir</title>
		<link rel="stylesheet" href="_tastydir/style.css">
	</head>
	<body>
		<div id="everything" class="fluid">
			<div id="header">
				<h1>tastydir</h1>
			</div>
			<div id="nav" class="rounded_top clearfix">
				<div id="navnav">
					<button class="icon" onClick="history.go(-1);">&laquo;</button>
					<button class="icon" onClick="updateFiles(document.location.hash.substr(1));"><img src="_tastydir/images/arrow_refresh.png" alt="Refresh" title="Refresh"></button>
					<button onclick="document.location='#';">Home</button>
					<?php if($win){ ?>
					<div id="letters">
						<button class="icon">
							<img src="_tastydir/images/loading.gif">
						</button>
					</div>
					<?php } ?>
				</div>
				<?php if($auth['use']){ ?>
				<div id="meta">
					<div class="item"><a rel="tipsy" id="topinfo"><img src="_tastydir/images/information.png" alt="Info"></a></div>
					<div class="sep"></div>
					<?php
					if($auth['loggedin']){ ?>
						<div class="item" id="login"><a href="index.php?action=logout">Log out <img src="_tastydir/images/door_out.png" title="Log out" alt="Log out"></a></div>
					<?php }else{ ?>
						<div class="item" id="login"><a href="javascript:;" onClick="replaceLogin();">Log in <img src="_tastydir/images/user_go.png" title="Log in" alt="Log in"></a></div>
					<?php } ?>
				</div>
				<?php } ?>
			</div>
			<div id="path" class="clearfix">
				
			</div>
			<div id="body">
				<div id="files_outer">
					<table id="files_table">
						<thead id="files_head">
							<tr>
								<th style="width:55%;">Name</th>
								<th style="width:15%;">Size</th>
								<th style="width:15%;">Permissions</th>
								<th style="width:15%;">Actions</th>
							</tr>
						</thead>
						<tbody id="files">
						</tbody>
					</table>
				</div>
				<div class="modal" id="loading_modal">
					<img src="_tastydir/images/loading.gif">
				</div>
				<div class="modal" id="editfile_modal">
				</div>
			</div>
			<div id="bottombar" class="clearfix">
				<div id="bottombar_l">Navigate to the folder you want to copy or move <span id="copyname"></span> to, then use the buttons on the right.</div>
				<div id="bottombar_r">
					<a href="javascript:;" onClick="closeCopyBar();">Cancel <img src="_tastydir/images/cancel.png" alt="Cancel" title="Cancel"></a>
					<span style="padding:0 10px;">&nbsp;</span> <!-- ok so this is hacky -->
					<a href="javascript:;" onClick="copyFileAttempt(cdir,false);">Copy here <img src="_tastydir/images/folder_go.png" alt="Cancel" title="Cancel"></a>
					<span style="padding:0 10px;">&nbsp;</span> <!-- ok so this is hacky -->
					<a href="javascript:;" onClick="copyFileAttempt(cdir,true);">Move here <img src="_tastydir/images/folder_go.png" alt="Cancel" title="Cancel"></a>
				</div>
			</div>
			<div id="footer" class="rounded_bottom clearfix">
				<div id="makefiles">
					<div class="makefile"><a href="javascript:;" onClick="createFileDialog(cdir);">Create file <img src="_tastydir/images/page_white_add.png" alt="Create file" title="Create file"></a></div>
					<div class="sep"></div>
					<div class="makefile"><a href="javascript:;" onClick="createFolderDialog(cdir);">Create folder <img src="_tastydir/images/folder_add.png" alt="Create folder" title="Create folder"></a></div>
				</div>
				<div id="uploadfile">
					<div id="uploadform">
						<div id="uploadform_progress"><img src="_tastydir/images/loading.gif"></div>
						<div id="uploadform_really">
							<form enctype="multipart/form-data" action="_tastydir/do.php" method="POST" onsubmit="return startUpload();" target="hacky_iframe" id="uploadform_seriously">
								<input name="file" type="file" id="upload_finput">
								<input type="submit" value="Upload">
							</form>
						</div>
						<iframe id="hacky_iframe" name="hacky_iframe" src="#"></iframe> 
					</div>
					<div id="uploadtext">
						<a href="javascript:;" onClick="showUploadForm();"><span id="uploadtext_really">Upload file</span> <img src="_tastydir/images/page_white_get.png" alt="Upload file" title="Upload file"></a>
					</div>
				</div>
			</div>
		</div>
		<script>
			var t_dn='<?php echo $t_dn; ?>';
			var loggedin=<?php echo $auth['loggedin'] ? 'true' : 'false'; ?>;
			var t_version='<?php echo TASTYDIR_VERSION; ?>';
			var t_subversion=<?php echo TASTYDIR_SUBVERSION; ?>;
			var t_fname_blacklist='<?php foreach($fname_blacklist as $key=>$ff){ if($key!=(count($fname_blacklist)-1)){ if($key!=0){echo ' ';} echo str_replace('\\','\\\\',$ff); } } ?>';
			var t_metainfo = {
				user: '<?php echo $t_curruser; ?>'
			};
			var t_switchlayout=false;
			var t_path='<?php echo $path; ?>';
		</script>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
		<script src="_tastydir/js/jquery.ba-hashchange.min.js"></script>
		<script src="_tastydir/js/jquery.tipsy.js"></script>
		<script src="_tastydir/js/site.js"></script>
	</body>
</html>























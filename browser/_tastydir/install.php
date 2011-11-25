<?php

if(!defined('TASTYDIR_VERSION')){
	echo 'No direct access allowed.';
	die();
}

$status=0;
if(isset($_POST['run']) && $_POST['run']=='yes'){	
	if($_POST['auth']=='yes' && empty($_POST['pass'])){
		$status=-1;
	}else{
		$config='';
		$config.=	'<?php'."\r\n";
		$config.=	''."\r\n";
		$config.=	'//////////////////////////'."\r\n";
		$config.=	'//	authentication settings'."\r\n";
		$config.=	'////////'."\r\n";
		$config.=	''."\r\n";
		$config.=	'//	turn authentication on?'."\r\n";
		$config.=	'//	if so, you can view and download files above this directory without logging in and do everything else while logged in'."\r\n";
		$config.=	'//	if not, everyone with access to the script will be able to modify all your files!'."\r\n";
		if($_POST['auth']=='yes'){
			$config.=	'$auth["use"]=true;'."\r\n";
		}else{
			$config.=	'$auth["use"]=false;'."\r\n";
		}
		$config.=	''."\r\n";
		$config.=	'//	a sha1 hash of your password'."\r\n";
		$config.=	'//	hashing prevents people from reading your password in case they gain access to your hosting account'."\r\n";
		if($_POST['auth']=='yes'){
			$config.=	'$auth["pass"]="'.sha1($_POST['pass']).'";'."\r\n";
		}else{
			$config.=	'$auth["pass"]="";'."\r\n";
		}
		$f=@fopen('_tastydir/settings.php','wb');
		if(@fwrite($f,$config) && $f){
			$status=1;
		}else{
			$status=-2;
		}
	}
}

?>
<!doctype html>
<html>
	<head>
		<title>tastydir installation</title>
		<link rel="stylesheet" href="_tastydir/style.css">
		<style>
			#auth_opt, #finish{
				display:none;
			}
			#auth_opt label{
				margin-left:10px;
				color:#666;
			}
		</style>
	</head>
	<body>
		<div id="everything" class="fluid">
			<div id="header">
				<h1>tastydir</h1>
			</div>
			<div id="nav" class="rounded_top">
				Welcome! Get ready to install <strong>tastydir</strong>.
			</div>
			<div id="body" class="rounded_bottom">
				<?php if($status==-1){ ?>
				<fieldset>
					<legend>Error</legend>
					Sorry, but you provided an empty password. Please type one below.
					<script>authval(true);hide('finish');show('auth_opt');</script>
				</fieldset>
				<?php }else if($status==-2){ ?>
				<fieldset>
					<legend>Error</legend>
					Sorry, but the config file at _tastydir/settings.php couldn't be written. Please make sure you set permissions of at least 755 on the _tastydir directory (or, if that doesn't work, 777).
				</fieldset>
				<?php }else if($status==1){ ?>
				<fieldset>
					<legend>Installation done!</legend>
					<p>
						For security reasons, please delete _tastydir/install.php.
					</p>
					<p class="clearfix">
						<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false" onClick="document.location='index.php';"><span class="ui-button-text">Tastydir time!</span></button>
					</p>
				</fieldset>
				<?php } 
				if($status!=1){
				?>
					<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" id="installform">
						<input type="hidden" name="run" value="yes">
						<fieldset id="auth">
							<legend>Authentication</legend>
							
							<p>If you enable authentication, <strong>tastydir</strong> will work like this:</p>
							<ul>
								<li>you set a password below.</li>
								<li>when you aren't logged in, you can only see and download files below the folder that tastydir is intalled in (no editing!). this is useful for public file listings.</li>
								<li>if you're logged in, you gain access to all of the features. <strong>don't share your password!</strong></li>
							</ul>
							<p>Would you like to enable authentication?</p>
							<p class="clearfix">
								<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false" style="margin-right:10px;" onClick="authval(true);hide('finish');show('auth_opt');">
									<span class="ui-button-text">Sure!</span>
								</button>
								<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false" onClick="authval(false);hide('auth_opt');show('finish');">
									<span class="ui-button-text">No thanks.</span>
									</button>
							</p>
								
							<div id="auth_opt">
								<input type="hidden" name="auth" value="yes" id="auth_input">
								<p>Alright! What would you like your password to be?</p>
								<p>
									<input type="password" name="pass" size="20" id="pass"><label>password</label>
								</p>
								
								<p class="clearfix">
									<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false" onClick="show('finish');">
										<span class="ui-button-text">Submit</span>
									</button>
								</p>
							</div>
						</fieldset>
						<fieldset id="finish">
							<legend>Finish</legend>
							<p>
							You're all set! Click the button below to finish your installation.<br>
							<span style="color:#666;"><strong>Note:</strong> the _tastydir/install.php file will be deleted for security reasons. If you want to run this installer again, please reupload it.
							</p>
							<p class="clearfix">
								<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false" onClick="$('#installform').submit();"><span class="ui-button-text">Install</span></button>
							</p>
						</fieldset>
					</form>
				<?php } ?>
			</div>
		</div>
		<script>
			function show(id){
				$("#"+id).show();
				if(id=='auth_opt'){
					$("#pass").focus();
				}
			}
			function hide(id){
				$("#"+id).hide();
			}
			function authval(umm){
				if(umm){
					$("#auth_input").val('yes');
				}else{
					$("#auth_input").val('no');
				}
			}
		</script>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
	</body>
</html>
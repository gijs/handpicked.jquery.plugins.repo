$(document).ready(function () {
    $('a').click(
    function(){
    if($(this).attr('target') !== '_blank'){

    $('#receiver').attr('src',$(this).attr('href'))
    
    if ($.browser.webkit) {
// I Fucking hate chrome
// http://www.google.com/support/forum/p/Chrome/thread?tid=2c81c3e3fd99b388&hl=en
// http://www.google.com/chrome/intl/en/webmasters-faq.html#charencoding
$('#receiver').load(function() {
$('#receiver').css('width','0px');
$('#receiver').css('width',$(window).width() - 400);
});
  }

    
    return false;
  
    }
    }
    )
    
$('#container').css('height',$(window).height());

$(window).resize(function() {

$('#container').css('height',$(window).height());
	
});

$('#receiver').css('width',$(window).width() - 400);

$(window).resize(function() {

$('#receiver').css('width',$(window).width() - 400);
	
});

 $('li.twitter').click(function(e){


        var hash = window.location.hash;
        var page = hash.substr(1).replace(/-/g,' ');
        var text = 'jQuery Plugins Repo.';
        var url = 'http://twitter.com/intent/tweet?text='+text+'&url=http://repo.eire-media.com/';
        window.open(url,'twitter-window','height=300,width=450');

    });

    $('li.facebook').bind('click', function(e) {
        var hash = window.location.hash;
        var url = 'http://repo.eire-media.com/';
		var imgPath = 'http://davidhiggins.me/emblem.png';
		var summary = 'jQuery Plugins Repo. ';
		var url = 'http://www.facebook.com/sharer.php?s=100&p[title]=jQuery Plugins Repo. .&p[url]='+url+'&p[images][0]='+imgPath+'&p[summary]='+summary;
		window.open(url,'facebook-window','height=300,width=550');


    });


	$('#socialSharing .google').hover(function(){
    	$(this).animate({
    		width: "75px"
    		}, 200);
	}, function() {
    	$(this).animate({
    		width: "5px"
    		}, 200);
	});

	$('#socialSharing .twitter').hover(function(){
    	$(this).animate({
    		width: "85px"
    		}, 200);
	}, function() {
    	$(this).animate({
    		width: "5px"
    		}, 200);
	});

	$('#socialSharing .facebook').hover(function(){
    	$(this).animate({
    		width: "95px"
    		}, 200);
	}, function() {
    	$(this).animate({
    		width: "5px"
    		}, 200);
	});


 var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = '//apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	
	var id_patt = new RegExp ( "registrant_id=([0-9]+)" );
	var page_id_matches = window.location.href.match( id_patt );
	if ( page_id_matches != null ) { 
		email_user_id = page_id_matches[1] ? page_id_matches[1] : false;
	}
	id_patt = new RegExp ( "email=([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+)" );
	page_id_matches = window.location.href.match( id_patt );
	if ( page_id_matches != null ) { 
		email_user_email = page_id_matches[1] ? page_id_matches[1] : false;
	}
	id_patt = new RegExp("lb_unreg");
	page_id_matches = window.location.href.match(id_patt);
	if (page_id_matches != null)
	{
		lb_reg_param = "lb&";
	}


    
});

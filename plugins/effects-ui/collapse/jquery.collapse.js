/*!
 * Collapse plugin for jQuery
 * http://github.com/danielstocks/jQuery-Collapse/
 *
 * @author Daniel Stocks (http://webcloud.se)
 * @version 0.9.1
 * @updated 17-AUG-2010
 * 
 * Copyright 2010, Daniel Stocks
 * Released under the MIT, BSD, and GPL Licenses.
 */
(function($){var cookieCounter=0;$.fn.extend({collapse:function(options){var defaults={head:"h3",group:"div, ul",cookieName:"collapse",show:function(){this.show()},hide:function(){this.hide()}};var op=$.extend(defaults,options);var active="active",inactive="inactive";return this.each(function(){cookieCounter++;var obj=$(this),sections=obj.find(op.head).wrapInner('<a href="#"></a>'),l=sections.length,cookie=op.cookieName+"_"+cookieCounter;var panel=obj.find(op.head).map(function(){var head=$(this);if(!head.hasClass(active)){return head.next(op.group).hide()[0]}return head.next(op.group)[0]});obj.bind("show",function(e,bypass){var obj=$(e.target);obj.attr("aria-hidden",false).prev().removeClass(inactive).addClass(active);if(bypass){obj.show()}else{op.show.call(obj)}});obj.bind("hide",function(e,bypass){var obj=$(e.target);obj.attr("aria-hidden",true).prev().removeClass(active).addClass(inactive);if(bypass){obj.hide()}else{op.hide.call(obj)}});if(cookieSupport){for(var c=0;c<=l;c++){var val=$.cookie(cookie+c);if(val==c+"open"){panel.eq(c).trigger("show",[true])}else{if(val==c+"closed"){panel.eq(c).trigger("hide",[true])}}}}obj.bind("click",function(e){var t=$(e.target);if(!t.is(op.head)){if(t.parent().is(op.head)){t=t.parent()}else{return}e.preventDefault()}var num=sections.index(t),cookieName=cookie+num,cookieVal=num,content=t.next(op.group);if(t.hasClass(active)){content.trigger("hide");cookieVal+="closed";if(cookieSupport){$.cookie(cookieName,cookieVal,{path:"/",expires:10})}return}content.trigger("show");cookieVal+="open";if(cookieSupport){$.cookie(cookieName,cookieVal,{path:"/",expires:10})}})})}});var cookieSupport=(function(){try{$.cookie("x","x",{path:"/",expires:10});$.cookie("x",null)}catch(e){return false}return true})()})(jQuery);
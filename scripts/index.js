(function(){var _ShortUniqueId=function _ShortUniqueId(options){var self=this;this.DEFAULT_RANDOM_ID_LEN=6;this.DICT_RANGES={digits:[48,58],lowerCase:[97,123],upperCase:[65,91]};this.dict=[];this.log=function log(){var args=[],len=arguments.length;while(len--)args[len]=arguments[len];args[0]="[short-unique-id] "+args[0];if(this.debug===true){if(typeof console!=="undefined"&&console!==null){return console.log.apply(console,args)}}return undefined};this.getDict=function getDict(){return this.dict};this.sequentialUUID=function sequentialUUID(){var counterDiv;var counterRem;var id;id="";counterDiv=this.counter;while(true){counterRem=counterDiv%self.dictLength;counterDiv=parseInt(counterDiv/self.dictLength,10);id+=self.dict[counterRem];if(counterDiv===0){break}}this.counter+=1;return id};this.randomUUID=function randomUUID(uuidLength){var id;var randomPartIdx;var _j;if(uuidLength===null||typeof uuidLength==="undefined"){uuidLength=this.DEFAULT_RANDOM_ID_LEN}if(uuidLength===null||typeof uuidLength==="undefined"||uuidLength<1){throw new Error("Invalid UUID Length Provided")}var idIndex;id="";for(idIndex=_j=0;0<=uuidLength?_j<uuidLength:_j>uuidLength;idIndex=0<=uuidLength?++_j:--_j){randomPartIdx=parseInt(Math.random()*self.dictLength)%self.dictLength;id+=self.dict[randomPartIdx]}return id};this.dictIndex=this._i=0;var rangeType;for(rangeType in self.DICT_RANGES){self.dictRange=self.DICT_RANGES[rangeType];self.lowerBound=self.dictRange[0],self.upperBound=self.dictRange[1];for(this.dictIndex=this._i=this.lowerBound;this.lowerBound<=this.upperBound?this._i<this.upperBound:this._i>this.upperBound;this.dictIndex=this.lowerBound<=this.upperBound?++this._i:--this._i){self.dict.push(String.fromCharCode(self.dictIndex))}}this.dict=this.dict.sort(function(){return Math.random()<=.5});this.dictLength=this.dict.length;if(options===null||typeof options==="undefined"){options={}}this.counter=0;this.debug=options.debug;this.log("Generator created with Dictionary Size "+this.dictLength)};if(typeof module!=="undefined"&&typeof module.exports!=="undefined"){module.exports=_ShortUniqueId}else if(typeof define==="function"&&define.amd){define([],function(){return _ShortUniqueId})}else{window.ShortUniqueId=_ShortUniqueId}})();
(function(){var _ShortUniqueId=function _ShortUniqueId(options){var self=this;this.DEFAULT_RANDOM_ID_LEN=6;this.DICT_RANGES={digits:[48,58],lowerCase:[97,123],upperCase:[65,91]};this.dict=[];this.log=function log(){var args=[],len=arguments.length;while(len--)args[len]=arguments[len];args[0]="[short-unique-id] "+args[0];if(this.debug===true){if(typeof console!=="undefined"&&console!==null){return console.log.apply(console,args)}}return undefined};this.getDict=function getDict(){return this.dict};this.sequentialUUID=function sequentialUUID(){var counterDiv;var counterRem;var id;id="";counterDiv=this.counter;while(true){counterRem=counterDiv%self.dictLength;counterDiv=parseInt(counterDiv/self.dictLength,10);id+=self.dict[counterRem];if(counterDiv===0){break}}this.counter+=1;return id};this.randomUUID=function randomUUID(uuidLength){var id;var randomPartIdx;var _j;if(uuidLength===null||typeof uuidLength==="undefined"){uuidLength=this.DEFAULT_RANDOM_ID_LEN}if(uuidLength===null||typeof uuidLength==="undefined"||uuidLength<1){throw new Error("Invalid UUID Length Provided")}var idIndex;id="";for(idIndex=_j=0;0<=uuidLength?_j<uuidLength:_j>uuidLength;idIndex=0<=uuidLength?++_j:--_j){randomPartIdx=parseInt(Math.random()*self.dictLength)%self.dictLength;id+=self.dict[randomPartIdx]}return id};this.dictIndex=this._i=0;var rangeType;for(rangeType in self.DICT_RANGES){self.dictRange=self.DICT_RANGES[rangeType];self.lowerBound=self.dictRange[0],self.upperBound=self.dictRange[1];for(this.dictIndex=this._i=this.lowerBound;this.lowerBound<=this.upperBound?this._i<this.upperBound:this._i>this.upperBound;this.dictIndex=this.lowerBound<=this.upperBound?++this._i:--this._i){self.dict.push(String.fromCharCode(self.dictIndex))}}this.dict=this.dict.sort(function(){return Math.random()<=.5});this.dictLength=this.dict.length;if(options===null||typeof options==="undefined"){options={}}this.counter=0;this.debug=options.debug;this.log("Generator created with Dictionary Size "+this.dictLength)};if(typeof module!=="undefined"&&typeof module.exports!=="undefined"){module.exports=_ShortUniqueId}else if(typeof define==="function"&&define.amd){define([],function(){return _ShortUniqueId})}else{window.ShortUniqueId=_ShortUniqueId}})();
(function($){$.fn.scrollbox=function(config){var defConfig={linear:false,startDelay:2,delay:3,step:5,speed:32,switchItems:1,direction:"vertical",distance:"auto",autoPlay:true,onMouseOverPause:true,paused:false,queue:null,listElement:"ul",listItemElement:"li",infiniteLoop:true,switchAmount:0,afterForward:null,afterBackward:null,triggerStackable:false};config=$.extend(defConfig,config);config.scrollOffset=config.direction==="vertical"?"scrollTop":"scrollLeft";if(config.queue){config.queue=$("#"+config.queue)}return this.each(function(){var container=$(this),containerUL,scrollingId=null,nextScrollId=null,paused=false,releaseStack,backward,forward,resetClock,scrollForward,scrollBackward,forwardHover,pauseHover,switchCount=0,stackedTriggerIndex=0;if(config.onMouseOverPause){container.bind("mouseover",function(){paused=true});container.bind("mouseout",function(){paused=false})}containerUL=container.children(config.listElement+":first-child");if(config.infiniteLoop===false&&config.switchAmount===0){config.switchAmount=containerUL.children().length}scrollForward=function(){if(paused){return}var curLi,i,newScrollOffset,scrollDistance,theStep;curLi=containerUL.children(config.listItemElement+":first-child");scrollDistance=config.distance!=="auto"?config.distance:config.direction==="vertical"?curLi.outerHeight(true):curLi.outerWidth(true);if(!config.linear){theStep=Math.max(3,parseInt((scrollDistance-container[0][config.scrollOffset])*.3,10));newScrollOffset=Math.min(container[0][config.scrollOffset]+theStep,scrollDistance)}else{newScrollOffset=Math.min(container[0][config.scrollOffset]+config.step,scrollDistance)}container[0][config.scrollOffset]=newScrollOffset;if(newScrollOffset>=scrollDistance){for(i=0;i<config.switchItems;i++){if(config.queue&&config.queue.find(config.listItemElement).length>0){containerUL.append(config.queue.find(config.listItemElement)[0]);containerUL.children(config.listItemElement+":first-child").remove()}else{containerUL.append(containerUL.children(config.listItemElement+":first-child"))}++switchCount}container[0][config.scrollOffset]=0;clearInterval(scrollingId);scrollingId=null;if($.isFunction(config.afterForward)){config.afterForward.call(container,{switchCount:switchCount,currentFirstChild:containerUL.children(config.listItemElement+":first-child")})}if(config.triggerStackable&&stackedTriggerIndex!==0){releaseStack();return}if(config.infiniteLoop===false&&switchCount>=config.switchAmount){return}if(config.autoPlay){nextScrollId=setTimeout(forward,config.delay*1e3)}}};scrollBackward=function(){if(paused){return}var curLi,i,newScrollOffset,scrollDistance,theStep;if(container[0][config.scrollOffset]===0){for(i=0;i<config.switchItems;i++){containerUL.children(config.listItemElement+":last-child").insertBefore(containerUL.children(config.listItemElement+":first-child"))}curLi=containerUL.children(config.listItemElement+":first-child");scrollDistance=config.distance!=="auto"?config.distance:config.direction==="vertical"?curLi.height():curLi.width();container[0][config.scrollOffset]=scrollDistance}if(!config.linear){theStep=Math.max(3,parseInt(container[0][config.scrollOffset]*.3,10));newScrollOffset=Math.max(container[0][config.scrollOffset]-theStep,0)}else{newScrollOffset=Math.max(container[0][config.scrollOffset]-config.step,0)}container[0][config.scrollOffset]=newScrollOffset;if(newScrollOffset===0){--switchCount;clearInterval(scrollingId);scrollingId=null;if($.isFunction(config.afterBackward)){config.afterBackward.call(container,{switchCount:switchCount,currentFirstChild:containerUL.children(config.listItemElement+":first-child")})}if(config.triggerStackable&&stackedTriggerIndex!==0){releaseStack();return}if(config.autoPlay){nextScrollId=setTimeout(forward,config.delay*1e3)}}};releaseStack=function(){if(stackedTriggerIndex===0){return}if(stackedTriggerIndex>0){stackedTriggerIndex--;nextScrollId=setTimeout(forward,0)}else{stackedTriggerIndex++;nextScrollId=setTimeout(backward,0)}};forward=function(){clearInterval(scrollingId);scrollingId=setInterval(scrollForward,config.speed)};backward=function(){clearInterval(scrollingId);scrollingId=setInterval(scrollBackward,config.speed)};forwardHover=function(){config.autoPlay=true;paused=false;clearInterval(scrollingId);scrollingId=setInterval(scrollForward,config.speed)};pauseHover=function(){paused=true};resetClock=function(delay){config.delay=delay||config.delay;clearTimeout(nextScrollId);if(config.autoPlay){nextScrollId=setTimeout(forward,config.delay*1e3)}};if(config.autoPlay){nextScrollId=setTimeout(forward,config.startDelay*1e3)}container.bind("resetClock",function(delay){resetClock(delay)});container.bind("forward",function(){if(config.triggerStackable){if(scrollingId!==null){stackedTriggerIndex++}else{forward()}}else{clearTimeout(nextScrollId);forward()}});container.bind("backward",function(){if(config.triggerStackable){if(scrollingId!==null){stackedTriggerIndex--}else{backward()}}else{clearTimeout(nextScrollId);backward()}});container.bind("pauseHover",function(){pauseHover()});container.bind("forwardHover",function(){forwardHover()});container.bind("speedUp",function(event,speed){if(speed==="undefined"){speed=Math.max(1,parseInt(config.speed/2,10))}config.speed=speed});container.bind("speedDown",function(event,speed){if(speed==="undefined"){speed=config.speed*2}config.speed=speed});container.bind("updateConfig",function(event,options){config=$.extend(config,options)})})}})(jQuery);

var eventData = [];

$('#clock').fitText(1.3);

function updateClock() {
  $('#clock').html(moment().format('D. MMMM YYYY H:mm:ss'));
}

var currentImgIndex = 0;

function updateSliders() {
	var availableHeight = $(".row > :first-child .panel-content-wrapper").outerHeight() - $(".row > :first-child .list-group-item:nth-child(1)").outerHeight() - $(".row > :first-child .list-group-item:nth-child(2)").outerHeight();
	console.log(availableHeight);
	var imgSrc = Settings.get().sliderImgs[currentImgIndex].url;
	currentImgIndex++;
	if (currentImgIndex > Settings.get().sliderImgs.length - 1) {
		currentImgIndex = 0;
	}
	if (availableHeight > 0) {
		$("#image-display").height(availableHeight);
		$("#image-display .next-img").css("background-image", "url('" + imgSrc + "')");
		$(".slide-img").toggleClass("current-img");
		$(".slide-img").toggleClass("next-img");
	}
	$('#scroller').slick('next');
}

function renderMessages() {
	$("#scroller").html("");
	for (i = 0; i < Settings.get().messages.length; i++) {
		$("#scroller").append('<div class="scroll-content">' + Settings.get().messages[i] + '</div>');
	}
}

function loadSettings() {
	if (Settings.get().zoom) {
		$(".schedule").css("zoom", Settings.get().zoom);
	}
}

setInterval(updateClock, 1000);

loadSettings();

renderMessages();

function updateSchedule() {
	var firstEvent = $(".table tr:first");
	firstEvent.fadeOut(500, function(){
		firstEvent.removeClass("success");
		firstEvent.parent().append(firstEvent);
		firstEvent.show();
		setTimeout(function(){
			$(".table tr").not(".success").first().addClass("success");
		}, 5000+(Math.random()-0.5)*4000);
	});

	console.log(Settings.get());

	console.log(Events.get());

	var tweetReady = function(tweetstring){
		console.log(tweetstring);
		var outputContainer = $('<div class="tweets-container"/>');
		var outputSelector = "#announcements-container";
		for (var i = 0; i < tweetstring.length; i++) {
			var output = $('<div/>');
			output.append('<div class="msg-container panel panel-primary"></div>');
			var tweet = $('<div/>').html(tweetstring[i]).contents();
			tweet.find(".twitter_reply_icon").html('<i class="fa fa-comment" aria-hidden="true"></i>');
			tweet.find(".twitter_fav_icon").html('<i class="fa fa-heart" aria-hidden="true"></i>');
			tweet.find(".twitter_retweet_icon").html('<i class="fa fa-retweet" aria-hidden="true"></i>');
			tweet.parent().find(".timePosted").contents().appendTo(tweet.parent().find(".user > div"));
			tweet.find("[data-scribe='element:screen_name']").hide();
			output.find(".msg-container").append(tweet.parent().find(".user, .tweet, .interact"));
			output.find(".interact").before(tweet.parent().find(".media"));
			output.find(".user").addClass("panel-heading");
			output.find(".tweet").addClass("panel-body");
			output.find(".interact").hide();
			outputContainer.append(output);
		}
		$(outputSelector).html(outputContainer);
	};

	var configProfile = {
		"profile": {"screenName": 'LiveFuzz'},
		"domId": 'announcements-container',
		"maxTweets": 5,
		"enableLinks": true,
		"customCallback": tweetReady,
		"showUser": true,
		"showTime": true,
		"showImages": true,
		"dateFunction": function(date){
			console.log(date);
			console.log(date.getTime());
			console.log(Date.now());
			return moment.duration(date.getTime() - Date.now(), "milliseconds").humanize(true);
		},
		"lang": 'en'
	};
	
	twitterFetcher.fetch(configProfile);
}

$('#scroller').slick({
  vertical: true,
  autoplay: false,
  speed: 500,
  arrows: false
});

updateSliders();

setInterval(updateSchedule, 10000);

setInterval(updateSliders, Settings.get().sliderInterval);

/*********************************************************************
*  #### Twitter Post Fetcher v18.0.2 ####
*  Coded by Jason Mayes 2015. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here:
*  http://www.jasonmayes.com/projects/twitterApi/
*  Github: https://github.com/jasonmayes/Twitter-Post-Fetcher
*  Updates will be posted to this site.
*********************************************************************/
(function(root,factory){if(typeof define==='function'&&define.amd){define([],factory);}else if(typeof exports==='object'){module.exports=factory();}else{factory();}}(this,function(){var domNode='';var maxTweets=20;var parseLinks=true;var queue=[];var inProgress=false;var printTime=true;var printUser=true;var formatterFunction=null;var supportsClassName=true;var showRts=true;var customCallbackFunction=null;var showInteractionLinks=true;var showImages=false;var useEmoji=false;var targetBlank=true;var lang='en';var permalinks=true;var dataOnly=false;var script=null;var scriptAdded=false;function handleTweets(tweets){if(customCallbackFunction===null){var x=tweets.length;var n=0;var element=document.getElementById(domNode);var html='<ul>';while(n<x){html+='<li>'+tweets[n]+'</li>';n++;}
html+='</ul>';element.innerHTML=html;}else{customCallbackFunction(tweets);}}
function strip(data){return data.replace(/<b[^>]*>(.*?)<\/b>/gi,function(a,s){return s;}).replace(/class="(?!(tco-hidden|tco-display|tco-ellipsis))+.*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,'');}
function targetLinksToNewWindow(el){var links=el.getElementsByTagName('a');for(var i=links.length-1;i>=0;i--){links[i].setAttribute('target','_blank');links[i].setAttribute('rel','noopener');}}
function getElementsByClassName(node,classname){var a=[];var regex=new RegExp('(^| )'+classname+'( |$)');var elems=node.getElementsByTagName('*');for(var i=0,j=elems.length;i<j;i++){if(regex.test(elems[i].className)){a.push(elems[i]);}}
return a;}
function extractImageUrl(image_data){if(image_data!==undefined&&image_data.innerHTML.indexOf('data-image')>=0){var data_src=image_data.innerHTML.match(/data-image=\"([A-z0-9]+:\/\/[A-z0-9]+\.[A-z0-9]+\.[A-z0-9]+\/[A-z0-9]+\/[A-z0-9\-]+)/i)[1];return decodeURIComponent(data_src)+'.jpg';}}
var twitterFetcher={fetch:function(config){if(config.maxTweets===undefined){config.maxTweets=20;}
if(config.enableLinks===undefined){config.enableLinks=true;}
if(config.showUser===undefined){config.showUser=true;}
if(config.showTime===undefined){config.showTime=true;}
if(config.dateFunction===undefined){config.dateFunction='default';}
if(config.showRetweet===undefined){config.showRetweet=true;}
if(config.customCallback===undefined){config.customCallback=null;}
if(config.showInteraction===undefined){config.showInteraction=true;}
if(config.showImages===undefined){config.showImages=false;}
if(config.useEmoji===undefined){config.useEmoji=false;}
if(config.linksInNewWindow===undefined){config.linksInNewWindow=true;}
if(config.showPermalinks===undefined){config.showPermalinks=true;}
if(config.dataOnly===undefined){config.dataOnly=false;}
if(inProgress){queue.push(config);}else{inProgress=true;domNode=config.domId;maxTweets=config.maxTweets;parseLinks=config.enableLinks;printUser=config.showUser;printTime=config.showTime;showRts=config.showRetweet;formatterFunction=config.dateFunction;customCallbackFunction=config.customCallback;showInteractionLinks=config.showInteraction;showImages=config.showImages;useEmoji=config.useEmoji;targetBlank=config.linksInNewWindow;permalinks=config.showPermalinks;dataOnly=config.dataOnly;var head=document.getElementsByTagName('head')[0];if(script!==null){head.removeChild(script);}
script=document.createElement('script');script.type='text/javascript';if(config.list!==undefined){script.src='https://syndication.twitter.com/timeline/list?'+'callback=__twttrf.callback&dnt=false&list_slug='+
config.list.listSlug+'&screen_name='+config.list.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else if(config.profile!==undefined){script.src='https://syndication.twitter.com/timeline/profile?'+'callback=__twttrf.callback&dnt=false'+'&screen_name='+config.profile.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else if(config.likes!==undefined){script.src='https://syndication.twitter.com/timeline/likes?'+'callback=__twttrf.callback&dnt=false'+'&screen_name='+config.likes.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random();}else{script.src='https://cdn.syndication.twimg.com/widgets/timelines/'+
config.id+'?&lang='+(config.lang||lang)+'&callback=__twttrf.callback&'+'suppress_response_codes=true&rnd='+Math.random();}
head.appendChild(script);}},callback:function(data){if(data===undefined||data.body===undefined){inProgress=false;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1);}
return;}
if(!useEmoji){data.body=data.body.replace(/(<img[^c]*class="Emoji[^>]*>)|(<img[^c]*class="u-block[^>]*>)/g,'');}
if(!showImages){data.body=data.body.replace(/(<img[^c]*class="NaturalImage-image[^>]*>|(<img[^c]*class="CroppedImage-image[^>]*>))/g,'');}
if(!printUser){data.body=data.body.replace(/(<img[^c]*class="Avatar"[^>]*>)/g,'');}
var div=document.createElement('div');div.innerHTML=data.body;if(typeof(div.getElementsByClassName)==='undefined'){supportsClassName=false;}
function swapDataSrc(element){var avatarImg=element.getElementsByTagName('img')[0];if(avatarImg){avatarImg.src=avatarImg.getAttribute('data-src-2x');}else{var screenName=element.getElementsByTagName('a')[0].getAttribute('href').split('twitter.com/')[1];var img=document.createElement('img');img.setAttribute('src','https://twitter.com/'+screenName+'/profile_image?size=bigger');element.prepend(img);}
return element;}
var tweets=[];var authors=[];var times=[];var images=[];var rts=[];var tids=[];var permalinksURL=[];var x=0;if(supportsClassName){var tmp=div.getElementsByClassName('timeline-Tweet');while(x<tmp.length){if(tmp[x].getElementsByClassName('timeline-Tweet-retweetCredit').length>0){rts.push(true);}else{rts.push(false);}
if(!rts[x]||rts[x]&&showRts){tweets.push(tmp[x].getElementsByClassName('timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(tmp[x].getElementsByClassName('timeline-Tweet-author')[0]));}
times.push(tmp[x].getElementsByClassName('dt-updated')[0]);permalinksURL.push(tmp[x].getElementsByClassName('timeline-Tweet-timestamp')[0]);if(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]!==undefined){images.push(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]);}else{images.push(undefined);}}
x++;}}else{var tmp=getElementsByClassName(div,'timeline-Tweet');while(x<tmp.length){if(getElementsByClassName(tmp[x],'timeline-Tweet-retweetCredit').length>0){rts.push(true);}else{rts.push(false);}
if(!rts[x]||rts[x]&&showRts){tweets.push(getElementsByClassName(tmp[x],'timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(getElementsByClassName(tmp[x],'timeline-Tweet-author')[0]));}
times.push(getElementsByClassName(tmp[x],'dt-updated')[0]);permalinksURL.push(getElementsByClassName(tmp[x],'timeline-Tweet-timestamp')[0]);if(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0]!==undefined){images.push(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0]);}else{images.push(undefined);}}
x++;}}
if(tweets.length>maxTweets){tweets.splice(maxTweets,(tweets.length-maxTweets));authors.splice(maxTweets,(authors.length-maxTweets));times.splice(maxTweets,(times.length-maxTweets));rts.splice(maxTweets,(rts.length-maxTweets));images.splice(maxTweets,(images.length-maxTweets));permalinksURL.splice(maxTweets,(permalinksURL.length-maxTweets));}
var arrayTweets=[];var x=tweets.length;var n=0;if(dataOnly){while(n<x){arrayTweets.push({tweet:tweets[n].innerHTML,author:authors[n]?authors[n].innerHTML:'Unknown Author',author_data:{profile_url:authors[n]?authors[n].querySelector('[data-scribe="element:user_link"]').href:null,profile_image:authors[n]?'https://twitter.com/'+authors[n].querySelector('[data-scribe="element:screen_name"]').title.split('@')[1]+'/profile_image?size=bigger':null,profile_image_2x:authors[n]?'https://twitter.com/'+authors[n].querySelector('[data-scribe="element:screen_name"]').title.split('@')[1]+'/profile_image?size=original':null,screen_name:authors[n]?authors[n].querySelector('[data-scribe="element:screen_name"]').title:null,name:authors[n]?authors[n].querySelector('[data-scribe="element:name"]').title:null},time:times[n].textContent,timestamp:times[n].getAttribute('datetime').replace('+0000','Z').replace(/([\+\-])(\d\d)(\d\d)/,'$1$2:$3'),image:extractImageUrl(images[n]),rt:rts[n],tid:tids[n],permalinkURL:(permalinksURL[n]===undefined)?'':permalinksURL[n].href});n++;}}else{while(n<x){if(typeof(formatterFunction)!=='string'){var datetimeText=times[n].getAttribute('datetime');var newDate=new Date(times[n].getAttribute('datetime').replace(/-/g,'/').replace('T',' ').split('+')[0]);var dateString=formatterFunction(newDate,datetimeText);times[n].setAttribute('aria-label',dateString);if(tweets[n].textContent){if(supportsClassName){times[n].textContent=dateString;}else{var h=document.createElement('p');var t=document.createTextNode(dateString);h.appendChild(t);h.setAttribute('aria-label',dateString);times[n]=h;}}else{times[n].textContent=dateString;}}
var op='';if(parseLinks){if(targetBlank){targetLinksToNewWindow(tweets[n]);if(printUser){targetLinksToNewWindow(authors[n]);}}
if(printUser){op+='<div class="user">'+strip(authors[n].innerHTML)+'</div>';}
op+='<p class="tweet">'+strip(tweets[n].innerHTML)+'</p>';if(printTime){if(permalinks){op+='<p class="timePosted"><a href="'+permalinksURL[n]+'">'+times[n].getAttribute('aria-label')+'</a></p>';}else{op+='<p class="timePosted">'+
times[n].getAttribute('aria-label')+'</p>';}}}else{if(tweets[n].textContent){if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>';}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>';}}else{if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>';}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>';}}}
if(showInteractionLinks){op+='<p class="interact"><a href="https://twitter.com/intent/'+'tweet?in_reply_to='+tids[n]+'" class="twitter_reply_icon"'+
(targetBlank?' target="_blank" rel="noopener">':'>')+'Reply</a><a href="https://twitter.com/intent/retweet?'+'tweet_id='+tids[n]+'" class="twitter_retweet_icon"'+
(targetBlank?' target="_blank" rel="noopener">':'>')+'Retweet</a>'+'<a href="https://twitter.com/intent/favorite?tweet_id='+
tids[n]+'" class="twitter_fav_icon"'+
(targetBlank?' target="_blank" rel="noopener">':'>')+'Favorite</a></p>';}
if(showImages&&images[n]!==undefined&&extractImageUrl(images[n])!==undefined){op+='<div class="media">'+'<img src="'+extractImageUrl(images[n])+'" alt="Image from tweet" />'+'</div>';}
if(showImages){arrayTweets.push(op);}else if(!showImages&&tweets[n].textContent.length){arrayTweets.push(op);}
n++;}}
handleTweets(arrayTweets);inProgress=false;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1);}}};window.__twttrf=twitterFetcher;window.twitterFetcher=twitterFetcher;return twitterFetcher;}));(function(arr){arr.forEach(function(item){if(item.hasOwnProperty('prepend')){return;}
Object.defineProperty(item,'prepend',{configurable:true,enumerable:true,writable:true,value:function prepend(){var argArr=Array.prototype.slice.call(arguments),docFrag=document.createDocumentFragment();argArr.forEach(function(argItem){var isNode=argItem instanceof Node;docFrag.appendChild(isNode?argItem:document.createTextNode(String(argItem)));});this.insertBefore(docFrag,this.firstChild);}});});})([Element.prototype,Document.prototype,DocumentFragment.prototype]);
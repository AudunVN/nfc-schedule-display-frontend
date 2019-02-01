var dateTimeInputFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]";
var timezone = "Europe/Stockholm";

var tweetReady = function(tweetstring){
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
	"profile": {"screenName": Settings.get().twitterUsername},
	"domId": 'announcements-container',
	"maxTweets": 5,
	"enableLinks": true,
	"customCallback": tweetReady,
	"showUser": true,
	"showTime": true,
	"showImages": true,
	"dateFunction": function(date){
		return moment.duration(date.getTime() - Date.now(), "milliseconds").humanize(true);
	},
	"lang": 'en'
};

function updateClock() {
	$('#clock').fitText(1.3);
	$('#clock').html(moment().format('D. MMMM YYYY H:mm:ss'));
}

var currentImgIndex = 0;

function updateSliders() {
	var availableHeight = $(".row > :first-child .panel-content-wrapper").outerHeight() - $(".row > :first-child .list-group-item:nth-child(1)").outerHeight() - $(".row > :first-child .list-group-item:nth-child(2)").outerHeight();
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
	var messages = Settings.get().messages;
	for (i = 0; i < messages.length; i++) {
		$("#scroller").append('<div class="scroll-content">' + messages[i] + '</div>');
	}

	$('#scroller').slick({
		vertical: true,
		autoplay: false,
		speed: 500,
		arrows: false
	  });

	  console.log("Rendered messages");
}

function loadSettings() {
	if (Settings.get().zoom) {
		$(".schedule").css("zoom", Settings.get().zoom);
	}
	console.log("Loaded settings");
}

var previousEvents = [];

function updateSchedule() {
	var events = Events.get();
	console.log(events);
	if (events != previousEvents) {
		console.log("Rendering latest events");
		previousEvents = events;
		$(".schedule .table tbody").hide();
		$(".schedule .table tbody").html("");
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			var eventRow = $("" + 
			"<tr><td>" +
				event.title +
			"</td><td>" +
				event.location +
			"</td><td>" +
				moment(event.startTime).tz(timezone).format("HH:mm") +
			"</td><td>" +
				moment(event.endTime).tz(timezone).format("HH:mm") + 
			"</td></tr>");
			if (moment(event.endTime).tz(timezone).valueOf() - Date.now() < 0) {
				eventRow.hide();
			}
			$(".schedule .table tbody").append(eventRow);
		}
		$(".schedule .table tbody").show();
	}
	firstEvent.fadeOut(500, function(){
		firstEvent.removeClass("success");
		firstEvent.show();
		setTimeout(function(){
			$(".table tr").not(".success").first().addClass("success");
		}, 100+(Math.random()-0.5)*100);
	});
	console.log("Updated schedule");
}

function updateTweets() {	
	twitterFetcher.fetch(configProfile);
	console.log("Updated tweets");
}

loadSettings();

renderMessages();

updateSliders();

updateTweets();

setInterval(updateClock, 1000);

setInterval(updateSchedule, 1000);

setInterval(updateSliders, Settings.get().sliderInterval);

setInterval(updateTweets, Settings.get().tweetRefreshInterval);
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
	$('#clock').html(moment().format('MMMM Do HH:mm:ss'));
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

function setEventStates() {
	$(".schedule .table tbody tr").each(function(index, object) {
		if (parseInt($(this).data("end")) < Date.now()) {
			if ($(this).is(":visible")) {
				$(this).fadeOut(500);
			} else {
				$(this).hide();
			}
		} else if (parseInt($(this).data("start")) < Date.now()) {
			$(this).addClass("success");
		}
	});
}

var previousEvents = [];

function updateSchedule() {
	var events = Events.get();
	if (JSON.stringify(events) != JSON.stringify(previousEvents)) {
		console.log("Rendering latest events");
		previousEvents = events;
		$(".schedule .table tbody").hide();
		$(".schedule .table tbody").html("");
		var previousEvent = {};
		for (var i = 0; i < events.length; i++) {
			var event = events[i];
			var eventRow = $("" + 
			"<tr data-start='" + moment(event.startTime).tz(timezone).second(0).valueOf() + "' data-end='" + moment(event.endTime).tz(timezone).second(0).valueOf() + "'><td>" +
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
			} else if (moment(previousEvent.startTime).tz(timezone).format("dddd [()]MMM Do[)]") != moment(event.startTime).tz(timezone).format("dddd [()]MMM Do[)]")) {
				/* new day! add a title */
				var dayRow = $("" + 
				"<tr data-end='" + moment(event.startTime).hour(0).minute(0).second(0) + "' class='warning text-center'><td colspan=4>" +
					moment(event.startTime).tz(timezone).format("dddd [(]MMM Do[)]") +
				"</td></tr>");
				$(".schedule .table tbody").append(dayRow);
			}
			previousEvent = event;
			$(".schedule .table tbody").append(eventRow);
		}
		setEventStates();
		$(".schedule .table tbody").show();
	}
	setEventStates();
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
/* get/set device id */
var uid = new ShortUniqueId();

var deviceId = "not-set";

if (typeof(Storage) !== "undefined") {
	if (localStorage.getItem("device_id")) {
		deviceId = localStorage.getItem("device_id");
	} else {
		deviceId = "471-" + uid.randomUUID(6);
		localStorage.setItem("device_id", deviceId);
	}
} else {
	deviceId = "x-" + uid.randomUUID(6);
}

document.querySelector("#device-id").innerHTML = "<h3 class='text-center'>" + deviceId + "</h3>";

setTimeout(function(){ document.querySelector("#device-id").className = "hide"; }, 10000);
/* end get/set device id */

/* static settings */
var dateTimeInputFormat = "YYYY-MM-DD[T]HH:mm:ss[Z]";
var timezone = "Europe/Stockholm";
/*end static settings */

/* twitter embed setup */
var tweetReady = function(tweetstring) {
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
	"profile": {"screenName": Settings.getForDevice(deviceId).twitterUsername},
	"domId": 'announcements-container',
	"maxTweets": Settings.getForDevice(deviceId).maxTweets,
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
/* end twitter embed setup */

/* helper functions and objects */
function renderTagsToClassList(tagArray) {
    if (tagArray) {
        var tagsString = "";
        for (var i = 0; i < tagArray.length; i++) {
			tagsString += "event_" + tagArray[i] + " ";
        }
        return tagsString;
    }
    return "";
}

function getDayTitle(time) {
	return moment(time).tz(timezone).format("dddd [(]MMM Do[)]");
}

function isElementOverflowing(element) {
    return (element.offsetWidth < element.scrollWidth);
}

function getOverflow(element) {
	return (element.scrollWidth - element.offsetWidth);
}

/* used in updateSliders() to keep track of the current slide */
var currentImgIndex = 0;

/* used in updateSliders() to see whether the messages need to be rendered again */
var previousMessages = [];

/* used in updateSchedule() to see whether the schedule needs to be rendered again */
var previousEvents = [];

/* used in loadSettings() to check whether settings need to be applied again */
var previousSettings = {};

/* used in loadSettings() to see whether we should reload */
var lastPageLoad = Date.now();

/* end helper functions and objects */

function updateClock() {
	$('#clock').fitText(1.3);
	$('#clock').html(moment().format('MMMM Do HH:mm:ss'));
}

function updateSliders() {
	var imgSrc = Settings.getForDevice(deviceId).sliderImgs[currentImgIndex].url;
	
	currentImgIndex++;
	if (currentImgIndex > Settings.getForDevice(deviceId).sliderImgs.length - 1) {
		currentImgIndex = 0;
	}

	var availableHeight = $(".row > :first-child .panel-content-wrapper").outerHeight() - $(".row > :first-child .list-group-item:nth-child(1)").outerHeight() - $(".row > :first-child .list-group-item:nth-child(2)").outerHeight();
	if (availableHeight > 0) {
		$("#image-display").height(availableHeight);
		$("#image-display .next-img").css("background-image", "url('" + imgSrc + "')");
		$(".slide-img").toggleClass("current-img");
		$(".slide-img").toggleClass("next-img");
	}

	var messages = Settings.getForDevice(deviceId).messages;
	if (JSON.stringify(previousMessages) != JSON.stringify(messages)) {
		renderMessages(messages);
		previousMessages = messages;
	} else {
		$('#scroller').slick('next');
	}
}

function renderMessages(messages) {
	$("#scroller.slick-initialized").slick("unslick");
	$("#scroller").html("");
	for (i = 0; i < messages.length; i++) {
		$("#scroller").append('<div class="scroll-content">' + messages[i] + '</div>');
	}

	$('#scroller').slick({
		vertical: true,
		autoplay: false,
		speed: 500,
		arrows: false
	});

	$('#scroller').on('afterChange', function(event, slick){
		$("#scroller .slick-slide > *").css({
			left: 0,
			transition: "left " + 0.0006*Settings.getForDevice(deviceId).sliderInterval + "s linear"
		});
		if (isElementOverflowing(document.querySelector("#scroller .slick-active > *"))) {
			console.log("omg overflow");
			setTimeout(function(){
				$("#scroller .slick-active > *").css({left: -getOverflow(document.querySelector(".slick-active > *"))});
			}, 0.0002*Settings.getForDevice(deviceId).sliderInterval);
			
		}
	});
	console.log("Rendered messages");
}

function loadSettings() {
	var settings = Settings.getForDevice(deviceId);
	if (JSON.stringify(previousSettings) != JSON.stringify(settings)) {
		/*if (settings.zoom) {
			$(".schedule").css("zoom", settings.zoom);
		}*/
		if (settings.view && settings.view != "auto") {
			if (settings.view == "portrait") {
				$(".schedule").removeClass("landscape");
				$(".schedule").addClass("portrait");
			} else if (settings.view == "landscape") {
				$(".schedule").removeClass("portrait");
				$(".schedule").addClass("landscape");
			}
		}
		if (settings.debug && settings.timeTravel) {
			chronokinesis.travel(settings.timeTravel);
		}
		if (settings.noAnimations) {
			$(".schedule").addClass("no-animation");
		} else {
			$(".schedule").removeClass("no-animation");
		}
		previousSettings = settings;
		console.log("Loaded settings");
	}

	if ((Date.now() > settings.reloadBy) && (lastPageLoad < settings.reloadBy)) {
		$.ajax({
			url: window.location.href,
			type: 'GET',
			success: function(data) {
				console.log("Able to load schedule page, reloading");
				location.reload();
			},
			error: function() {
				console.warn("Main page unavailable, unable to reload");
			}
		});
	}
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

			var startTime = moment(event.startTime).tz(timezone).second(0).valueOf();
			var endTime =  moment(event.endTime).tz(timezone).second(0).valueOf();
			var eventRow = $("" + 
			"<tr class='" + renderTagsToClassList(event.eventTags)  + "' data-start='" + startTime + "' data-end='" +endTime + "'><td>" +
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
			} else if (getDayTitle(previousEvent.startTime) != getDayTitle(event.startTime)) {
				/* new day! add a title */
				var dayRow = $("" + 
				"<tr data-end='" + moment(event.startTime).hour(0).minute(0).second(0) + "' class='warning text-center'><td colspan=4>" +
					getDayTitle(event.startTime) +
				"</td></tr>");
				$(".schedule .table tbody").append(dayRow);
			}

			if (event.title.toLowerCase().indexOf("cancelled") != -1) {
				eventRow.addClass("event_cancelled");
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

/* timers */

function runClock() {
	setTimeout(runClock, 1000);
	updateClock();
}

function runSchedule() {
	setTimeout(runSchedule, 1000);
	updateSchedule();
}

function runLoadSettings() {
	setTimeout(runLoadSettings, 1000);
	loadSettings();
}

/* these are timed using a different method, as the intervals may change */
function runSlider() {
	setTimeout(runSlider, Settings.getForDevice(deviceId).sliderInterval);
	updateSliders();
}

function runTweets() {
	setTimeout(runTweets, Settings.getForDevice(deviceId).tweetRefreshInterval);
	updateTweets();
}

/* init */

runLoadSettings();

runClock();

runSlider();

runTweets();

runSchedule();
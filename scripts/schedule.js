$.ajaxSetup({ cache: false });

var defaultEvents = [
    {
        "eventId": 101,
        "title": "Test of locally stored event data",
        "description": "Yes",
        "location": "471.no",
        "organizers": "Me",
        "startTime": "2019-03-03T20:00:00Z",
        "endTime": "2019-03-04T02:00:00Z",
        "lastUpdate": "2019-01-21T19:05:16.181215Z",
        "cancelled": false,
        "eventTags": [
            "main",
            "dance"
        ]
    },
    {
        "eventId": 101,
        "title": "Internal test event",
        "description": "Yes",
        "location": "471.no",
        "organizers": "Me",
        "startTime": "2019-03-03T20:00:00Z",
        "endTime": "2019-03-04T02:00:00Z",
        "lastUpdate": "2019-01-21T19:05:16.181215Z",
        "cancelled": false,
        "eventTags": [
            "main",
            "dance"
        ]
    },
];

var baseApiUrl = "https://games-api-staging.nordicfuzzcon.org/schedule/v1/events";
var apiKey = "staging-read";
var settingsUrl = "data/test_settings.json";

if (window.location.href.indexOf("test") == -1) {
    /* switch to production */
    baseApiUrl = "https://games-api.nordicfuzzcon.org/schedule/v1/events";
    apiKey = "f18f8411-42ba-4587-aed0-90d55bcb3b49";
    settingsUrl = "data/settings.json";
} else {
    document.querySelector("body").classList.add("test-mode");
    document.querySelector(".test-mode-warning").classList.remove("hidden");
}

var deviceSpecificSettings = [
    {
        deviceId: "uXhOvR",
        zoom: 1.3,
        view: "auto",
        noAnimation: false
    },
];

var defaultSettings = {
    view: "landscape",
    noAnimations: false,
    reloadBy: Date.now()+300*1000, // reload by this time (if site available), datetime in ms
    eventsLifetime: 10 * 1000, // best-before time for schedule data, in ms
    settingsLifetime: 10 * 1000, // best-before time for schedule settings, in ms
    tweetRefreshInterval: 60 * 1000, // twitter fetch interval, in ms
    maxTweets: 5,
    settingsURLs: [settingsUrl], // priority list of URLs to fetch settings from
    eventURLs: [baseApiUrl, "./data/events.json"], // priority list of URLs to fetch event data from
    eventApiKey: apiKey,
    zoom: 1, // default zoom level, useful for scaling to fit to lobby displays
    sliderInterval: 10 * 1000, // slide change interval, in ms
    sliderTransition: 0.5 * 1000, // slide transition length, in ms
    twitterUsername: "LiveFuzz",
    debug: false, // enables time travel and other things that certainly shouldn't be live in production
    timeTravel: 0, //new Date(2019,1,27,16,29,45), // datetime or moment, useful for light time travel if you want to test the schedule
    sliderImgs: [
		{
			url: "https://www.nordicfuzzcon.org/Content/2020/IMG_2246_lq_169_fp.jpg",
			caption: ""
		},
		{
			url: "https://www.nordicfuzzcon.org/Content/themes/2020/images/bg_main_cmp_2000px_progressive.jpg",
			caption: ""
        }
    ],
    messages: [
        "<h3>Welcome to <a href='https://twitter.com/intent/tweet?button_hashtag=NFC2020'>#NFC2020</a>!</h3>",
        "<h3>For detailed schedule information, see <a href='https://nordicfuzzcon.org/Program/Schedule'>nordicfuzzcon.org/Program/Schedule</a>.</h3>",
        "<h3>Get the latest NFC news: <a href='http://social.nordicfuzzcon.org'>social.nordicfuzzcon.org</a>!</h3>",
    ],
    deviceSpecificSettings: deviceSpecificSettings
};

/* to aid with copy-pasting it over to settings.json */
console.log(JSON.stringify(defaultSettings));

var Events = {
    events: defaultEvents,
    lastUpdate: 0,
    getInProgress: false,
    updateEventData: function(i) {
        if (!this.getInProgress) {
            console.log("Getting new event data");
            var eventObj = this;
            var settings = Settings.get();

            $.ajax({
                url: settings.eventURLs[i],
                type: 'GET',
                dataType: 'json',
                beforeSend: function(xhr) {
                    eventObj.getInProgress = true;
                    xhr.setRequestHeader('X-API-KEY', settings.eventApiKey);
                },
                success: function(data) {
                    console.log("Updated events data from "  + settings.eventURLs[i]);
                    eventObj.events = data;
                    eventObj.lastUpdate = Date.now();
                },
                error: function(xhr, error) {
                    console.warn("Couldn't get events from " + settings.eventURLs[i]);
                    console.log(xhr.status);
                    if (i+1 < settings.eventURLs.length) {
                        /* try again with next URL in list */
                        eventObj.getInProgress = false;
                        eventObj.updateEventData(i+1);
                    } else {
                        console.error("Failed to get new events, URL list exhausted.");
                    }
                },
                complete: function() {
                    eventObj.getInProgress = false;
                }
            });
        }
    },
    get: function() {
        if (this.lastUpdate + Settings.get().eventsLifetime < Date.now()) {
            /* our event data is a bit old; check if there's some new data out */
            this.updateEventData(0);
        }
        return this.events;
    }
};

var Settings = {
    settings: defaultSettings,
    lastUpdate: 0,
    getInProgress: false,
    updateSettings: function(i) {
        if (!this.getInProgress) {
            console.log("Getting new settings");
            var setObj = this;
            var settings = this.settings;
    
            $.ajax({
                url: settings.settingsURLs[i],
                type: 'GET',
                dataType: 'json',
                beforeSend: function() {
                    setObj.getInProgress = true;
                },
                success: function(data) {
                    console.log("Updated settings from "  + settings.settingsURLs[i]);
                    setObj.settings = data;
                    setObj.lastUpdate = Date.now();
                },
                error: function(xhr, error) {
                    console.warn("Couldn't get settings from " + settings.settingsURLs[i]);
                    console.log(error);
                    if (i+1 < settings.settingsURLs.length) {
                        /* try again with next URL in list */
                        setObj.getInProgress = false;
                        setObj.updateSettings(i+1);
                    } else {
                        console.error("Failed to get new settings, URL list exhausted.");
                    }
                },
                complete: function() {
                    setObj.getInProgress = false;
                }
            });
        }
    },
    get: function() {
        if (this.lastUpdate + this.settings.settingsLifetime < Date.now()) {
            /* our settings are a bit old; check if there are some new ones out */
            this.updateSettings(0);
        }
        return this.settings;
    },
    getForDevice: function(deviceId) {
        var settings = this.get();
        if (typeof settings.deviceSpecificSettings !== 'undefined') {
            var deviceSettings = settings.deviceSpecificSettings.filter(function(settings){ return settings.deviceId === deviceId });
            if (typeof deviceSettings !== 'undefined') {
                deviceSettings = deviceSettings[0];
                for (var customSetting in deviceSettings) {
                    if (settings.hasOwnProperty(customSetting)) {
                        /* overwrite with custom property */
                        settings[customSetting] = deviceSettings[customSetting];
                    }
                }
            }
        }
        return settings;
    }
};
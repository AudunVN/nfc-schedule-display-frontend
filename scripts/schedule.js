var defaultEvents = [
    {
        "eventId": 101,
        "title": "Dead Dog Dance",
        "description": "The Dead Dog Dance...",
        "location": "Ball Room",
        "organizers": "StarFoxCoon",
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
        "eventId": 137,
        "title": "Glögg and fika sampling",
        "description": "7 bouts of glögg sampling with 20 persons in each",
        "location": "8XX",
        "organizers": "Fredrix Swiftnote",
        "startTime": "2019-03-03T21:00:00Z",
        "endTime": "2019-03-03T22:30:00Z",
        "lastUpdate": "2019-01-21T19:05:16.397372Z",
        "cancelled": false,
        "eventTags": [
            "theme",
            "food"
        ]
    }
];

var defaultSettings = {
    eventsLifetime: 300 * 1000, // best-before time for schedule data, in ms
    settingsLifetime: 300 * 1000, // best-before time for schedule settings, in ms
    settingsURLs: ["test"], // priority list of URLs to fetch settings from
    eventURLs: ["https://games-api-staging.nordicfuzzcon.org/schedule/v1/events"], // priority list of URLs to fetch event data from
    eventApiKey: "staging-read",
}

var Events = {
    events: defaultEvents,
    lastUpdate: 0,
    updateEventData: function(i) {
        console.log("Getting event data");
        var eventObj = this;
        var settings = Settings.get();
        $.ajax({
            url: settings.eventURLs[i],
            type: 'GET',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-API-KEY', settings.eventApiKey);
            },
            success: function(data) {
                console.log("Updated events data from "  + settings.eventURLs[i]);
                eventObj.events = data;
                eventObj.lastUpdate = Date.now();
            },
            error: function() {
                console.warn("Couldn't get events from " + settings.eventURLs[i]);
                if (i+1 < settings.eventURLs.length) {
                    /* try again with next URL in list */
                    eventObj.updateScheduleData(i+1);
                } else {
                    console.error("Failed to get new events, URL list exhausted.");
                }
            }
        });
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
    updateSettings: function(i) {
        console.log("Getting settings");
        var setObj = this;
        var settings = this.settings;

        $.ajax({
            url: settings.settingsURLs[i],
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log("Updated settings from "  + settings.eventURLs[i]);
                setObj.settings = data;
                setObj.lastUpdate = Date.now();
            },
            error: function() {
                console.warn("Couldn't get settings from " + settings.settingsURLs[i]);
                if (i+1 < settings.settingsURLs.length) {
                    /* try again with next URL in list */
                    setObj.updateSettings(i+1);
                } else {
                    console.error("Failed to get new settings, URL list exhausted.");
                }
            }
        });
    },
    get: function() {
        if (this.lastUpdate + this.settings.settingsLifetime < Date.now()) {
            /* our settings are a bit old; check if there are some new ones out */
            this.updateSettings(0);
        }
        return this.settings;
    }
}
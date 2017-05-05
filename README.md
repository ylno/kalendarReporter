# kalendarReporter 

Hostet at [https://kalender.frankl.info](https://kalender.frankl.info)

Javascript-Tool to calculate total hours from your Google Calendar with filters.


uses https://github.com/christiansmith/ngGAPI with some modification to work with gapi oauth2.

* Select one or more of your google-calendars
* Set a start- and enddate
* Set a filter for the event-title
* Get a total of hours from your calendar-entries matching
* Get a List of all single Calendar-entries.

## Technical information

The app uses angular and google api (gapi) together, which was not an easy task. Both tools load and init their data at loading-time and you can not be sure when it is ready.

The app loads both angular and gapi. When gapi is ready an init-function is called in angular which starts to do the gapi-dependend stuff.
	


## License

The library distributed under the MIT License.

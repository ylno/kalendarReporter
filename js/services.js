'use strict';

angular.module('rvServices', ['ngResource', 'ngCookies']);

angular.module('rvServices').factory('GAPIService', ['$resource', '$http', '$log', '$q', 'GAPI',  function ($resource, $http, $log, $q, GAPI) {
	var service = {};

	var clientCallbacks = [];

	var gapiReady = false;

	service.registerClient = function(clientCallback) {
		$log.debug("registering new client ", clientCallback);
		if(gapiReady) {
			$log.debug("api already there, direct call of callback");
			clientCallback();
		} else {
			$log.debug("api not ready, storing callback for later");
			clientCallbacks.push(clientCallback);
		}
	};

	service.initGapi = function() {
		$log.debug("gapi-init");

		gapiReady = true;
		angular.forEach(clientCallbacks, function(callback) {
			$log.debug("calling callback", callback);
			callback();
		});

	};

	var clientId = '616754906879-sgfb40diik6vokq42ic4qgsgcu10s6fu.apps.googleusercontent.com';
	var scopes = 'https://www.googleapis.com/auth/calendar.readonly';

	service.doAuth = function () {
		var deferred = $q.defer();
		gapi.auth2.authorize({client_id: clientId, scope: scopes, immediate: false}, function (authResult) {
			$log.debug("authresult", authResult);
			if (authResult.status.signed_in == true) {
				deferred.resolve(true);
			} else {
				deferred.reject(false);
			}

		});

		return deferred.promise;
	};

	service.getCalendars = function () {
		var deferred = $q.defer();
		gapi.client.calendar.events.list({}).then(function (response){
			$log.debug("response ", response);
		}, function(error) {
			$log.debug(error);
		});


		// gapi.client.googleApiClient.load('calendar', 'v3', function () {
		// 	var request = gapi.client.calendar.calendarList.list();
		// 	request.execute(function (resp) {
		//
		// 		$log.debug("response ", resp);
		//
		// 		angular.forEach(resp.items, function (item) {
		// 			$log.debug(item.id);
		// 		});
		//
		//
		// 	});
		//
		// });
	};

	return service;
}]);


// var request1 = gapi.client.calendar.events.list({
// 	'calendarId': 'primary',
// 	'timeMin': '2015-12-23T04:26:52.000Z'//Suppose that you want get data after 23 Dec 2014
// });
// request1.execute(function(resp){
// 	angular.forEach( resp.items, function( item ) {
// 		$log.debug(item.id);// here you give all events from google calendar
// 	});
// });

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



	service.getCalendars = function () {
		var deferred = $q.defer();
		gapi.client.calendar.events.list({}).then(function (response){
			$log.debug("response ", response);
		}, function(error) {
			$log.debug(error);
		});

	};

	service.signOut = function () {
		var token = gapi.auth.getToken();
		if (token) {
			var accessToken = gapi.auth.getToken().access_token;
			if (accessToken) {
				$http({
					method: 'GET',
					url: 'https://accounts.google.com/o/oauth2/revoke?token=' + accessToken
				});
			}
		}
		gapi.auth.setToken(null);
		gapi.auth.signOut();
		$log.debug("signout ready");
	};

	return service;
}]);



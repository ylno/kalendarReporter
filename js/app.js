'use strict';

angular.module('kalenderApp', [
	'ngRoute',
	'rvControllers',
	'rvDirectives',
	'rvFilters',
	'rvServices',
	'ui.bootstrap',
	'blockUI',
	'gapi'
]).value('GoogleApp', {
	apiKey: 'rfZlliumNlZwK7O5l3yKM-ej',
	clientId: '616754906879-sgfb40diik6vokq42ic4qgsgcu10s6fu.apps.googleusercontent.com',
	scopes: [
		// whatever scopes you need for your app, for example:
		// 'https://www.googleapis.com/auth/drive',
		// 'https://www.googleapis.com/auth/youtube',
		// 'https://www.googleapis.com/auth/userinfo.profile'
		'https://www.googleapis.com/auth/calendar.readonly'
	]
});

var initG = function() {
	console.log("init gapi");
	window.initGapi();
	console.log("init gapi ready");
}



angular.module('kalenderApp').config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/seite1', {
		templateUrl: 'partials/seite1.html',
		controller: 'Seite1Controller'
	}).otherwise({
		redirectTo: '/seite1'
	});
}]);


angular.module('kalenderApp').run(['$rootScope', '$log', '$window', 'blockUIConfig', 'GAPIService', function ($rootScope, $log, $window, blockUIConfig, GAPIService) {
	$log.debug("init application");

	$window.initGapi = function() {
		GAPIService.initGapi();
	}




}]);

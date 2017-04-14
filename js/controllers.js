'use strict';

angular.module('rvControllers', []);

angular.module('rvControllers').controller('Seite1Controller', ['$scope', '$rootScope', '$window', '$log', '$q', '$location', 'GAPI', 'GAPIService', 'Calendar', function ($scope, $rootScope, $window, $log, $q, $location, GAPI, GAPIService, Calendar) {
	$log.debug('init Seite1 ');


	$scope.calendarList = "";
	$scope.data = {
		'choosenCalendar': {}
	};
	$scope.resultList = [];

	var postInitiation = function () {
		// load all your assets
		$log.debug("controller Seite1 fertig ", $scope);
		GAPI.init().then(function (app) {
			$log.debug("auth ok", app);
			$scope.showLoginButton = false;

			Calendar.listCalendarList().then(function (result) {
				$scope.calendarList = result.items;
			}, function (error) {
				$log.error(error);
			});

		}, function (onError) {
			$log.debug("auth failed", app);
		});


	};


	function Event(event) {
		this.event = event;
		this.summary = event.summary;
		this.start = new Date(event.start.dateTime);
		this.end = new Date(event.end.dateTime);

		this.getDuration = function () {

			var number = Math.abs(this.end.getTime() - this.start.getTime()) / 36e5;
			return !isNaN(number) ? number : 0;
		}


	}

	$scope.startCalculation = function () {

		$scope.total = 0.0;
		$scope.resultList = [];

		var params = {};

		angular.forEach($scope.data.choosenCalendar, function (isChoosen, calendarId) {

			if (isChoosen) {
				Calendar.listEvents(calendarId, params).then(function (list) {
					$log.debug(list);

					// $scope.displayResult = list.items;
					angular.forEach(list.items, function (e) {
						var event = new Event(e);
						$scope.displayResult = $scope.displayResult + event.summary + " " + event.getDuration() + "\n";
						$scope.total = $scope.total + event.getDuration();
						$scope.resultList.push(event);
					});


				}, function (error) {
					$log.error(error);
				});
			}
		});
	}

	GAPIService.registerClient(postInitiation);


}]);

angular.module('rvControllers').controller('Seite2Controller', ['$scope', '$rootScope', '$window', '$log', '$q', 'GAPI', 'GAPIService', function ($scope, $rootScope, $window, $log, $q, GAPI, GAPIService) {
	$log.debug('init Seite2 ');

	var postInitiation = function () {
		// load all your assets
		$log.debug("controller Seite2 init");
	}

	GAPIService.registerClient(postInitiation);


	$scope.agetCalendars = function () {
		var deferred = $q.defer();
		gapi.client.googleApiClient.load('calendar', 'v3', function () {
			var request = gapi.client.calendar.calendarList.list();
			request.execute(function (resp) {

				$log.debug("response ", resp);

				angular.forEach(resp.items, function (item) {
					$log.debug(item.id);
				});


			});
			var request1 = gapi.client.calendar.events.list({
				'calendarId': 'primary',
				'timeMin': '2015-12-23T04:26:52.000Z'//Suppose that you want get data after 23 Dec 2014
			});
			request1.execute(function (resp) {
				angular.forEach(resp.items, function (item) {
					$log.debug(item.id);// here you give all events from google calendar
				});
			});
		});
	};


}]);

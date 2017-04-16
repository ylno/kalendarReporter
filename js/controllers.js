'use strict';

angular.module('rvControllers', []);

angular.module('rvControllers').controller('Seite1Controller', ['$scope', '$rootScope', '$window', '$log', '$q', '$location', 'GAPI', 'GAPIService', 'Calendar', function ($scope, $rootScope, $window, $log, $q, $location, GAPI, GAPIService, Calendar) {
	$log.debug('init Seite1 ');

	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


	$scope.calendarList = "";
	$scope.data = {
		'choosenCalendar': {},
		'startdate': firstDay,
		'enddate': lastDay
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
			$log.debug("auth failed", onError);
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

		var params = {
			'timeMin': $scope.data.startdate,
			'timeMax': $scope.data.enddate
		};

		angular.forEach($scope.data.choosenCalendar, function (isChoosen, calendarId) {

			if (isChoosen) {
				Calendar.listEvents(calendarId, params).then(function (list) {
					$log.debug(list);

					// $scope.displayResult = list.items;
					angular.forEach(list.items, function (e) {
						var event = new Event(e);
						if (($scope.data.filter == null || $scope.data.filter == '') || event.summary.indexOf($scope.data.filter) !== -1) {
							$scope.displayResult = $scope.displayResult + event.summary + " " + event.getDuration() + "\n";
							$scope.total = $scope.total + event.getDuration();
							$scope.resultList.push(event);
						}
					});


				}, function (error) {
					$log.error(error);
				});
			}
		});
	}

	GAPIService.registerClient(postInitiation);


}]);


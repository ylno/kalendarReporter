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
			$log.debug("auto login ok", app);
			$scope.showLoginButton = false;

			Calendar.listCalendarList().then(function (result) {
				$scope.calendarList = result.items;
			}, function (error) {
				$log.error(error);
			});

		}, function (onError) {
			$log.debug("auth failed", onError);
			$scope.showLoginButton = true;
		}, function (notify) {
			$log.debug("defered notify", notify);
		});
		$log.debug("end of initialisation seite 1");


	};

	$scope.login = function () {
		GAPI.authorize().then(function (app) {
			$log.debug("login ok", app);
			$scope.showLoginButton = false;

			Calendar.listCalendarList().then(function (result) {
				$scope.calendarList = result.items;
			}, function (error) {
				$log.error(error);
			});

		}, function (onError) {
			$log.debug("auth failed", onError);
			$scope.showLoginButton = true;
		}, function (notify) {
			$log.debug("defered notify", notify);
		});
		$log.debug("end of Login");
	}


	$scope.logout = function () {
		$log.debug("controller signout");
		GAPIService.signOut();
		$scope.showLoginButton = true;
	};

	function Event(event) {
		this.event = event;
		this.summary = event.summary;

		this.getDuration = function () {
			if (this.end == null || this.start == null) {
				return 0;
			}
			var number = Math.abs(this.end.getTime() - this.start.getTime()) / 36e5;
			return !isNaN(number) ? number : 0;
		}

		this.setStartDateTime = function (date) {
			if (date) {
				this.start = new Date(date.dateTime);
			}
		}
		this.setEndDateTime = function (date) {
			if (date) {
				this.end = new Date(date.dateTime);
			}
		}

		this.setStartDateTime(event.start);
		this.setEndDateTime(event.end);


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
						if (($scope.data.filter == null || $scope.data.filter == '') || event.summary.toLowerCase().indexOf($scope.data.filter.toLowerCase()) !== -1) {
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


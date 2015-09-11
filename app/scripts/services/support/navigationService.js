'use strict';

app.factory('navigationService', ['$location', function ($location) {
	var defaultPages = {
		homePage : 'home'
	};
	var module = {
		lastPage : null,
		defaultPages : defaultPages,
		location : {
			'home' : {
				route : '/main-screen/home',
				defaultBackPage : defaultPages.homePage
			}
		}
	};

	module.navigateBackFrom = function (page) {
		var destination = module.location[page];
		if (destination) {
			var backPage = destination.backPage || destination.defaultBackPage;
			logger.info('Navigating back from [' + page + '] to [' + backPage + ']');
			module.navigateTo(backPage);
		} else {
			logger.warn('Cannot navigate back from [' + page + ']. Page not found.')
		}
	};

	module.navigateTo = function (page, originPage, routeParams, urlParams) {
		var destination = module.location[page];
		if (destination) {
			$location.url(destination.route);
			destination.backPage = originPage || destination.defaultBackPage;
			logger.info('Navigating to [' + page + ']: ' + destination.route)
		} else {
			logger.warn('Cannot navigate to [' + page + ']. Page not found.')
		}
	};

	logger.log('Navigation Service:', module);
	return module;
}]);

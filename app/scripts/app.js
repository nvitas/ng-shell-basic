//var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngTouch', 'restangular']);
var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngTouch']);

//app.config(function (RestangularProvider) {
//	RestangularProvider.setBaseUrl('http://api.localhost:909/');
//});

app.config(['$routeProvider', function ($routeProvider) {

	//$httpProvider.responseInterceptors.push('httpServiceInterceptor');

	$routeProvider
		.when('/home', {
			templateUrl : 'views/home/page.html',
			controller : 'homeController'
		})
	/************  Default URL *****************/
		.otherwise({redirectTo : '/home'})
}]);

app.run(['$injector', '$rootScope', function ($injector, $rootScope) {
//	$injector.get('httpService');
//	$rootScope.constants = constants;
//	window.console.log($rootScope.constants);
}]);

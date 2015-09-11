var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngTouch']);

app.config(['$routeProvider','globalResolve', 'mainRoutes', function ($routeProvider, globalResolve, mainRoutes) {

	var allRoutes = [
		mainRoutes
	];

	initRoutes(allRoutes);
	$routeProvider.otherwise({redirectTo : '/home'});

	function initRoutes(allRoutes) {
		_.each(allRoutes, function (routeGroup) {
			addGlobalResolve(routeGroup);
			addRouteResolve(routeGroup);
			_.each(routeGroup.routes, function (routeConfig, routePath) {
				$routeProvider.when(routePath, routeConfig);
			});
		});
	}

	function addGlobalResolve(routeGroup) {
		_.each(globalResolve.resolveBeforeEachRoute, function (resolveFunction, functionName) {
			_.each(routeGroup.routes, function (routeConfig) {
				if (routeConfig.redirectTo === undefined) {
					var resolveFunctionToAdd = {};
					resolveFunctionToAdd[functionName] = resolveFunction;
					routeConfig.resolve = routeConfig.resolve || {};
					angular.extend(routeConfig.resolve, resolveFunctionToAdd);
				}
			});
		});
	}

	function addRouteResolve(routeGroup) {
		_.each(routeGroup.resolveBeforeEachRoute, function (resolveFunction, functionName) {
			_.each(routeGroup.routes, function (routeConfig) {
				if (routeConfig.redirectTo === undefined) {
					var resolveFunctionToAdd = {};
					resolveFunctionToAdd[functionName] = resolveFunction;
					routeConfig.resolve = routeConfig.resolve || {};
					angular.extend(routeConfig.resolve, resolveFunctionToAdd);
				}
			});
		});
		_.each(routeGroup.routes, function (routeConfig) {
			if (routeConfig.resolveFunctionList !== undefined) {
				_.each(routeConfig.resolveFunctionList, function (functionName) {
					var resolveFunctionToAdd = {};
					resolveFunctionToAdd[functionName] = routeGroup.resolveFunctionList[functionName];
					routeConfig.resolve = routeConfig.resolve || {};
					angular.extend(routeConfig.resolve, resolveFunctionToAdd);
				});
			}
		});
	}

}]);

app.run(['$injector', '$rootScope', function ($injector, $rootScope) {
	$injector.get('appConfig');
}]);

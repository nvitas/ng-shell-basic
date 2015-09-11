'use strict';

app.factory('appConfig', ['appSetup', 'util', function (appSetup, util) {
	var service = {};
	var userEnvironment = {

	};

	function init() {
		var environmentSettings = util.mergeObjects(userEnvironment, appSettings);
		var appSetupConfig = appSetup.init(environmentSettings);
		service = util.mergeObjects(environmentSettings, appSetupConfig);
		logger.log('App Configuration Complete', service);
	}

	init();

	return service;

}]);

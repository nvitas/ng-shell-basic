'use strict';

app.factory('userData', ['localStorage', function (localStorage) {
	var module = {
		buckets : [
			'gameData'
		],
		data : {}
	};

	function init() {
		_.each(module.buckets, function (bucket) {
			module.data[bucket] = localStorage.get(bucket);
		});
	}

	module.get = function (section) {
		return module.data[section];
	};

	module.set = function (data, section) {
		module.data[section] = data;
		localStorage.set(data, section);
	};

	module.deleteAllUserData = function () {
		localStorage.deleteItems(module.buckets);
	};

	init();

	logger.log('Loaded userData:', module);
	return module;
}]);

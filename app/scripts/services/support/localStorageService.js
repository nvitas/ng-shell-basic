'use strict';

app.factory('localStorage', [function () {
	var service = {
		data : {},
		capacity : {}
	};

	service.init = function () {
		service.load();
	};

	service.get = function (location) {
		return service.data[location];
	};

	service.set = function (data, location) {
		save(data, location)
	};

	service.load = function () {
		var capacityTotals = 0;
		for (var i = 0; i < localStorage.length; i++) {
			var bucket = (localStorage.key(i));
			var locationData = localStorage.getItem(localStorage.key(i));
			service.capacity[bucket] = locationData ? locationData.length || 0 : 0;
			capacityTotals += service.capacity[bucket];
			service.data[bucket] = JSON.parse(localStorage.getItem(localStorage.key(i))) || {};
		}

		service.capacity.totalMB = capacityTotals / 104857;
		logger.log('Loaded LocalStorage Data:', service);
	};

	function save(data, bucket) {
		service.data[bucket] = data;
		localStorage.setItem(bucket, JSON.stringify(service.data[bucket]));
	}

	service.deleteAll = function () {
		_.each(service.data, function (data, bucket) {
			localStorage.removeItem(bucket);
		});
	};

	service.deleteItems = function (items) {
		_.each(items, function (item) {
			service.deleteItem(item);
		});
	};
	service.deleteItem = function (item) {
		logger.warn('deleting item: ', item);
		localStorage.removeItem(item);
	};

	return service;
}]);

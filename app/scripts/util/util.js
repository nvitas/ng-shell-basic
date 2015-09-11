'use strict';

app.factory('util', [function () {
	var util = {};

	util.userAgent = {
		ios : /iPhone|iPad|iPod/i.test(navigator.userAgent),
		android : /android/i.test(navigator.userAgent),
		mobile : /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent),
		windows : /Windows/i.test(navigator.userAgent),
		string : navigator.userAgent
	};

	util.platform = 'ontouchstart' in document.documentElement && util.userAgent.mobile ? 'mobile' : 'desktop';

	util.getEvent = function (eventName) {
		eventName = eventName ? eventName : 'click';
		var eventMap = {
			'start' : ['touchstart', 'mousedown'],
			'down' : ['touchstart', 'mousedown'],
			'move' : ['touchmove', 'mousemove'],
			'end' : ['touchend', 'mouseup'],
			'up' : ['touchend', 'mouseup'],
			'click' : ['touchstart', 'click']
		};
		if (eventMap[eventName]) {
			return util.platform === 'mobile' ? eventMap[eventName][0] : eventMap[eventName][1];
		}
		else {
			return input; // jshint ignore:line
		}
	};

	util.getTouchPosition = function (e) {
		var x, y;
		if (util.platform === 'mobile') {
			x = parseInt(e.touches[0].pageX);
			y = parseInt(e.touches[0].pageY);
			return {'top' : y, 'left' : x};
		} else {
			x = parseInt(e.clientX);
			y = parseInt(e.clientY);
			return {'top' : y, 'left' : x};
		}
	};

	util.$id = function (id) {
		return document.getElementById(id);
	};

	util.$apply = function (scope) {
		if (!scope.$$phase) {
			scope.$apply();
		}
	};

	util.mergeObjects = function (obj1, obj2) {
		var result = angular.copy(obj1);
		for (var i in obj2) {
			if (obj2 && obj2.hasOwnProperty(i)) {
				if (_.isArray(obj2[i])) {
					result[i] = obj2[i];
				} else if ((i in obj1) && (typeof obj2[i] === 'object') && (i !== null)) {
					result[i] = util.mergeObjects(obj1[i], obj2[i]); // if it's an object, merge
				} else {
					result[i] = obj2[i]; // add it to result
				}
			}
		}
		var mergedObject = JSON.parse(JSON.stringify(result));
		return mergedObject;
	};

	return util;
}]);

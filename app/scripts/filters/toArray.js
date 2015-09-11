'use strict';

// Angular does not order or filter over objects. We opted for one of the solutions discussed here: https://github.com/angular/angular.js/issues/1286
// If needed in future we could set $key as optional such as in this filter: http://ngmodules.org/modules/angular-toArrayFilter
// ** Note caveats of boths options: It only works with plain Objects **

app.filter('toArray', function () {
	return function (obj) {
		if (!(obj instanceof Object)) {
			return obj;
		}

		return Object.keys(obj).map(function (key) {
			return Object.defineProperty(obj[key], '$key', {__proto__ : null, value : key});
		});
	};
});

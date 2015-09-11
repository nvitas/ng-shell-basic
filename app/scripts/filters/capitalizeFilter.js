'use strict';

app.filter('capitalize', function () {
	return function (input) {
		if (_.isString(input)) {
			input = input.charAt(0).toUpperCase() + input.slice(1);
		}
		return input;
	};
});

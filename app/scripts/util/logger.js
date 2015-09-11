'use strict';

var enableLogging = true;
var globalLog = [];

function enableLocalLogging() {
	localStorage.setItem('enableLogging', 'true');
	enableLogging = true;
}
function disableLocalLogging() {
	localStorage.setItem('enableLogging', 'undefined');
	enableLogging = false;
}

if (!window.console) {
	window.console = {};
}
if (!window.console.log) {
	window.console.log = function () {
	};
}


var Logger = (function () {
	//var logService = angular.injector(['ng', 'mPulseApp']).get("logStashService");
	var pub = {},
		priv = {
			tagLength : 20,
			colorize : true
		};

	if (localStorage.getItem('enableLogging') === 'true') {
		enableLogging = true;
		window.console.log('Logging enabled from local storage. To disable use: disableLocalLogging()');
	}

	pub.constructor = function (tag) {
		if (tag === undefined || tag === null) {
			this.tag = 'untagged';
		} else {
			this.tag = tag;
		}

		this.writeToConsole = function (args) {
			this.storeInGlobalLog(args.slice());
			if (enableLogging) {
				try {
					window.console.log.apply(console, args);
				} catch (error) {
					window.console.log(args.join(' '));
				}
			}
		};

		this.storeInGlobalLog = function (args) {
			args.splice(1, 1);
			globalLog.push(args.join(' '));
		};

		this.log = function () {
			var timeString = '[' + (new Date()).toUTCString() + ']',
				color = '#999999',
				strings = ['%c'],
				args = [],
				length,
				value,
				i;

			//strings.push(timeString);
			//strings.push(priv.formatTag(this.tag));

			length = arguments.length;
			for (i = 0; i < length; i++) {
				value = arguments[i];
				if (typeof value === 'string') {
					strings.push(value);
				} else {
					args.push(value);
				}
			}

			args.unshift('color: ' + color + ';');
			args.unshift(strings.join(' '));

			this.writeToConsole(args);

		};

		this.info = function () {
			var timeString = '[' + (new Date()).toUTCString() + ']',
				color = '#66AA66',
				strings = ['%c'],
				args = [],
				length,
				value,
				i;

			//strings.push(timeString);
			//strings.push(priv.formatTag(this.tag));

			length = arguments.length;
			for (i = 0; i < length; i++) {
				value = arguments[i];
				if (typeof value === 'string') {
					strings.push(value);
				} else {
					args.push(value);
				}
			}

			args.unshift('color: ' + color + ';');
			args.unshift(strings.join(' '));

			this.writeToConsole(args);
		};

		this.debug = function () {
			var timeString = '[' + (new Date()).toUTCString() + ']',
				color = '#5555CC',
				strings = ['%c'],
				args = [],
				length,
				value,
				i;

			//strings.push(timeString);
			//strings.push(priv.formatTag(this.tag));

			length = arguments.length;
			for (i = 0; i < length; i++) {
				value = arguments[i];
				if (typeof value === 'string') {
					strings.push(value);
				} else {
					args.push(value);
				}
			}

			args.unshift('color: ' + color + ';');
			args.unshift(strings.join(' '));

			this.writeToConsole(args);
		};

		this.warn = function () {
			var timeString = '[' + (new Date()).toUTCString() + ']',
				color = '#FF8C00',
				strings = ['%c'],
				args = [],
				length,
				value,
				i;

			//strings.push(timeString);
			//strings.push(priv.formatTag(this.tag));

			length = arguments.length;
			for (i = 0; i < length; i++) {
				value = arguments[i];
				if (typeof value === 'string') {
					strings.push(value);
				} else {
					args.push(value);
				}
			}

			args.unshift('color: ' + color + ';');
			args.unshift(strings.join(' '));

			try {
				console.warn.apply(console, args);
			} catch (error) {
				window.console.warn(args.join(' '));
			}
		};

		this.error = function () {
			var args = Array.prototype.slice.call(arguments);
			try {
				console.error.apply(console, args);
			} catch (error) {
				window.console.error(args.join(' '));
			}
		};

	};

	priv.colorize = function (args, text, color) {
		if (priv.colorize) {
			args.push('%c ' + text);
		}
	};

	priv.formatTag = function (tag) {
		var length = priv.tagLength - tag.length,
			i,
			out = tag;

		if (length < 0) {
			out = out.substring(0, priv.tagLength);
		}

		out = '[' + out + ']';

		for (i = 0; i < length; i++) {
			out += ' ';
		}
		return out;
	};

	return pub.constructor;

}());

var logger = new Logger('Main Logger');

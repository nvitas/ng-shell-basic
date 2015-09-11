'use strict';

app.factory('scrollBarService', [function () {
	var module = {
		scrollSettings : {
			standard : {
				scrollbars : true,
				mouseWheel : true,
				interactiveScrollbars : true,
				shrinkScrollbars : 'scale',
				bounceEasing : 'elastic',
				bounceTime : 1200,
				fadeScrollbars : true
			}
		}
	};

	module.initScrollBar = function (id, scrollSettings) {
		scrollSettings = scrollSettings || module.scrollSettings.standard;
		var scrollBar = new IScroll(id, scrollSettings);
		module.refreshScrollBar(scrollBar);
		return scrollBar;
	};

	module.refreshScrollBar = function (scrollBar) {
		if (_.isArray(scrollBar)) {
			setTimeout(function () {
				_.each(scrollBar, function (bar) {
					refresh(bar)
				});
			}, 200);
		} else {
			setTimeout(function () {
				refresh(scrollBar)
			}, 200);
		}
	};

	function refresh(scrollBar) {
		if (scrollBar) {
			scrollBar.refresh();
		}
	}

	logger.log('Loaded scrollBarService:', module);
	return module;
}]);

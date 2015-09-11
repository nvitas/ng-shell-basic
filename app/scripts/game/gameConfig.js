function gameConfig() {
	var module = {};

	module.init = function (gameSettings) {
		module.gameSettings = gameSettings;
		return module;
	};

	return module;
};

var gc = gameConfig = gameConfig();

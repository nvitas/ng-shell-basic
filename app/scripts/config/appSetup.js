'use strict';

app.factory('appSetup', ['localStorage', function (localStorage) {
    var service = {};
    var envSettings;

    service.init = function (settings) {
        envSettings = settings;
        service.config = {};
        appSetup();
        return service.config;
    };

    function appSetup() {
        //run any app init functions here
        initLocalStorage();
        initGameConfig();
    }

    function initLocalStorage() {
        localStorage.init();
    }

    function initGameConfig() {
        gameConfig.init(envSettings.gameSettings)
    }

    return service;

}]);

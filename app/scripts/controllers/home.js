'use strict';

app.controller('homeController', ['$scope', 'localStorage', function ($scope, localStorage) {
	$scope.title = 'home page';
	//localStorage.set({'test':'test'}, 'test');
}]);

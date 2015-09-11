'use strict';

app.constant("mainRoutes", {
	resolveBeforeEachRoute : {},
	routes : {
		'/home' : {
			templateUrl : 'views/home/page.html',
			controller : 'homeController'
		}
	}
});

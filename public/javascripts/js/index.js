var app = angular.module('myApp', ["ngAnimate", 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        // route to show our basic form
        .state('signup', {
            url: '/signup',
            templateUrl: 'signup.html',
            controller: 'formController'
        }).state('slideShow', {
            url: '/slideShow',
            templateUrl: 'slideShow.html',
            controller: 'formController'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'formController'
        })
        .state('createSession', {
            url: '/createSession',
            templateUrl: 'createSession.html',
            controller: 'formController'
        })
        .state('viewSession', {
            url: '/viewSession',
            templateUrl: 'viewSession.html',
            controller: 'formController'
        })
        .state('login', {
            url: '/',
            templateUrl: 'login.html',
            controller: 'formController'
        })
        .state('reset', {
            url: '/reset',
            templateUrl: 'reset.html',
            controller: 'formController'
        }).state('resetPassword', {
            url: '/resetPassword',
            templateUrl: 'resetPassword.html',
            controller: 'formController'
        });
    // catch all route
    // send users to the form page
    $urlRouterProvider.otherwise('/');

}).directive('fileModel', ['$parse', function($parse){
  return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });

		}
	}
}]).filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}])
.controller('formController', function($scope, $state, $http, $rootScope) {

  /*
  *******
  CHANGE STATE
  */

  $scope.next = function(nextState){
      $state.go(nextState)
  }

});

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
        }).state('verify', {
            url: '#/verify/:email',
            templateUrl: 'verify.html',
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

  $rootScope.levelRoot = "Select Level 1"
  $rootScope.levelMain = "Select Level 2"
  $rootScope.levelSub = "Select Level 3"
  $rootScope.allLevel = {},$scope.sessionCoreArray = [];
  /*
  *******
  CHANGE STATE
  */
  $scope.next = function(nextState){
      $state.go(nextState)
  }

  /*
  *****
  CREATE USER
  */

  $scope.createUser = function(user){

    var captcha = document.querySelector("#g-recaptcha-response").value;
    console.log(captcha);
    if(captcha == undefined || captcha == ""){
      alert("Please do google captcha verification");
    }else{
    $http.post("/users", {user:user,signup:true})
      .then(function(response){
          if(response.data == "already"){
            alert("You are already member");
          }else{
          alert("You email verification sent to: <br> "+ user.email);
          $http.post("/verify", {user:user,verifyEmail:true})
          .then(function(response){

          });
        }
      });
    }
  };


  /*
  ****
  LOGIN
  */
  $scope.login = function(user){
    $http.post("/users", {loginData:user, login:true})
      .then(function(response){
        if(response.data != "fail"){
            alert("You Are successfully login");
            // $rootScope.id = response.data[0]._id
            localStorage.setItem('id', JSON.stringify(response.data[0]._id));
            localStorage.setItem('name', JSON.stringify(response.data[0].name));

            $rootScope.name = localStorage.getItem('name');
            $state.go('home');

        }else{
            alert("No Data Found");
        }

      });
  };
  /*
  ***
  GET LEVEL
  */

  $scope.levelList = function(){
    $http.post('/createHierarchy', {getList:true})
      .then(function(response){
        console.log(response)
          $scope.rootList = response.data;
      })
  }

  /*
  ***
  GET  SECOND LEVEL
  */

  $scope.getSecondLevel = function(data){
    console.log(data);
    $http.post('/createHierarchy', {getSecondList:true,id:data._id})
      .then(function(response){
        console.log(response)
          $rootScope.levelRoot = data.name;
          $scope.secondRootList = response.data;
          var level1 = {
            name:data.name,
            id:data._id
          }
          $rootScope.allLevel['level1'] = level1;
      })
  }

  /*
  ***
  GET THIRD LEVEL
  */

  $scope.getThirdLevel = function(data){
    $http.post('/createHierarchy', {getThirdList:true,id:data._id})
      .then(function(response){
        console.log(response);
          $rootScope.levelMain = data.name
          $scope.thirdRootList = response.data;

          var level2 = {
            name:data.name,
            id:data._id
          }

          $rootScope.allLevel['level2'] = level2;
      })
  }

  $scope.getFinalLevel = function(data){
      $rootScope.levelSub = data.name;
      var level3 = {
        name:data.name,
        id:data._id
      }
      $rootScope.allLevel['level3'] = level3;
  }

  /*
  ***
  CREATE SESSION
  */

  $scope.createSession = function(session, photos, allLevel){
    console.log(session, photos, allLevel);

    $http.post("/createSession", {session,photos,allLevel,userId:localStorage.getItem('id'), createSession:true})
      .then(function(response){
        console.log(response);
        $state.go("viewSession");
          // alert("You successfully reset your password");
      });
  }

  /*
  ***
  DELETE SESSION
  */

  $scope.deleteSession = function(id){
    $http.post("/createSession", {id:id, deleteSession:true})
      .then(function(response){
        console.log(response);
        $state.go("viewSession");
          // alert("You successfully reset your password");
      });
  }

  /*
  ***
  VIEW SESSION'S DETAILS
  */

  $scope.viewDetailSession = function(list){
    $scope.mediaList = list.photos;
    $("#myModal").modal('show');
  }



  /*
  ***
  VIEW SESSION
  */


  $scope.viewSession = function(){
    $http.post("/createSession", {userId:localStorage.getItem('id'), viewSession:true})
      .then(function(response){
        console.log(response);
        if(response.data == "404"){
          alert("no Session create new one");
        }else{

          $scope.sessionList = response.data;

          setTimeout(function () {
            response.data.forEach(function(item){

              var sessionCordId = $scope.randomString(10);

              $scope.sessionCoreArray.push(sessionCordId);

              var qrcode = new QRCode(item._id, {
                  text: "abc",
                  width: 128,
                  height: 128,
                  colorDark : "#000000",
                  colorLight : "#ffffff",
                  correctLevel : QRCode.CorrectLevel.H
              });
              var qrcode = qrcode.makeCode(item._id + "," + sessionCordId); // This will make another code.

              if(response.data.length-1 == response.data.indexOf(item)){
                localStorage.setItem('sessionArray', JSON.stringify($scope.sessionCoreArray));
              }
            });
          }, 10);
        }
          // alert("You successfully reset your password");
      });
  }


  //////////
  // Upload Files

  $scope.photos = [];

  $('#photo1').on("change", function(e){
    uploadFile("photo1");
  });


  function uploadFile(id){
    var file    = document.getElementById(id).files[0];
    var fd = new FormData();

    var uploadUrl = '/saveImage';

    var newName = $scope.randomString(6)+ "."+$scope.split(file.name);
    console.log(newName);
    fd.append('file', file, newName);
    // console.log(file);
    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
    })
    .then(function(response) {
        $scope.photos.push(newName);
        str = "You Uploaded:  <span style = 'font-size:18px'><b> "+$scope.photos.length +"</b></span>  File successfully";
        $("#showData").html(str);
    })
  }


  /////////////

  /*
  ***
  LOGOUT
  */
  $scope.logout = function(){
    localStorage.clear();
    $state.go("login");
  }

  /*
  ***
  RANDOM STRING
  */

  $scope.randomString = function(len) {
    var text = "";
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  }

  // SPLIT stringify

  $scope.split = function(value){
        value = value.split(".");
        ext = value[1];
        return ext;
  }


});

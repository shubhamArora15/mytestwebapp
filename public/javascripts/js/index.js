var app = angular.module('myApp', ["ngAnimate", 'ui.router', 'ui.sortable']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider


        // route to show our basic form
        .state('adminDashboard', {
            url: '/adminDashboard',
            templateUrl: 'adminDashboard.html',
            controller: 'adminController'
        }).state('createHierarchy1', {
            url: '/createHierarchy1',
            templateUrl: 'createHierarchy1.html',
            controller: 'adminController'
        }).state('createHierarchy2', {
            url: '/createHierarchy2',
            templateUrl: 'createHierarchy2.html',
            controller: 'adminController'
        }).state('createHierarchy3', {
            url: '/createHierarchy3',
            templateUrl: 'createHierarchy3.html',
            controller: 'adminController'
        }).state('levelOne', {
            url: '/levelOne',
            templateUrl: 'levelOne.html',
            controller: 'adminController'
        }).state('levelTwo', {
            url: '/levelTwo',
            templateUrl: 'levelTwo.html',
            controller: 'adminController'
        }).state('levelThree', {
            url: '/levelThree',
            templateUrl: 'levelThree.html',
            controller: 'adminController'
        }).state('signup', {
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
            url: '/verify',
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

  $rootScope.levelRoot = "Select Level 1";
  $rootScope.levelMain = "Select Level 2";
  $rootScope.levelSub = "Select Level 3";
  $rootScope.name = localStorage.getItem('username');
  $rootScope.allLevel = {},$scope.sessionCoreArray = [];

  /*
  *******
  CHANGE STATE
  */
  $scope.next = function(nextState){
      $state.go(nextState)
  }

  if(localStorage.getItem('id')){
      $state.go('home');
  }else {
    $state.go("login");
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
          $http.post("/verify?email="+user.email, {user:user,verifyEmail:true})
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
            localStorage.setItem('name', JSON.stringify(response.data[0].username));

            $rootScope.name = localStorage.getItem('username');
            console.log(response.data, response.data[0].role);
            if(response.data[0].role && response.data[0].role == "client"){
              $state.go('home');
            }else{
              $state.go('adminDashboard');
            }
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

        $scope.next('viewSession');
          // alert("You successfully reset your password");
      });
  }

  /*
  ***
  UPDATE MEDIA ON SESSION CREATION
  */
  $scope.sortableOptions = {
    // update: function(e, ui) {
    //   // do something here
    //   console.log($scope.photos);
    // }
   stop: function(e, ui) {
     // do something here
     console.log($scope.photos);
   }
  };

  /*
  ***
  UPDATE MEDIA ON SESSION VIEW
  */
  $scope.sortableOptions2 = {
    // update: function(e, ui) {
    //   // do something here
    //   console.log($scope.mediaList);
    // }
   stop: function(e, ui) {
     // do something here
     console.log($scope.mediaList);
   }
  };

  $scope.updateMediaOnly = function(media, id){
      console.log(media, id)
      $http.post("/createSession",{id:id, media:media, updateMedia:true})
        .then(function(response){
          console.log(response);
          alert("done");
      });
  }

  /*
  ***
  VIEW SESSION'S DETAILS
  */
$scope.allLevels = [];
  $scope.viewDetailSession = function(list){
    console.log(list);
    $scope.sessionId = list._id;
    $scope.sessionName = list.session
    $scope.mediaList = list.photos;
    list.allLevel.forEach(function(item){
        obj = {
          name:item.name,
          id:item.id,
          index:item.index
        }
        $scope.allLevels.push(obj);
    })
    // $scope.allLevels = [{
    //   name:list.allLevel.level1.name,
    //   id:list.allLevel.level1.id,
    //   index:'first'
    // },{
    //   name:list.allLevel.level2.name,
    //   id:list.allLevel.level2.id,
    //   index:'second'
    // },{
    //   name:list.allLevel.level3.name,
    //   id:list.allLevel.level3.id,
    //   index:'third'
    // }]
    $("#myModal").modal('show')
  }

  /*
  ***
  PLAY CAUROSAL
  */

  $('.carousel').carousel({
    interval: 3000,
    pause: "false"
  });

  // var $item = $('.carousel .item');
  // var $wHeight = $(window).height();
  // $item.height($wHeight);
  // $item.addClass('full-screen');
  // var element = document.getElementsByClassName('active');

  // // else if(videoElem.length > 0){
  // //   videoElem[0].autoplay = false;
  // //   pauseAudio();
  // // }
  //
  // if(audioElem.length){
  //   audioElem[0].autoplay = true;
  //   audioElem[0].load();
  //   pauseVideo();
  //   startStopCaurosol(audioElem[0]);
  // }



$('#carousel-example-generic').on('slide.bs.carousel', function (e) {

    // var carouselElement = document.querySelector('carousel-example-generic');
    // carouselElement.height = window.height;


    // var element = document.getElementsByClassName('active');
    // var element2 = $(document.getElementsByClassName('active')).next("div");
    var carouselData = $(this).data('bs.carousel');

    var currentIndex = carouselData.getItemIndex($(e.relatedTarget));
    // but that is unnecessary because the current slide is in e.relatedTarget
    var currentItem = $(e.relatedTarget);

    var videoElem = $(currentItem[0]).children().find('video');
    // .find('video');
    // var videoElem2 = $(currentItem[0]).find('video');
    var audioElem = $(currentItem[0]).children().find('audio');
    // var audioElem2 = $(currentItem[0]).find('audio');

    console.log(currentIndex,currentItem[0], "1, 2", audioElem, videoElem);

      function startStopCaurosol(elementNew){
        console.log(elementNew);

        $(elementNew).on('play', function (e) {
            $("#carousel-example-generic").carousel('pause');
        });

        $(elementNew).on('stop pause ended', function (e) {
            $("#carousel-example-generic").carousel();
        });

      }

      if(videoElem.length){
        videoElem[0].autoplay = true;
        videoElem[0].load();
        pauseAudio();
        startStopCaurosol(videoElem[0]);
      }
      else if(audioElem.length){
        audioElem[0].autoplay = true;
        audioElem[0].load();
        pauseVideo();
        startStopCaurosol(audioElem[0]);
      }
      // else if(audioElem.length > 0){
      //   audioElem[0].autoplay = false;
      //   pauseVideo()
      // }
      function pauseAudio(){

        if(audioElem.length){
          audioElem[0].pause();
        }else {
          return
        }
        // else if(audioElem.length > 0){
        //   audioElem[0].pause();
        // }
      }

      function pauseVideo(){

        if(videoElem.legth){
          videoElem[0].pause();
        }else {
          return
        }
        // else if(videoElem.length > 0){
        //   videoElem[0].pause();
        // }
      }

    // var length = $(document.getElementsByClassName('active')).next("div").length;
    // // var length2 = $(document.getElementsByClassName('active')).prev("div").length;
    if(length === 0){
      // pauseAudio();
      // pauseVideo();
      // $(element2[0]).removeAttribute('autoplay');;$(element[0]).removeAttribute('autoplay');;
    }
  });



  /*
  ***
  UPDATE LEVEL'S DETAILS
  */

  $scope.updateLevel = function(id, level, allLevel){
    console.log(level, allLevel);
    $http.post("/createSession",{id:id,value:level, allLevel:allLevel, updateSession:true})
      .then(function(response){
        console.log(response);
        alert("done");
    });
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

  // Get session data
$scope.firstElementCheck = function(){
    setTimeout(function()
    {
      var element = document.getElementsByClassName('detectCarousel');
    var videoElem = $(element[0]).children().find('video');
    var audioElem = $(element[0]).children().find('audio');
    console.log(element, videoElem, audioElem);
    if(videoElem.length){
      videoElem[0].autoplay = true;
      videoElem[0].load();
      pauseAudio();
      startStopCaurosol(videoElem[0]);
    }
    if(audioElem.length){
      audioElem[0].autoplay = true;
      audioElem[0].load();
      pauseVideo();
      startStopCaurosol(audioElem[0]);
    }

    function pauseAudio(){

      if(audioElem.length){
        audioElem[0].pause();
      }
    }

    function pauseVideo(){

      if(videoElem.legth){
        videoElem[0].pause();
      }
    }
    function startStopCaurosol(elementNew){
      console.log(elementNew);
      $(elementNew).on('play', function () {

      $("#carousel-example-generic").carousel('pause');

      });
      $(elementNew).on('stop pause ended', function (e) {
          $("#carousel-example-generic").carousel();
      });
    }
  });

}
  $scope.getSessionData = function(id){
    $http.post("/viewSession", {sessionId:id, getSessionData:true})
    .then(function(response){
      console.log(response.data);
      $rootScope.photosData = response.data[0].photos;
      console.log($rootScope.photosData);

      $state.go('slideShow');

      // openSlideShow();
      // console.log($scope.photosData)
    });
  }

  //////////
  // Upload Files

  $scope.photos = [];
  $scope.media = {
    title: ''
  }

    $scope.addTitle = function(title){
      uploadFile("photo1", title);
    }

    $('#photo1').on("change", function(e){
      uploadFile("photo1", undefined);
    });



  function uploadFile(id, title){
    var file    = document.getElementById(id).files[0];
    var fd = new FormData();
    console.log(file);
    var uploadUrl = '/saveImage';

    var newName = $scope.randomString(6)+ "."+$scope.split(file.name);
    console.log(newName);
    fd.append('file', file, newName);
    // console.log(file);
    if(($scope.split(file.name) != "jpg" && $scope.split(file.name) && "jpeg" &&
        $scope.split(file.name) != "png" && $scope.split(file.name) != "ico") || title){
          console.log("not image");
          $("#sessionTitle").hide();
          $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: { 'Content-Type': undefined }
          })
          .then(function(response) {
              var obj = {
                newName : newName,
                title   : title
              }
              console.log(obj, "obj");
              $scope.photos.push(obj);
              $scope.media.title = '';
              console.log($scope.photos);
              obj.title = '';
              str = "You Uploaded:  <span style = 'font-size:18px'><b> "+$scope.photos.length +"</b></span>  File successfully";
              $("#showData").html(str);
          });
        }else {
          $("#sessionTitle").show();
        }
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

  //session

  //socket implementation
  var socket = io();

  socket.on('checkIs', function(data){
      console.log(data)
  })

  socket.on('specificWeb', function(data){
    console.log(data, localStorage.getItem('sessionArray'), localStorage.getItem('id'))
    if(data.userId == JSON.parse(localStorage.getItem('id'))
    && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId) != -1){
      console.log("done");
      $state.go('viewSession');
    }
  });
  socket.on('newclientconnect', function(data) {
    console.log("done");
    console.log(data, localStorage.getItem('id'), localStorage.getItem('sessionArray'));
    if(data.sessionId!="data"){
      console.log(JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId), data.sessionCoreId)
      if(data.userId == JSON.parse(localStorage.getItem('id'))
      && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId) != -1){
        $http.post("/viewSession", {sessionId:data.sessionId, getSessionData:true})
        .then(function(response){
          $rootScope.photosData = response.data[0].photos;
          $state.go('slideShow');
        });
      }
    }else{
      console.log(data);
      if(JSON.parse(data.userId) == JSON.parse(localStorage.getItem('id'))
      && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sCoreId) != -1){
        console.log("done");
        $state.go('viewSession');
      }
    }
  });


})
.controller('adminController', function($scope, $state, $http, $rootScope) {
  console.log("Admin Controller");

  function __init(){
  $rootScope.levelRoot = "Select Level 1";
  $rootScope.levelMain = "Select Level 2";
  $rootScope.levelSub = "Select Level 3";
  $rootScope.levelValue = {};
  $rootScope.levelValueTwo = {};
  $scope.levelName = "";
  $scope.levelId = "";

  $rootScope.allLevel = {}

  }

  __init();




  /*
  *******
  CHANGE STATE
  */
  $scope.next = function(nextState){
      $state.go(nextState)
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



  /*
  ***
  LOGOUT
  */
  $scope.logout = function(){
    localStorage.clear();
    $state.go("adminLogin");
  }


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

    $rootScope.levelValue = data;
    console.log($rootScope.levelValue._id);
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

    $rootScope.levelValue = data;
    $rootScope.levelValueTwo = data;

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

  /*
  ***
  GET FINAL LEVEL
  */

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
  CREATE HIERARCHY 1
  */

  $scope.createHierarchy1 = function(level){
    var obj = {
      level:level.name
    }
    $http.post("/createHierarchy",{obj,type:"l1"})
      .then(function(response){
        console.log(response)
        localStorage.setItem("l1", response.data._id);
        $state.go('createHierarchy2');
    });
  }

  /*
  ***
  CREATE HIERARCHY 2
  */
  $scope.createHierarchy2 = function(level, levelData){
    console.log(level, levelData)
    var obj = {
      level:level.name,
      level1:levelData._id
    }
    $http.post("/createHierarchy",{obj,type:"l2"})
      .then(function(response){
        localStorage.setItem("l2", response.data._id);
        $state.go('createHierarchy3');
    });
  }

  /*
  ***
  CREATE HIERARCHY 3
  */
  $scope.createHierarchy3 = function(level, levelData, levelData2){
    var obj = {
      level:level.name,
      level1:levelData._id,
      level2:levelData2._id
    }
    $http.post("/createHierarchy",{obj,type:"l3"})
      .then(function(response){
        $state.go("adminDashboard");
    });
  }

  /*
  ***
  CREATE HIERARCHY 3
  */
  $scope.deleteHierarchy = function(id){

    $http.post("/createHierarchy",{id:id, deleteList:true})
      .then(function(response){
        $state.go("adminDashboard");
    });
  }

  /*
  ***
  GET LEVEL
  */

  $scope.rootList = function(){
    $http.post('/createHierarchy', {getList:true})
      .then(function(response){
        console.log(response)
          $scope.rootList = response.data;
      })
  }

  /*
  ***
  VIEW LEVEL'S DETAILS
  */

  $scope.viewDetailHierarchy = function(list){
    console.log(list);
    $scope.levelName = list.name;
    $scope.levelId = list._id;
    $("#myModal").modal('show')
  }

  /*
  ***
  UPDATE LEVEL'S DETAILS
  */

  $scope.updateLevel = function(id, level, type){
    console.log(level, id, type);
    $http.post("/createHierarchy",{id:id,value:level,type:type,updateList:true})
      .then(function(response){
        console.log(response);
        alert("done");
    });
  }

  //socket implementation
  var socket = io();

  socket.on('checkIs', function(data){
      console.log(data)
  })

  socket.on('specificWeb', function(data){
    if(JSON.parse(data.userId) == JSON.parse(localStorage.getItem('id'))
    && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId) != -1){
      console.log("done");
      $state.go('viewSession');
    }
  });
  // socket.on('newclientconnect', function(data){
  //     console.log(data, "done");
  // })
  socket.on('newclientconnect', function(data) {
    console.log("done");
    console.log(data, localStorage.getItem('id'), localStorage.getItem('sessionArray'));
    if(data.sessionId!="data"){
      console.log(JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId), data.sessionCoreId)
      if(data.userId == JSON.parse(localStorage.getItem('id'))
      && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sessionCoreId) != -1){
        $http.post("/viewSession", {sessionId:data.sessionId, getSessionData:true})
        .then(function(response){
          $rootScope.photosData = response.data[0].photos;
          $state.go('slideShow');
        });
      }
    }else{
      console.log(data);
      if(JSON.parse(data.userId) == JSON.parse(localStorage.getItem('id'))
      && JSON.parse(localStorage.getItem('sessionArray')).indexOf(data.sCoreId) != -1){
        console.log("done");
        $state.go('viewSession');
      }
    }
  });


});

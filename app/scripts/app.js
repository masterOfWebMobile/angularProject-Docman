'use strict';

/**
 * @ngdoc overview
 * @name docmanWebApp
 * @description
 * # docmanWebApp
 *
 * Main module of the application.
 */
angular
  .module('docmanWebApp', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'darthwade.dwLoading',
    'docman.loading',
    'docman.auth',
    'docman.user-model',
    'docman.fund-model',
    'docman.doc-model',
    'docman.user',
    'docman.funds',
    'docman.followers',
    'docman.subscription'
  ])

  .config(function ($stateProvider, $urlRouterProvider) {

    // firebase setting

    firebase.initializeApp({
      apiKey: "AIzaSyCinLyfYdnUrh-5tT7j68yaBMVcFPY8jz8",
      authDomain: "docman-8da8c.firebaseapp.com",
      databaseURL: "https://docman-8da8c.firebaseio.com",
      storageBucket: "docman-8da8c.appspot.com",
    });

  	// states settings

	  $urlRouterProvider.otherwise('/login/signin');
	  
    $stateProvider
    
    .state('login', {
      url: '/login',
      abstract: true,
      templateUrl: 'views/login.html',
      data: {
        redirectIfAuth: true
      }
    })

    .state('login.signin', {
      url: '/signin',
      templateUrl: 'views/login-signin.html',
      controller: 'LoginCtrl'      
    })

    .state('login.register', {
      url: '/register',
      templateUrl: 'views/login-signup.html',
      controller: 'RegisterCtrl'
    })

    .state('login.forget', {
      url: '/forget',
      templateUrl: 'views/login-forget.html',
      controller: 'ForgetCtrl'
    })

    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'views/main.html',
      data: {
        auth: true
      }
    })

    .state('main.profile', {
      url: '/profile',
      views: {
        'main-profile': {
          templateUrl: 'views/main-profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('main.funds', {
      url: '/funds',
      views: {
        'main-funds': {
          templateUrl: 'views/main-funds.html',
          controller: 'FundsCtrl'
        }
      }
    })

    .state('main.followers', {
      url: '/followers',
      views: {
        'main-followers': {
          templateUrl: 'views/main-followers.html',
          controller: 'FollowersCtrl'
        }
      }
    })

    .state('main.subscription', {
      url: '/subscription',
      views: {
        'main-subscription': {
          templateUrl: 'views/main-subscription.html',
          controller: 'SubscriptionCtrl'
        }
      }
    })    

  })

  .run(function($rootScope, $state, Auth) {

    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (Auth.getID()) {
        if (next.data && next.data.redirectIfAuth) {
          event.preventDefault();
          $state.go('main.profile');
        }
      } else {
        if (next.data && next.data.auth) {
          event.preventDefault();
          $state.go('login.signin');
        }
      }
    });

  })

  .controller('DocmanCtrl', function($scope, $http, Auth) {

    $scope.lang = {};
    $scope.ui = {};

    // get language

    $http.get('lang.json',{
    }).then(function(result){
      $scope.lang = result.data;
      $scope.ui = $scope.lang['en'];
    });

    // logout

    $scope.logout = function() {
      Auth.signOut(); 
    };

  })





'use strict';

/**
 * @ngdoc function
 * @name docmanWebApp.controller:LoginCtrl, RegisterCtrl
 * @description
 * # LoginCtrl, RegisterCtrl
 * Controller of the docmanWebApp
 */
angular.module('docman.user', [])

  .controller('RegisterCtrl', function ($scope, $state, Auth) {
    
    $scope.form = {};

    $scope.signUp = function() {
      Auth.signUp($scope.form).then(function(){
        $state.go('main.profile');
      }).catch(function(error){
        $scope.form.error = error;
      });
    };

  })

  .controller('LoginCtrl', function ($scope, $state, Auth) {

    $scope.form = {};

    $scope.signIn = function() {
      Auth.signIn($scope.form.username, $scope.form.password).then(function(){
        $state.go('main.profile');
      }).catch(function(error){
        $scope.form.error = error;
      });
    };
    
  })

  .controller('ForgetCtrl', function ($scope) {
  
    

  })

  .controller('ProfileCtrl', function ($scope, $q, Auth, DocFile) {

    // get user's information

    Auth.getUser().then(function(user){

      $scope.form = {
        username: user.username,     
        email: user.email,
        password: user.password,
        repassword: user.password,
        address1: user.address1 || '',
        address2: user.address2 || '',
        logo: user.logo
      };

      if (user.logo) {
        DocFile.download(user.logo).then(function(url){
          $scope.logoUrl = url;
        }).catch(function(error){
        })
      }

    }).catch(function(error){
      Auth.signOut();
    })

    $scope.browser = function() {

      $('#logo-file').click();

    }
    
    // save user's information

    $scope.update = function() {

      var file = $('#logo-file')[0].files[0];
      if (file) {
        var uploadfile = "logo-" + Auth.getID();
        DocFile.upload(file, uploadfile).then(function(){
          $scope.form.logo = uploadfile;
          updateProfile();
        }).catch(function(){
          $scope.form.error = error;
        });          
      } else {
        updateProfile();
      }
            
    };

    function updateProfile() {
      Auth.updateUser($scope.form).catch(function() {
        $scope.form.error = error;
      });
    }

    /*
      change logo file
     */
    $('#logo-file')[0].addEventListener('change', function(evt){
      
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt.target.files[0];
      var img = $('.profile-container .logo')[0];
      img.classList.add("obj");
      img.file = file;

      var reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);

    }, false);

  })

;

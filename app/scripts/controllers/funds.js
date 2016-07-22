'use strict';

angular.module('docman.funds', [])

  .controller('FundsCtrl', function ($timeout, $scope, $location, $anchorScroll, Auth, Funds, Fund, Docs, Doc, DocFile) {

    /*
      new fund
     */
  	$scope.newFund = function() {
      var fund = new Fund();
      Funds.setFund(fund).then(function() {
        $scope.funds.push(fund);
        $scope.selectFund(fund);
      }).catch(function(error) {
        console.log(error);
      });
    };

    /*
      select fund
     */
    $scope.selectFund = function(fund) {
      $scope.form = fund;
      $scope.docs = [];
      $scope.mq = 'm';
      $scope.date = new Date();
      Docs.getAll($scope.form.id).then(function(docs){
        $scope.docs = docs;
      }).catch(function(){
      });
    }

    /*
      save fund
     */
    $scope.publish_new = function() {
      Funds.setFund($scope.form).then(function() {
        console.log('saved');
      }).catch(function(error) {
        console.log(error);
      });
    }

    /*
      add document file
     */
    $('#new-document input')[0].addEventListener('change', function(evt){
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt.target.files[0];
      DocFile.upload(file).then(function(uploadname){
        $(evt.target).val('');
        var doc = new Doc({
          fid: $scope.form.id,
          filename: file.name,
          uploadname: uploadname,
          date: $scope.date,
          wq: $scope.wq,
          mtd: $scope.mtd,
          ytd: $scope.ytd,
          avg: $scope.avg,
        });
        Docs.setDoc(doc).then(function(){
          $scope.docs.push(doc);
        }).catch(function(error){
        });
      }).catch(function(error){
      });
    }, false);

    /*
      ui functions
     */
    $scope.gotoNewDocument = function() {
      $location.hash('new-document');
      $anchorScroll();
    };

    $scope.popupDatePicker = { opened: false };
    $scope.openDataPicker = function() {
      $scope.popupDatePicker.opened = true;
    };

    /*
      get all documents
     */    
    Funds.getAll(Auth.getID()).then(function(list) {
      $scope.funds = list;
      if (list.length) {
        $scope.selectFund(list[0]);
      }
    }).catch(function(error) {
      console.log(error);
    });

  })

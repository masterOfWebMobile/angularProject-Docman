
angular.module('docman.loading', [])

.service('Loading', function($loading){

  var self = this;
  var counter = 0;

  this.show = function() {
    if (counter == 0) {
      $loading.start('loading');
    }
    counter++;
  }

  this.hide = function() {
    counter--;
    if (counter == 0) {
      $loading.finish('loading');
    }
  }

  this.progress = function(promise) {
    self.show();
    return promise.then(function(){
      self.hide();
      return promise;
    }).catch(function(){
      self.hide();
      return promise;
    });
  }

})

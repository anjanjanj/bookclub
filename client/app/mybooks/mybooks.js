'use strict';

angular.module('bookclubApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mybooks', {
        url: '/my',
        templateUrl: 'app/mybooks/mybooks.html',
        controller: 'MybooksCtrl',
        authenticate: true
      });
  });

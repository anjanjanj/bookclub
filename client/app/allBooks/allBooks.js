'use strict';

angular.module('bookclubApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('allBooks', {
        url: '/all',
        templateUrl: 'app/allBooks/allBooks.html',
        controller: 'AllBooksCtrl'
      });
  });
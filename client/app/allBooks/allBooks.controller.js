'use strict';

angular.module('bookclubApp')
  .controller('AllBooksCtrl', function ($scope, booksFactory) {

    $scope.books = [];

    booksFactory.getBooksList().then(function success(response) {
      //console.log(response);
      $scope.books = response;
    }, function failure(response) {
      console.error(response);
    });

  });

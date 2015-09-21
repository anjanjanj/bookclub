'use strict';

angular.module('bookclubApp')
  .controller('MybooksCtrl', function ($scope, booksFactory, Auth) {
    //$scope.message = 'Hello';
    //console.log(Auth.getCurrentUser()._id);

    $scope.books = [];

    booksFactory.getBooksList(Auth.getCurrentUser()._id).then(function success(response) {
      //console.log(response);
      $scope.books = response;
    }, function failure(response) {
      console.error(response);
    });

    $scope.addBook = function() {
      booksFactory.addBook($scope.bookName).then(function success(book) {
        //$scope.books.push({name: $scope.bookName, owner: Auth.getCurrentUser()._id});
        $scope.bookName = '';
        $scope.books.push(book);
        console.log(book);
      });
    };

  });

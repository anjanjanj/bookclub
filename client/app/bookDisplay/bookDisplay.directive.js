'use strict';

angular.module('bookclubApp')
  .directive('bookDisplay', ['booksFactory', function(booksFactory) {
    return {
      templateUrl: 'app/bookDisplay/bookDisplay.html',
      restrict: 'E',
      controller: function($scope) {
        $scope.trade = function(book) {
          if (book.canTrade) {
            book = booksFactory.proposeTrade(book);
            // book.canTrade = false;
            // console.log(book);
          }
        };
      },
      link: function(scope, element, attrs) {}
    };
  }]);

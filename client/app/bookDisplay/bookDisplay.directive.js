'use strict';

angular.module('bookclubApp')
  .directive('bookDisplay', ['booksFactory', function(booksFactory) {
    return {
      templateUrl: 'app/bookDisplay/bookDisplay.html',
      restrict: 'E',
      controller: function($scope) {
        $scope.trade = function(book) {
          booksFactory.proposeTrade(book);
        };
      },
      link: function(scope, element, attrs) {}
    };
  }]);

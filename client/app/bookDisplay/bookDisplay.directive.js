'use strict';

angular.module('bookclubApp')
  .directive('bookDisplay', function () {
    return {
      templateUrl: 'app/bookDisplay/bookDisplay.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });

'use strict';

angular.module('bookclubApp')
  .controller('TradesListCtrl', function ($scope, Auth, booksFactory) {
    if (Auth.isLoggedIn()) {
      // get all incoming trade requests for this user
      booksFactory.getIncomingTradeRequests(Auth.getCurrentUser()._id).then(function success(response) {
        $scope.incomingTrades = response;
      }, function failure(response) {
        console.error(response);
      });

      // get all outgoing trade requests for this user
      booksFactory.getOutgoingTradeRequests(Auth.getCurrentUser()._id).then(function success(response) {
        $scope.outgoingTrades = response;
      }, function failure(response) {
        console.error(response);
      });
    }
  });

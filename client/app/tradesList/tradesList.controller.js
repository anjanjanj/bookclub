'use strict';

angular.module('bookclubApp')
  .controller('TradesListCtrl', function ($scope, Auth, booksFactory, $http) {

    if (Auth.isLoggedIn()) {
      // get all incoming trade requests for this user
      booksFactory.getIncomingTradeRequests(Auth.getCurrentUser()._id).then(function success(response) {
        $scope.incomingTrades = response;
        getUserInfoFromTrades($scope.incomingTrades, true);
      }, function failure(response) {
        console.error(response);
      });

      // get all outgoing trade requests for this user
      booksFactory.getOutgoingTradeRequests(Auth.getCurrentUser()._id).then(function success(response) {
        $scope.outgoingTrades = response;
        getUserInfoFromTrades($scope.outgoingTrades, false);
      }, function failure(response) {
        console.error(response);
      });
    }

    $scope.accept = function(book) {
      book = booksFactory.acceptTrade(book, book.borrowerId);
    };

    $scope.reject = function(book) {
      book = booksFactory.rejectTrade(book, book.borrowerId);
    };

    var getUserInfoFromTrades = function(trades, incoming) {
      trades.forEach(function (trade) {
        $http.get('/api/users/'+(incoming ? trade.borrowerId : trade.owner)).then(function success(response) {
          // console.log(response.data);
          trade.userCity = response.data.city;
          trade.userState = response.data.state;
          trade.userName = response.data.name;
        }, function failure(response) {
          console.error(response);
        });
      });
    };


  });

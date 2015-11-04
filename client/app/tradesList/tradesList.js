'use strict';

angular.module('bookclubApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tradesList', {
        url: '/trades',
        templateUrl: 'app/tradesList/tradesList.html',
        controller: 'TradesListCtrl'
      });
  });
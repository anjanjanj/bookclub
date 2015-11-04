'use strict';

describe('Controller: TradesListCtrl', function () {

  // load the controller's module
  beforeEach(module('bookclubApp'));

  var TradesListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TradesListCtrl = $controller('TradesListCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: AllBooksCtrl', function () {

  // load the controller's module
  beforeEach(module('bookclubApp'));

  var AllBooksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllBooksCtrl = $controller('AllBooksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

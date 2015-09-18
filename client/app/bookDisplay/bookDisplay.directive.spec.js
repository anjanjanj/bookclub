'use strict';

describe('Directive: bookDisplay', function () {

  // load the directive's module and view
  beforeEach(module('bookclubApp'));
  beforeEach(module('app/bookDisplay/bookDisplay.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<book-display></book-display>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the bookDisplay directive');
  }));
});
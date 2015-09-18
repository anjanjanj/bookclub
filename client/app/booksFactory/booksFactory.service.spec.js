'use strict';

describe('Service: booksFactory', function () {

  // load the service's module
  beforeEach(module('bookclubApp'));

  // instantiate service
  var booksFactory;
  beforeEach(inject(function (_booksFactory_) {
    booksFactory = _booksFactory_;
  }));

  it('should do something', function () {
    expect(!!booksFactory).toBe(true);
  });

});

'use strict';

angular.module('bookclubApp')
  .factory('booksFactory', function($http, $q, Auth, Modal) {

    var getBooksList = function(userId) {
      return $q(function(resolve, reject) {
        var endpoint = '/api/books';

        $http.get(endpoint).then(function success(response) {
          var booksList;

          if (userId) {
            booksList = _.filter(response.data, function(book) {
              return book.owner === userId;
            });
            //getBookCovers(thisUsersBooks).then(function(results) {
            // something like _.combine getBookCovers(thisUsersBooks)
            //console.log(results);
            //});
          } else {
            booksList = response.data;
          }

          // @TODO: add check that user hasn't already requested a trade on this book
          if (Auth.isLoggedIn()) {
            booksList.forEach(function(book) {
              if (book.owner != Auth.getCurrentUser()._id) {
                book.canTrade = true;
              }
            });
          }

          resolve(booksList);
        }, function failure() {
          reject('Error collecting books');
        });
      });
    };

    var addBook = function(bookName) {
      return $q(function(resolve, reject) {
        if (bookName === '') {
          reject('No book specified!');
        }
        $http.post('/api/books', {
          name: bookName
        }).then(function success(response) {
          resolve(response.data);
        }, function failure(response) {
          reject(response);
        });
      });
    };

    var getBookCovers = function(bookNamesArray) {
      return $q(function(resolve, reject) {
        var results = [];
        bookNamesArray.forEach(function(book) {
          var encodedBookName = encodeURIComponent(book);

          // @FIXME: try using Firefox to examine the request
          $http.get('https://www.googleapis.com/books/v1/volumes?q=' + encodedBookName + '&maxResults=1&orderBy=relevance&key=AIzaSyA5AP_X7PO5fL-K7bIdF35zEUfOQdU7yJ8').then(function success(response) {
            //results.push(----);
            //console.log(response.body.items[0].volumeInfo.imageLinks.thumbnail);
            console.log(response);
            if (results.length >= bookNamesArray.length) {
              resolve(results);
            }
          }, function failure(response) {
            reject(response);
          });

        });
      });
    };

    var proposeTrade = function(book) {
      if (book.owner !== Auth.getCurrentUser()._id) {
        //return Modal.confirm.trade(function(book) {

        // @TODO: + if the user hasn't already proposed a trade for the book
          if (window.confirm('Propose trade?')) {
            console.log('trade proposed');
            // POST /api/books/trade/:bookId (option 'propose')
            // later, POST /api/books/trade/:bookId (option 'accept')
            // ,,,,,, POST /api/books/trade/:bookId (option 'reject')
          }
      }
      else {
        console.error('This is your book!');
      }
      //pollFactory.deletePoll(poll._id).then(function (res) {
      //  $location.path('/my');
      //}, function(res) {
      //  console.log(JSON.stringify(res));
      //});
      //});
    };

    // Public API here
    return {
      getBooksList: getBooksList,
      addBook: addBook,
      proposeTrade: proposeTrade
    };
  });

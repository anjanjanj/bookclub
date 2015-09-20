'use strict';

angular.module('bookclubApp')
  .factory('booksFactory', function($http, $q) {
    // Service logic
    // ...

    var getBooksList = function(userId) {
      return $q(function(resolve, reject) {
        var endpoint = '/api/books';

        $http.get(endpoint).then(function success(response) {
          if (userId) {
            var thisUsersBooks = _.filter(response.data, function(book) {
              return book.owner === userId;
            });

            resolve(thisUsersBooks);
          } else {
            resolve(response.data);
          }
        }, function failure() {
          reject('Error collecting books');
        });
      });
    };

    var addBook = function(bookName) {
      return $q(function (resolve, reject) {
        if(bookName === '') {
          reject('No book specified!');
        }
        $http.post('/api/books', { name: bookName }).then(function success(response) {
          resolve(response);
        }, function failure(response) {
          reject(response);
        });
      });
    };

    var getBookCover = function(bookName) {
      return $q(function (resolve, reject) {
        var encodedBookName = encodeURIComponent(bookName);
        $http.get('https://www.googleapis.com/books/v1/volumes?q='+encodedBookName+'&maxResults=1&orderBy=relevance&key=AIzaSyCmFa9yTif-u0rBC2v52-U7LXPV1izGPuk').then(function success(response) {
          console.log(response.body.items[0].volumeInfo.imageLinks.thumbnail);
          resolve(response);
        }, function failure(response) {
          reject(response);
        });
      });
    };

    // Public API here
    return {
      getBooksList: getBooksList,
      addBook: addBook,
      getBookCover: getBookCover
    };
  });

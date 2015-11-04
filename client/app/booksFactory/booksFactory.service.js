'use strict';

angular.module('bookclubApp')
  .factory('booksFactory', function($http, $q, Auth) {

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

          if (Auth.isLoggedIn()) {
            booksList.forEach(function(book) {
              if (book.owner != Auth.getCurrentUser()._id) {
                book.canTrade = true;
              }
              if (book.tradeRequests && book.tradeRequests.some(function (tradeRequest) {
                return tradeRequest.status !== 'rejected' && tradeRequest.borrowerId == Auth.getCurrentUser()._id;
              })) {
                book.canTrade = false;
              }
              //_.filter(summary.data, {category: [{parent: 'Food'}] });
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

        // @TODO: + if the user hasn't already proposed a trade for the book... is this already fixed?
        if (window.confirm('Propose trade?')) {
          console.log('trade proposed');
          // POST /api/books/trade/:bookId (option 'propose')
          // (or /api/books/trade/propose/:bookId)
          // later, POST /api/books/trade/:bookId (option 'accept')
          // ,,,,,, POST /api/books/trade/:bookId (option 'reject')

          $http.patch('/api/books/trade/'+book._id, {borrowerId: Auth.getCurrentUser()._id, status: 'proposed'}).then(function success(response) {
            // @TODO: provide a way to update the trade icon
            console.log(response.data);
          }, function failure(response) {
            console.error(response);
          });
        }
      } else {
        console.error('This is your book!');
      }
      //pollFactory.deletePoll(poll._id).then(function (res) {
      //  $location.path('/my');
      //}, function(res) {
      //  console.log(JSON.stringify(res));
      //});
      //});
    };

    var acceptTrade = function(book, tradeRequester) {
      $http.patch('/api/books/trade/'+book.bookId, {borrowerId: tradeRequester, status: 'accepted'}).then(function success(response) {
        book = response.data;
        console.log(response.data);
      }, function failure(response) {
        console.error(response);
      });
    };

    var rejectTrade = function(book, tradeRequester) {
      $http.patch('/api/books/trade/'+book.bookId, {borrowerId: tradeRequester, status: 'rejected'}).then(function success(response) {
        book = response.data;
        console.log(response.data);
      }, function failure(response) {
        console.error(response);
      });
    };

    var getIncomingTradeRequests = function(userId) {
      return $q(function(resolve, reject) {
        getBooksList(userId).then(function success(response) {
          var books = response;
          var tradeRequests = [];
          //console.log(books);
          books.forEach(function(book) {
            if (book.tradeRequests) {
              book.tradeRequests.forEach(function(tradeRequest) {
                if (tradeRequest.status === 'proposed') {
                  tradeRequests.push({
                    bookId: book._id,
                    name: book.name,
                    borrowerId: tradeRequest.borrowerId,
                    status: tradeRequest.status
                  });
                }
              });
            }
          });

          resolve(tradeRequests);
        }, function failure(response) {
          reject(response);
        });
      });
    };

    var getOutgoingTradeRequests = function(user) {
      return $q(function(resolve, reject) {
        getBooksList().then(function success(response) {
          var books = response;
          var tradeRequests = [];
          //console.log(books);
          books.forEach(function(book) {
            if (book.tradeRequests) {
              book.tradeRequests.forEach(function(tradeRequest) {
                if (tradeRequest.borrowerId === user) {
                  tradeRequests.push({
                    bookId: book._id,
                    name: book.name,
                    borrowerId: tradeRequest.borrowerId,
                    status: tradeRequest.status
                  });
                }
              });
            }
          });

          resolve(tradeRequests);
        }, function failure(response) {
          reject(response);
        });
      });
    };

    // Public API here
    return {
      getBooksList: getBooksList,
      addBook: addBook,
      proposeTrade: proposeTrade,
      acceptTrade: acceptTrade,
      rejectTrade: rejectTrade,
      getIncomingTradeRequests: getIncomingTradeRequests,
      getOutgoingTradeRequests: getOutgoingTradeRequests
    };
  });

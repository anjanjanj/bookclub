'use strict';

var _ = require('lodash');
var Book = require('./book.model');
var request = require('request');
//var fs = require('fs');

// Get list of books
exports.index = function(req, res) {
  Book.find(function(err, books) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(books);
  });
};

// Get a single book
exports.show = function(req, res) {
  Book.findById(req.params.id, function(err, book) {
    if (err) {
      return handleError(res, err);
    }
    if (!book) {
      return res.status(404).send('Not Found');
    }
    return res.json(book);
  });
};

// Creates a new book in the DB.

exports.create = function(req, res) {
  var userId = req.user._id;

  var encodedBookName = encodeURIComponent(req.body.name);
  var options = {
    url: 'https://www.googleapis.com/books/v1/volumes?q='+encodedBookName+'&maxResults=1&orderBy=relevance&key=AIzaSyCmFa9yTif-u0rBC2v52-U7LXPV1izGPuk',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(error, response, body) {
    var thumbnail = '';
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      if (info.items[0].volumeInfo.imageLinks.thumbnail) {
        thumbnail = info.items[0].volumeInfo.imageLinks.thumbnail;
      }
    }
    else {
      console.log(error);
    }
    Book.create({
      name: req.body.name,
      owner: userId,
      thumbnail: thumbnail
    }, function(err, book) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(201).json(book);
    });
  });
};

// Updates an existing book in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Book.findById(req.params.id, function(err, book) {
    if (err) {
      return handleError(res, err);
    }
    if (!book) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(book, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(book);
    });
  });
};

exports.updateTrade = function(req, res) {
  Book.findById(req.params.id, function(err, book) {
    if (err) {
      return handleError(res, err);
    }
    if (!book) {
      return res.status(404).send('Book not found');
    }
    if (req.body.status === 'proposed') {
      // user wants to propose a trade
      // + user should NOT be the owner of this book
      // + also the user not have any existing unrejected trade requests for this book
      if (book.owner == req.user._id) {
        return res.status(403).send('You own this book');
      }
      if (book.tradeRequests) {
        //console.log(book.tradeRequests);
        var invalid = false;
        book.tradeRequests.forEach(function(tradeRequest) {
          if ((String(tradeRequest.borrowerId) === String(req.user._id)) && (tradeRequest.status === 'accepted' || tradeRequest.status === 'proposed')) {
            invalid = true;
          }
        });
        if (invalid) {
          return res.status(403).send('Trade request exists');
        }
      }

      book.tradeRequests = book.tradeRequests || [];
      book.tradeRequests.push({borrowerId: req.user._id, status: 'proposed'});

      book.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(book);
      });

      //console.log(req.params.id, req.body);
    }
    else if (req.body.status === 'accepted' || req.body.status === 'rejected') {
      // user wants to accept or reject a trade
      // + user should own the book in question
      // + also the trade in question should
      //    a) exist
      //    b) have a 'proposed' status
      if (book.owner != req.user._id) {
        return res.status(403).send('You do not own this book');
      }
      if (book.tradeRequests) {
        //console.log(book.tradeRequests);
        var trade = book.tradeRequests.filter(function (tradeRequest) {
          return (String(tradeRequest.borrowerId) === String(req.body.borrowerId)) && (tradeRequest.status === 'proposed');
        });

        if (trade.length === 0) {
          return res.status(404).send('Trade request not found!');
        }

        console.log('valid trade found', trade[0]);

        // update/replace the trade request inside the book.tradeRequests array
        var index = _.indexOf(book.tradeRequests, _.find(book.tradeRequests, {
          borrowerId: req.body.borrowerId,
          status: 'proposed'
        }));

        book.tradeRequests.splice(index, 1, {
          borrowerId: req.body.borrowerId,
          status: req.body.status
        });

        console.log(book);

        // save the updated book
        book.save(function(err) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(book);
        });
      }

    }
  });
};

// Deletes a book from the DB.
exports.destroy = function(req, res) {
  Book.findById(req.params.id, function(err, book) {
    if (err) {
      return handleError(res, err);
    }
    if (!book) {
      return res.status(404).send('Not Found');
    }
    book.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

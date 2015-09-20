'use strict';

var _ = require('lodash');
var Book = require('./book.model');
//var request = require('request');
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
  console.log(process.cwd());
  var userId = req.user._id;
  Book.create({
    name: req.body.name,
    owner: userId
  }, function(err, book) {
    if (err) {
      return handleError(res, err);
    }
    /*
    // find and download the image! - oops, turns out Heroku can't be uploaded to
    var encodedBookName = encodeURIComponent(req.body.name);
    var options = {
      url: 'https://www.googleapis.com/books/v1/volumes?q='+encodedBookName+'&maxResults=1&orderBy=relevance&key=AIzaSyCmFa9yTif-u0rBC2v52-U7LXPV1izGPuk',
      headers: {
        'User-Agent': 'request'
      }
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        //console.log(JSON.stringify(info));
        if (info.items[0].volumeInfo.imageLinks.thumbnail) {
          var thumbnail = info.items[0].volumeInfo.imageLinks.thumbnail;
          // *** add path!
          request(thumbnail).pipe(fs.createWriteStream('uploads/'+book._id+'.jpg'));
        }
      }
      else {
        console.log(error);
      }
    }
    // GET 'https://www.googleapis.com/books/v1/volumes?q='+encodedBookName+'&maxResults=1&orderBy=relevance&key=AIzaSyCmFa9yTif-u0rBC2v52-U7LXPV1izGPuk'
    request(options, callback);
    */

    return res.status(201).json(book);
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

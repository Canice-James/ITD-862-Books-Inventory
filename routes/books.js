var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Book = require('../models/book');

/* GET books listing. */

router.post('/', function(req, res, next) {
  let bookToCreate = new Book(req.body);
  bookToCreate.save(function(err, book){
    res.send(book);
  });
});

router.get('/', function(req, res, next) {
  Book.find(function (err, books){
    if (err) return console.error(err);
    res.json(books);    
  });
});

router.get('/:id', function(req, res, next) {
  Book.findOne({_id: req.params["id"]}, function (err, book){
    if (err) return console.error(err);
    res.send(book);
  });
});

router.put('/:id', function(req, res, next) {
  Book.findByIdAndUpdate({_id: req.params["id"]}, req.body, function(err, book) {
    if (err) return next(err);
    res.status(204).send();
  });
}); 

router.delete('/:id', function(req, res, next) {
  Book.deleteOne({_id: req.params["id"]}, function(err, book) {
    if (err) return next(err);
    res.status(204).send();
  });
});

module.exports = router;



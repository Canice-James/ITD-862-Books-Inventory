let mongoose = require("mongoose");
let Book = require('../models/book');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let http = require('http');

let server = http.createServer(app);
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
  before(done => {
    server.listen(0);
    done();
  }); 
  beforeEach(done => {
    Book.remove({}, (err) => {
      done();
    });
  });

  after(done => {
    server.close();
    mongoose.disconnect();
    done();
  });

  describe('GET /api/books', () => {
    it ('should GET all the books', (done)=>{
      let expectedBook = new Book({
        title: "The Melancholy Of Haruhi",
        author: "Kazuma Tenchi",
        numPages: 186
      });

      expectedBook.save(function (err, book) {
        if (err) return console.error(err);
        chai.request(server)
            .get('/api/books')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
            });
      });
    });
  });

  describe('GET /api/books/:id', () => {
    it ('should get an existing book', (done)=>{
      let existingBook = new Book({
        title: "The Melancholy Of Haruhi Suzuri",
        author: "Kazuma Tenchi",
        numPages: 186
      });

      existingBook.save(function (err, book){
        chai.request(server)
            .get('/api/books/' + book.id)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property("title").eql(existingBook.title);
              res.body.should.have.property("author").eql(existingBook.author);
              res.body.should.have.property("numPages").eql(existingBook.numPages);
              done();
            });
      });
    });
  });

  describe('POST /api/books', () => {
    it ('should add a new book', (done)=>{
      let expectedBook = new Book({
        title: "The Melancholy Of Haruhi",
        author: "Kazuma Tenchi",
        numPages: 186
      });

      chai.request(server)
        .post('/api/books')
        .send(expectedBook)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property("title").eql(expectedBook.title);
          res.body.should.have.property("author").eql(expectedBook.author);
          res.body.should.have.property("numPages").eql(expectedBook.numPages);
          done();
        });
    });
  });

  describe('PUT /api/books/:id', () => {
    it ('should update an existing book', (done)=>{
      let existingBook = new Book({
        title: "The Melancholy Of Haruhi Suzuri",
        author: "Kazuma Tenchi",
        numPages: 186
      });

      let expectedBook = new Book({
        title: "The Melancholy Of Haruhi Suzuri",
        author: "Kazuma Tenchi",
        numPages: 217
      });

      existingBook.save(function (err, book){
        if (err) return console.error(err);
        chai.request(server)
            .put('/api/books/' + book.id)
            .send(expectedBook)
            .end((err, res) => {
              res.should.have.status(204);
              res.body.should.be.empty;

              Book.findOne({_id: existingBook.id}, function(err, foundBook) {
                if (err) return console.error(err);
                foundBook.should.be.a('object');
                foundBook.should.have.property("title").eql(expectedBook.title);
                foundBook.should.have.property("author").eql(expectedBook.author);
                foundBook.should.have.property("numPages").eql(expectedBook.numPages);
                done();
              });
          });
        });
    });
  });

  describe('DELETE /api/books/:id', () => {
    it ('should delete an existing book', (done)=>{
      let existingBook = new Book({
        title: "The Melancholy Of Haruhi Suzuri",
        author: "Kazuma Tenchi",
        numPages: 186
      });

      existingBook.save(function (err, book){
        if (err) return console.error(err);
        chai.request(server)
            .delete('/api/books/' + book.id)
            .end((err, res) => {
              res.should.have.status(204);
              res.body.should.be.empty;

              Book.findOne({_id: existingBook.id}, function(err, book) {
                if (err) return console.error(err);
                should.not.exist(book);
                done();
              });
             });
        });
      });
  });

});
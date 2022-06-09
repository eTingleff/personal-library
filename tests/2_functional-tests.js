/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);
let testingId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', () => {

    suite('POST /api/books with title => create book object/expect book object', () => {

      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Moby Dick' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isTrue(ObjectId.isValid(res.body._id));
            assert.equal(res.body.title, 'Moby Dick');
            testingId = res.body._id;

            done();
          });
      });

      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'missing required field title');

            done();
          });
      });

    });


    suite('GET /api/books => array of books', () => {

      test('Test GET /api/books',  (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.hasAllKeys(res.body[0], [
              '_id',
              'title',
              'commentcount',
            ]);

            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', () => {

      test('Test GET /api/books/[id] with id not in db',  (done) => {
        chai.request(server)
          .get(`/api/books/${new ObjectId()}`)
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.text, 'no book exists');

            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .get(`/api/books/${testingId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.hasAllKeys(res.body, [
              '_id',
              'title',
              'comments',
            ]);
            assert.deepEqual(res.body, {
              _id: testingId,
              title: 'Moby Dick',
              comments: [],
            });

            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {

      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
          .post(`/api/books/${testingId}`)
          .send({ comment: 'Test comment' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
              _id: testingId,
              title: 'Moby Dick',
              comments: ['Test comment'],
            });

            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai.request(server)
          .post(`/api/books/${testingId}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'missing required field comment');

            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai.request(server)
          .post(`/api/books/${new ObjectId()}`)
          .send({ comment: 'Test comment' })
          .end((err, res) => {
            assert.equal(res.status, 404);
            assert.equal(res.text, 'no book exists')

            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${testingId}`)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text, 'delete successful');

            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${new ObjectId()}`)
          .end((err, res) => {
            assert.equal(res.status, 404)
            assert.equal(res.text, 'no book exists');

            done();
          });
      });

    });

  });

});

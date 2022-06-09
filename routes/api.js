/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const {
  getAllBooksService,
  getBookService,
  createBookService,
  addBookCommentService,
  deleteAllBooksService,
  deleteOneBookService,
} = require('../app/books/book_service');

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const response = await getAllBooksService();

      return res.status(response.status).json(response.data);
    })

    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      const response = await createBookService(title);

      if (response.error) {

        return res.status(response.status).send(response.error);
      }
      return res.status(response.status).json(response.data);
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      const response = await deleteAllBooksService();
      if (response.error) {

        return res.status(response.status).send(response.error);
      }

      return res.status(response.status).send(response.data);
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const response = await getBookService(bookid);
      if (response.error) {

        return res.status(response.status).send(response.error);
      }

      return res.status(response.status).json(response.data);
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      const response = await addBookCommentService(bookid, comment);
      if (response.error) {

        return res.status(response.status).send(response.error);
      }

      return res.status(response.status).json(response.data);
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const response = await deleteOneBookService(bookid);
      if (response.error) {

        return res.status(response.status).send(response.error);
      }

      return res.status(response.status).send(response.data);
    });

};

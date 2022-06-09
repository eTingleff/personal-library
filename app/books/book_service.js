'use strict';

const { ObjectId } = require('mongodb');

const {
  findBooks,
  findOneBook,
  insertBook,
  updateBook,
  deleteManyBooks,
  deleteOneBook,
} = require('./book_dal');
const { createCommentService } = require('../comments/comment_service');
const { findComments } = require('../comments/comment_dal');

exports.getAllBooksService = async () => {
  try {
    const projection = {
      comments: 0,
    };
    const books = await findBooks({}, { projection });

    const response = {
      status: 200,
      data: books ? books : [],
    };

    return response;
  } catch (err) {
    console.error('getBooksService error: ', err);

    return 'could not get books';
  }
}

const getBookService = async (bookId) => {
  try {
    if (!ObjectId.isValid(bookId)) {

      return {
        status: 404,
        error: 'no book exists',
      };
    }

    const _id = new ObjectId(bookId);
    const projection = {
      commentcount: 0,
    };
    const book = await findOneBook({ _id }, { projection });

    if (!book) {

      return {
        status: 404,
        error: 'no book exists',
      };
    }

    let comments = [];
    if (book.comments && book.comments.length) {
      const conditions = {
        _id: {
          $in: book.comments,
        },
      };
      comments = await findComments(conditions);
      if (comments) {
        comments = comments.map((comment) => comment.text);
      }
    }

    const response = {
      ...book,
      comments,
    };

    return {
      status: 200,
      data: response,
    };
  } catch (err) {
    console.error('getBookService error: ', err);

    return 'could not get book';
  }
}

exports.getBookService = getBookService;

exports.createBookService = async (bookTitle) => {
  try {
    if (!bookTitle || !bookTitle.trim()) {

      return {
        status: 400,
        error: 'missing required field title',
      };
    }

    const title = bookTitle.trim();

    const book = {
      title,
      commentcount: 0,
      comments: [],
    };

    const insertResult = await insertBook(book);
    if (!insertResult.insertedId) {

      return 'could not create book';
    }

    const _id = insertResult.insertedId;

    return {
      status: 200,
      data: {
        _id,
        title,
      },
    };
  } catch (err) {
    console.error('createBookService error: ', err);

    return 'could not create book';
  }
}

exports.addBookCommentService = async (bookId, comment) => {
  try {
    const createCommentResult = await createCommentService(bookId, comment);

    if (createCommentResult && createCommentResult.error) {

      return createCommentResult;
    }

    const { _id } = createCommentResult;

    const bookFilter = {
      _id: new ObjectId(bookId),
    };
    const bookUpdate = {
      $push: {
        comments: _id,
      },
      $inc: {
        commentcount: 1,
      },
    };

    await updateBook(bookFilter, bookUpdate);

    const updatedBook = await getBookService(bookId);

    return updatedBook;
  } catch (err) {
    console.error('addBookCommentService error: ', err);

    return 'could not update book comments';
  }
}

exports.deleteAllBooksService = async () => {
  try {
    const deleteAllResult = await deleteManyBooks({});

    if (!deleteAllResult) {

      return 'could not delete';
    }

    return {
      status: 200,
      data: 'complete delete successful',
    };
  } catch (err) {
    console.error('deleteAllBooksService error: ', err);

    return 'could not delete';
  }
}

exports.deleteOneBookService = async (bookId) => {
  try {
    if (!ObjectId.isValid(bookId)) {

      return {
        status: 404,
        error: 'no book exists',
      };
    }

    const _id = new ObjectId(bookId);

    const deleteResult = await deleteOneBook({ _id });

    if (!deleteResult) {

      return 'could not delete';
    }

    const { deletedCount } = deleteResult;

    if (typeof deletedCount === 'number' && deletedCount === 0) {

      return {
        status: 404,
        error: 'no book exists',
      };
    }

    return {
      status: 200,
      data: 'delete successful',
    };
  } catch (err) {
    console.error('deleteOneBookService error: ', err);

    return 'could not delete';
  }
}

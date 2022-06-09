'use strict';

const { ObjectId } = require('mongodb');

const {
  insertComment,
} = require('./comment_dal');

exports.createCommentService = async (bookId, commentText) => {
  try {
    if (!ObjectId.isValid(bookId)) {

      return {
        error: 'no book exists',
      };
    }

    if (!commentText || !commentText.trim()) {

      return {
        error: 'missing required field comment',
      };
    }

    const text = commentText.trim();

    const comment = {
      bookId,
      text,
    };

    const result = await insertComment(comment);
    if (!result || !result.insertedId) {

      return {
        error: 'no book exists',
      };
    }

    return { _id: result.insertedId };
  } catch (err) {
    console.error('postCommentToBook error: ', err);

    return {
      error: 'could not post comment',
    };
  }
}

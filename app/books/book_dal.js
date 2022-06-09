'use strict';

const db = require('../../db');

exports.findBooks = (conditions, options = {}) => {

  return db.books().find(conditions, options).toArray();
}

exports.findOneBook = (conditions, options = {}) => {

  return db.books().findOne(conditions, options);
}

exports.insertBook = (book) => {

  return db.books().insertOne(book);
}

exports.updateBook = (filter, update) => {

  return db.books().updateOne(filter, update);
}

exports.deleteManyBooks = (filter, options = {}) => {

  return db.books().deleteMany(filter, options);
}

exports.deleteOneBook = (filter, options = {}) => {

  return db.books().deleteOne(filter, options);
}

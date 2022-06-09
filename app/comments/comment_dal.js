'use strict';

const db = require('../../db');

exports.findComments = (conditions, options) => {

  return db.comments().find(conditions, options).toArray();
}

exports.insertComment = (comment) => {

  return db.comments().insertOne(comment);
}

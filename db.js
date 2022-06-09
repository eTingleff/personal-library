'use strict';

const { MongoClient } = require('mongodb');

const url = process.env['MONGODB_URI'];
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const db_name = process.env['DB_NAME'];

let _db;

module.exports = {

  async connect() {
    const client = new MongoClient(url, config);
    await client.connect();
    _db = client.db(db_name);
  },

  getInstance() {
    return _db;
  }
}

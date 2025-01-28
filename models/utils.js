const db = require("../db/connection");

exports.checkValueExists = (value) => {
  let table = "";
  let column = "";
  let itemName = "";
  if (value.username) {
    table = "users";
    column = "username";
    itemName = "Username";
  }
  if (value.article_id) {
    table = "articles";
    column = "article_id";
    itemName = "Article";
  }
  if (value.comment_id) {
    table = "comments";
    column = "comment_id";
    itemName = "Comment";
  }
  if (value.topic_id) {
    table = "topics";
    column = "topic_id";
    itemName = "Topic";
  }
  const sql = `SELECT * FROM ${table} WHERE ${column} = $1`;
  return db.query(sql, [value[column]]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: `${itemName} not found`, status: 404 });
    }
  });
};

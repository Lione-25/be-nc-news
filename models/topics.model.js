const db = require("../db/connection");
const { checkItemExists } = require("./utils");

exports.selectTopics = () => {
  const sql = "SELECT * FROM topics;";
  return db.query(sql).then(({ rows }) => {
    return checkItemExists(rows);
  });
};

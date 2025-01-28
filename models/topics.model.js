const { sqlReturnTable } = require("./utils");

exports.selectTopics = () => {
  const sql = "SELECT * FROM topics;";
  return sqlReturnTable(sql);
};

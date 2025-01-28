const { sqlReturnTable } = require("./utils");

exports.selectUsers = () => {
  const sql = "SELECT * FROM users;";
  return sqlReturnTable(sql);
};

const endpointsJson = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.endpointNotFound = (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
};

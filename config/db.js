var dbURIs = {
  test: "mongodb://localhost/wdi-project-4-test",
  development: "mongodb://localhost/wdi-project-4",
  production: process.env.MONGODB_URI || "mongodb://localhost/wdi-project-4"
};

module.exports = function(env) {
  return dbURIs[env];
}
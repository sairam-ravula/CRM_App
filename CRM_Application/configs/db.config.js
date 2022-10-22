const dbConfig = {
  DB_NAME: "crm_app",
  DB_URL: process.env.MONGODB_URI || "mongodb://localhost/crm_app",
};

module.exports = dbConfig;

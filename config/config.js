module.exports = {
  // "development": {
  //   "username": "postgres",
  //   "password": "090696",
  //   "database": "twitterClone",
  //   "host": "127.0.0.1",
  //   "dialect": "postgres",
  //   "logging": false
  // },
  "production": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "postgres"
    //! For HEROKU
    // "use_env_variable": "DATABASE_URL",
    // "dialect": "postgres"
  }
}
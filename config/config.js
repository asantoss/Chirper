module.exports = {
  development: {
    "username": process.env.RDS_USERNAME || "postgres",
    "password": process.env.RDS_PASSWORD || "090696",
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.RDS_USERNAME,
    "password": process.env.RDS_PASSWORD,
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "logging": false,
    "dialect": "postgres"
    // ! For HEROKU
    // "use_env_variable": "DATABASE_URL",
    // "dialect": "postgres"
  }
}
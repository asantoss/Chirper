module.exports = {
  default: {
    "username": process.env.RDS_USERNAME || "postgres",
    "password": process.env.RDS_PASSWORD || "090696",
    "database": process.env.RDS_DB_NAME,
    "host": process.env.RDS_HOSTNAME,
    "dialect": "postgres",
    "logging": false
  }
}
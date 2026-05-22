const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "db-ferrari.cdya8sowa2t3.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "123456789",
  database: "db-ferrari"
});

connection.connect((err) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("RDS Connected");
  }
});

module.exports = connection;
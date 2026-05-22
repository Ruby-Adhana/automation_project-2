const express = require("express");
const cors = require("cors");
const multer = require("multer");

const s3 = require("./s3");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage()
});


// =============================
// ADD STUDENT API
// =============================

app.post("/addStudent", upload.single("photo"), async (req, res) => {

  try {

    let photoUrl = "";

    // Upload photo to S3
    if (req.file) {

      const params = {
        Bucket: "ferrari-bucket-ruby",
        Key: Date.now() + "-" + req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const result = await s3.upload(params).promise();

      photoUrl = result.Location;
    }

    // SQL Query
    const sql = `
      INSERT INTO students
      (name, gender, father, mother, occupation, school, class, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert into RDS
    db.query(
      sql,
      [
        req.body.name,
        req.body.gender,
        req.body.father,
        req.body.mother,
        req.body.occupation,
        req.body.school,
        req.body.class,
        photoUrl
      ],
      (err, result) => {

        if (err) {
          console.log(err);
          res.status(500).send("DB Error");
        } else {
          res.send("Saved Successfully");
        }
      }
    );

  } catch (error) {

    console.log(error);
    res.status(500).send("Server Error");
  }
});


// =============================
// GET ALL STUDENTS API
// =============================

app.get("/students", (req, res) => {

  const sql = "SELECT * FROM students";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      res.status(500).send("DB Error");
    } else {
      res.json(result);
    }
  });
});


// =============================
// SERVER START
// =============================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
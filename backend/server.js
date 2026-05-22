const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const s3 = require("./s3");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/schoolDB");

const Student = mongoose.model("Student", {
  name: String,
  gender: String,
  father: String,
  mother: String,
  occupation: String,
  school: String,
  class: String,
  photo: String   
});

app.post("/addStudent", upload.single("photo"), async (req, res) => {

  let photoUrl = "";

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

  const student = new Student({
    name: req.body.name,
    gender: req.body.gender,
    father: req.body.father,
    mother: req.body.mother,
    occupation: req.body.occupation,
    school: req.body.school,
    class: req.body.class,
    photo: photoUrl
  });

  await student.save();

  res.send("Saved with photo");
});

app.get("/students", async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

app.listen(5000, () => console.log("Server running"));

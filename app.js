let express = require("express");
let exphbs = require("express-handlebars");
let path = require("path");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let StudentSchema = new Schema({
  firstName: String,
  lastName: String,
  age: String,
  grade: String
});

let Student = mongoose.model("Student", StudentSchema);

mongoose.connect("mongodb://localhost:27017/sms", { useNewUrlParser: true });

let app = express();
app.use(bodyParser.urlencoded());

let staticFile = path.join(__dirname, "public");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static(staticFile));

let student = [];

app.get("/", (req, resp) => {
  Student.find((err, studentList) => {
    if (err) throw err;

    resp.render("index", { title: "Student List", studentList: studentList });
  });
});

app.get("/addStudent", (req, resp) => {
  resp.render("addStudent", { title: "Add Student" });
});

app.post("/addStudent", (req, resp) => {
  let student = new Student(req.body);
  student.save();

  resp.redirect("/");
});

app.get("/update", (req, resp) => {
  resp.render("updateStudent", { title: "Update Student" });
});

app.get("/delete", async (req, resp) => {
  let studentId = req.query.id;

  await Student.deleteOne({ _id: studentId });
  resp.redirect("/");
});

app.listen(3000, () => console.log("application is running on port 3000"));

const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = express();

app.use(express.json());
const SECRET = "s3cer5"

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imagelink: String,
  published: Boolean
})

const User = mongoose.model('User',userSchema)
const Admin = mongoose.model('Admin',adminSchema)
const Course = mongoose.model('Course', courseSchema)

mongoose.connect("mongodb+srv://div:divakar068@divakarapi.srzsq6i.mongodb.net/",{ useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" })

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body
  const admin = await Admin.findOne({username})
  if(admin){
    res.status(403).json({message: "admin already exists"})
  }
  else{
    const newAdmin = new Admin({username,password})
    await newAdmin.save()
    const token = jwt.sign({username, role:"admin"}, SECRET, {expiresIn:'1hr'})
    res.json({message: "admin created sucessfully"})
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers
  const admin = await Admin.findOne({username, password})
  if(admin){
    const token = jwt.sign({username, role:"admin"}, SECRET, {expiresIn:'1hr'})
    res.json({message: "admin logged in successfully", token})
  }
  else{
    res.status(403).json({error:"username or password incorrect"})
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

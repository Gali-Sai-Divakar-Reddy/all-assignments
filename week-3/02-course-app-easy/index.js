const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {email, password} = req.body
  const existingAdmin = ADMINS.find(admin => admin.email === email)
  if (existingAdmin){
    res.status(400).json({error: "admin already exists"})
  }
  const admin = {email, password}
  ADMINS.push(admin)
  res.status(201).json({message:"admin signed up successfully"})
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {email, password} = req.body
  const existingAdmin = ADMINS.find(admin => admin.email === email && admin.password === password)
  if (!existingAdmin){
    res.status(401).json({error:"incorrect email or password"})
  }
  res.json({message: "admin logged in successfully"})
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

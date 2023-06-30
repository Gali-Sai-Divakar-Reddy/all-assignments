const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
//admin authentication
const adminAuthentication = (req, res, next) => {
  const {username, password} = req.headers
  const existingAdmin = ADMINS.find(admin => admin.username === username && admin.password === password)
  if (existingAdmin){
    next()
  }
  else{
    res.status(403).json({error: "admin authentication failed"})
  } 
}

//user athunetication
const userAuthentication = (req, res, next) => {
  const {username, password} = req.headers
  const existingUser = USERS.find(user => user.username === username && user.password === password)
  if (existingUser){
    req.user = existingUser
    next()
  }
  else{
    res.status(403).json({error: "user authentication failed"})
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body
  const existingAdmin = ADMINS.find(admin => admin.username === username)
  if (existingAdmin){
    res.status(403).json({error: "admin already exists"})
  }
  const admin = {username, password}
  ADMINS.push(admin)
  res.status(201).json({message:"admin signed up successfully"})
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({message: "admin logged in successfully"})
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  var course = req.body
  course.id = Date.now()
  COURSES.push(course)
  res.json({message: "course submitted successfully", courseId: course.id})
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  var courseID = parseInt(req.params.courseId)
  var course = COURSES.find(c => c.id === courseID)
  if(course){
    Object.assign(course, req.body)
    res.json({message: "Course updated successfully"})
  }
  else{
    res.status(404).json({message:"course not found"})
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({courses: COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = {...req.body, purchasedCourses: []}
  USERS.push(user)
  res.json({message: "user created successfully"})
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.json({message: "user logged in successfully"})
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  let usersCourses = COURSES.filter(c => c.published)
  res.json({courses : usersCourses})
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseID = Number(req.params.courseId)
  const course = COURSES.find(c => c.id === courseID)
  if(course){
    req.user.purchasedCourses.push(courseID)
    res.json({message : "course purchased successfully"})
  }
  else{
    res.status(404).json({error: "course not found"})
  } 
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  const userPurchasedCourses = COURSES.find(c => req.user.purchasedCourses.includes(c.id))
  res.json({purchasedCourses: userPurchasedCourses})
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

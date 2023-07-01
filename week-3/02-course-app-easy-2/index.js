const express = require('express');
const jwt = require("jsonwebtoken")
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//added a comment

const secretKey = "sudim34goa1u"

const generateJwt = (user) => {
  const payload = { username: user.username, };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
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
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body
  const existingAdmin = ADMINS.find(a => a.username === admin.username)
  if(existingAdmin){
    res.status(403).json({error: "This admin already exists"})
  }
  else{
    ADMINS.push(admin)
    const token = generateJwt(admin)
    res.json({message : "Admin created successfully", token: token})
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers
  const existingAdmin = ADMINS.find(a => a.username === username && a.password === password)
  if(existingAdmin){
    const token = generateJwt(existingAdmin)
    res.json({message : "admin logged in successfully", token})
  }
  else{
    res.status(403).json({error: "admin authentication failed"})
  }
});

app.post('/admin/courses', authenticateJwt,(req, res) => {
  console.log(req.user.username)
  // logic to create a course
  const course =  req.body
  course.id = Date.now()
  COURSES.push(course)
  res.json({message: "course submitted", id: course.id})
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

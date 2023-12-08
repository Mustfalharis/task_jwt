const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'ELjvWlp8s3mdLb+7xia4mrJpvkmMO4A7xzQZ9FoI6ec=';  
const app = express();
app.use(express.json());
const users = [];




/// midware 
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token verification failed' });
      }
  
      req.user = decoded;
      next();
    });
  }





app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
      const data = {
          email:email,
          token:token,
      };
      res.json(responseSuccess(data));
    } else {
      res.status(401).json(responseFild("Authentication failed"));
    }
  });







  app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    if(name===""||email===""||password===""){
        res.status(401).json(responseFild("Please Enter inputs"));
    }
    const existingUser=users.find(e=>e.email===email);
    if(existingUser){
        res.status(401).json(responseFild("Email is already register"));
    }
    const user = {
        name:name,
        email:email,
        password:password
    }
    users.push(user);
    const token = jwt.sign({email:email},secretKey , {expiresIn:"1h"});
    const data = {
        name:name,
        email:email,
        token,
    }
    res.json(responseSuccess(data));

  })






app.get('/home', authenticateToken, (req, res) => {
    try {
      res.json({ message: 'Dashboard data retrieved successfully', user: req.user });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });










const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



/// response 
const responseSuccess =(data)=>{
    return response = {
     status:true,
     data:data
    }    
 }
 const responseFild =(message)=>{
     return response = {
      status:false,
      message:message
     }
  }

   
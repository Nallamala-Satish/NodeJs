const express = require("express");
const nm = require("nodemailer");
const multer=require('multer')
const cors = require("cors");

const app = express();
const db = require("./db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'))

// const users = [
//   {
//     id: 1,
//     name: "satish",
//     city: "hyderabad",
//     email: "nsatish1999@gmail.com",
//     age: 24,
//   },
//   {
//     id: 2,
//     name: "srikanth",
//     city: "hyderabad",
//     email: "nsrikanth@gmail.com",
//     age: 27,
//   },
//   {
//     id: 3,
//     name: "vamsi",
//     city: "vizag",
//     email: "vamsi@gmail.com",
//     age: 26,
//   },
// ];

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});

     // File upload
// const ds=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,"uploads/")
//    },
//   filename:(req,file,cb)=>{
//    cb(null,Date.now()+file.originalname)
//   }
// })

// const upload=multer({
//   storage:ds
// })


// app.post('/upload',upload.single('file'),
// (req,res)=>{
//   res.send("upload Successfully")
// })
    // get static files
    
// app.use(express.static(__dirname+'/public'))

// Email

// const transporter = nm.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "nsatish1999@gmail.com",
//     pass: "wqjmnwiuqgkaxcem",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const options = {
//   from: "nsatish1999@gmail.com",
//   to: "nsatish1999@gmail.com",
//   subject: "testing demo",
//   html: `<h1> Welcome to Node js</h1>
//   <img src='cid:food' width:'300px'>
//   <button>Click Here</button>
//   `,
//   attachments:[
//     {
//       filename:'food.png',
//       path:"https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600",
//       cid:'food'
//     }
//   ]
// };

// transporter.sendMail(options, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Email sent successfully");
//   }
// });

// CRUD operations

app.get('/getUsers',(req, res)=>{
  db.getUsers(req.params.id)
  .then((user)=>{
      res.send(user)
  }).catch((err)=>{
    res.send(err)
  })

})

app.post('/addUser',(req, res)=>{
  db.addUsers(req.body.name,req.body.age,req.body.city,req.body.email)
  .then(()=>{
    res.send(req.body)
  }).catch((err)=>{
    res.send(err)
  })
})
app.put('/updateUser',(req, res)=>{
  db.updateUsers(req.body.name,req.body.age,req.body.city,req.body.email,req.body.id,)
  .then((user)=>{
    res.send(req.body)
  }).catch((err)=>{
    res.send(err)
  })
})
app.delete('/deleteUser',(req, res)=>{
  db.deleteUsers(req.body.id)
  .then(()=>{
    res.send(req.body)

  }).catch((err)=>{
    res.send(err)
  })
})

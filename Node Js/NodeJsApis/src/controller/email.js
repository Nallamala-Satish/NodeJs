const nm = require("nodemailer");

const getEmail =async (req,res)=>{
 
 const transporter = nm.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nsatish1999@gmail.com",
    pass: "wqjmnwiuqgkaxcem",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const options = {
  from: "nsatish1999@gmail.com",
  to: "nsatish1999@gmail.com",
  subject: "testing demo",
  html: `<h1> Welcome to Node js</h1>
  <img src='cid:food' width:'300px'>
  <button>Click Here</button>
  `,
  attachments:[
    {
      filename:'food.png',
      path:"https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600",
      cid:'food'
    }
  ]
};

transporter.sendMail(options, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent successfully");
    res.send("Email sent successfully")
  }
});
res.send(options) 
}

module.exports ={
    getEmail
}

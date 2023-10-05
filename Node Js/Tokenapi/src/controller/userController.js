const { User, Product, Country, State } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const crypto = require("crypto");
const multer = require('multer');

const port = process.env.PORT;
console.log(port)
const baseUrl=`http://localhost:${4000}/src/upload/`



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './src/upload');
    },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});
const uploadImg = multer({storage: storage}).single('productImage');

const signUp= async(req,res)=>{
    try {
        const { first_name, last_name, email, password } = req.body;
    
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
        }
    
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.token = token;
        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
}

const login= async(req,res)=>{
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}
const  getToken = async (req,res)=>{
  try{
    const token =  crypto.randomBytes(20).toString("base64url");
    res.send(token);
  }catch(err){
    res.status(500).send(err)
  }
}

const verifyToken =async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const Home = async(req, res)=>{
  res.status(200).send("Welcome 🙌 ");
}

const getProducts = async(req, res)=>{
  try{
    const products= await Product.find()
    res.send(products)
}catch(err){
    res.status(500).send(err)
}
    
}

const UploadProducts = async(req, res)=>{
    const {title} = req.body
    const file =  req.file.path.replace(/\\/g, "/");
    // console.log(req.file)
    try{
    const product = await Product.create({
     title,
     productImage:file
    });
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
  }
}

const Countries = async(req,res)=>{
  try{
    let countries=req.body
     const country = await  Country.insertMany(countries)
    res.send(country);
   }catch(err){
    res.status(500).send(err)
  }
}

const getCountries = async(req,res)=>{
  try{
 
    const country = await  Country.find()
    res.send(country);
   }catch(err){
    res.status(500).send(err)
  }
}

const getStates = async(req,res)=>{
  try{
    let id=req.params.id
    const state = await  State.find()
    const states= state.filter(e=>e.countryId == id)
    
   let a= states.map(e=>{
    if(e){
      return ({_id:e._id,name:e.name,__v:e.__v})
    }
    })
    // console.log(a)
    res.send(a);
      // res.send(states);
    
   }catch(err){
    res.status(500).send(err)
  }
}

const States = async(req,res)=>{
  try{
    let states=req.body
    const country =[];
    
      for(let i=0;i< states.length ; i++){
        let a= await  Country.findById(states[i].countryId)
        if(!a){
          return res.status(400).send('Invalid Country')
        }
         country.push (a)
      }
    // console.log("country",country);
    const state = await  State.insertMany(states)
    res.send(state);
   }catch(err){
    res.status(500).send(err)
  }
}

module.exports={
    signUp,login,verifyToken,Home,getToken,getProducts,UploadProducts,
    uploadImg,getCountries,getStates,Countries,States
}
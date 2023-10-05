const {StatusCodes} =require("http-status-codes");
const {Employee,Country} = require('../models/employeeModel');
const jwt =require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const countries = require("../../countries");
const  {uploadfile}  = require("../validator/employeeValidations");
let fs = require('fs-extra')
const port = process.env.PORT;
const baseUrl=`http://localhost:${port}/api/getFiles/`
const multer = require('multer')

const signUp= async(req,res)=>{
    const{firstName,lastName,email,password,} =req.body;
      const file = req.files[0].filename;
       console.log('mmm',file);
   
let filePath=''
  const directoryPath = "./src/upload/";
  fs.readdir(directoryPath, function (err, files) {
  if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
     filePath=fileInfos.filter(e=>e.name == file)
    // console.log('file rs',fileInfos)
  });
 
       
    if(!firstName || !lastName || !email || !password){
       return res.status(StatusCodes.BAD_REQUEST).json({message:"Please Provide required information"})
    }

    const hash_password = await bcrypt.hash(password,10);
    console.log('file rs',filePath)
    const profilePicture = filePath[0].url
     
    const employeeData={
        firstName,lastName,email,hash_password,profilePicture
    }
    const employ = await Employee.findOne({email})
    if(employ){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Employee already registered"})
    }else{
        Employee.create(employeeData).then((data,err)=>{
            if(err){
                return res.status(StatusCodes.BAD_REQUEST).json({err})
            }else{
          
                return res.status(StatusCodes.CREATED).json({message:"Employee registered Successfully"})
            }
        })
    }

}

const signIn = async (req, res)=>{
   try{
    if(!req.body.email || !req.body.password){
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Please enter email and password"})
    }
    
    const employ = await Employee.findOne({email:req.body.email});
    if(employ){
        const passwordEnteredByUser = req.body.password
        const hash = employ.hash_password
        // console.log(passwordEnteredByUser,hash)
        bcrypt.compare(passwordEnteredByUser, hash, function(err, isMatch) {
            if (err) {
              throw err
            } else if (!isMatch) {
                return res.status(StatusCodes.UNAUTHORIZED).json({message:"Something went wrong"})
            } else {
                const token=jwt.sign(
                    {_id:employ._id,role:employ.role},
                    process.env.JWT_SECRET,{ expiresIn: "30d"});
                   const {_id,firstName,lastName,email,role,fullName}= employ;
                   res.status(StatusCodes.OK).json({token, employ:{_id,firstName,lastName,email,role,fullName}});
            }
          })
    }else{
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Employee does not exit"})
    }
   }catch{
    return res.status(StatusCodes.BAD_REQUEST).json({error})
   }
}

const dropdownApi =async(req,res)=>{
   let name =req.body;
 
   Country.insertMany(name).then((data,err)=>{
         if(err){
            return res.status(StatusCodes.BAD_REQUEST).json({err})
         }else{
           res.send(data)
         }
   })
}
const getDropdownApi =async(req,res)=>{
    Country.find().then((data,err)=>{
            if(err){
                return res.status(StatusCodes.BAD_REQUEST).json({err})
             }else{
               res.send(data)
             }
         })
}
const getCountries = async(req,res)=>{
    res.send(countries.map(e=>{return e}));
}

const upload = async(req,res)=>{
    try{
      await uploadfile(req,res);
     if(req.file == undefined){
        return res.status(400).send({ message: "Please upload a file!" });
     }else{
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
     }
    }catch(err){
        res.status(500).send({
            message: `  ${err}`,
          });
    }
}
const getFiles=async(req,res)=>{
    const directoryPath = "./src/upload/";
    fs.readdir(directoryPath, function (err, files) {
    if (err) {
        res.status(500).send({
          message: "Unable to scan files!",
        });
      }
  
      let fileInfos = [];
  
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
  
      res.status(200).send(fileInfos);
    });
}

const downloadFiles =async(req,res)=>{
    const fileName = req.params.name;
    const directoryPath = "./src/upload/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
}


module.exports={
    signUp,signIn,dropdownApi,getDropdownApi,getCountries,upload,getFiles,downloadFiles,
};
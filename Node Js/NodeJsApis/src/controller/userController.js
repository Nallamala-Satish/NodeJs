const userModel = require('../models/userModel')
const crypto = require("crypto");
module.exports = {
    getToken : async (req,res)=>{
        try{
          const token =  crypto.randomBytes(20).toString("base64url");
          res.send(token);
        }catch(err){
          res.status(500).send(err)
        }
    },
     addUser : async (req, res)=>{
        try{
            let userdata=req.body
            const user = await  userModel.insertMany(userdata)
            res.send(user);
        }catch(err){
            res.status(500).send(err)
        }
     },
     getUsers : async (req, res)=>{
        try{
       const users= await userModel.find({})
       res.send(users)
        }catch(err){
            res.status(500).send(err)
        }
     },
     getUser : async (req, res)=>{
        try{
            let id=req.params.id;
            const user= await userModel.findById(id)
            res.send(user)
        }catch(err){
            res.status(500).send(err)
        }
     },
     updateUser : async (req, res) =>{
          try{
            let id=req.params.id;
            let user = req.body;
            let options = { new: true };
            const updateUser = await userModel.findByIdAndUpdate(id, user, options)
            res.send(updateUser) ;
          }catch(err){
            res.status(500).send(err)
          }
     },
     deleteUser : async (req, res)=>{
          try{
            let id=req.params.id;
            const deleteUser = await userModel.findByIdAndDelete(id)
            res.send(deleteUser)
          }catch(err){
            res.status(500).send(err)
          }
     }
}
const express = require("express");
const http = require("http");
const connectDB= require('./src/config/db')
const cors = require('cors')
const bodyParser = require("body-parser");

const userRouter = require('./src/routes/userRouter')

require("dotenv").config();
const port = process.env.PORT;


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))
app.use(cors('*'))

app.use('/src/upload', express.static( __dirname + '/src/upload'));

app.use("/api",userRouter)

const start =async()=>{
    try{
        await connectDB(process.env.mongodb_URL); 
        http.createServer(app).listen(port, ()=>{
            console.log(`server running at http://localhost:${port}`);
         });
      }catch(err){
        console.log("error",err)
    }
}

start()
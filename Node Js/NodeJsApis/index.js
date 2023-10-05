const express = require("express");
const http = require("http");
const connectDB= require('./src/db/db')
const cors = require('cors')

require("dotenv").config();
const port = process.env.PORT;
const bodyParser = require("body-parser");

const userRouter = require('./src/routes/userRouter')
const employRouter = require('./src/routes/employeeRouter')
const emailRouter = require('./src/routes/emailRouter')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))
app.use(cors('*'))

app.use("/api",userRouter)
app.use("/api",employRouter)
app.use("/api",emailRouter)

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

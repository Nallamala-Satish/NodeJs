const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

require("dotenv").config();
const port = process.env.PORT;

const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(morgan('tiny'));
// app.use(authJwt());
app.use('/public/uploads', express.static( __dirname + '/public/uploads'));
app.use(errorHandler);

const categoriesRoute = require('./routes/categories');
const productRoute = require('./routes/products');
const userRoute = require('./routes/users');
const orderRoute = require('./routes/orders');

// Routes

app.use(`/api/products`, productRoute);
app.use(`/api/categories`, categoriesRoute);
app.use(`/api/users`, userRoute);
app.use(`/api/orders`, orderRoute);

const connectDB =(url=>{
    return mongoose.connect(url)
})

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



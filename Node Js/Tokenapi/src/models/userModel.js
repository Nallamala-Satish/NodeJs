const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

const productSchema = new mongoose.Schema({
    title :{type :String,require:true},
    productImage : {type: String, require:true}
})

const countrySchema = new mongoose.Schema({
   name :{type:String,require:true}
})

const stateSchema = new mongoose.Schema({
  countryId : {type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true},
  name :{type:String,require:true}
})

const User =  mongoose.model("user", userSchema);
const Product = mongoose.model('products', productSchema)
const Country = mongoose.model('Countries',countrySchema)
const State = mongoose.model("States",stateSchema)

module.exports ={
    User, Product, Country, State
}
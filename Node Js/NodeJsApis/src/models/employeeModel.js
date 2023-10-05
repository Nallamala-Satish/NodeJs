const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const employeeSchema =  new mongoose.Schema({
    firstName :{type:String,require:true,trim:true,min:3,max:20},
    lastName :{type:String,require:true,trim:true,min:3,max:20},
    email :{type:String,require:true,trim:true,unique:true,lowercase:true},
    hash_password :{type:String,require:true},
    role :{type:String,enum:['employee','manager'], default: "employee",},
    contactNumber :{type:String},
    profilePicture :{type:String}
});
const countrySchema = new mongoose.Schema({
    name :{type:String,require:true},
    
})

employeeSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`
});
employeeSchema.method({
    async authenticate(password){
        return bcrypt.compare(password,this.hash_password);
    }
});

const Employee = mongoose.model("Employee",employeeSchema)
const Country = mongoose.model("country",countrySchema)

module.exports ={
    Employee,Country
}

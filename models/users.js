import mongoose from "mongoose";

// creating schmema for users collection in userlist DB 

const userschema= new mongoose.Schema({

    
    id:{type:String,required:true},
    createdAt:{type:String,required:true},
    name:{type:String,required:true},
    avatar:{type:String,required:true},
    password:{type:String,required:true}

})

export const User = mongoose.model("user",userschema);
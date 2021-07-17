import express from "express";

import {User} from "../models/users.js";

// importing bcrypt
// bcrypt to produce hashed password with salt
import bcrypt from "bcrypt";

const router =express.Router();

// accessing the userlist DB

router.get("/",async(req,res)=>{

    const users = await User.find();
    console.log(users,"number of users-->>>-- "+users.length);
    
    res.send(users);
    
})

// posting data into DB

router.post("/",async(req,res)=>{

  const adduser=req.body ;
  console.log(adduser);

  // for validation purpose by using the mongoose model which contains the schema
  //if keys in both schema and adduser is same then >>const user = new User(adduser) is enough
  const user=new User({

    id:adduser.id,
    createdAt:adduser.createdAt,
    name:adduser.name,
    avatar:adduser.avatar,
    password:adduser.password
  })
// a save call is made to save the new document user in DB
// try and catch is used to handle the error in validation

try{
  const newuser =await user.save();
  res.send(newuser);
}
catch(err){

  // optional to give status code either 500(internal server error)
  // or 400 (bad request error)
   res.status(500);
   res.send(err);
   res.send({message:"input -- error"});
}

})
// check whether data got added to DB using get request in postman

//DELETE in mongoDB by "_id" in BSON by use mongoose method remove()

router.delete("/:id",async(req,res)=>{

  const { id }= req.params;
  console.log(id);

  try {

  const user = await User.findById(id);
  await user.remove();
  res.send({...user,message:"User is deleted"});
  console.log("user with above ID is deleted");

  }
 catch(err)
 {

   res.status(500);
   res.send("user not found in userlist DB");
   console.log("err: user not found");

 }

})


//-------password hashing and authentication--------


// const passwordStoredinDB="password@123";

// sample hashed password with salt  given for passwordStoredinDB
const passwordStoredinDB="$2b$10$Sm7sRIBNPvuSi/O22mhnQuq.bgSm4meFySt3WcnEr73iB.CamLuTW";


// genHash called  during sign up only

async function genHash(){

  const password ="password@123";

  // 10 represents 10 rounds of salt
  // brcrypt returns a promise therefore async,await
  const salt=await bcrypt.genSalt(10);

 // on refresh new salt is generated 
   console.log("sample salt --->",salt);

  const passwordHash =await bcrypt.hash(password,salt);
  console.log("sample hashed password with salt --->",passwordHash);
}

genHash();

// execution on log in
// comparison between login password and passwordStoredinDB

async function verifyUser(){

  const userpassword="password@123";

  //bcrypt comparison don't compromise parameter order
  const isMatch=await bcrypt.compare(userpassword,passwordStoredinDB);

  if(!isMatch)
  {
    console.log("----invalid credentials----");
  }
  else
  {
    console.log("----successful login----");
  }
}

verifyUser();



// ---------- authentication TEST starts -------------


//  --------- verification (Login) ---------


router.route("/login").post(async(req,res)=>{

 // getting login details -Input from frontend
  const {usernameInput,passwordInput} =req.body;
  console.log("Login alert >>>",usernameInput);

try{

  const userLoggingIn= await User.findOne({name:usernameInput});
  console.log("User Found !!! >>>",userLoggingIn);
  const storedPasswordOfUser=userLoggingIn.password;

  const LoginMatch=await bcrypt.compare(passwordInput,storedPasswordOfUser);

  if(!LoginMatch)
  {
    res.status(500);
    res.send({message:"---- invalid credentials in POST----"});
    console.log("---- invalid credentials in POST----");
  }
  else
  {
    res.send({userLoggingIn,message:"---- successful login in POST (Authentication success)----"});
    console.log("---- successful login in POST ----");
  }

}

catch(err)
{
  res.status(500);
  res.send(err);
  console.log("Error in login !!!");
}

})

// ----------- Password generation (sign up) ----------

router.route("/signup").post(async(req,res)=>{

  const adduser=req.body ;
  console.log("Sign up input details >>>>",adduser);

  const salt=await bcrypt.genSalt(10);

  const passwordHash =await bcrypt.hash(adduser.password,salt);

   console.log("After new SIGNUP >>>","\n",
   "username :---"+adduser.name,"\n",
   "passwordInput :---"+adduser.password,"\n",
   "passwordHashed :---"+passwordHash);

   // steps to save new user using save() 

   const user=new User({

    id:adduser.id,
    createdAt:adduser.createdAt,
    name:adduser.name,
    avatar:adduser.avatar,
    password:passwordHash
  })

  try{
    const newuser =await user.save();
    res.send(newuser);
    console.log("new user signed up !!!",newuser);
  }
  catch(err){
  
    // optional to give status code either 500(internal server error)
    // or 400 (bad request error)
     res.status(500);
     res.send(err);
     res.send({message:"input -- error"});
  }

});

export default router;
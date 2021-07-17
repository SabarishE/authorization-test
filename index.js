import express, { response } from "express";

// importing mongoose

import mongoose from "mongoose";

import router from "./routes/users.js";

//change the port from 3000 to both local and heroku compatible  port, here PORT is a variable
const PORT = process.env.PORT || 5000;

const app=express();

//middle ware
app.use(express.json());
// testing
// app.get("/",(req,res)=>{res.send("hi chieffffff")});

app.listen(PORT,console.log("server started"));

console.log("hi");

// mongoose testing starts here

// mongodb://localhost/userlist
// new url from mongo atlas (cluster > connect > connect your application > copy string)
// change password and change database name to userlist in last block of new url, after slash
// "mongodb+srv://SabarishE:sabarishe@cluster0.eeimf.mongodb.net/userlist"

//MONGODB_URI contains above url

const url= process.env.MONGODB_URI || "mongodb://localhost/userlist";
mongoose.connect(url,{useNewUrlParser:true});

const con=mongoose.connection;
  // to check mongoDB is connected or not
con.on("open",()=>console.log("MongoDB in connected"));


// router is used to access the DB

app.get("/",(req,res)=>{
res.send("Heroku is deployed (auth-test)");
console.log("Heroku is deployed (auth-test)");
})


app.use("/users",router);
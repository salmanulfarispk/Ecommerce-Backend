const express=require("express")
const router=express.Router();
const admincontroller=require("../controllers/AdminController")

//middlewares
const Trycatchmiddleware=require("../middlewares/TryCatchmiddleware")




router

.post("/login",Trycatchmiddleware(admincontroller.login))




module.exports=router
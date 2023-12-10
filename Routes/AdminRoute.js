const express=require("express")
const router=express.Router();
const admincontroller=require("../controllers/AdminController")
const verifytoken=require("../middlewares/AdiminAuthentication")

//middlewares
const Trycatchmiddleware=require("../middlewares/TryCatchmiddleware")




router

.post("/login",Trycatchmiddleware(admincontroller.login))


.use(verifytoken)

.get("/Allusers",Trycatchmiddleware(admincontroller.viewallusers))
.get("/Allusers/:id",Trycatchmiddleware(admincontroller.viewById)) 
.post("/Allproducts",Trycatchmiddleware(admincontroller.addproducts))


module.exports=router
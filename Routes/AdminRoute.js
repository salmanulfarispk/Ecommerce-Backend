const express=require("express")
const router=express.Router();
const admincontroller=require("../controllers/AdminController")


//middlewares
const Trycatchmiddleware=require("../middlewares/TryCatchmiddleware")
const verifytoken=require("../middlewares/AdiminAuthentication")
const imageuploading=require("../middlewares/imageUploader/imageuploader")



router

.post("/login",Trycatchmiddleware(admincontroller.login))


.use(verifytoken) 

.get("/Allusers",Trycatchmiddleware(admincontroller.viewallusers))
.get("/Allusers/:id",Trycatchmiddleware(admincontroller.viewById)) 
.post("/products",imageuploading,Trycatchmiddleware(admincontroller.addproducts))
.get("/products",Trycatchmiddleware(admincontroller.viewAllproducts))
.delete("/products",Trycatchmiddleware(admincontroller.deleteproduct))
.put("/products",Trycatchmiddleware(admincontroller.editproducts))
.get("/orders",Trycatchmiddleware(admincontroller.viewOrderDetails))
.get("/RevenueStatus",Trycatchmiddleware(admincontroller.status))

 
  
module.exports=router
const express=require("express")
const router=express.Router()

const Trycatchmiddleware=require("../middlewares/TryCatchmiddleware")
const usercontroler=require("../controllers/userController")



router

.post('/register',Trycatchmiddleware(usercontroler.userRegister))
.post('/login',Trycatchmiddleware(usercontroler.userlogin))





module.exports= router
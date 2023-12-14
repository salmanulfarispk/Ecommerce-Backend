const express=require("express")
const router=express.Router()

const Trycatchmiddleware=require("../middlewares/TryCatchmiddleware")
const usercontroler=require("../controllers/userController")

const verifyToken=require("../middlewares/userAuthentication")



router

.post('/register',Trycatchmiddleware(usercontroler.userRegister))
.post('/login',Trycatchmiddleware(usercontroler.userlogin))


.use(verifyToken)

.get('/products',Trycatchmiddleware(usercontroler.viewAllProduct))
.get("/products/:id",Trycatchmiddleware(usercontroler.viewproductById))
.get("/products/category/:categoryname",Trycatchmiddleware(usercontroler.productByCategory))
.post("/:id/cart",Trycatchmiddleware(usercontroler. addToCart))
.get("/:id/cart",Trycatchmiddleware(usercontroler.viewcart))


module.exports= router             



       
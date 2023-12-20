const mongoose=require("mongoose")
const bcrypt=require("bcrypt")





const userSchema= new mongoose.Schema({

    name:String,
    email:String,
    username:String,
    password:String, 
    cart:[{ productsId: { type: mongoose.Schema.ObjectId, ref: "allproducts" } }],
    wishlist:[{type:mongoose.Schema.ObjectId, ref:"allproducts"}],
    orders: [{ type: mongoose.Schema.ObjectId, ref: "orders" }]
})





module.exports= mongoose.model("user",userSchema)
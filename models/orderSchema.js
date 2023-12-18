const mongoose=require("mongoose")
const userSchema = require("./userSchema")

const orderSchema= mongoose.Schema({

   userId:String,
   products:[{type:mongoose.Schema.ObjectId , ref: "allproducts"}],
   date: { type: String, default: () => new Date().toLocaleDateString() },
   time: { type: String, default: () => new Date().toLocaleTimeString() },
   order_id:String,
   payment_id:String,
   total_amount:Number
 

})

module.exports=mongoose.model("orders",orderSchema)
require("dotenv").config();
const express=require("express")
const app=express();
const port=5000;
const adminrout=require("./Routes/AdminRoute")
const mongoose=require("mongoose")
const userrout=require("./Routes/UserRouter")




const MongoDb="mongodb://127.0.0.1:27017/E-commerce_BackEnd";
main().catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MongoDb)
    console.log("Db connected");
}

 

app.use(express.json())

app.use("/api/admin",adminrout)
app.use("/api/users",userrout)



app.listen(port,()=>{
    console.log("server is running...",port);
})
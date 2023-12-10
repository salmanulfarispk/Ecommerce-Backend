const jwt=require("jsonwebtoken")
const userDatabase=require("../models/userSchema")
const Allproducts=require("../models/productSchema")
const {joiproductSchema}=require("../models/validationSchema")





module.exports={

// Admin login

  login: async (req,res)=>{
    const {email,password}=req.body;
      // console.log("admin:",req.body);

   if( email === process.env.ADMIN_EMAIL &&   password === process.env.ADMIN_PASSWORD){
    
      const token= jwt.sign(
       { email },
       process.env.ADMIN_ACCESS_TOKEN_SECRET  
      );

      return res.status(200).json({
        status:"success",
        message:"Admin login succesfully",
        data:token,
      });

   }else{
    return res.status(404).json({
        status:"error",
        message:"invalid admin",
    });

   }

  },

    //list/view all users
    
    viewallusers: async(req,res)=>{
      const allusers= await userDatabase.find()
      // console.log(allusers);
       
      if(allusers.length === 0){
        return res.status(404).json({
          status:"error",
          message:"no users found"
        })
      }else{
        res.status(200).json({
          status:"successs",
          message:"All users succesfully founded",
          data:{allusers}
        })
      }


    },

    //admin view specific user

    viewById: async(req,res)=>{
      const userid=req.params.id;
      const user= await userDatabase.findById(userid)

      if(!user){
        return res.status(404).json({
          status:"error",
          message:" user not found"
        })
      }

      res.status(200).json({
        status:"success",
        message:"user founded succesfully",
        data:{user}
      })   

    },

  //Add/create products

    addproducts: async(req,res)=>{
        const {value,error}= await joiproductSchema.validate(req.body);
        if(error){
          return res.status(404).json({
            error:error.details[0].message
          })
        }

        const {title,price,category,description,image}=value;
        await Allproducts.create({
          title,
          category,
          image,
          price,
          description

        })

        res.status(201).json({
          status:"success",
          message:"products created succesfully",
          data:Allproducts
        })

    },





}
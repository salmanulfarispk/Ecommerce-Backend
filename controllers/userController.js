
const {joiuserSchema}=require("../models/validationSchema")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const Allproducts=require("../models/productSchema")
const userSchemaData=require("../models/userSchema")
const { ObjectId } = require('mongoose').Types;
const cookie=require("cookie")




module.exports={

//user registration

userRegister: async(req,res)=>{

const {value,error}= joiuserSchema.validate(req.body);

 if(error){
    res.status(400).json({
        status:"error",
        message:"invalid user input data.please check the data"
    });
  
 }

 try{

    const { name,email,username,password}=value
   //  console.log("data is ",value);  

   await userSchemaData.create({
      name,
      email,
      username,
      password,
   });

     res.status(201).json({
      status:"success",
      message:"user registration succesfull"
     })

 }catch{
   res.status(500).json({
      status:"error occured",
      message:"internal server error"
   })
 }


},


//user login

userlogin: async(req,res)=>{
   const {value,error}= joiuserSchema.validate(req.body);
   if(error){
     return res.json(error.message)
   }
   const {email,password}=value;
   const user= await userSchemaData.findOne({
      email:email
   })
    const id=user.id;

    if(!user){
     return  res.status(400).json({
         status:"error",
         message:"user not found"
      })
    }

    if(!password || !user.password){
      return res.status(400).json({
         status:"error occured",
         message:"invalid input"
      })
    }
     
    const passwordmatch= await bcrypt.compare(password,user.password)
    if(!passwordmatch){
      return res.status(401).json({
         status:"error ",
         message:"incorrect password"
      })
    }
      
    const token= jwt.sign({email:user.email},process.env.USER_ACCES_TOKEN_SECRET,{expiresIn:8500})
    
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
          httpOnly: true, maxAge: 8500, path: "/" , }));
     
      
            res.status(200).json({
               status:"success",
               message:"login succesfull",
               data:{id,email,token}
            })
},

   //user view all products

   viewAllProduct: async(req,res)=>{
      const products=await Allproducts.find()
      if(!products){
        return res.status(404).json({
            status:"error",
            message:"products not found"
         })
      }
      return res.status(200).json({
         status:"success",
         message:"All products founded succesfully",
         datas:{products}
      })

   },
      
   //user view specific product

   viewproductById: async(req,res)=>{
      const productid=req.params.id;
      const product= await Allproducts.findById(productid)
      if(!product){
         return res.status(404).json({
            status:"error",
            message:"product not found"
         })
      }
      res.status(200).json({
         status:"success",
         message:"product founded succesfuly",
         data:{product}
      })

   },

   //view product by category

   productByCategory: async(req,res)=>{
      const prodByCategry=req.params.categoryname;
     
      const product= await Allproducts.find({category:prodByCategry})
      if(!product){
         return res.status(404).json({
            status:"error",
            message:"product not found"
         })
      }
      res.status(200).json({
         status:"success",
         message:"product founded sucesfuly",
         data:product
      })
   },
   
   //add to cart
    
   addToCart:async (req, res) => {

      const userId = req.params.id;
      const user = await userSchemaData.findById(userId);

      if (!user) {
      return res.status(404).json({
          status: "error",
          message: "User Not Found",
      });
      } 

      const { productId } = req.body;
         //   console.log(productId);

      if (!productId) {
      return res.status(404).json({
          status: "error",
          message: "Product Not Found",
      });
      }
      // if (!ObjectId.isValid(productId)) {
      //     return res.status(400).json({
      //         status: "error",
      //         message: "Invalid Product ID",
      //     });
      // }

      const productObject = {
          productsId: new  ObjectId(productId)      
      }

      try {
      await userSchemaData.updateOne({ _id: user._id }, { $addToSet: { cart:productObject } });
      res.status(200).json({
          status: "success",
          message: "Product Successfully Added To Cart",
      });

      } catch (error) {
      console.error(error);
      res.status(500).json({
          status: "error",
          message: "Internal Server Error",
      });
      }
  },

   

  // view cart

  viewcart: async(req,res)=>{
   const userId=req.params.id;
   const user= await userSchemaData.findById(userId)
   // console.log(user);
   if(!user){
      return res.status(404).json({
         status:"error",
         message:"user not found"
      })
   }
   const cartprodId=user.cart;
  
   if( cartprodId.length ===0 ){
      res.status(200).json({
         status:"success",
         message:"cart is empty",
         data:[]
      })
   }

   const cartproducts= await userSchemaData.findOne({_id:userId}).populate("cart.productsId")
   //   console.log(cartproducts);
   res.status(200).json({
      status:"success",
      message:"cart product fetched succesfully",
      data: cartproducts
   })


  },

 //delete cart product

 dltCartProdct: async(req,res)=>{
   const userId=req.params.id;
   const prodId=req.params.proid;

   const user= await userSchemaData.findById(userId)
   if(!user){
      res.status(400).json({message:"user not found"})
   }
   if(!prodId){
      res.status(400).json({message:"product not found"})
   }

    const result = await userSchemaData.updateOne({_id:userId},{$pull: { cart:{ productsId:prodId } }})
      
    if(result.modifiedCount > 0){
      res.status(200).json({
         status:"success",
         message:"product removed from cart succesfully"})
    }else{
      res.status(400).json({message:"product not found in the cart"})
    }


 },
    

 

}
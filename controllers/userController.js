
const {joiuserSchema}=require("../models/validationSchema")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const Allproducts=require("../models/productSchema")
const userSchemaData=require("../models/userSchema")
const { ObjectId } = require('mongoose').Types;
const cookie=require("cookie")
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)
const order=require("../models/orderSchema")


let sValue={}


module.exports={

//user registration

userRegister: async(req,res)=>{

const {value,error}= joiuserSchema.validate(req.body);

 if(error){
    return res.status(400).json({
        status:"error",
        message:"invalid user input data.please check the data"
    });
  
 }

 try{

    const { name,email,username,password}=value
   //  console.log("data is ",value);  


   const hashedPassword = await bcrypt.hash(password, 10);

   await userSchemaData.create({
      name,
      email,
      username,
      password:hashedPassword ,
   });

    return res.status(201).json({
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
     return res.status(200).json({
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
      return res.status(200).json({
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
  

      const productObject = {
          productsId: new  ObjectId(productId)      
      }

      try {
      await userSchemaData.updateOne({ _id: user._id }, { $addToSet: { cart:productObject } });
       return res.status(200).json({
          status: "success",
          message: "Product Successfully Added To Cart",
      });

      } catch (error) {
      console.error(error);
       return res.status(500).json({
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
      return  res.status(200).json({
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
     return res.status(400).json({message:"user not found"})
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

    //Add product to wishlist

    addTowishlist: async(req,res)=>{
    const userId=req.params.id;
    const user=await userSchemaData.findById(userId)
    if(!user){
      return res.status(404).json({
         status:"errror",
         message:"user not found"
      })
    }
      
      const { productId }=req.body;
      const product= await Allproducts.findById(productId)
      // console.log(product);
      if(!product){
         return res.status(404).json({
            message:"product not found"
         })
      }
 
 
    const  findproducts= await userSchemaData.findOne({_id:userId, wishlist: productId})
   //  console.log(findproducts);
     if(findproducts){
       return  res.status(409).json({
         status:"conflict",
         message:"product already on wishlist"
      })
     }
      

     await userSchemaData.updateOne({_id:userId},{$push:{ wishlist: productId }})
        res.status(201).json({
         status:"success",
         message:"product added to wishlist succesfuly!"
        })

 }, 
    //view wishlist  

 viewWishlist: async(req,res)=>{
    const userId=req.params.id
    const user=await userSchemaData.findById(userId)

    if(!user){
        return res.status(404).json({
            status:"error",
            message:"User Not found"
        })
    } 
    const WishListPrdtId=user.wishlist
    // console.log(WishListPrdtId)

    if(WishListPrdtId.length === 0){
        return res.status(200).json({ 
            status: "Succes", 
            message: "User Wishlist is Emty", 
            data: [] 
            });
    }
    
    const WishListproducts= await Allproducts.find({_id:{$in:WishListPrdtId}})
    res.status(200).json({
      status: "Success",
      message: "Wishlist products fetched successfully",
      data: WishListproducts
})
},

//Delete wishlist

dletwishlist:async(req,res)=>{
   const userid=req.params.id;
   const user=await userSchemaData.findById(userid)
   if(!user){
      res.status(404).json({
         status:"error",
         messsage:"user not found"
      })
   }
    
   const { productId }=req.body;
   if(!productId){
      return res.status(404).json({
         status:"error",
         message:"product not found"
      })
   }

   await userSchemaData.updateOne({_id:userid},{$pull:{wishlist:productId}})
     return res.status(200).json({
      status:"success",
      message:"product succesfully removed from wishlist"
     })

},
  //payment section

  payment: async(req,res)=>{
   const userid=req.params.id;
   // console.log(userid);
   const user=await userSchemaData.findOne({ _id: userid }).populate('cart.productsId');
   if(!user){
      return res.status(404).json({
         status:"error",
         message:"user not found"
      })
   }

 
   const cartproduct=user.cart;
   if(cartproduct.length === 0){
      return res.status(200).json({
         message:"user cart is empty",
         data:[]
      })
   }
   //  console.log(cartproduct);
   const paymentItems = cartproduct.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productsId.title,
            images: [item.productsId.image], 
            description: item.productsId.description,
          },
          unit_amount: Math.round(item.productsId.price * 100), 
        },
        quantity: 1,
      };
    });
     
   
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         line_items: paymentItems,
         mode: "payment",
         success_url: "http://localhost:3000/api/users/payment/success",
         cancel_url: "http://localhost:3000/api/users/payment/cancel",
       });
      //  console.log("strpsession",session);
  if(!session){
   res.status(404).json({
      status:"failure",
      message:"error occured in session side"
   })
  }
   sValue={
   userid,
   user,
   session
  }

//   console.log(sValue);
   
  res.status(200).json({
   status:"success",
   message:"stripe payment session created succesfully",
   url: session.url
  })


},
 
 
// success payment

success: async(req,res)=>{
   const {userid,user,session}=sValue;
   // console.log("svalues",sValue);
  
   
   const userId=user._id;
   const cartitems=user.cart;
   
   const productitems= cartitems.map((item)=> item.productsId)
   // console.log("produtcitems",productitems);

  const orders=await order.create({

  userId:userid,
  products:productitems,
  order_id:session.id,
  payment_id:`demo ${Date.now()}`,
  total_amount: session.amount_total / 100,

  })
  
//   console.log("orderrrrrrrrr",orders);
if(!orders){
   return res.status(404).json({message:"error occured while inputing to orderDB"})
}

const orderId=orders._id;

const userUpdate=await userSchemaData.updateOne({_id:userId},
   { $push:{ orders:orderId }, $set:{ cart:[] } }, { new:true }  );
                                                    
   if (userUpdate) {
      res.status(200).json({
        status: "Success",
        message: "Payment Successful.",
      });
    } else {
      res.status(500).json({
        status: "Error",
        message: "Failed to update user data.", 
      });
    }
},
 
  //Payment Cancel

  Cancel:async(req,res)=>{
   res.status(204).json({
       status:" No Content",
       message:"Payment canceled"
   })
},

//user order details

orderDetails: async(req,res)=>{
   const userId=req.params.id;
   const user=await userSchemaData.findOne({_id:userId}).populate("orders")
   // console.log("userrrr",user);

   const orderedProdct=user.orders;
   
   if(orderedProdct.length === 0){
      return res.status(404).json({
         message:"you dont have any ordered products",
         data:[]
      })
   }

    const oredereditems=await order.find({_id:{ $in:orderedProdct}}).populate("products")
    res.status(200).json({
      message:"ordered details founded",
      data:oredereditems
    })


},



}
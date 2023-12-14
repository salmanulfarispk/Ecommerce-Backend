const jwt=require("jsonwebtoken")




module.exports= function verifyingToken(req,res, next){
    const token= req.headers["authorization"]
    // console.log("token is",token);

    if(!token){
        return res.status(403).json({
            error:"invalid token format"
        }) 
    }
   
    jwt.verify(token,process.env.ADMIN_ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({error:"Unauthorized"})
        }
        req.email=decoded.email

        next()
    })


}
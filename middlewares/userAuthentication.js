const jwt=require("jsonwebtoken")


module.exports= verifyToken=(req,res, next)=>{
    const token=req.headers["authorization"]
    // console.log(token);
    if(!token){
        res.status(403).json({
            error:"token not provided"
            
        })
    }
     
    jwt.verify(token,process.env.USER_ACCES_TOKEN_SECRET,(err,decode)=>{
        if(err){
            return res.status(401).json({error:"unauthorized"})
        }
        req.email=decode.email;
        next() 
    })
}
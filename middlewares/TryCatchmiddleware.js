const Trycatchmiddleware= (Trycatchhandler)=>{
       return async(req,res, next)=>{
        try{
            await Trycatchhandler(req,res, next);
        }catch(error){
            console.log(error);
            res.status(500).json({
                status:"failure",
                message:"error",
                error_message:error.message
            });
        }
        next()
       }
}

module.exports=Trycatchmiddleware;
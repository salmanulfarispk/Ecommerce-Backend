const fs=require("fs")
const path=require("path")
const multer=require("multer")
const storage=multer.diskStorage({
    destination:path.join(__dirname,'uploads'),
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`)
    }
})

// console.log(storage)
const upload=multer({storage:storage})



const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})





const imageUpload=(req,res, next)=>{
    upload.single("image")(req,res,async(err)=>{
        //  console.log("req body",req)
        if(err){
            return res.status(400).json({error:err.messsage})
        }

         // console.log("request file:",req.file)
        if(!req.file){
            return res.status(400).json({message:"No files uploaded"})
        }

        try{
            const result=await cloudinary.uploader.upload(req.file.path,{
                folder:"Ecomerce-images"
            })
           
            req.body.image=result.secure_url

            //delete local files
            fs.unlink(req.file.path,(unlinker)=>{
                if(unlinker){
                console.log("Error in unlinking the file");
                }
            })
         
            next()
        }

        catch(error){
            return res.status(500).json({message:"Error uploading file to cloudinary"})
        }
        
    })
}



module.exports=imageUpload












const jwt=require('jsonwebtoken')



const authMiddleware=async(req,res,next)=>{
  
  const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }
    
        const token = authHeader.split(' ')[1];
        
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!decoded || !decoded.id) {
          return res.status(401).json({ success: false, message: "Token invalid or user ID missing" });
        }
    
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


module.exports=authMiddleware
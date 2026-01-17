import jwt from "jsonwebtoken";

const isAuth = (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token) return res.status(401).json({msg:"User not authenticated"});

        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({msg:"Token invalid or expired"});
    }
}

export default isAuth;

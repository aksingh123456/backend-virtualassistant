import jwt from "jsonwebtoken"
const isAuth=async(req,res,next)=>{
try{
    const token=req.cookies.token
    console.log(token);
    if(!token){
        return res.status(400).json({msg:"invalid user"});
    }
    const verifytoken =await jwt.verify(token,process.env.JWT_SECRET)
    req.userId=verifytoken.userId
   next();
}
catch(err){
    return res.status(400).json({msg:"is auth error"})
}
}
export default isAuth
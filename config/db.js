import mongoose from "mongoose";
const connectdb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db connected");
    }
    catch(err){
        console.log(err);
        
    }
}
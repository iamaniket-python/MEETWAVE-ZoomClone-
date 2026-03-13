import httpStatus from "http-status";
import { User } from "../models/user.model";
import bcrypt, { hash } from "bcrypt";

const register =async(req,res)=>{
    const { name , username ,password} =req.body;

    try {
        const existingUser =await User.findone({ username });
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User Already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser =new User({
            name: name,
            username: username,
            password : password
        })
    } catch {

    }
}
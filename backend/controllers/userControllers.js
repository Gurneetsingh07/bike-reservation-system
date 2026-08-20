import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"



const signup=async (req,res) => {
    try{
        const {email,password} =req.body;
    }
    catch(error){

    }
}
const login=async (req,res) => {
    
}
const logout=async (req,res) => {
    
}


export{
    signup,
    login,
    logout
}
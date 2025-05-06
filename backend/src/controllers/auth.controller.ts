import {Request,Response } from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entities/user";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt"
import { UserRegister } from "../services/auth.service";
import jwt  from "jsonwebtoken";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const Register=async(req:Request,res:Response):Promise<void> =>{
    try {
        const{name,email,password,store,role}=req.body;
        const registeredUser= await UserRegister (name,email,password,store,role)
        res.status(200).json({message: "User registered successfully",data: registeredUser})

    }catch(e){
        console.error(e)
        res.status(500).json({message:'Registration failed',
          error:"Registration failed"
        })
      
    }
};


export const Login = async(req:Request,res:Response) :Promise<void> =>{
  const {email,password}=req.body;
  const user = await userRepository.findOneBy({email});

  if (!user){
    res.status(401).json({message:"Invalid User"})
    return
  }

  const isPasswordMatch = await bcrypt.compare (password,user.password);

  if(!isPasswordMatch){
    res.status(401).json({message:"Invalid password"});
    return
  }
  const token = jwt.sign(
    {id:user.id,email:user.email,role:user.role,name:user.name},
    process.env.SECRET_KEY as string,
    {expiresIn:"7d"}
  );
  res.json({message:"Login successful",token,role:user.role,name:user.name});
}

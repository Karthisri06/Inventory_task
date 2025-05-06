import { Request,Response } from "express";
import { AppDataSource} from "../datasource";
import { User } from "../entities/user";

export const getUsers=async(req:Request,res:Response) =>{
    try{
        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find({
            select: ["id", "name", "email", "role", "store", "created_at", "updated_at"], 
        });
        res.status(200).json(users);
    }catch(error){
        console.error("Error fetching users:",error)
        res.status(500).json({message:"server error"})
    }
}
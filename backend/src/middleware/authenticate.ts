import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entities/user";


interface UserRequest extends Request {
    user?:User;
}


export const registerMiddleware = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>{
    const { name , email , password} =req.body;
    if (!email || !password){
        res.status(400).json({message:"Email and password are required"});
        return

    }
    const userRepository =AppDataSource.getRepository(User);
    const existingUser= await userRepository.findOneBy({email});

     if (existingUser){
        res.status(400).json({message:"User already exists"});
        return;
     }
     next();
  };

  export const loginMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userName, email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
  
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
  
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
  
    (req as UserRequest).user = user;
  
    next();
  };
import {User} from "../entities/user"
import { AppDataSource } from "../datasource"
import bcrypt from "bcrypt"



export const UserRegister=async(
    name:string,
    email:string,
    password:string,
    store:string,
    role:string,

)=>{
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword= await bcrypt.hash(password,10);

    const user = userRepo.create({
          name,
          email,
          password:hashedPassword,
          store,
          role,
    });
    await userRepo.save(user);

}

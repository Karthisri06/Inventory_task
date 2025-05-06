import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export interface UserRequest extends Request{
    user?:string | JwtPayload;
}


export const authorizeAdminMiddleware = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
         try{
            const token =req.headers.authorization?.split(" ")[1];
            if(!token){
                res.status(400).json({message:"Token not found"})
            }
            const decodedToken = jwt.verify(
                token as string,
                process.env.SECRET_KEY as string
                
            );
            (req as UserRequest).user =decodedToken;

            const user=(req as any).user;
            if (user.role === "Admin") {
              console.log(" Admin access granted");
              next();
            } else {
              console.log(" Access denied");
              res.status(403).json({ message: "Access denied. Admins only." });
            }
          } catch (e) {
            console.log("Token verification failed:", e);
            res.status(401).json({ message: "Invalid or expired token" });
          }
  };

  export const authorizeMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        res.status(400).json({ message: "Token not found" });
        return;
      }
  
      const decodedToken = jwt.verify(
        token as string,
        process.env.SECRET_KEY as string
      ) as { id: number; email: string; name: string; role: string };
  
      req.user = decodedToken;
      next();
    } catch (e) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  

import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { authorizeAdminMiddleware } from "../middleware/authorize";

const userRoutes = Router();

userRoutes.get("/users",authorizeAdminMiddleware, getUsers);

export default userRoutes;

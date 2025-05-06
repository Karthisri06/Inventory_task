import{Router} from "express"
import { Login,Register } from "../controllers/auth.controller"
import { loginMiddleware } from "../middleware/authenticate"


const UserRoutes= Router();


UserRoutes.post("/register",Register);
UserRoutes.post("/login",loginMiddleware,Login);


export default UserRoutes;
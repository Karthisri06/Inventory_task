import { RequestHandler, Router } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUserOrders
} from "../controllers/order.controller";
import { authorizeMiddleware, authorizeAdminMiddleware } from "../middleware/authorize";
import { AuthenticatedRequest } from "../types/express";

const orderRoutes = Router();
orderRoutes.post("/", authorizeMiddleware, createOrder as unknown as RequestHandler<any, any, any, any, AuthenticatedRequest>); 
orderRoutes.get("/user", authorizeMiddleware, getUserOrders); 
orderRoutes.get("/", authorizeMiddleware, getAllOrders); 
orderRoutes.get("/users",authorizeAdminMiddleware,getAllUserOrders);
orderRoutes.put("/:id", authorizeAdminMiddleware, updateOrderStatus); 
orderRoutes.delete("/:id", authorizeAdminMiddleware, deleteOrder);

export default orderRoutes;
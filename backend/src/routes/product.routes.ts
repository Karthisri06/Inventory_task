
import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadCSV,
} from "../controllers/product.controller";
import { authorizeAdminMiddleware,authorizeMiddleware } from "../middleware/authorize";
const productRoutes = Router();

productRoutes.get("/",authorizeMiddleware, getAllProducts);
productRoutes.post("/",authorizeAdminMiddleware,addProduct);
productRoutes.put("/:id",authorizeAdminMiddleware, updateProduct);
productRoutes.delete("/:id",authorizeAdminMiddleware,deleteProduct);
productRoutes.post('/csv',authorizeAdminMiddleware,uploadCSV)

export default productRoutes;

import {Request,Response} from "express";
import * as OrderService from "../services/order.service";
import { Order } from "../entities/orders";
import { UserRequest } from "../middleware/authorize";
import { AppDataSource } from "../datasource";
import { Product } from "../entities/product";
import { User } from "../entities/user";


interface OrderItem{
    productId:number;
    quantity:number;
}

interface CreateOrderRequestBody{
    items:OrderItem[];
    total_amount:number;
    
}

interface AuthenticatedRequest extends Request {
    user: { id: number }; 
    body: CreateOrderRequestBody;
  }

export const createOrder = async (req:AuthenticatedRequest,res:Response) =>{
    const {items} = req.body;
    const userId = req.user?.id;

    if (!items || items.length === 0){
        res.status(400).json({message:"No items in order"})
        return
    }

    const orderRepo = AppDataSource.getRepository(Order);
    const productRepo= AppDataSource.getRepository(Product);
    const userRepo = AppDataSource.getRepository(User);

    try{

        const user = await userRepo.findOneBy({ id: userId }); 
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

        let totalAmount =0;
        for (const item of items){
            const product =await productRepo.findOneBy({id:item.productId});

            if(!product){
                res.status(404).json({message:`Product ${item.productId}not found.`})
                return
            }
            if(product.quantity < item.quantity){
                res.status (400).json ({message:`Not enough stock for ${product.name}.`});
            }
            product.quantity -= item.quantity;
            await productRepo.save(product);
            totalAmount += item.quantity * parseFloat(product.price.toString()) 
        
        }
            const order = orderRepo.create({
            user:user,
            store:user.store,
            items,
            total_amount: totalAmount,
            status:"pending"
        });

        await orderRepo.save(order);
       res.status(201).json({message:"Order placed successfully",orderId:order.id})
       return 
    }catch(error){
        console.error("Order creation failed:",error);
      res.status(500).json({message:"Failed to create order"})
      return 
    }
};

export const getAllOrders = async (req: Request, res: Response):Promise<void> => {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
      return
    } catch (error) {
      res.status(500).json({ message: "Could not fetch orders", error });
    }
  };

export const getUserOrders = async (req:Request,res:Response) =>{
    try{
        const userId =(req as any).user.id;
        console.log("User Id for token:",userId)
        const orders = await OrderService.getUserOrders(userId);
        res.json(orders);
    }catch(error){
        console.log("fatching users error:",error)
        res.status(500).json({message:"could not fetch user Orders",error})
        return
    }
};

export const updateOrderStatus = async(req:Request,res:Response) =>{
    try{
        const {id} =req.params;
        const{status}= req.body;
        const updated = await OrderService.updateOrderStatus(Number(id),status);
        res.json(updated);
    }catch(error){
        res.status(500).json({message:"could not update status"})
    }
};

export const deleteOrder = async (req:Request,res:Response) =>{
    try{
        const {id} =req.params;
        await OrderService.deleteOrder(Number(id));
        res.status(204).send()
    }catch(error){
        res.status(500).json({message:"could not delete order",error})
    }
};


export const getAllUserOrders = async(req:Request,res:Response) =>{
    try{
        const groupedOrders =await OrderService.getAllUserOrders();
        res.status(200).json(groupedOrders);
    }catch(error:any){
        console.log("orders fetching error:",error)
        res.status(500).json({
            message:"cant fetch orders",
            error:error.message ||"unknown error"})
      
    } 
};
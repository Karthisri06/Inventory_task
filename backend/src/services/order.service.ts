import { error } from "console";
import { AppDataSource } from "../datasource";
import { Order } from "../entities/orders";
import { Product } from "../entities/product";
import { User } from "../entities/user";

const orderRepo = AppDataSource.getRepository(Order);
const ProductRepo = AppDataSource.getRepository(Product);

interface OrderItem{
    productId:number;
    quantity:number;
}

interface GroupOrder{
  user:User;
  orders:Order[];
  store:string,
  userId:number,
}

   
export const createOrder = async (userId: number, items: OrderItem[],total_amount:number ) => {

  if(!userId){
    throw new Error ("user id is required")
  }
    let totalAmount = 0;
    const processedItems = [];
  
    for (const item of items) {
      const product = await ProductRepo.findOneBy({ id:item.productId
       });
  
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
  
      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product.name}`);
      }
  
      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;
  
      processedItems.push({
        
        product: product,
        name: product.name,
        quantity: item.quantity,
        price: Number(product.price),
        subtotal,
      });
    }
  
    const order = orderRepo.create({
      user: { id: userId } as User,
      items: processedItems,
      total_amount: totalAmount,
      status: "Pending",
    });
  
    return await orderRepo.save(order);
  };
  
export const getAllOrders = async ()=>{
    return await orderRepo.find({relations:["user"]});

};

export const getUserOrders = async (userId: number) => {
  return await orderRepo.find({
    where: { user: { id: userId } },
    relations: [ "user"],
    order: { created_at: "DESC" },
  });
};


export const updateOrderStatus = async (orderId: number, newStatus: string) => {
    const order = await orderRepo.findOneBy({ id: orderId });

    if (!order) throw new Error("Order not found");
    order.status = newStatus;
    return await orderRepo.save(order);
  };

export const deleteOrder = async(orderId:number) =>{
    return await orderRepo.delete(orderId);
};



//to get all the users orders

export const getAllUserOrders = async() =>{
  const orders = await orderRepo.find({
    relations:["user"],
    order:{created_at:"DESC"},
  });

  const grouped: { [key: string]: GroupOrder } = {};

  for (const order of orders){
    if(!order.user || !order.store)continue;
    const userId =order.user.id;
    const store = order.store;
    const key = `${userId}-${store}`;

    if(!grouped[key]){
      grouped[key]={
        userId,
        store,
        user:order.user,
        orders:[],
      }
    }

    grouped[key].orders.push(order);
  }
   return Object.values(grouped);
}

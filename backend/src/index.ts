import express from 'express';
import { AppDataSource } from './datasource';
import cors from "cors";
import dotenv from 'dotenv'
import UserRoutes from "./routes/auth.routes"
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import userRoutes from './routes/user.routes';


dotenv.config();

const app:express.Application=express();

// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true,
}));


  
app.use(express.json());


app.use("/auth",UserRoutes);
app.use("/product",productRoutes);
app.use("/order",orderRoutes);
app.use("/",userRoutes)


AppDataSource.initialize()
.then(() =>{
    console.log("Connected to DB!")
    app.listen(3000 , () =>{
        console.log("Server running on http://localhost:3000 ");
    });
})

.catch((error)=> {
    console.error("Error during DS initialization",error)
});

export default app;

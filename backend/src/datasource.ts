import "reflect-metadata";
import {DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entities/user";
import { Order } from "./entities/orders";
import { Product } from "./entities/product";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql", 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, 
    logging: false,
    entities: [User,Order,Product], 
    migrations: [`${process.cwd()}/src/migration/*.ts`],
    subscribers: [],
})